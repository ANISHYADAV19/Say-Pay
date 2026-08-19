import ListItemRow from './ListItemRow.jsx'

/**
 * One category section (SP-015). Header shows the label + item count, followed
 * by its rows. Grouping/ordering is computed by useGroupedItems in the store.
 */
export default function CategoryGroup({ group, justChangedId, onToggle, onStep, onDelete }) {
  return (
    <section aria-label={group.label} className="space-y-1.5">
      <h3 className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {group.label}
        <span className="rounded-full bg-stone-200 px-1.5 py-0.5 text-[0.65rem] tabular-nums text-stone-600 dark:bg-stone-800 dark:text-stone-300">
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
