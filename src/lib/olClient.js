import axios from 'axios'
const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
export const OL_ROOT = isDev ? '/ol' : 'https://openlibrary.org'
export const COVERS_ROOT = isDev ? '/covers' : 'https://covers.openlibrary.org'

export const ol = axios.create({
  baseURL: OL_ROOT,
  timeout: 12000,
  headers: { 'Accept': 'application/json' },
})

const CACHE_PREFIX = 'olcache:'
const mem = new Map()

const safeGet = (k) => { try { return JSON.parse(sessionStorage.getItem(k)) || null } catch { return null } }
const safeSet = (k, v) => { try { sessionStorage.setItem(k, JSON.stringify(v)) } catch {} }

const keyFor = (path, params={}) => {
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k,v]) => {
    if (v == null) return
    if (Array.isArray(v)) v.forEach(val => usp.append(k, String(val)))
    else usp.append(k, String(v))
  })
  return `${CACHE_PREFIX}${path}?${usp.toString()}`
}

export async function olCachedGet(path, { params, ttlMs = 5*60*1000, staleMs = 24*60*60*1000, signal } = {}) {
  const key = keyFor(path, params)
  const now = Date.now()

  const pickCache = () => {
    const inMem = mem.get(key)
    if (inMem) return inMem
    const sess = safeGet(key)
    if (sess) return sess
    return null
  }

  const cached = pickCache()
  const isFresh = cached && (now - cached.t) < ttlMs
  const isStaleOk = cached && (now - cached.t) < staleMs

  if (isFresh) return { data: cached.d, fromCache: true }

  try {
    const res = await ol.get(path, { params, signal })
    const payload = { t: now, d: res.data }
    mem.set(key, payload); safeSet(key, payload)
    return res
  } catch (err) {
    if (isStaleOk) {
      return { data: cached.d, fromCache: 'stale' }
    }
    throw err
  }
}

export const ratingForKey = (key='x') => ((Array.from(key).reduce((a,c)=>((a*33 + c.charCodeAt(0))>>>0),0) % 11) * 0.5)
export const coverUrlFrom = (doc) => {
  const id = doc.cover_i || doc.cover_id || doc.cover
  return id ? `${COVERS_ROOT}/b/id/${id}-L.jpg` : `https://via.placeholder.com/300x450?text=No+Cover`
}
export const normalizeDoc = (doc) => ({
  key: doc.key,
  id: doc.key,
  title: doc.title || doc.title_suggest,
  author: (doc.author_name && doc.author_name[0]) || (doc.authors && doc.authors[0]?.name) || 'Unknown',
  year: doc.first_publish_year || null,
  coverUrl: coverUrlFrom(doc),
  rating: ratingForKey(doc.key || String(doc.cover_i || 'x')),
  genres: doc.subject ? doc.subject.slice(0,3) : [],
})

export async function searchBySubject(subject, limit = 6, { ttlMs = 5*60*1000, signal } = {}) {
  try {
    const { data } = await olCachedGet('/search.json', { params: { subject, limit }, ttlMs, signal })
    return data.docs || []
  } catch (e1) {
    try {
      const { data } = await olCachedGet('/search.json', { params: { q: `subject:"${subject}"`, limit }, ttlMs, signal })
      return data.docs || []
    } catch (e2) {
      try {
        const { data } = await olCachedGet(`/subjects/${encodeURIComponent(subject)}.json`, { params: { limit }, ttlMs, signal })
        const works = data?.works || []
        return works.map(w => ({
          key: w.key,
          title: w.title,
          author_name: w.authors?.map(a => a.name),
          first_publish_year: w.first_publish_year || w.first_publish_date,
          cover_id: w.cover_id,
          subject: w.subject,
        }))
      } catch {
        return []
      }
    }
  }
}