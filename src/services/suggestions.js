import substitutes from '../data/substitutes.json'
import seasonal from '../data/seasonal.json'
import { categorize } from './categorize.js'

/**
 * Smart suggestions engine (SP-017/018, FR-4.x).
 *
 * Produces up to `max` chip suggestions from three sources, interleaved so the
 * strip always feels varied:
 *   - substitute : alternatives for items on the list / the just-added item
 *   - seasonal   : produce in season for the current month
 *   - reorder    : frequently-added items (history) not currently on the list
 *
 * Anything already on the (unchecked) list is filtered out, and duplicates are
 * removed across sources. Pure function -> trivially testable.
 */

const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase())

function collect(candidates, onList, seen, source, max) {
  const out = []
  for (const raw of candidates) {
    const key = (raw || '').toLowerCase().trim()
    if (!key || onList.has(key) || seen.has(key)) continue
    seen.add(key)
    out.push({ id: `${source}:${key}`, item: key, label: titleCase(key), source, category: categorize(key) })
    if (out.length >= max) break
  }
  return out
}

/** Round-robin merge so no single source dominates the strip. */
function interleave(lists, max) {
  const out = []
  let i = 0
  while (out.length < max) {
    let progressed = false
    for (const list of lists) {
      if (list[i]) {
        out.push(list[i])
        progressed = true
        if (out.length >= max) break
      }
    }
    if (!progressed) break
    i++
  }
  return out
}

export function computeSuggestions({ items = [], history = {} } = {}, opts = {}) {
  const { addedName = null, max = 6 } = opts
  const month = opts.month ?? new Date().getMonth() + 1

  const onList = new Set(items.filter((it) => !it.checked).map((it) => it.name.toLowerCase()))
  const seen = new Set()

  // substitutes — just-added item first, then everything else on the list
  const subjects = []
  if (addedName) subjects.push(addedName.toLowerCase())
  for (const it of items) if (!it.checked) subjects.push(it.name.toLowerCase())
  const subCandidates = []
  for (const subj of subjects) {
    const alts = substitutes[subj]
    if (alts) subCandidates.push(...alts)
  }
  const subs = collect(subCandidates, onList, seen, 'substitute', max)

  // seasonal — current month
  const seas = collect(seasonal[String(month)] || [], onList, seen, 'seasonal', max)

  // reorder — frequent history items not on the list
  const freq = Object.values(history)
    .filter((h) => h && h.count >= 2)
    .sort((a, b) => b.count - a.count || b.lastAdded - a.lastAdded)
    .map((h) => h.name)
  const reorder = collect(freq, onList, seen, 'reorder', max)

  return interleave([subs, seas, reorder], max)
}
