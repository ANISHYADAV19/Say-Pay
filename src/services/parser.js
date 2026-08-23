import { parseRules } from './rules.js'
import { normalizeCommand, LLM_FALLBACK_THRESHOLD } from './command.js'
import { categorize } from './categorize.js'
import { toCanonical } from './terms.js'

/**
 * Parser orchestration (SP-010, FR-2.5, NFR-5).
 *
 * 1. Run the fast, offline rule parser.
 * 2. If it's confident enough, use it — no network needed.
 * 3. Otherwise call the LLM proxy; re-validate its output client-side
 *    (the LLM is untrusted, docs/03 §3) and prefer it when usable.
 * 4. On ANY LLM failure/timeout, fall back to the rule result.
 *
 * The app therefore keeps working with the network off — it just loses the
 * flexible-phrasing/multilingual lift that the LLM provides.
 */

const LLM_TIMEOUT_MS = 8000

async function fetchLLM(transcript, language, signal) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS)
  // allow an external abort (e.g. user starts a new command) to cancel us too
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true })
  try {
    const resp = await fetch('/api/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, language }),
      signal: controller.signal,
    })
    if (!resp.ok) return null // 4xx/5xx -> caller falls back to rules
    const data = await resp.json()
    return data?.command ?? null
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

/**
 * @param {string} transcript
 * @param {string} [language]
 * @param {{ signal?: AbortSignal, forceLLM?: boolean }} [opts]
 * @returns {Promise<{ command: object, source: 'rules'|'llm'|'rules-fallback' }>}
 */
export async function parseCommand(transcript, language = 'en-US', opts = {}) {
  const rule = parseRules(transcript, language)

  if (!opts.forceLLM && rule.confidence >= LLM_FALLBACK_THRESHOLD) {
    return { command: rule, source: 'rules' }
  }

  const raw = await fetchLLM(transcript, language, opts.signal)
  if (raw) {
    // Re-validate on the client — never trust the LLM shape blindly.
    let cmd = normalizeCommand(raw, { transcript, language })
    if (cmd.item) {
      cmd.item = toCanonical(cmd.item, language) ?? cmd.item
    }
    if ((cmd.action === 'add' || cmd.action === 'update') && cmd.category === 'other') {
      cmd = { ...cmd, category: categorize(cmd.item) }
    }
    // Use the LLM result unless it's a worse "unknown" than what rules found.
    if (cmd.action !== 'unknown' || rule.action === 'unknown') {
      return { command: cmd, source: 'llm' }
    }
  }

  return { command: rule, source: 'rules-fallback' }
}
