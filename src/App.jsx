import { useCallback, useEffect, useMemo, useState } from 'react'
import { ListProvider, useList } from './store/ListContext.jsx'
import { useSpeech } from './hooks/useSpeech.js'
import { useToasts } from './hooks/useToasts.js'
import { useCommandRunner } from './hooks/useCommandRunner.js'
import { computeSuggestions } from './services/suggestions.js'
import { titleCase } from './utils/format.js'
import { useT } from './i18n/useT.js'

import Header from './components/Header.jsx'
import StatusBar from './components/StatusBar.jsx'
import TypedInputFallback from './components/TypedInputFallback.jsx'
import SuggestionStrip from './components/SuggestionStrip.jsx'
import ShoppingList from './components/ShoppingList.jsx'
import SearchResults from './components/SearchResults.jsx'
import EmptyState from './components/EmptyState.jsx'
import MicButton from './components/MicButton.jsx'
import ToastHost from './components/ToastHost.jsx'

/**
 * App shell (SP-024/025). Wires the store to the voice + command pipeline and
 * renders the full loop: header → status → input → suggestions → list/search,
 * with the mic FAB and toast host floating above. Mobile-first, a11y-minded.
 */
function Shell() {
  const { language, setLanguage, addItem, items, history } = useList()
  const { t } = useT()

  const [search, setSearch] = useState(null) // { query, filters, results } | null
  const [lastTranscript, setLastTranscript] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const [voiceDenied, setVoiceDenied] = useState(false)

  const { toasts, push, dismiss } = useToasts()

  // aria-live re-reads only when the node's text changes; bounce through '' so
  // even repeated identical messages ("Added milk" twice) get announced.
  const announce = useCallback((msg) => {
    setAnnouncement('')
    const raf = typeof window !== 'undefined' ? window.requestAnimationFrame : (fn) => fn()
    raf(() => setAnnouncement(msg))
  }, [])

  const { run, processing } = useCommandRunner({ language, pushToast: push, announce, setSearch })

  const runText = useCallback(
    (text) => {
      setLastTranscript(text)
      return run(text)
    },
    [run],
  )

  const { supported, listening, interim, error, toggle, clearError } = useSpeech({
    language,
    onFinal: runText,
  })

  // Surface actionable mic errors as a toast, and permanently promote the typed
  // input once voice is denied/unavailable (FR-1.4, NFR-5).
  useEffect(() => {
    if (!error) return
    const denied = error === 'not-allowed' || error === 'service-not-allowed'
    const msg = denied
      ? t('error.micBlocked')
      : error === 'audio-capture'
        ? t('error.noMic')
        : t('error.generic')
    if (denied || error === 'audio-capture') setVoiceDenied(true)
    push({ type: 'error', message: msg })
    announce(msg)
    clearError()
  }, [error, push, announce, clearError, t])

  const promoteTyped = !supported || voiceDenied

  const micState = !supported
    ? 'unavailable'
    : processing
      ? 'processing'
      : listening
        ? 'listening'
        : 'idle'

  const suggestions = useMemo(
    () => computeSuggestions({ items, history }, { max: 6 }),
    [items, history],
  )

  const addByName = useCallback(
    (name, category, unit = null) => {
      addItem({ name, category, unit })
      const msg = t('toast.added', { name: titleCase(name) })
      push({ type: 'success', message: msg })
      announce(msg)
    },
    [addItem, push, announce, t],
  )

  const onAddSuggestion = useCallback((s) => addByName(s.item, s.category), [addByName])
  const onAddFromSearch = useCallback((p) => addByName(p.name, p.category), [addByName])

  return (
    <div className="min-h-dvh bg-stone-50 text-stone-900 dark:bg-[#0B0F14] dark:text-stone-100">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-4 px-4 pb-44 pt-5">
        <Header language={language} onLanguageChange={setLanguage} />

        <StatusBar
          listening={listening}
          processing={processing}
          interim={interim}
          lastTranscript={lastTranscript}
          announcement={announcement}
        />

        <TypedInputFallback onSubmit={runText} promoted={promoteTyped} disabled={processing} />

        <SuggestionStrip suggestions={suggestions} onAdd={onAddSuggestion} />

        <main className="flex-1">
          {search ? (
            <SearchResults search={search} onAdd={onAddFromSearch} onClose={() => setSearch(null)} />
          ) : items.length === 0 ? (
            <EmptyState onTry={runText} disabled={processing} />
          ) : (
            <ShoppingList />
          )}
        </main>
      </div>

      <MicButton state={micState} onToggle={toggle} />
      <ToastHost toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

export default function App() {
  return (
    <ListProvider>
      <Shell />
    </ListProvider>
  )
}
