/**
 * Enables Email auth provider for the trial flow Supabase project via Management API.
 * Requires: SUPABASE_ACCESS_TOKEN in .env (get from https://supabase.com/dashboard/account/tokens)
 * Run: node scripts/enable-email-auth.js
 */

import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRef = 'owtkjltnhfsystbbxxeq'

function loadEnv() {
  const envPath = join(__dirname, '..', '.env')
  if (!existsSync(envPath)) return
  const content = readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*SUPABASE_ACCESS_TOKEN\s*=\s*(.+)\s*$/)
    if (m) return m[1].replace(/^["']|["']$/g, '').trim()
  }
}

const token = process.env.SUPABASE_ACCESS_TOKEN || loadEnv()
if (!token) {
  console.error('Missing SUPABASE_ACCESS_TOKEN.')
  console.error('Add it to .env or run: SUPABASE_ACCESS_TOKEN=your_token node scripts/enable-email-auth.js')
  console.error('Get a token from: https://supabase.com/dashboard/account/tokens')
  process.exit(1)
}

const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/config/auth`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    external_email_enabled: true,
    site_url: 'http://localhost:5173',
  }),
})

if (!res.ok) {
  const text = await res.text()
  console.error('API error:', res.status, text)
  process.exit(1)
}

console.log('Email auth provider enabled. site_url set to http://localhost:5173')
console.log('Try signup/login again at http://localhost:5173')
