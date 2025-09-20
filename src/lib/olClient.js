// src/lib/olClient.js
import axios from 'axios'

// Keep isDev if other files import/use it, though we no longer use the proxy.
const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

// ✅ Force absolute domains in ALL environments (no Vite proxy)
export const OL_ROOT = 'https://openlibrary.org';
export const COVERS_ROOT = 'https://covers.openlibrary.org';

// --- axios instance ----------------------------------------------------------
export const ol = axios.create({
  baseURL: OL_ROOT,
  timeout: 12000,
  headers: { 'Accept': 'application/json' },
  // Force %20 instead of '+' for spaces, and consistent encoding for arrays, etc.
  paramsSerializer: (params) => {
    const parts = [];
    const append = (k, v) => {
      if (v == null) return;
      if (Array.isArray(v)) v.forEach(val => append(k, val));
      else parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    };
    Object.entries(params || {}).forEach(([k, v]) => append(k, v));
    return parts.join('&');
  },
});

// --- tiny helpers: cache & encoding -----------------------------------------
const CACHE_PREFIX = 'olcache:';
const mem = new Map();

const safeGet = (k) => { try { return JSON.parse(sessionStorage.getItem(k)) || null } catch { return null } }
const safeSet = (k, v) => { try { sessionStorage.setItem(k, JSON.stringify(v)) } catch {} }

// Use SAME encoding as paramsSerializer so keys match network URLs (%20 not '+')
const encodeQS = (params = {}) => {
  const parts = [];
  const append = (k, v) => {
    if (v == null) return;
    if (Array.isArray(v)) v.forEach(val => append(k, val));
    else parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  };
  Object.entries(params).forEach(([k, v]) => append(k, v));
  return parts.join('&');
};

const keyFor = (path, params = {}) => {
  const qs = encodeQS(params);
  return `${CACHE_PREFIX}${path}${qs ? `?${qs}` : ''}`;
};

// Cached GET that falls back to stale cache if network fails (within staleMs)
export async function olCachedGet(
  path,
  { params, ttlMs = 5 * 60 * 1000, staleMs = 24 * 60 * 60 * 1000, signal } = {}
) {
  const key = keyFor(path, params);
  const now = Date.now();

  const pickCache = () => {
    const inMem = mem.get(key);
    if (inMem) return inMem;
    const sess = safeGet(key);
    if (sess) return sess;
    return null;
  };

  const cached = pickCache();
  const isFresh = cached && (now - cached.t) < ttlMs;
  const isStaleOk = cached && (now - cached.t) < staleMs;

  if (isFresh) return { data: cached.d, fromCache: true };

  try {
    const res = await ol.get(path, { params, signal });
    const payload = { t: now, d: res.data };
    mem.set(key, payload); safeSet(key, payload);
    return res;
  } catch (err) {
    if (isStaleOk) {
      return { data: cached.d, fromCache: 'stale' };
    }
    throw err;
  }
}

// --- misc utils you already had ---------------------------------------------
export const ratingForKey = (key = 'x') =>
  ((Array.from(key).reduce((a, c) => ((a * 33 + c.charCodeAt(0)) >>> 0), 0) % 11) * 0.5);

export const coverUrlFrom = (doc) => {
  const id = doc.cover_i || doc.cover_id || doc.cover;
  return id
    ? `${COVERS_ROOT}/b/id/${id}-L.jpg`
    : `https://via.placeholder.com/300x450?text=No+Cover`;
};

export const normalizeDoc = (doc) => ({
  key: doc.key,
  id: doc.key,
  title: doc.title || doc.title_suggest,
  author: (doc.author_name && doc.author_name[0]) || (doc.authors && doc.authors[0]?.name) || 'Unknown',
  year: doc.first_publish_year || null,
  coverUrl: coverUrlFrom(doc),
  rating: ratingForKey(doc.key || String(doc.cover_i || 'x')),
  genres: doc.subject ? doc.subject.slice(0, 3) : [],
});

// --- your existing subject search with fallbacks (kept as-is) ----------------
export async function searchBySubject(subject, limit = 6, { ttlMs = 5 * 60 * 1000, signal } = {}) {
  try {
    const { data } = await olCachedGet('/search.json', { params: { subject, limit }, ttlMs, signal });
    return data.docs || [];
  } catch (e1) {
    try {
      const { data } = await olCachedGet('/search.json', { params: { q: `subject:"${subject}"`, limit }, ttlMs, signal });
      return data.docs || [];
    } catch (e2) {
      try {
        const { data } = await olCachedGet(`/subjects/${encodeURIComponent(subject)}.json`, { params: { limit }, ttlMs, signal });
        const works = data?.works || [];
        return works.map(w => ({
          key: w.key,
          title: w.title,
          author_name: w.authors?.map(a => a.name),
          first_publish_year: w.first_publish_year || w.first_publish_date,
          cover_id: w.cover_id,
          subject: w.subject,
        }));
      } catch {
        return [];
      }
    }
  }
}

// --- thin helpers for ALL APIs you listed -----------------------------------

// Trending Books: https://openlibrary.org/trending/{period}.json
// period = 'daily' | 'weekly' | 'monthly'
export async function trendingBooks(period = 'daily', { signal } = {}) {
  const path = `/trending/${period}.json`;
  // Trending changes often; shorter cache
  const { data } = await olCachedGet(path, { signal, ttlMs: 60 * 1000 });
  // API returns an object; sometimes .works list is what callers want
  return data?.works ?? data ?? [];
}

// Book Search: https://openlibrary.org/search.json?q={query}&limit={value}&page={page}
export async function searchBooks(q, { limit = 24, page = 1, signal } = {}) {
  const { data } = await olCachedGet('/search.json', { params: { q, limit, page }, signal });
  return data; // { numFound, docs, ... }
}

// Subject Search (direct): https://openlibrary.org/search.json?subject={subject}&limit={value}
export async function subjectSearch(subject, { limit = 24, signal } = {}) {
  const { data } = await olCachedGet('/search.json', { params: { subject, limit }, signal });
  return data; // { docs, ... }
}

// Book Details: https://openlibrary.org/{book.key}.json
// Accepts keys like "/works/OL82563W" or "works/OL82563W"
export async function bookDetails(bookKey, { signal } = {}) {
  const path = bookKey.startsWith('/') ? bookKey : `/${bookKey}`;
  const { data } = await olCachedGet(`${path}.json`, { signal });
  return data;
}

// (Covers are just URLs; use coverUrlFrom(doc) for: https://covers.openlibrary.org/b/id/{id}-L.jpg
