/**
 * Web Speech API wrapper (SP-003, FR-1.1/1.3).
 *
 * Framework-agnostic: exposes support detection + a small recognizer with
 * start/stop/abort and callbacks. The React glue lives in hooks/useSpeech.js.
 */

export function isSpeechSupported() {
  if (typeof window === 'undefined') return false
  // Both engines gate the recognizer on a secure context. Over plain http —
  // e.g. hitting the dev server from a phone on the LAN — the constructor can
  // still exist while start() never yields any audio, which is worse than
  // reporting it unsupported and promoting the typed input.
  if (window.isSecureContext === false) return false
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition)
}

/**
 * @param {{
 *   lang?: string,
 *   onInterim?: (text: string) => void,
 *   onFinal?: (text: string) => void,
 *   onError?: (code: string) => void,
 *   onNoResult?: () => void,
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

  // Per-session bookkeeping. The characteristic mobile failure is a session
  // that opens and closes cleanly having heard nothing (see utils/device.js) —
  // indistinguishable from success unless we track whether a transcript ever
  // arrived, and from a cancellation unless we know the user hit stop.
  let gotResult = false
  let sawError = false
  let userStopped = false

  rec.onstart = () => opts.onStart?.()

  rec.onerror = (e) => {
    const code = e.error || 'unknown'
    // "no-speech" is not a fault — it's the mic hearing nothing, which the
    // onend/no-result path below reports more usefully.
    if (code === 'no-speech') return
    sawError = true
    opts.onError?.(code)
  }

  rec.onend = () => {
    if (!gotResult && !sawError && !userStopped) opts.onNoResult?.()
    opts.onEnd?.()
  }

  rec.onresult = (event) => {
    let interim = ''
    let final = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const r = event.results[i]
      if (r.isFinal) final += r[0].transcript
      else interim += r[0].transcript
    }
    if (interim) opts.onInterim?.(interim)
    if (final) {
      gotResult = true
      opts.onFinal?.(final.trim())
    }
  }

  return {
    start() {
      gotResult = false
      sawError = false
      userStopped = false
      try {
        rec.start()
      } catch (err) {
        // InvalidStateError just means a session is already open — harmless.
        // Anything else means the engine is present but not functional (some
        // WebKit wrappers expose the constructor without implementing it), and
        // the UI has to hear about that rather than sit on a dead button.
        if (err?.name !== 'InvalidStateError') {
          sawError = true
          opts.onError?.('start-failed')
        }
      }
    },
    stop() {
      userStopped = true
      try {
        rec.stop()
      } catch {
        /* ignore */
      }
    },
    abort() {
      userStopped = true
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
