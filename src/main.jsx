import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const root = document.getElementById('root')
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  root.innerHTML = `
    <div style="font-family:system-ui,sans-serif;padding:2rem;max-width:480px;margin:0 auto;text-align:center;direction:rtl;">
      <h1 style="font-size:1.25rem;margin-bottom:1rem;">שגיאת הגדרות</h1>
      <p style="color:#666;margin-bottom:1rem;">חסרים משתני סביבה. ב-Vercel: Settings → Environment Variables הוסף:</p>
      <ul style="text-align:right;list-style:none;padding:0;">
        <li><code style="background:#f0f0f0;padding:0.2rem 0.4rem;">VITE_SUPABASE_URL</code></li>
        <li><code style="background:#f0f0f0;padding:0.2rem 0.4rem;">VITE_SUPABASE_ANON_KEY</code></li>
      </ul>
      <p style="color:#666;font-size:0.9rem;">אחרי הוספה – בצע Redeploy לפרויקט.</p>
    </div>
  `
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  )
}
