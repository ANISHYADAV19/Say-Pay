import { describe, it, expect } from 'vitest'
import { parseRules } from '../rules.js'
import { LLM_FALLBACK_THRESHOLD } from '../command.js'

describe('Multilingual Lexicon Rules Parser', () => {
  const testCases = [
    // hi-IN
    { lang: 'hi-IN', text: 'ब्रेड हटाएँ', action: 'remove', item: 'bread', category: 'other' },
    { lang: 'hi-IN', text: 'सूची साफ़ करें', action: 'clear', item: '', category: 'other' },
    { lang: 'hi-IN', text: 'दूध जोड़ें', action: 'add', item: 'milk', category: 'dairy' },
    // es-ES
    { lang: 'es-ES', text: 'busca manzanas', action: 'search', item: 'apples' },
    { lang: 'es-ES', text: 'añadir leche de avena', action: 'add', item: 'oat milk', category: 'dairy' },
    { lang: 'es-ES', text: 'eliminar mantequilla', action: 'remove', item: 'butter', category: 'other' },
    // zh-CN
    { lang: 'zh-CN', text: '添加牛奶', action: 'add', item: 'milk', category: 'dairy' },
    { lang: 'zh-CN', text: '清空列表', action: 'clear', item: '', category: 'other' },
    { lang: 'zh-CN', text: '搜索苹果', action: 'search', item: 'apples' },
    // en-US
    { lang: 'en-US', text: 'add milk', action: 'add', item: 'milk', category: 'dairy' },
    { lang: 'en-US', text: 'remove butter', action: 'remove', item: 'butter', category: 'other' },
    // fr-FR
    { lang: 'fr-FR', text: 'ajouter du pain', action: 'add', item: 'bread', category: 'bakery' },
    { lang: 'fr-FR', text: 'supprimer les œufs', action: 'remove', item: 'eggs', category: 'other' },
    // de-DE
    { lang: 'de-DE', text: 'Milch hinzufügen', action: 'add', item: 'milk', category: 'dairy' },
    { lang: 'de-DE', text: 'Brot entfernen', action: 'remove', item: 'bread', category: 'other' },
  ]

  testCases.forEach(({ lang, text, action, item, category }) => {
    it(`should parse offline "${text}" (${lang}) successfully`, () => {
      const cmd = parseRules(text, lang)
      expect(cmd.action).toBe(action)
      if (item !== undefined) expect(cmd.item).toBe(item)
      if (category !== undefined) expect(cmd.category).toBe(category)
      expect(cmd.confidence).toBeGreaterThanOrEqual(LLM_FALLBACK_THRESHOLD)
    })
  })
})
