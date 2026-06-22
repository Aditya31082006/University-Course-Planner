// Thin, safe wrapper around localStorage. Every read/write is guarded so a
// corrupted value, a private-browsing quota error, or SSR (no `window`)
// never crashes the app — callers always get a sane fallback instead.

export const STORAGE_KEYS = {
  COURSES: 'ucp.courses',
  TIMETABLE: 'ucp.timetableEntries',
  SETTINGS: 'ucp.settings',
};

export function loadFromStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[storage] Failed to read "${key}", using fallback.`, error);
    return fallback;
  }
}

export function saveToStorage(key, value) {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[storage] Failed to write "${key}".`, error);
    return false;
  }
}

export function removeFromStorage(key) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storage] Failed to remove "${key}".`, error);
  }
}
