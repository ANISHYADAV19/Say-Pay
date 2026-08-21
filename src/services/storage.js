/**
 * localStorage persistence with a version key + safe parse (SP-013, T5).
 * Everything is guarded: corrupt or unavailable storage never breaks the app,
 * it just resets to empty (docs/03-security-and-access.md §4, NFR-5).
 */

const KEY = 'sayandpay.v1'

const hasStorage = () => {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

/** @returns {{items:Array,history:Object,language:string,theme:('light'|'dark'|null)}|null} */
export function loadState() {
  if (!hasStorage()) return null
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    // shape validation — anything unexpected resets to empty
    if (!data || typeof data !== 'object' || !Array.isArray(data.items)) return null
    return {
      items: data.items,
      history: data.history && typeof data.history === 'object' ? data.history : {},
      language: typeof data.language === 'string' ? data.language : 'en-US',
      // theme is optional: null means "no explicit choice → follow the system"
      theme: data.theme === 'light' || data.theme === 'dark' ? data.theme : null,
    }
  } catch {
    return null
  }
}

export function saveState(state) {
  if (!hasStorage()) return false
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({
        items: state.items,
        history: state.history,
        language: state.language,
        theme: state.theme,
      }),
    )
    return true
  } catch {
    return false
  }
}

export function clearStorage() {
  if (!hasStorage()) return
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
