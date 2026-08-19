/**
 * Web Speech API wrapper (SP-003, FR-1.1/1.3).
 *
 * Framework-agnostic: exposes support detection + a small recognizer with
 * start/stop/abort and callbacks. The React glue lives in hooks/useSpeech.js.
 */

export function isSpeechSupported() {
  return (
    typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  )
}

/**
 * @param {{
 *   lang?: string,
 *   onInterim?: (text: string) => void,
 *   onFinal?: (text: string) => void,
 *   onError?: (code: string) => void,
 *   onStart?: () => void,
 *   onEnd?: () => void,
 * }} opts
 */
export function createRecognizer(opts = {}) {
  const Impl = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!Impl) return null

  const rec = new Impl()
  rec.lang = opts.lang || 'en-US'
  rec.continuous = false
  rec.interimResults = true
  rec.maxAlternatives = 1

  rec.onstart = () => opts.onStart?.()
  rec.onerror = (e) => opts.onError?.(e.error || 'unknown')
  rec.onend = () => opts.onEnd?.()
  rec.onresult = (event) => {
    let interim = ''
    let final = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const r = event.results[i]
      if (r.isFinal) final += r[0].transcript
      else interim += r[0].transcript
    }
    if (interim) opts.onInterim?.(interim)
    if (final) opts.onFinal?.(final.trim())
  }

  return {
    start() {
      try {
        rec.start()
      } catch {
        /* start() throws if already started — ignore */
      }
    },
    stop() {
      try {
        rec.stop()
      } catch {
        /* ignore */
      }
    },
    abort() {
      try {
        rec.abort()
      } catch {
        /* ignore */
      }
    },
    setLang(lang) {
      rec.lang = lang
    },
  }
}
