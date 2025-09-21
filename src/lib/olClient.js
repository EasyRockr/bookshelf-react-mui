import axios from 'axios';

export const OL_ROOT = 'https://openlibrary.org';
export const COVERS_ROOT = 'https://covers.openlibrary.org';

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

export const ol = axios.create({
  baseURL: OL_ROOT,
  headers: { Accept: 'application/json' },
  paramsSerializer: (p) => qsSerialize(p || {}),
});

export const ratingForKey = (key = 'x') =>
  ((Array.from(key).reduce((a, c) => ((a * 33 + c.charCodeAt(0)) >>> 0), 0) % 11) * 0.5);

export const coverUrlFrom = (doc = {}) => {
  const id = doc.cover_i || doc.cover_id || doc.cover;
  return id
    ? `${COVERS_ROOT}/b/id/${id}-L.jpg`
    : `https://via.placeholder.com/300x450?text=No+Cover`;
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

export { axios };
