/**
 * Optional CDN / static host for per-chapter JSON. Example chapter URL:
 * `{base}/{translationId}/{bookId}/{chapter}.json`
 *
 * Set in `.env`: EXPO_PUBLIC_SCRIPTURE_CDN_BASE=https://your.cdn.example/scripture
 */
export const SCRIPTURE_CDN_BASE_URL = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SCRIPTURE_CDN_BASE?.trim()) || '';

/**
 * Second-tier base (e.g. another CDN or `http://localhost:8081/scripture-data` during web dev).
 */
export const SCRIPTURE_STATIC_BASE_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SCRIPTURE_STATIC_BASE?.trim()) || '';
