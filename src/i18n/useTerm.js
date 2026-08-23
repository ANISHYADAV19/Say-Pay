import { useCallback } from 'react'
import { useList } from '../store/ListContext.jsx'
import { displayName } from '../services/terms.js'

/**
 * Binds the term display name to the current UI language.
 *
 * @returns {{ term: (name: string) => string }}
 */
export function useTerm() {
  const { language } = useList()
  const term = useCallback((name) => displayName(name, language), [language])
  return { term }
}
