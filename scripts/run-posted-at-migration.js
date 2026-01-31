/**
 * Applies the posted_at migration to user_posts via Supabase Management API.
 * Requires: SUPABASE_ACCESS_TOKEN in .env (get from https://supabase.com/dashboard/account/tokens)
 * Run: node scripts/run-posted-at-migration.js
 */

import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRef = 'owtkjltnhfsystbbxxeq'

function loadEnv() {
  const envPath = join(__dirname, '..', '.env')
  if (!existsSync(envPath)) return null
  const content = readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*SUPABASE_ACCESS_TOKEN\s*=\s*(.+)\s*$/)
    if (m) return m[1].replace(/^["']|["']$/g, '').trim()
  }
  return null
}

const token = process.env.SUPABASE_ACCESS_TOKEN || loadEnv()
if (!token) {
  console.error('Missing SUPABASE_ACCESS_TOKEN.')
  console.error('Add it to .env or run: SUPABASE_ACCESS_TOKEN=your_token node scripts/run-posted-at-migration.js')
  console.error('Get a token from: https://supabase.com/dashboard/account/tokens')
  process.exit(1)
}

const sql = `
alter table public.user_posts
  add column if not exists posted_at timestamptz;

create index if not exists user_posts_posted_at_idx on public.user_posts(posted_at);
`.trim()

const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: sql }),
})

if (!res.ok) {
  const text = await res.text()
  console.error('API error:', res.status, text)
  process.exit(1)
}

console.log('Migration applied: user_posts.posted_at column and index created.')
process.exit(0)
