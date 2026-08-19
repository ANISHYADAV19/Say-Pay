import { CATEGORY_LABELS } from './command.js'

/**
 * Command execution + user-facing feedback (SP-014).
 *
 * `applyCommand` maps a Command onto store actions (search is handled by the
 * caller, which owns the catalog + results UI). `describeCommand` produces the
 * toast/announcement copy so feedback is consistent everywhere (FR-7.2).
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
export function describeCommand(command, { changed = true, resultCount = null } = {}) {
  switch (command.action) {
    case 'add':
      return { type: 'success', message: `Added ${qtyLabel(command)}${command.item}` }

    case 'remove':
      return changed
        ? { type: 'success', message: `Removed ${command.item}` }
        : { type: 'info', message: `“${command.item}” wasn't on your list` }

    case 'update':
      return changed
        ? { type: 'success', message: `Updated ${command.item} to ${command.quantity}` }
        : { type: 'info', message: `“${command.item}” isn't on your list yet` }

    case 'clear':
      return { type: 'success', message: 'Cleared your list' }

    case 'search': {
      const label =
        command.item ||
        (command.filters?.brand ? command.filters.brand : '') ||
        'items'
      if (resultCount === 0) {
        return { type: 'info', message: `No matches for “${label}”` }
      }
      return { type: 'info', message: `Found ${resultCount} result${resultCount === 1 ? '' : 's'} for “${label}”` }
    }

    default:
      return {
        type: 'error',
        message: "I didn't catch that — try “add milk” or “remove bread”.",
      }
  }
}

export { CATEGORY_LABELS }
