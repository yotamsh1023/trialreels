import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignInWithGoogle() {
    setError('')
    setLoading(true)
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/connect-instagram`,
        },
      })
      if (oauthError) throw oauthError
      // User is redirected to Google; after success Supabase redirects back to redirectTo
    } catch (err) {
      console.error('Login error:', err)
      if (err.message === 'Failed to fetch') {
        setError('connection_error')
      } else {
        setError(err.message || 'אירעה שגיאה בהתחברות. נסו שוב.')
      }
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-card">
        <h1 className="page-title">התחברות למערכת</h1>
        <p className="page-subtitle">
          היכנסו עם חשבון Google כדי להמשיך לנהל את ההעלאות שלכם לרילס
        </p>

        {error && (
          <div id="login-error" className="alert alert-error" role="alert" aria-live="assertive">
            {error === 'connection_error' ? (
              <>
                <strong>שגיאת חיבור לשרת.</strong>
                <br />
                ודא ש-Google מופעל ב-Supabase: Authentication → Providers → Google.
                <br />
                <small style={{ opacity: 0.9 }}>הוסף גם את כתובת ההפניה (Redirect URL) בהגדרות הפרויקט.</small>
              </>
            ) : (
              error
            )}
          </div>
        )}

        <div style={{ marginTop: '1.5rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSignInWithGoogle}
            disabled={loading}
            aria-busy={loading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading ? 'מתחבר...' : (
              <>
                <GoogleIcon />
                התחבר עם Google
              </>
            )}
          </button>
        </div>

        <p className="link-text" style={{ marginTop: '1.5rem' }}>
          אין לך חשבון? <Link to="/signup">הירשם כאן</Link>
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}
