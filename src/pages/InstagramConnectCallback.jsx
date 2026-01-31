import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { listAccounts } from '../lib/getlate'

/**
 * OAuth callback from GetLate Instagram connect.
 * URL: /connect-instagram/callback?user_id=...&connected=instagram&profileId=...&username=...
 */
export default function InstagramConnectCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const userId = searchParams.get('user_id')
    const connected = searchParams.get('connected')
    const profileId = searchParams.get('profileId')
    const username = searchParams.get('username') || ''

    if (!userId || connected !== 'instagram' || !profileId) {
      setStatus('error')
      setMessage('חסרים פרטים בחיבור. נסו שוב מהתחלה.')
      return
    }

    // Verify current user matches callback user_id
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || user.id !== userId) {
        setStatus('error')
        setMessage('משתמש לא תואם. היכנסו מחדש ונסו שוב.')
        return
      }
      finishConnection()
    })

    async function finishConnection() {

      try {
        // Get Instagram account _id from GetLate (for posting later)
        let accountId = searchParams.get('accountId') || ''
        if (!accountId) {
          try {
            const accounts = await listAccounts(profileId)
            const ig = accounts.find((a) => a.platform === 'instagram')
            if (ig) accountId = ig._id || ig.accountId || ''
          } catch {
            // continue without accountId; we can fetch later
          }
        }

        const { error } = await supabase.from('instagram_accounts').upsert(
          {
            user_id: userId,
            late_profile_id: profileId,
            late_account_id: accountId || null,
            instagram_id: accountId || null,
            username: username || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )
        if (error) throw error
        setStatus('success')
        setTimeout(() => navigate('/posts/loading', { replace: true }), 1500)
      } catch (err) {
        setStatus('error')
        setMessage(err?.message || 'שגיאה בשמירת החיבור. נסו שוב.')
      }
    }
  }, [navigate, searchParams])

  return (
    <div className="page" role="status" aria-live="polite" aria-busy={status === 'loading'}>
      <div className="page-card">
        <h1 className="page-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>חיבור אינסטגרם</h1>
        {status === 'loading' && (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
            מחבר את חשבון האינסטגרם...
          </p>
        )}
        {status === 'success' && (
          <div className="alert alert-success" role="status" aria-live="polite">
            החשבון חובר בהצלחה! מעביר אתכם הלאה...
          </div>
        )}
        {status === 'error' && (
          <>
            <div className="alert alert-error" role="alert" aria-live="assertive">{message}</div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/connect-instagram')}
            >
              חזרה לחיבור אינסטגרם
            </button>
          </>
        )}
      </div>
    </div>
  )
}
