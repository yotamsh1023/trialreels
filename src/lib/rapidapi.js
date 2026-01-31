/**
 * RapidAPI Instagram Data Scraper – fetch reels by user_id with max_id pagination.
 * 1) GET user_id_by_username?username=... → user_id
 * 2) GET reels?user_id=...&include_feed_video=true&max_id=... (max_id dynamic each page, ~12 posts per page)
 * API: https://instagram-api-fast-reliable-data-scraper.p.rapidapi.com
 */

const DEFAULT_HOST = 'instagram-api-fast-reliable-data-scraper.p.rapidapi.com'

function getKey() {
  return import.meta.env.VITE_RAPIDAPI_KEY || ''
}

function getHost() {
  return import.meta.env.VITE_RAPIDAPI_HOST || DEFAULT_HOST
}

function getBaseUrl() {
  return `https://${getHost()}`
}

const RAPID_FETCH_TIMEOUT_MS = 90_000

async function rapidFetch(url) {
  const key = getKey()
  if (!key) throw new Error('VITE_RAPIDAPI_KEY לא הוגדר ב-.env (מ-RapidAPI).')
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), RAPID_FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': getHost(),
      },
      signal: controller.signal,
    })
    const text = await res.text()
    let data = {}
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      if (!res.ok) throw new Error(`RapidAPI ${res.status}: ${text.slice(0, 200)}`)
    }
    if (!res.ok) {
      const msg = data.message ?? data.error ?? data.reason ?? `RapidAPI ${res.status}`
      throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
    }
    return data
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('הבקשה לוקחת יותר מדי זמן. נסו שוב.')
    }
    if (err?.message?.toLowerCase().includes('fetch') || err?.message === 'Failed to fetch') {
      throw new Error('שגיאת רשת או CORS. בדקו את המפתח ב-.env (VITE_RAPIDAPI_KEY).')
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
  }
}

function extractUserIdFromResponse(data) {
  if (data == null || typeof data !== 'object') return null
  const id =
    data.UserID ??
    data.user_id ??
    data.id ??
    data.pk ??
    data.userId ??
    data.data?.user_id ??
    data.data?.id ??
    data.data?.pk ??
    null
  if (id == null || id === '') return null
  return String(id).trim()
}

/**
 * Get Instagram user_id by username.
 * GET /user_id_by_username?username=...
 */
export async function getUserIdByUsername(username) {
  const url = `${getBaseUrl()}/user_id_by_username?username=${encodeURIComponent(username)}`
  const data = await rapidFetch(url)
  const id = extractUserIdFromResponse(data)
  if (!id) {
    const keys = typeof data === 'object' && data !== null ? Object.keys(data).join(', ') : ''
    throw new Error(
      keys ? `לא נמצא מזהה משתמש. השדות בתשובה: ${keys}` : 'לא נמצא מזהה משתמש לאינסטגרם.'
    )
  }
  return id
}

function normalizeReelItem(item) {
  if (!item || typeof item !== 'object') return null
  const id =
    item.id ?? item.pk ?? item.shortcode ?? item.code ?? item.media_id ?? item.MediaID ?? item.post_id ?? item.Id
  if (id == null || id === '') return null

  const caption =
    typeof item.caption === 'string'
      ? item.caption
      : item.Caption ??
        item.caption?.text ??
        item.edge_media_to_caption?.edges?.[0]?.node?.text ??
        item.caption_plain ??
        item.description ??
        item.title ??
        ''

  const thumbnail =
    item.display_url ??
    item.thumbnail_src ??
    item.display_src ??
    item.ThumbnailUrl ??
    item.thumbnail_url ??
    item.ImageUrl ??
    item.cover_media_url ??
    item.image_versions2?.candidates?.[0]?.url ??
    ''

  const videoUrl =
    item.video_url ?? item.VideoUrl ?? item.video_versions?.[0]?.url ?? item.video_url_hd ?? item.media_url ?? item.MediaUrl

  const postedAt = parsePostedAt(
    item.taken_at_timestamp ??
      item.taken_at ??
      item.timestamp ??
      item.created_at ??
      item.CreatedAt ??
      item.date
  )

  return {
    post_id: String(id),
    thumbnail_url: thumbnail || undefined,
    caption: (typeof caption === 'string' ? caption : '')?.slice(0, 2000) ?? '',
    video_url: videoUrl || undefined,
    media_type: 'video',
    posted_at: postedAt || undefined,
  }
}

function parsePostedAt(value) {
  if (value == null) return null
  if (typeof value === 'number') {
    const ms = value < 1e12 ? value * 1000 : value
    const d = new Date(ms)
    return isNaN(d.getTime()) ? null : d.toISOString()
  }
  if (typeof value === 'string') {
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d.toISOString()
  }
  return null
}

function findUrlsInObject(obj) {
  const urls = []
  if (!obj || typeof obj !== 'object') return urls
  for (const v of Object.values(obj)) {
    if (typeof v === 'string' && /^https?:\/\//i.test(v)) urls.push(v)
  }
  return urls
}

function findCaptionInObject(obj) {
  if (!obj || typeof obj !== 'object') return ''
  for (const v of Object.values(obj)) {
    if (typeof v === 'string' && !/^https?:\/\//i.test(v) && v.length < 3000) return v.slice(0, 2000)
  }
  return ''
}

function looseNormalizeReelItem(item, index, fallbackIdPrefix) {
  if (!item || typeof item !== 'object') return null
  const id =
    item.id ?? item.pk ?? item.shortcode ?? item.code ?? item.media_id ?? item.MediaID ?? item.post_id ?? item.Id ?? item.MediaId
  const post_id = id != null && id !== '' ? String(id) : `reel_${fallbackIdPrefix}_${index}`

  const urls = findUrlsInObject(item)
  const videoUrl =
    item.video_url ?? item.VideoUrl ?? item.media_url ?? item.MediaUrl ?? urls.find((u) => /\.(mp4|webm|m3u8)/i.test(u)) ?? urls[0] ?? ''
  const thumbnail =
    item.display_url ?? item.thumbnail_url ?? item.ThumbnailUrl ?? item.ImageUrl ?? urls.find((u) => /\.(jpg|jpeg|png|webp|gif)/i.test(u)) ?? urls[0] ?? ''
  const caption = findCaptionInObject(item) || ''
  const rawDate = item.taken_at_timestamp ?? item.taken_at ?? item.timestamp ?? item.created_at ?? item.CreatedAt ?? item.date
  const posted_at = parsePostedAt(rawDate) || undefined

  return {
    post_id,
    thumbnail_url: thumbnail || undefined,
    caption: caption?.slice(0, 2000) ?? '',
    video_url: videoUrl || undefined,
    media_type: 'video',
    posted_at,
  }
}

function extractReelsArray(data) {
  if (!data || typeof data !== 'object') return []
  let raw =
    data.reels ??
    data.items ??
    data.Items ??
    data.feed ??
    data.media ??
    data.data?.reels ??
    data.data?.items ??
    data.data?.feed ??
    data.data?.edges?.map((e) => e.node) ??
    (Array.isArray(data.data) ? data.data : null) ??
    data.data ??
    (Array.isArray(data) ? data : null)
  if (!Array.isArray(raw)) {
    if (typeof data === 'object' && data !== null) {
      for (const key of Object.keys(data)) {
        const val = data[key]
        if (Array.isArray(val)) {
          raw = val
          break
        }
      }
    }
  }
  if (!Array.isArray(raw)) return []
  return raw.map((it) => (it && typeof it === 'object' && (it.media || it.node) ? (it.media || it.node) : it))
}

/** Read next-page max_id from API response (dynamic each ~12 posts). */
function extractMaxId(data) {
  if (!data || typeof data !== 'object') return null
  const id =
    data.paging_info?.max_id ??
    data.next_max_id ??
    data.next_max_id_cursor ??
    data.max_id ??
    data.cursor ??
    data.next_cursor ??
    data.end_cursor ??
    data.page_info?.end_cursor ??
    data.more_info?.next_max_id ??
    data.data?.paging_info?.max_id ??
    data.data?.next_max_id ??
    data.data?.more_info?.next_max_id ??
    data.data?.cursor ??
    data.data?.next_cursor ??
    null
  if (id != null && id !== '') return String(id)
  // Fallback: scan for any key that looks like a cursor (next_*, *max*, *cursor*)
  for (const key of Object.keys(data)) {
    const lower = key.toLowerCase()
    if ((lower.includes('next') || lower.includes('max') || lower.includes('cursor')) && typeof data[key] === 'string' && data[key].length > 0) {
      return String(data[key])
    }
  }
  if (data.data && typeof data.data === 'object') {
    for (const key of Object.keys(data.data)) {
      const lower = key.toLowerCase()
      if ((lower.includes('next') || lower.includes('max') || lower.includes('cursor')) && typeof data.data[key] === 'string' && data.data[key].length > 0) {
        return String(data.data[key])
      }
    }
  }
  if (data.more_info && typeof data.more_info === 'object') {
    const mi = data.more_info
    const next = mi.next_max_id ?? mi.max_id ?? mi.cursor
    if (next != null && next !== '') return String(next)
  }
  return null
}

const REELS_MAX_PAGES = 100

/**
 * Fetch all reels by user_id with max_id pagination.
 * GET /reels?user_id=X&include_feed_video=true&max_id=Y (max_id only when present for next page).
 * Keeps requesting until no max_id in response, then returns all collected videos.
 * @param {string} userId - Instagram numeric user_id
 * @param {object} [opts] - { onPageLoaded(totalSoFar, maxId) } for UI progress
 */
export async function fetchReelsByUserId(userId, opts = {}) {
  const allItems = []
  let maxId = null
  let page = 0

  do {
    const params = new URLSearchParams({
      user_id: userId,
      include_feed_video: 'true',
    })
    if (maxId) params.set('max_id', maxId)

    const url = `${getBaseUrl()}/reels?${params.toString()}`
    const data = await rapidFetch(url)
    const items = extractReelsArray(data)
    items.forEach((it) => allItems.push(it))

    maxId = extractMaxId(data)
    if (items.length > 0 && !maxId && import.meta.env.DEV) {
      console.warn('[RapidAPI reels] Got', items.length, 'items but no next max_id. Response keys:', Object.keys(data))
    }
    page++
    if (typeof opts.onPageLoaded === 'function') {
      await Promise.resolve(opts.onPageLoaded(allItems.length, maxId))
    }
  } while (maxId != null && page < REELS_MAX_PAGES)

  const videos = allItems
    .map((item, i) => normalizeReelItem(item) ?? looseNormalizeReelItem(item, i, userId))
    .filter(Boolean)
  return videos
}

/**
 * Fetch all reels for an Instagram user: get user_id by username, then paginate reels with max_id until done.
 * Redirect to post selection only after no more max_id.
 */
export async function fetchInstagramUserPosts(username, opts = {}) {
  const rapidapi_ig_id = await getUserIdByUsername(username.trim())
  const videos = await fetchReelsByUserId(rapidapi_ig_id, opts)
  return { videos, rapidapi_ig_id }
}
