import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import InstagramConnect from './pages/InstagramConnect'
import InstagramConnectCallback from './pages/InstagramConnectCallback'
import PostsLoading from './pages/PostsLoading'
import PostSelection from './pages/PostSelection'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Accessibility from './pages/Accessibility'

function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="page" role="status" aria-live="polite" aria-busy="true">
        <div className="page-card">
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>טוען...</p>
        </div>
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="page" role="status" aria-live="polite" aria-busy="true">
        <div className="page-card">
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>טוען...</p>
        </div>
      </div>
    )
  }
  if (user) {
    return <Navigate to="/connect-instagram" replace />
  }
  return children
}

// Main entry: landing page at /
const MAIN_LANDING_PATH = '/'

export default function App() {
  return (
    <div className="app-root">
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
      <main id="main-content" tabIndex={-1}>
    <Routes>
      <Route path={MAIN_LANDING_PATH} element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/accessibility" element={<Accessibility />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route
        path="/connect-instagram"
        element={
          <ProtectedRoute>
            <InstagramConnect />
          </ProtectedRoute>
        }
      />
      <Route
        path="/connect-instagram/callback"
        element={
          <ProtectedRoute>
            <InstagramConnectCallback />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/loading"
        element={
          <ProtectedRoute>
            <PostsLoading />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts"
        element={
          <ProtectedRoute>
            <PostSelection />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={MAIN_LANDING_PATH} replace />} />
    </Routes>
      </main>
    </div>
  )
}
