import { describe, it, expect } from 'vitest'
import { parseRules } from '../services/rules.js'
import { t, SUPPORTED_LANGS } from './strings.js'
import { LLM_FALLBACK_THRESHOLD } from '../services/command.js'

describe('Empty State Examples Parse Verification', () => {
  SUPPORTED_LANGS.forEach((lang) => {
    const examples = t('empty.examples', lang)
    expect(examples).toBeDefined()
    expect(Array.isArray(examples)).toBe(true)

    examples.forEach((example) => {
      it(`should successfully parse example "${example}" (${lang}) above threshold`, () => {
        const cmd = parseRules(example, lang)
        expect(cmd.action).not.toBe('unknown')
        expect(cmd.confidence).toBeGreaterThanOrEqual(LLM_FALLBACK_THRESHOLD)
      })
    })
  })
})
