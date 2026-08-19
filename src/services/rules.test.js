import { describe, it, expect } from 'vitest'
import { parseRules } from './rules.js'

/**
 * SP-008 DoD: >= 8/10 sample English phrases parse correctly.
 * This is the "documented test list" the ticket asks for. Each case asserts
 * the fields that matter for that command; category is checked where relevant.
 */
describe('parseRules — varied phrasing', () => {
  const cases = [
    ['add milk', { action: 'add', item: 'milk', quantity: 1, category: 'dairy' }],
    ['I need apples', { action: 'add', item: 'apples', category: 'produce' }],
    ['add two bottles of milk', { action: 'add', item: 'milk', quantity: 2, unit: 'bottles' }],
    ['buy 5 oranges', { action: 'add', item: 'oranges', quantity: 5, category: 'produce' }],
    ['I want to buy bananas', { action: 'add', item: 'bananas', category: 'produce' }],
    ['get me a dozen eggs', { action: 'add', item: 'eggs', quantity: 12 }],
    ["I'd like some cheese", { action: 'add', item: 'cheese', category: 'dairy' }],
    ['add 2 bottles of water', { action: 'add', item: 'water', quantity: 2, category: 'beverages' }],
    ['remove milk from my list', { action: 'remove', item: 'milk' }],
    ['delete the eggs', { action: 'remove', item: 'eggs' }],
    ['change milk to 3', { action: 'update', item: 'milk', quantity: 3 }],
    ['clear my list', { action: 'clear' }],
    ['find organic apples under $5', { action: 'search', item: 'apples' }],
    ['add bread', { action: 'add', item: 'bread', category: 'bakery' }],
  ]

  let passed = 0
  for (const [phrase, expected] of cases) {
    it(`parses: "${phrase}"`, () => {
      const cmd = parseRules(phrase)
      for (const [k, v] of Object.entries(expected)) {
        expect(cmd[k], `${phrase} -> ${k}`).toBe(v)
      }
      passed++
    })
  }

  it('meets the >=8/10 bar (sanity)', () => {
    // Re-run silently and count clean passes on the core fields.
    let ok = 0
    for (const [phrase, expected] of cases) {
      const cmd = parseRules(phrase)
      const good = Object.entries(expected).every(([k, v]) => cmd[k] === v)
      if (good) ok++
    }
    expect(ok).toBeGreaterThanOrEqual(8)
  })
})

describe('parseRules — search filters', () => {
  it('extracts maxPrice and brand', () => {
    const cmd = parseRules('find organic apples under $5')
    expect(cmd.action).toBe('search')
    expect(cmd.item).toBe('apples')
    expect(cmd.filters.maxPrice).toBe(5)
    expect(cmd.filters.brand).toBe('organic')
  })

  it('handles "toothpaste under 5 dollars"', () => {
    const cmd = parseRules('find toothpaste under 5 dollars')
    expect(cmd.action).toBe('search')
    expect(cmd.item).toContain('toothpaste')
    expect(cmd.filters.maxPrice).toBe(5)
  })
})

describe('parseRules — robustness', () => {
  it('empty input -> unknown, no crash', () => {
    expect(parseRules('').action).toBe('unknown')
    expect(parseRules('   ').action).toBe('unknown')
  })

  it('gibberish add still yields a low/normal confidence, never throws', () => {
    const cmd = parseRules('asdf qwerty')
    expect(cmd).toHaveProperty('action')
    expect(cmd.confidence).toBeLessThanOrEqual(1)
  })

  it('bare noun defaults to add with sub-threshold confidence', () => {
    const cmd = parseRules('milk')
    expect(cmd.action).toBe('add')
    expect(cmd.item).toBe('milk')
    expect(cmd.confidence).toBeLessThan(0.65)
  })
})
