import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createRecognizer, isSpeechSupported } from './speech.js'

/**
 * Guards the recognizer wrapper (SP-003), and specifically the mobile failure
 * modes it exists to paper over: a session that opens and closes having heard
 * nothing, and an engine that exposes the constructor without implementing it.
 * Both look like success to a naive wrapper.
 *
 * The Web Speech API isn't available under vitest's node environment, so this
 * drives a fake implementation through the same event surface Chrome/Safari use.
 */

/** Minimal stand-in for SpeechRecognition, plus helpers to fire its events. */
class FakeRecognition {
  constructor() {
    FakeRecognition.last = this
    this.started = false
    this.startCalls = 0
    this.throwOnStart = null
  }

  start() {
    this.startCalls += 1
    if (this.throwOnStart) throw this.throwOnStart
    if (this.started) {
      const err = new Error('recognition already started')
      err.name = 'InvalidStateError'
      throw err
    }
    this.started = true
  }

  stop() {
    this.started = false
  }

  abort() {
    this.started = false
  }

  // --- event drivers -------------------------------------------------------
  fireStart() {
    this.onstart?.()
  }

  fireError(code) {
    this.onerror?.({ error: code })
  }

  fireEnd() {
    this.onend?.()
  }

  /** @param {Array<{ transcript: string, isFinal: boolean }>} parts */
  fireResult(parts) {
    const results = parts.map((p) => ({ 0: { transcript: p.transcript }, isFinal: p.isFinal }))
    results.length = parts.length
    this.onresult?.({ resultIndex: 0, results })
  }
}

/** Callback spies wired into a fresh recognizer. */
function build(overrides = {}) {
  const spies = {
    onStart: vi.fn(),
    onInterim: vi.fn(),
    onFinal: vi.fn(),
    onError: vi.fn(),
    onNoResult: vi.fn(),
    onEnd: vi.fn(),
    ...overrides,
  }
  const rec = createRecognizer(spies)
  return { rec, raw: FakeRecognition.last, spies }
}

beforeEach(() => {
  globalThis.window = { SpeechRecognition: FakeRecognition, isSecureContext: true }
})

afterEach(() => {
  delete globalThis.window
  FakeRecognition.last = null
})

describe('isSpeechSupported()', () => {
  it('is true when the constructor exists in a secure context', () => {
    expect(isSpeechSupported()).toBe(true)
  })

  it('accepts the webkit-prefixed constructor', () => {
    globalThis.window = { webkitSpeechRecognition: FakeRecognition, isSecureContext: true }
    expect(isSpeechSupported()).toBe(true)
  })

  it('is false over an insecure origin, even with the constructor present', () => {
    globalThis.window = { SpeechRecognition: FakeRecognition, isSecureContext: false }
    expect(isSpeechSupported()).toBe(false)
  })

  it('is false when no engine is exposed', () => {
    globalThis.window = { isSecureContext: true }
    expect(isSpeechSupported()).toBe(false)
  })
})

describe('createRecognizer() — transcripts', () => {
  it('splits interim from final and trims the final text', () => {
    const { rec, raw, spies } = build()
    rec.start()
    raw.fireStart()

    raw.fireResult([{ transcript: 'add mi', isFinal: false }])
    expect(spies.onInterim).toHaveBeenCalledWith('add mi')
    expect(spies.onFinal).not.toHaveBeenCalled()

    raw.fireResult([{ transcript: '  add milk  ', isFinal: true }])
    expect(spies.onFinal).toHaveBeenCalledWith('add milk')
  })
})

describe('createRecognizer() — the silent-session case', () => {
  it('reports no-result when a session ends without a transcript', () => {
    const { rec, raw, spies } = build()
    rec.start()
    raw.fireStart()
    raw.fireEnd()

    expect(spies.onNoResult).toHaveBeenCalledTimes(1)
    expect(spies.onEnd).toHaveBeenCalledTimes(1)
  })

  it('stays quiet when the session produced a transcript', () => {
    const { rec, raw, spies } = build()
    rec.start()
    raw.fireStart()
    raw.fireResult([{ transcript: 'add eggs', isFinal: true }])
    raw.fireEnd()

    expect(spies.onNoResult).not.toHaveBeenCalled()
  })

  it('stays quiet when the user deliberately stopped', () => {
    const { rec, raw, spies } = build()
    rec.start()
    raw.fireStart()
    rec.stop()
    raw.fireEnd()

    expect(spies.onNoResult).not.toHaveBeenCalled()
  })

  it('stays quiet when an error already explained the failure', () => {
    const { rec, raw, spies } = build()
    rec.start()
    raw.fireStart()
    raw.fireError('not-allowed')
    raw.fireEnd()

    expect(spies.onError).toHaveBeenCalledWith('not-allowed')
    expect(spies.onNoResult).not.toHaveBeenCalled()
  })

  it('treats "no-speech" as silence rather than an error', () => {
    const { rec, raw, spies } = build()
    rec.start()
    raw.fireStart()
    raw.fireError('no-speech')
    raw.fireEnd()

    expect(spies.onError).not.toHaveBeenCalled()
    expect(spies.onNoResult).toHaveBeenCalledTimes(1)
  })

  it('resets its bookkeeping between sessions', () => {
    const { rec, raw, spies } = build()
    rec.start()
    raw.fireStart()
    raw.fireResult([{ transcript: 'add milk', isFinal: true }])
    raw.fireEnd()
    expect(spies.onNoResult).not.toHaveBeenCalled()

    rec.start()
    raw.fireStart()
    raw.fireEnd()
    expect(spies.onNoResult).toHaveBeenCalledTimes(1)
  })
})

describe('createRecognizer() — start failures', () => {
  it('swallows InvalidStateError from a double start', () => {
    const { rec, raw, spies } = build()
    rec.start()
    rec.start()

    expect(raw.startCalls).toBe(2)
    expect(spies.onError).not.toHaveBeenCalled()
  })

  it('reports start-failed when the engine is present but not functional', () => {
    const { rec, raw, spies } = build()
    raw.throwOnStart = new TypeError('not implemented')
    rec.start()

    expect(spies.onError).toHaveBeenCalledWith('start-failed')
  })

  it('does not also report no-result after a failed start', () => {
    const { rec, raw, spies } = build()
    raw.throwOnStart = new TypeError('not implemented')
    rec.start()
    raw.fireEnd()

    expect(spies.onNoResult).not.toHaveBeenCalled()
  })
})

describe('createRecognizer() — language', () => {
  it('defaults to en-US and updates in place', () => {
    const { rec, raw } = build()
    expect(raw.lang).toBe('en-US')
    rec.setLang('hi-IN')
    expect(raw.lang).toBe('hi-IN')
  })
})
