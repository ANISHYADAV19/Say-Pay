import { useCallback, useRef, useState } from 'react'
import { useList } from '../store/ListContext.jsx'
import { parseCommand } from '../services/parser.js'
import { applyCommand, describeCommand } from '../services/commands.js'
import { filterCatalog } from '../services/catalog.js'

/**
 * The end-to-end command pipeline (SP-014): transcript -> parse -> execute ->
 * feedback. Owns the "processing" (thinking) flag and cancels an in-flight
 * parse if a new command arrives.
 *
 * @param {{
 *   language: string,
 *   pushToast: (t: {type:string,message:string}) => void,
 *   announce: (msg: string) => void,
 *   setSearch: (s: object|null) => void,
 * }} deps
 */
export function useCommandRunner({ language, pushToast, announce, setSearch }) {
  const list = useList()
  const [processing, setProcessing] = useState(false)
  const abortRef = useRef(null)

  const run = useCallback(
    async (transcript) => {
      const text = (transcript || '').trim()
      if (!text) return null

      abortRef.current?.abort()
      const ac = new AbortController()
      abortRef.current = ac

      setProcessing(true)
      announce('Thinking…')
      try {
        const existingNames = list.items.map((it) => it.name)
        const { command } = await parseCommand(text, language, { signal: ac.signal })

        if (command.action === 'search') {
          const results = filterCatalog({ query: command.item, ...command.filters })
          setSearch({
            query: command.item || command.filters?.brand || '',
            filters: command.filters || {},
            results,
          })
          const fb = describeCommand(command, { resultCount: results.length })
          pushToast(fb)
          announce(fb.message)
          return command
        }

        if (command.action === 'unknown') {
          const fb = describeCommand(command)
          pushToast(fb)
          announce(fb.message)
          return command
        }

        // list-mutating command
        const { changed } = applyCommand(command, list, { existingNames })
        setSearch(null) // return focus to the list
        const fb = describeCommand(command, { changed })
        pushToast(fb)
        announce(fb.message)
        return command
      } catch {
        const fb = { type: 'error', message: 'Something went wrong — please try again.' }
        pushToast(fb)
        announce(fb.message)
        return null
      } finally {
        setProcessing(false)
      }
    },
    [language, list, pushToast, announce, setSearch],
  )

  return { run, processing }
}
