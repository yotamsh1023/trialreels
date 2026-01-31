import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getAnalytics, extractPostsFromAnalyticsResponse, listPosts } from '../lib/getlate'

const FETCH_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

const SKIP_AFTER_MS = 20_000 // show "skip to posts" after 20 seconds

export default function PostsLoading() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')
  const [loadedCount, setLoadedCount] = useState(0)
  const [showSkip, setShowSkip] = useState(false)
  const [userId, setUserId] = useState(null)
  const timeoutRef = useRef(null)
  const skipTimerRef = useRef(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    skipTimerRef.current = setTimeout(() => {
      if (mountedRef.current) setShowSkip(true)
    }, SKIP_AFTER_MS)
    return () => {
      mountedRef.current = false
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function run() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) return
      setUserId(user.id)

      const { data: account, error: accountError } = await supabase
        .from('instagram_accounts')
        .select('late_profile_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (accountError || !account?.late_profile_id) {
        if (mountedRef.current) {
          setStatus('error')
          setMessage('לא נמצא פרופיל GetLate. חִברו קודם את חשבון האינסטגרם.')
        }
        return
      }
      const profileId = account.late_profile_id.trim()
      if (!profileId) {
        if (mountedRef.current) {
          setStatus('error')
          setMessage('פרופיל ריק. נסו לחבר שוב את האינסטגרם.')
        }
        return
      }
      const timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          setStatus('success')
          setMessage('הטעינה לוקחת זמן. מעבירים אתכם לבחירת פוסטים.')
          setTimeout(() => navigate('/posts', { replace: true }), 1500)
        }
      }, FETCH_TIMEOUT_MS)
      timeoutRef.current = timeoutId

      try {
        const params = { profileId, platform: 'instagram', limit: 100 }
        const [analyticsRes, postsRes] = await Promise.allSettled([
          getAnalytics(params),
          listPosts({ ...params, status: 'published' }),
        ])
        if (cancelled || !mountedRef.current) return

        const analyticsList =
          analyticsRes.status === 'fulfilled'
            ? extractPostsFromAnalyticsResponse(analyticsRes.value)
            : []
        const postsList =
          postsRes.status === 'fulfilled' && Array.isArray(postsRes.value?.posts)
            ? postsRes.value.posts
            : []
        const seen = new Set()
        for (const p of analyticsList) {
          const id = p._id ?? p.postId ?? p.id
          if (id) seen.add(String(id))
        }
        for (const p of postsList) {
          const id = p._id ?? p.id
          if (id) seen.add(String(id))
        }
        const count = seen.size
        if (mountedRef.current) setLoadedCount(count)

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        if (mountedRef.current) {
          setStatus('success')
          setTimeout(() => navigate('/posts', { replace: true }), 800)
        }
      } catch (err) {
        if (cancelled || !mountedRef.current) return
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        setStatus('error')
        setMessage(err?.message ?? String(err) ?? 'שגיאה בטעינת הפוסטים. נסו שוב.')
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [navigate])

  if (status === 'error') {
    return (
      <div className="page">
        <div className="page-card">
          <h1 className="page-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>טעינת פוסטים</h1>
          <p style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-text)' }}>
            טעינת פוסטים מ-GetLate Analytics
          </p>
          <div className="alert alert-error" role="alert" aria-live="assertive">{message}</div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setStatus('loading')
                setMessage('')
                window.location.reload()
              }}
            >
              נסו שוב
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/posts', { replace: true })}
            >
              המשך לבחירת פוסטים
            </button>
          </div>
        </div>
      </div>
    )
  }

  const stepLabel =
    loadedCount > 0
      ? `מביא פוסטים... (${loadedCount} פוסטים)`
      : 'מביא פוסטים...'

  return (
    <div className="page" role="status" aria-live="polite" aria-busy="true">
      <div className="page-card">
        <h1 className="page-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>טוען פוסטים</h1>
        <p style={{ textAlign: 'center', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
          אנחנו מביאים את הפוסטים שלכם מ-GetLate
        </p>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
          עד דקה
        </p>
        <p style={{ textAlign: 'center', color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 600 }} aria-live="polite">
          {stepLabel}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }} aria-hidden="true">
          <div className="spinner" />
        </div>
        {showSkip && (
          <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/posts', { replace: true })}
              style={{ width: 'auto' }}
              aria-label="דלג לבחירת פוסטים"
            >
              דלג לבחירת פוסטים
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
