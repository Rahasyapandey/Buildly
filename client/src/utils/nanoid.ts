// ============================================================
// nanoid — tiny ID generator (no external dependency needed)
// Generates a URL-safe random string of 21 characters.
// Used for element IDs that must be stable across frontend
// and backend (they're stored as-is in PostgreSQL).
// ============================================================

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

export function nanoid(size = 21): string {
  const bytes = crypto.getRandomValues(new Uint8Array(size))
  return Array.from(bytes, (b) => CHARS[b & 63]).join('')
}
