import { CATEGORY_LABELS } from './command.js'
import { t, DEFAULT_LANG } from '../i18n/strings.js'

/**
 * Command execution + user-facing feedback (SP-014).
 *
 * `applyCommand` maps a Command onto store actions (search is handled by the
 * caller, which owns the catalog + results UI). `describeCommand` produces the
 * toast/announcement copy so feedback is consistent everywhere (FR-7.2), and is
 * localized to the active language (FR-6.4) — item names stay as spoken/typed.
 */

const qtyLabel = (cmd) => {
  const unit = cmd.unit ? ` ${cmd.unit}` : ''
  return cmd.quantity && cmd.quantity > 1 ? `${cmd.quantity}${unit} ` : unit ? `${unit} ` : ''
}

/**
 * Execute add/remove/update/clear against the store.
 * @returns {{ changed: boolean }} whether the list was actually modified
 */
export function applyCommand(command, actions, { existingNames = [] } = {}) {
  const name = command.item
  switch (command.action) {
    case 'add':
      actions.addItem({
        name,
        quantity: command.quantity,
        unit: command.unit,
        category: command.category,
      })
      return { changed: true }

    case 'remove': {
      const existed = existingNames.includes(name)
      actions.removeItem(name)
      return { changed: existed }
    }

    case 'update': {
      const existed = existingNames.includes(name)
      if (!existed) return { changed: false }
      actions.updateQuantity(name, command.quantity)
      return { changed: true }
    }

    case 'clear':
      actions.clearList()
      return { changed: true }

    default:
      return { changed: false }
  }
}

/**
 * @returns {{ type: 'success'|'info'|'error', message: string }}
 */
export function describeCommand(command, { changed = true, resultCount = null, lang = DEFAULT_LANG } = {}) {
  switch (command.action) {
    case 'add':
      return {
        type: 'success',
        message: t('toast.added', lang, { name: `${qtyLabel(command)}${command.item}` }),
      }

    case 'remove':
      return changed
        ? { type: 'success', message: t('cmd.removed', lang, { name: command.item }) }
        : { type: 'info', message: t('cmd.notOnList', lang, { name: command.item }) }

    case 'update':
      return changed
        ? { type: 'success', message: t('cmd.updated', lang, { name: command.item, qty: command.quantity }) }
        : { type: 'info', message: t('cmd.notOnListYet', lang, { name: command.item }) }

    case 'clear':
      return { type: 'success', message: t('cmd.cleared', lang) }

    case 'search': {
      const label =
        command.item ||
        (command.filters?.brand ? command.filters.brand : '') ||
        t('search.itemsFallback', lang)
      if (resultCount === 0) {
        return { type: 'info', message: t('search.noMatches', lang, { label }) }
      }
      return {
        type: 'info',
        message: t(resultCount === 1 ? 'cmd.foundOne' : 'cmd.foundOther', lang, {
          count: resultCount,
          label,
        }),
      }
    }

    default:
      return { type: 'error', message: t('cmd.unknown', lang) }
  }
}

export { CATEGORY_LABELS }
