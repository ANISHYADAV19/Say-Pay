import { useList, useGroupedItems } from '../store/ListContext.jsx'
import CategoryGroup from './CategoryGroup.jsx'
import { TrashIcon } from './icons.jsx'
import { useT } from '../i18n/useT.js'

/**
 * The shopping list view (SP-015, FR-3.2/3.3). Renders category groups from the
 * store and owns the row-level handlers + "Clear all". Assumes the caller only
 * mounts it when there's at least one item (App shows EmptyState otherwise).
 */
export default function ShoppingList() {
  const { t } = useT()
  const { items, justChangedId, toggleItem, setQuantityById, deleteItem, clearList } = useList()
  const groups = useGroupedItems()

  const total = items.length
  const done = items.filter((it) => it.checked).length

  const handleClear = () => {
    if (typeof window !== 'undefined' && !window.confirm(t('list.confirmClear'))) return
    clearList()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {t(total === 1 ? 'list.itemsOne' : 'list.itemsOther', { count: total })}
          {done > 0 && (
            <span className="text-stone-400 dark:text-stone-500"> · {t('list.done', { count: done })}</span>
          )}
        </p>
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-stone-500 transition hover:bg-red-500/10 hover:text-red-600 dark:text-stone-400 dark:hover:bg-red-500/15 dark:hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
        >
          <TrashIcon className="text-sm" />
          {t('list.clear')}
        </button>
      </div>

      <div className="space-y-5">
        {groups.map((group) => (
          <CategoryGroup
            key={group.category}
            group={group}
            justChangedId={justChangedId}
            onToggle={toggleItem}
            onStep={setQuantityById}
            onDelete={deleteItem}
          />
        ))}
      </div>
    </div>
  )
}
