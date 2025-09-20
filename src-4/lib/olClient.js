// src/lib/olClient.js
import axios from 'axios';

// Absolute public domains
export const OL_ROOT = 'https://openlibrary.org';
export const COVERS_ROOT = 'https://covers.openlibrary.org';

// Fallback cover (use a reliable host or swap to your own /public asset)
export const NO_COVER_URL = 'https://placehold.co/300x450?text=No%20Cover';

/** Keep %20 (not '+') for spaces */
export const qsSerialize = (params = {}) => {
  const parts = [];
  const add = (k, v) => {
    if (v == null) return;
    if (Array.isArray(v)) v.forEach((vv) => add(k, vv));
    else parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  };
  Object.entries(params).forEach(([k, v]) => add(k, v));
  return parts.join('&');
};

// Optional axios instance (kept for compatibility).
// NOTE: No timeout here (as requested: remove timers that end GETs).
export const ol = axios.create({
  baseURL: OL_ROOT,
  headers: { Accept: 'application/json' },
  paramsSerializer: (p) => qsSerialize(p || {}),
});

// ---- Utilities (unchanged API) ------------------------------------
export const ratingForKey = (key = 'x') =>
  ((Array.from(key).reduce((a, c) => ((a * 33 + c.charCodeAt(0)) >>> 0), 0) % 11) * 0.5);

export const coverUrlFrom = (doc = {}) => {
  const id = doc.cover_i || doc.cover_id || doc.cover;
  return id ? `${COVERS_ROOT}/b/id/${id}-L.jpg` : NO_COVER_URL;
};

export const normalizeDoc = (doc = {}) => ({
  key: doc.key,
  id: doc.key || doc.id,
  title: doc.title || doc.title_suggest,
  author:
    (doc.author_name && doc.author_name[0]) ||
    (doc.authors && doc.authors[0]?.name) ||
    'Unknown',
  year: doc.first_publish_year || doc.first_publish_date || null,
  coverUrl: coverUrlFrom(doc),
  rating: ratingForKey(doc.key || String(doc.cover_i || 'x')),
  genres: Array.isArray(doc.subject) ? doc.subject.slice(0, 3) : [],
});

// Re-export axios for convenience
export { axios };
