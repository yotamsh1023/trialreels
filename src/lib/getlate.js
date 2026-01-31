/**
 * GetLate (Late) API helpers – https://docs.getlate.dev/
 * Base URL: https://getlate.dev/api/v1
 */

const BASE = 'https://getlate.dev/api/v1'

function getApiKey() {
  return import.meta.env.VITE_GETLATE_API_KEY || ''
}

async function request(method, path, body = null, query = {}) {
  const key = getApiKey()
  if (!key) throw new Error('VITE_GETLATE_API_KEY לא הוגדר ב-.env')
  const url = new URL(BASE + path)
  Object.entries(query).forEach(([k, v]) => {
    if (v != null && v !== '') url.searchParams.set(k, v)
  })
  const res = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      ...(body && { 'Content-Type': 'application/json' }),
    },
    ...(body && { body: JSON.stringify(body) }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 402) {
      const code = (data.code || '').toString().toLowerCase()
      const msg = (data.error || data.message || '').toString().toLowerCase()
      if (code.includes('analytics') || code.includes('addon') || msg.includes('analytics') || msg.includes('addon')) {
        throw new Error('נדרש מנוי Analytics ב-GetLate. הפעל את התוסף Analytics בחשבון GetLate.')
      }
    }
    throw new Error(data.error || data.message || `GetLate ${res.status}`)
  }
  return data
}

/** List profiles (GET /v1/profiles) */
export async function listProfiles() {
  return request('GET', '/profiles')
}

/** Create a profile (POST /v1/profiles) */
export async function createProfile(name, description = '', color = '#0095f6') {
  const data = await request('POST', '/profiles', { name, description, color })
  return data.profile?._id || data.profile?.id
}

/** Start Instagram OAuth – returns authUrl to redirect user (GET /v1/connect/instagram) */
export async function getInstagramConnectUrl(profileId, redirectUrl) {
  const data = await request('GET', '/connect/instagram', null, {
    profileId,
    redirect_url: redirectUrl,
  })
  return data.authUrl
}

/** List accounts for a profile (GET /v1/accounts?profileId=) */
export async function listAccounts(profileId) {
  const data = await request('GET', '/accounts', null, { profileId })
  return data.accounts || []
}

/**
 * List posts (GET /v1/posts). Returns posts created/scheduled via GetLate.
 * Query: profileId?, platform?, status?, page?, limit?, dateFrom?, dateTo?.
 * Response: { posts: [...], pagination: { page, limit, total, pages } }.
 */
export async function listPosts(query = {}) {
  return request('GET', '/posts', null, query)
}

/**
 * Get analytics list or single post (GET /v1/analytics).
 * Query: profileId (required), platform?, fromDate?, toDate?, limit?, page?, sortBy?, order?, postId? (single post).
 * Returns raw API response (list or single post). 402 throws Hebrew message for analytics add-on required.
 */
export async function getAnalytics(query = {}) {
  return request('GET', '/analytics', null, query)
}

/** Fetch all analytics pages (no date limit). Keeps requesting page 1, 2, ... until no more items. */
export async function getAllAnalyticsPages(query = {}) {
  const limit = Math.min(Number(query.limit) || 100, 100)
  const baseQuery = { ...query, limit, sortBy: query.sortBy || 'date', order: query.order || 'desc' }
  const all = []
  let page = 1
  while (true) {
    const data = await getAnalytics({ ...baseQuery, page })
    const list = extractPostsFromAnalyticsResponse(data)
    if (!list.length) break
    all.push(...list)
    const pagination = data.pagination ?? data.paginationInfo
    const totalPages = pagination?.pages ?? pagination?.totalPages
    if (totalPages != null && page >= totalPages) break
    if (list.length < limit) break
    page++
  }
  return all
}

/** Fetch all posts pages (no date limit). Keeps requesting page 1, 2, ... until no more items. */
export async function getAllPostsPages(query = {}) {
  const limit = Math.min(Number(query.limit) || 100, 100)
  const baseQuery = { ...query, limit }
  const all = []
  let page = 1
  while (true) {
    const data = await listPosts({ ...baseQuery, page })
    const list = Array.isArray(data?.posts) ? data.posts : []
    if (!list.length) break
    all.push(...list)
    const totalPages = data.pagination?.pages
    if (totalPages != null && page >= totalPages) break
    if (list.length < limit) break
    page++
  }
  return all
}

/**
 * Extract post list from analytics API response. Handles multiple response shapes (posts, data, items, results, pagination).
 */
export function extractPostsFromAnalyticsResponse(data) {
  if (!data || typeof data !== 'object') return []
  if (Array.isArray(data)) return data
  const keys = ['posts', 'data', 'items', 'results', 'analytics']
  for (const k of keys) {
    const val = data[k]
    if (Array.isArray(val)) return val
  }
  // Pagination wrapper: e.g. { data: { posts: [...] } } or { posts: { items: [...] } }
  if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
    const inner = data.data
    for (const k of keys) {
      if (Array.isArray(inner[k])) return inner[k]
    }
  }
  // Single array value anywhere in the object
  const arr = Object.values(data).find((v) => Array.isArray(v))
  return arr ?? []
}
