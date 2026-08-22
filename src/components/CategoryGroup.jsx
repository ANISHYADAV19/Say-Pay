import ListItemRow from './ListItemRow.jsx'
import { useT } from '../i18n/useT.js'

/**
 * One category section (SP-015). Header shows the label + item count, followed
 * by its rows. Grouping/ordering is computed by useGroupedItems in the store;
 * the category key is localized to a header label here (FR-6.4).
 */
export default function CategoryGroup({ group, justChangedId, onToggle, onStep, onDelete }) {
  const { t } = useT()
  const label = t('category.' + group.category)
  return (
    <section aria-label={label} className="space-y-1.5">
      <h3 className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {label}
        <span className="rounded-full border border-white/50 bg-white/45 px-1.5 py-0.5 text-[0.65rem] tabular-nums text-stone-600 dark:border-white/[0.07] dark:bg-white/[0.07] dark:text-stone-300">
          {group.items.length}
        </span>
      </h3>
      <ul className="space-y-1.5">
        {group.items.map((item) => (
          <ListItemRow
            key={item.id}
            item={item}
            justChanged={item.id === justChangedId}
            onToggle={onToggle}
            onStep={onStep}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  )
}
