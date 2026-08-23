import { useCallback, useEffect, useRef, useState } from 'react'
import { createRecognizer, isSpeechSupported } from '../services/speech.js'

/**
 * React hook around the speech recognizer (SP-003/004/006).
 * Owns mic state (idle/listening), the interim transcript, and errors.
 * Calls `onFinal(transcript)` when the user finishes speaking.
 */

/**
 * How long to wait for `onstart` before giving up on a session.
 *
 * Chrome and Safari fire it within a few hundred ms once permission exists, but
 * a first-run permission prompt sits in front of it — hence the patience. Some
 * WebKit wrappers (in-app browsers, non-Safari iOS browsers) expose the
 * constructor without implementing it and never fire *any* event; without this
 * the button quietly stays idle and the user is left guessing.
 */
const START_TIMEOUT_MS = 10000

export function useSpeech({ language = 'en-US', onFinal } = {}) {
  const [supported] = useState(isSpeechSupported)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState(null) // 'not-allowed' | 'audio-capture' | 'no-start' | ...
  const [hint, setHint] = useState(null) // 'no-speech' — heard nothing, not a fault

  const recRef = useRef(null)
  // Tracks "a session is in flight" (requested OR running). `listening` state is
  // the visual truth and only flips on onstart, but toggle() has to decide
  // start-vs-stop synchronously, before React has re-rendered.
  const pendingRef = useRef(false)
  const watchdogRef = useRef(0)
  const onFinalRef = useRef(onFinal)
  onFinalRef.current = onFinal

  const clearWatchdog = useCallback(() => {
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current)
      watchdogRef.current = 0
    }
  }, [])

  const settle = useCallback(() => {
    clearWatchdog()
    pendingRef.current = false
    setListening(false)
    setInterim('')
  }, [clearWatchdog])

  useEffect(() => {
    if (!supported) return undefined
    recRef.current = createRecognizer({
      lang: language,
      onStart: () => {
        clearWatchdog()
        setListening(true)
        setError(null)
      },
      onInterim: (t) => setInterim(t),
      onFinal: (t) => {
        setInterim('')
        onFinalRef.current?.(t)
      },
      onNoResult: () => setHint('no-speech'),
      onError: (code) => {
        // "aborted" is benign (our own stop/teardown); surface the rest
        if (code !== 'aborted') setError(code)
        settle()
      },
      onEnd: settle,
    })
    return () => {
      clearWatchdog()
      recRef.current?.abort()
    }
    // `language` is applied at creation and then synced below — recreating the
    // recognizer on every language change would drop an in-flight session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supported])

  // keep recognizer language in sync without recreating it
  useEffect(() => {
    recRef.current?.setLang(language)
  }, [language])

  const start = useCallback(() => {
    if (!supported || pendingRef.current) return
    setInterim('')
    setError(null)
    setHint(null)
    pendingRef.current = true

    clearWatchdog()
    watchdogRef.current = setTimeout(() => {
      watchdogRef.current = 0
      // Abort so a late permission grant can't open a zombie session behind
      // the error we're about to report.
      recRef.current?.abort()
      setError('no-start')
      settle()
    }, START_TIMEOUT_MS)

    recRef.current?.start()
  }, [supported, clearWatchdog, settle])

  const stop = useCallback(() => {
    clearWatchdog()
    recRef.current?.stop()
  }, [clearWatchdog])

  /**
   * Mic button handler. Runs start/stop inline rather than inside a setState
   * updater: the recognizer has to be started within the tap's user-activation
   * window (mobile Safari enforces this), and an updater both runs too late and
   * gets double-invoked under StrictMode — firing start() twice per tap.
   */
  const toggle = useCallback(() => {
    if (pendingRef.current) stop()
    else start()
  }, [start, stop])

  return {
    supported,
    listening,
    interim,
    error,
    hint,
    start,
    stop,
    toggle,
    clearError: () => setError(null),
    clearHint: () => setHint(null),
  }
}
