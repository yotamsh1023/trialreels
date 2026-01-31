import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getAllAnalyticsPages, getAllPostsPages, getAnalytics } from '../lib/getlate'
import { fetchInstagramUserPosts } from '../lib/rapidapi'

const VIEW_LIST = 'list'
const VIEW_CARDS = 'cards'

const DATE_FILTER_ALL = 'all'
const DATE_FILTER_OPTIONS = [
  { value: DATE_FILTER_ALL, label: 'הכל' },
  { value: '7d', label: '7 ימים אחרונים' },
  { value: '30d', label: '30 ימים אחרונים' },
  { value: '90d', label: '90 ימים אחרונים' },
  { value: '1y', label: 'שנה אחרונה' },
]

function formatPostDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatPostDateRelative(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const now = new Date()
  const diffMs = now - d
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  if (days === 0) return 'היום'
  if (days === 1) return 'אתמול'
  if (days < 7) return `לפני ${days} ימים`
  if (days < 30) return `לפני ${Math.floor(days / 7)} שבועות`
  if (days < 365) return `לפני ${Math.floor(days / 30)} חודשים`
  return `לפני ${Math.floor(days / 365)} שנים`
}

const IMAGE_URL_PATTERN = /\.(jpe?g|png|webp|gif)(\?|$)/i
const IMAGE_CDN_PATTERN = /cdninstagram|fbcdn|cdn\.fb\.com|imgix|cloudinary|ak\.instagram\.com|scontent/i

function isImageLikeUrl(s) {
  if (typeof s !== 'string' || !s.startsWith('http')) return false
  return IMAGE_URL_PATTERN.test(s) || IMAGE_CDN_PATTERN.test(s)
}

function getFirstImageUrlFromObject(obj, seen = new Set()) {
  if (obj == null || typeof obj !== 'object' || seen.has(obj)) return ''
  seen.add(obj)
  for (const value of Object.values(obj)) {
    if (typeof value === 'string' && isImageLikeUrl(value)) return value
    if (typeof value === 'object' && value !== null) {
      const found = getFirstImageUrlFromObject(value, seen)
      if (found) return found
    }
  }
  return ''
}

function extractThumbnailFromItem(item) {
  const direct =
    item.thumbnail_url ??
    item.thumbnail ??
    item.coverUrl ??
    item.cover_url ??
    item.thumbnailUrl ??
    item.imageUrl ??
    item.mediaUrl ??
    item.displayUrl ??
    item.coverImage ??
    item.previewUrl ??
    item.image_url ??
    item.media_url ??
    item.picture ??
    (item.media && (item.media.url ?? item.media.thumbnail ?? item.media.imageUrl)) ??
    (item.analytics && item.analytics.thumbnailUrl) ??
    ''
  if (direct && typeof direct === 'string') return direct
  return getFirstImageUrlFromObject(item)
}

/** True if Analytics item is a video/reel (Trial Flow only support video) */
function isAnalyticsVideoReel(item) {
  if (!item || typeof item !== 'object') return false
  const mt = (item.mediaType ?? item.media_type ?? item.type ?? '').toString().toLowerCase()
  if (mt === 'video' || mt === 'reel') return true
  const url = item.platformPostUrl ?? item.platform_post_url ?? ''
  if (url && typeof url === 'string' && url.includes('/reel/')) return true
  if (item.video_url || item.videoUrl || item.video_versions?.[0]?.url) return true
  return false
}

function mapAnalyticsItemToPost(item) {
  const id = item._id ?? item.postId ?? item.id ?? ''
  const caption = item.content ?? item.caption ?? ''
  const publishedAt = item.publishedAt ?? item.published_at ?? item.scheduledFor
  const postedAt = publishedAt ? new Date(publishedAt) : null
  const thumbnail = extractThumbnailFromItem(item)
  const platformPostUrl = item.platformPostUrl ?? item.platform_post_url ?? ''
  return { id: String(id), caption: String(caption), postedAt, thumbnail: thumbnail || '', platformPostUrl }
}

/** True if GetLate Posts API item is a video/reel (Trial Flow only support video) */
function isPostsApiVideoReel(item) {
  if (!item || typeof item !== 'object') return false
  const contentType = item.platformSpecificData?.contentType ?? item.contentType ?? ''
  if (String(contentType).toLowerCase() === 'reel') return true
  const platforms = item.platforms ?? []
  for (const p of platforms) {
    const ct = p.platformSpecificData?.contentType ?? p.contentType ?? ''
    if (String(ct).toLowerCase() === 'reel') return true
  }
  const media = item.mediaItems ?? item.media ?? []
  const first = Array.isArray(media) ? media[0] : null
  if (first) {
    const type = (first.type ?? first.mediaType ?? first.media_type ?? '').toString().toLowerCase()
    if (type === 'video') return true
    const u = first.url ?? first.src ?? ''
    if (u && /\.(mp4|mov|webm|m3u8)(\?|$)/i.test(u)) return true
  }
  return false
}

/** Map GetLate Posts API item (created via GetLate) to our post shape */
function mapPostsApiItemToPost(item) {
  const id = item._id ?? item.id ?? ''
  const caption = item.content ?? item.title ?? ''
  const firstPlatform = Array.isArray(item.platforms) ? item.platforms[0] : null
  const publishedAt = item.publishedAt ?? firstPlatform?.publishedAt ?? item.scheduledFor ?? item.createdAt
  const postedAt = publishedAt ? new Date(publishedAt) : null
  const platformPostUrl = firstPlatform?.platformPostUrl ?? item.platformPostUrl ?? ''
  const thumbnail = extractThumbnailFromItem(item) || (item.mediaItems?.[0]?.url) || ''
  return { id: String(id), caption: String(caption), postedAt, thumbnail: thumbnail || '', platformPostUrl }
}

/** RapidAPI returns reels/videos; keep only items that are clearly video */
function isRapidApiVideo(item) {
  if (!item || typeof item !== 'object') return false
  if (item.media_type === 'video') return true
  if (item.video_url || item.videoUrl) return true
  return false
}

/** Map RapidAPI reel (existing Instagram reels by username) to our post shape */
function mapRapidApiReelToPost(item) {
  const id = item.post_id ?? item.id ?? ''
  const caption = item.caption ?? ''
  const postedAt = item.posted_at ? new Date(item.posted_at) : null
  const thumbnail = item.thumbnail_url ?? item.thumbnail ?? ''
  return { id: String(id), caption: String(caption), postedAt, thumbnail: thumbnail || '', platformPostUrl: '' }
}

/** Merge analytics + posts API + RapidAPI results, dedupe by platformPostUrl or id, sort by date desc */
function mergeAndDedupePosts(analyticsPosts, postsApiPosts, rapidApiPosts = []) {
  const byKey = new Map()
  for (const p of analyticsPosts) {
    const key = (p.platformPostUrl && p.platformPostUrl.trim()) || p.id
    if (key && !byKey.has(key)) byKey.set(key, p)
  }
  for (const p of postsApiPosts) {
    const key = (p.platformPostUrl && p.platformPostUrl.trim()) || p.id
    if (key && !byKey.has(key)) byKey.set(key, p)
  }
  for (const p of rapidApiPosts) {
    const key = p.id
    if (key && !byKey.has(key)) byKey.set(key, p)
  }
  const merged = Array.from(byKey.values())
  merged.sort((a, b) => (b.postedAt?.getTime() ?? 0) - (a.postedAt?.getTime() ?? 0))
  return merged
}

export default function PostSelection() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState(null)
  const [lateProfileId, setLateProfileId] = useState(null)
  const [viewMode, setViewMode] = useState(VIEW_CARDS)
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState(DATE_FILTER_ALL)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
  }, [])

  const requestedThumbnailIdsRef = useRef(new Set())
  const fetchPosts = useCallback(async (profileId, username) => {
    if (!profileId) return
    setLoadError('')
    setLoading(true)
    requestedThumbnailIdsRef.current.clear()
    try {
      const params = { profileId, platform: 'instagram', limit: 100 }
      const promises = [
        getAllAnalyticsPages({ ...params, sortBy: 'date', order: 'desc' }),
        getAllPostsPages({ ...params, status: 'published' }),
      ]
      if (username && String(username).trim()) {
        promises.push(
          fetchInstagramUserPosts(String(username).trim()).then((r) => r.videos || [])
        )
      } else {
        promises.push(Promise.resolve([]))
      }
      const [analyticsData, postsData, rapidApiData] = await Promise.allSettled(promises)
      const analyticsRaw = analyticsData.status === 'fulfilled' && Array.isArray(analyticsData.value) ? analyticsData.value : []
      const postsApiRaw = postsData.status === 'fulfilled' && Array.isArray(postsData.value) ? postsData.value : []
      const rapidApiRaw = rapidApiData.status === 'fulfilled' && Array.isArray(rapidApiData.value) ? rapidApiData.value : []
      const fromAnalytics = analyticsRaw
        .filter(isAnalyticsVideoReel)
        .map(mapAnalyticsItemToPost)
        .filter((p) => p.id)
      const fromPostsApi = postsApiRaw
        .filter(isPostsApiVideoReel)
        .map(mapPostsApiItemToPost)
        .filter((p) => p.id)
      const fromRapidApi = rapidApiRaw
        .filter(isRapidApiVideo)
        .map(mapRapidApiReelToPost)
        .filter((p) => p.id)
      const merged = mergeAndDedupePosts(fromAnalytics, fromPostsApi, fromRapidApi)
      setPosts(merged)
    } catch (err) {
      setLoadError(err?.message ?? String(err) ?? 'שגיאה בטעינת הפוסטים.')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fallback: fetch single-post analytics for posts missing thumbnail (API may include thumbnail in detail)
  const THUMBNAIL_FETCH_MAX = 15
  const THUMBNAIL_FETCH_DELAY_MS = 150
  useEffect(() => {
    const withoutThumbnail = posts.filter((p) => p.id && !p.thumbnail)
    const toFetch = withoutThumbnail
      .filter((p) => !requestedThumbnailIdsRef.current.has(p.id))
      .slice(0, THUMBNAIL_FETCH_MAX)
    if (toFetch.length === 0) return
    toFetch.forEach((p) => requestedThumbnailIdsRef.current.add(p.id))
    let cancelled = false
    const run = async () => {
      for (const post of toFetch) {
        if (cancelled) return
        try {
          const data = await getAnalytics({ postId: post.id })
          const thumb = extractThumbnailFromItem(data)
          if (thumb && !cancelled) {
            setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, thumbnail: thumb } : p)))
          }
        } catch {
          // ignore per-post errors
        }
        if (toFetch.indexOf(post) < toFetch.length - 1) {
          await new Promise((r) => setTimeout(r, THUMBNAIL_FETCH_DELAY_MS))
        }
      }
    }
    run()
    return () => { cancelled = true }
  }, [posts])

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    supabase
      .from('instagram_accounts')
      .select('late_profile_id, username')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data: account, error }) => {
        if (cancelled) return
        if (error || !account?.late_profile_id) {
          setLateProfileId(null)
          setPosts([])
          if (!account?.late_profile_id && !error) {
            setLoadError('')
          }
        } else {
          setLateProfileId(account.late_profile_id)
          fetchPosts(account.late_profile_id, account.username ?? null)
          return
        }
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setLateProfileId(null)
          setPosts([])
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [userId, fetchPosts])

  useEffect(() => {
    if (!userId) return
    supabase
      .from('selected_posts')
      .select('post_id')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (data?.length) setSelected(new Set(data.map((r) => r.post_id)))
      })
      .catch(() => {})
  }, [userId])

  const filteredPosts = useMemo(() => {
    let list = posts
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((p) => (p.caption || '').toLowerCase().includes(q))
    }
    if (dateFilter !== DATE_FILTER_ALL && list.length > 0) {
      const now = Date.now()
      const dayMs = 24 * 60 * 60 * 1000
      const ranges = { '7d': 7 * dayMs, '30d': 30 * dayMs, '90d': 90 * dayMs, '1y': 365 * dayMs }
      const ms = ranges[dateFilter]
      const since = ms != null ? now - ms : now
      list = list.filter((p) => p.postedAt && p.postedAt.getTime() >= since)
    }
    return list
  }, [posts, search, dateFilter])

  function togglePost(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() {
    setSelected(new Set(filteredPosts.map((p) => p.id)))
  }

  function clearSelection() {
    setSelected(new Set())
  }

  const allFilteredSelected = filteredPosts.length > 0 && filteredPosts.every((p) => selected.has(p.id))
  function toggleSelectAllFiltered() {
    if (allFilteredSelected) {
      setSelected((prev) => {
        const next = new Set(prev)
        filteredPosts.forEach((p) => next.delete(p.id))
        return next
      })
    } else {
      setSelected((prev) => {
        const next = new Set(prev)
        filteredPosts.forEach((p) => next.add(p.id))
        return next
      })
    }
  }

  async function handleSave() {
    setSaveError('')
    setSaving(true)
    try {
      await supabase.from('selected_posts').delete().eq('user_id', userId)
      if (selected.size > 0) {
        const { error } = await supabase.from('selected_posts').insert(
          [...selected].map((post_id) => ({ user_id: userId, post_id }))
        )
        if (error) throw error
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 5000)
    } catch (err) {
      const msg = err?.message || ''
      if (msg.includes('relation') && msg.includes('does not exist')) {
        setSaveError('הטבלאות עדיין לא נוצרו. הרץ את supabase-schema.sql ב-Supabase SQL Editor, או הרץ: npm run db:push (אחרי supabase link).')
      } else {
        setSaveError(err?.message || 'אירעה שגיאה בשמירה. נסו שוב.')
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="page posts-page" style={{ justifyContent: 'center', background: 'var(--gallery-bg)' }}>
        <p style={{ textAlign: 'center', color: 'var(--gallery-text-muted)', fontSize: '0.9rem' }}>טוען...</p>
      </div>
    )
  }

  return (
    <div className="page posts-page" style={{ justifyContent: 'flex-start', paddingTop: '2rem', paddingBottom: '6rem' }}>
      <div className="posts-container" style={{ width: '100%', padding: '0 1.5rem' }}>
        {/* Header: minimal */}
        <header className="gallery-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="gallery-title" style={{ textAlign: 'right' }}>פוסטים</h1>
            <p className="gallery-subtitle" style={{ textAlign: 'right' }}>בחרו תוכן להעלאה</p>
          </div>
          <button type="button" className="gallery-link" onClick={handleLogout}>התנתק</button>
        </header>

        {saved && (
          <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
            נשמר
          </div>
        )}
        {saveError && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{saveError}</div>}
        {loadError && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{loadError}</div>}

        {posts.length === 0 && !loading && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gallery-text-muted)', fontSize: '0.9rem' }}>
            {!lateProfileId ? (
              <>
                <p style={{ marginBottom: '1rem' }}>חברו אינסטגרם כדי לראות פוסטים</p>
                <button type="button" className="gallery-bar-save" onClick={() => navigate('/connect-instagram')}>
                  חיבור
                </button>
              </>
            ) : (
              <>
                <p style={{ marginBottom: '1rem' }}>אין פוסטים</p>
                <button type="button" className="gallery-bar-save" onClick={() => fetchPosts(lateProfileId)}>
                  טען
                </button>
              </>
            )}
          </div>
        )}

        {posts.length > 0 && (
          <>
            {/* Toolbar: minimal */}
            <div className="gallery-toolbar">
              <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '160px' }}>
                <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gallery-text-muted)', pointerEvents: 'none', fontSize: '0.9rem' }} aria-hidden>🔍</span>
                <input
                  type="search"
                  className="gallery-search"
                  placeholder="חיפוש"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: '100%' }}
                  aria-label="חיפוש"
                />
              </div>
              <select
                className="gallery-filter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                aria-label="תאריך"
              >
                {DATE_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button type="button" className="gallery-link" onClick={toggleSelectAllFiltered} style={{ marginRight: 'auto' }}>
                {allFilteredSelected ? 'בטל הכל' : 'בחר הכל'}
              </button>
              <div style={{ display: 'flex', gap: '0.25rem' }} role="group" aria-label="תצוגה">
                <button type="button" className={`gallery-view-btn ${viewMode === VIEW_LIST ? 'active' : ''}`} onClick={() => setViewMode(VIEW_LIST)} title="רשימה">☰</button>
                <button type="button" className={`gallery-view-btn ${viewMode === VIEW_CARDS ? 'active' : ''}`} onClick={() => setViewMode(VIEW_CARDS)} title="רשת">⊞</button>
              </div>
            </div>

            {/* Content: list or cards */}
            <div style={{ marginBottom: '1.5rem' }}>
              {viewMode === VIEW_LIST ? (
                <div className="gallery-list">
                  {filteredPosts.length === 0 ? (
                    <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gallery-text-muted)', fontSize: '0.875rem' }}>אין תוצאות</p>
                  ) : (
                    filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        className={`gallery-list-row ${selected.has(post.id) ? 'is-selected' : ''}`}
                      >
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input type="checkbox" checked={selected.has(post.id)} onChange={() => togglePost(post.id)} aria-label={`בחר ריל: ${typeof post.caption === 'string' ? post.caption.slice(0, 60) : 'ללא כיתוב'}`} />
                        </label>
                        <div className="gallery-list-thumb">
                          {post.thumbnail ? (
                            <img src={post.thumbnail} alt={typeof post.caption === 'string' ? `תצוגה מקדימה: ${post.caption.slice(0, 50)}` : 'תצוגה מקדימה של ריל'} onError={(e) => { e.target.style.display = 'none' }} />
                          ) : (
                            <span style={{ color: 'var(--gallery-text-muted)', fontSize: '0.75rem' }} aria-hidden>📷</span>
                          )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--gallery-text)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', margin: 0 }}>
                            {post.caption || 'ללא כיתוב'}
                          </p>
                          {post.postedAt && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--gallery-text-muted)', marginTop: '0.2rem', marginBottom: 0 }}>
                              {formatPostDateRelative(post.postedAt.toISOString())}
                            </p>
                          )}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--gallery-text-muted)', minWidth: '4.5rem' }}>
                          {formatPostDate(post.postedAt ? post.postedAt.toISOString() : null)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="gallery-grid">
                  {filteredPosts.length === 0 ? (
                    <p style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: 'var(--gallery-text-muted)', fontSize: '0.875rem' }}>אין תוצאות</p>
                  ) : (
                    filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        className={`gallery-card ${selected.has(post.id) ? 'is-selected' : ''}`}
                      >
                        <div className="gallery-card-thumb">
                          {post.thumbnail ? (
                            <img src={post.thumbnail} alt={typeof post.caption === 'string' ? `תצוגה מקדימה: ${post.caption.slice(0, 50)}` : 'תצוגה מקדימה של ריל'} onError={(e) => { e.target.style.display = 'none' }} />
                          ) : (
                            <span style={{ color: 'var(--gallery-text-muted)', fontSize: '1.5rem' }} aria-hidden>📷</span>
                          )}
                          <label className={`gallery-card-check ${selected.has(post.id) ? 'checked' : ''}`}>
                            <input type="checkbox" checked={selected.has(post.id)} onChange={() => togglePost(post.id)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} aria-label={`בחר ריל: ${typeof post.caption === 'string' ? post.caption.slice(0, 60) : 'ללא כיתוב'}`} />
                            {selected.has(post.id) ? '✓' : ''}
                          </label>
                        </div>
                        <div className="gallery-card-body">
                          <p className="gallery-card-title">{post.caption || 'ללא כיתוב'}</p>
                          {post.postedAt && (
                            <p className="gallery-card-meta">{formatPostDateRelative(post.postedAt.toISOString())}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button type="button" className="gallery-bar-save" onClick={handleSave} disabled={saving}>
                {saving ? 'שומר...' : 'שמור'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Floating selection bar: calm, minimal */}
      {selected.size > 0 && (
        <div className="gallery-bar">
          <span className="gallery-bar-count" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{selected.size} נבחרו</span>
            <button type="button" className="gallery-link" onClick={clearSelection} style={{ padding: '0 0.25rem', fontSize: '1.1rem' }} aria-label="נקה">×</button>
          </span>
          <button type="button" className="gallery-bar-save" onClick={handleSave} disabled={saving}>
            {saving ? 'שומר...' : 'שמור'}
          </button>
        </div>
      )}
    </div>
  )
}
