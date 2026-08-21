import { useCallback } from 'react'
import { useList } from '../store/ListContext.jsx'
import { t as translate } from './strings.js'

/**
 * Binds the translator to the current UI language (FR-6.4). The language lives
 * in the list store (`useList().language`) — the same value that drives speech
 * recognition — so one control localizes the UI and sets the recognition locale.
 *
 * @returns {{ t: (key: string, vars?: object) => string|string[], lang: string }}
 */
export function useT() {
  const { language } = useList()
  const t = useCallback((key, vars) => translate(key, language, vars), [language])
  return { t, lang: language }
}
