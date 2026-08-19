import { useCallback, useEffect, useRef, useState } from 'react'
import { createRecognizer, isSpeechSupported } from '../services/speech.js'

/**
 * React hook around the speech recognizer (SP-003/004/006).
 * Owns mic state (idle/listening), the interim transcript, and errors.
 * Calls `onFinal(transcript)` when the user finishes speaking.
 */
export function useSpeech({ language = 'en-US', onFinal } = {}) {
  const [supported] = useState(isSpeechSupported)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState(null) // 'not-allowed' | 'no-speech' | 'audio-capture' | ...

  const recRef = useRef(null)
  const onFinalRef = useRef(onFinal)
  onFinalRef.current = onFinal

  useEffect(() => {
    if (!supported) return undefined
    recRef.current = createRecognizer({
      lang: language,
      onStart: () => {
        setListening(true)
        setError(null)
      },
      onInterim: (t) => setInterim(t),
      onFinal: (t) => {
        setInterim('')
        onFinalRef.current?.(t)
      },
      onError: (code) => {
        // "no-speech"/"aborted" are benign; surface the actionable ones
        if (code !== 'no-speech' && code !== 'aborted') setError(code)
        setListening(false)
        setInterim('')
      },
      onEnd: () => {
        setListening(false)
        setInterim('')
      },
    })
    return () => recRef.current?.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supported])

  // keep recognizer language in sync without recreating it
  useEffect(() => {
    recRef.current?.setLang(language)
  }, [language])

  const start = useCallback(() => {
    if (!supported) return
    setInterim('')
    setError(null)
    recRef.current?.start()
  }, [supported])

  const stop = useCallback(() => {
    recRef.current?.stop()
  }, [])

  const toggle = useCallback(() => {
    setListening((cur) => {
      if (cur) recRef.current?.stop()
      else {
        setInterim('')
        setError(null)
        recRef.current?.start()
      }
      return cur // real state flips via onstart/onend events
    })
  }, [])

  return { supported, listening, interim, error, start, stop, toggle, clearError: () => setError(null) }
}
