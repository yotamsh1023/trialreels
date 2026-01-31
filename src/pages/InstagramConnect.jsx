import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { createProfile, getInstagramConnectUrl, listAccounts } from '../lib/getlate'

export default function InstagramConnect() {
  const navigate = useNavigate()
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
  }, [])

  useEffect(() => {
    if (!userId) return
    async function checkConnection() {
      const { data, error } = await supabase
        .from('instagram_accounts')
        .select('id, late_account_id, instagram_id')
        .eq('user_id', userId)
        .maybeSingle()
      if (!error && data && (data.late_account_id || data.instagram_id)) {
        setConnected(true)
      }
    }
    checkConnection()
  }, [userId])

  async function handleConnect() {
    setError('')
    setLoading(true)
    try {
      // 1. Get or create Late profile for this user
      let { data: row } = await supabase
        .from('instagram_accounts')
        .select('late_profile_id')
        .eq('user_id', userId)
        .maybeSingle()

      let profileId = row?.late_profile_id
      if (!profileId) {
        profileId = await createProfile(`Reels AutoPoster - ${(userId || '').slice(0, 8)}`, '', '#0095f6')
        await supabase.from('instagram_accounts').upsert(
          {
            user_id: userId,
            late_profile_id: profileId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )
      }

      // 2. Get Instagram OAuth URL and redirect
      const redirectUrl = `${window.location.origin}/connect-instagram/callback?user_id=${encodeURIComponent(userId)}`
      const authUrl = await getInstagramConnectUrl(profileId, redirectUrl)
      window.location.href = authUrl
    } catch (err) {
      setError(
        err?.message === 'VITE_GETLATE_API_KEY לא הוגדר ב-.env'
          ? 'חסר מפתח GetLate API. הוסף VITE_GETLATE_API_KEY ל-.env (מ-getlate.dev).'
          : err?.message || 'אירעה שגיאה. נסו שוב.'
      )
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-card">
        <h1 className="page-title">חיבור חשבון אינסטגרם</h1>
        <p className="page-subtitle">
          כדי להעלות רילס באופן אוטומטי, <br></br>יש לחבר את חשבון האינסטגרם שלך למערכת.
        </p>

        {error && <div className="alert alert-error" role="alert" aria-live="assertive">{error}</div>}

        {!connected ? (
          <>
            <button
              type="button"
              className="btn btn-gradient"
              onClick={handleConnect}
              disabled={loading}
              style={{ marginBottom: '1rem' }}
            >
              {loading ? 'מתחבר...' : 'התחברו לחשבון האינסטגרם שלי'}
            </button>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              תועברו לדף ההרשאה של אינסטגרם. <br></br>נדרש חשבון אינסטגרם ביזנס.
            </p>
          </>
        ) : (
          <>
            <div className="alert alert-success" role="status" aria-live="polite">החשבון חובר בהצלחה!</div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/posts')}
            >
              המשך לבחירת פוסטים
            </button>
          </>
        )}
      </div>
    </div>
  )
}
