import { createContext, useContext, useEffect, useReducer, useMemo, useCallback } from 'react'
import { loadState, saveState } from '../services/storage.js'
import { CATEGORIES, CATEGORY_LABELS } from '../services/command.js'
import { categorize } from '../services/categorize.js'

/**
 * List store (SP-013). useReducer + Context — no external state lib needed at
 * this scale (docs/02 §6). Handles add/remove/update/toggle/clear, tracks a
 * lightweight purchase history (for reorder suggestions), and persists to
 * localStorage on every change.
 */

const ListContext = createContext(null)

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`

const norm = (s) => (s || '').trim().toLowerCase()

const initialState = {
  items: [],
  history: {}, // name -> { name, count, lastAdded }
  language: 'en-US',
  justChangedId: null, // drives the brief add/update highlight (FR-7.5)
}

function bumpHistory(history, name) {
  const key = norm(name)
  const prev = history[key]
  return {
    ...history,
    [key]: {
      name: key,
      count: (prev?.count || 0) + 1,
      lastAdded: Date.now(),
    },
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.payload }

    case 'add': {
      const { name, quantity = 1, unit = null, category } = action.payload
      const key = norm(name)
      if (!key) return state
      const cat = CATEGORIES.includes(category) ? category : categorize(key)
      const existing = state.items.find((it) => norm(it.name) === key && !it.checked)

      let items
      let changedId
      if (existing) {
        // merge quantity on duplicate (FR-3.1)
        changedId = existing.id
        items = state.items.map((it) =>
          it.id === existing.id
            ? { ...it, quantity: it.quantity + quantity, unit: unit || it.unit }
            : it,
        )
      } else {
        const item = {
          id: uid(),
          name: key,
          quantity,
          unit,
          category: cat,
          checked: false,
          addedAt: Date.now(),
        }
        changedId = item.id
        items = [...state.items, item]
      }
      return { ...state, items, history: bumpHistory(state.history, key), justChangedId: changedId }
    }

    case 'remove': {
      const key = norm(action.payload.name)
      const items = state.items.filter((it) => norm(it.name) !== key)
      return { ...state, items, justChangedId: null }
    }

    case 'updateQuantity': {
      // by name (voice) — targets the first matching unchecked item
      const key = norm(action.payload.name)
      const qty = Math.max(0, Math.round(action.payload.quantity))
      if (qty === 0) {
        return { ...state, items: state.items.filter((it) => norm(it.name) !== key) }
      }
      let changedId = null
      const items = state.items.map((it) => {
        if (norm(it.name) === key && changedId === null) {
          changedId = it.id
          return { ...it, quantity: qty }
        }
        return it
      })
      return { ...state, items, justChangedId: changedId }
    }

    case 'setQuantityById': {
      const qty = Math.max(0, Math.round(action.payload.quantity))
      if (qty === 0) {
        return { ...state, items: state.items.filter((it) => it.id !== action.payload.id) }
      }
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.payload.id ? { ...it, quantity: qty } : it,
        ),
        justChangedId: action.payload.id,
      }
    }

    case 'toggle':
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.payload.id ? { ...it, checked: !it.checked } : it,
        ),
      }

    case 'deleteById':
      return { ...state, items: state.items.filter((it) => it.id !== action.payload.id) }

    case 'clear':
      return { ...state, items: [], justChangedId: null }

    case 'setLanguage':
      return { ...state, language: action.payload.language }

    default:
      return state
  }
}

export function ListProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // hydrate once from localStorage
  useEffect(() => {
    const saved = loadState()
    if (saved) dispatch({ type: 'hydrate', payload: saved })
  }, [])

  // persist on change (debounced to a microtask via effect)
  useEffect(() => {
    saveState(state)
  }, [state.items, state.history, state.language])

  // stable action creators
  const actions = useMemo(
    () => ({
      addItem: (payload) => dispatch({ type: 'add', payload }),
      removeItem: (name) => dispatch({ type: 'remove', payload: { name } }),
      updateQuantity: (name, quantity) =>
        dispatch({ type: 'updateQuantity', payload: { name, quantity } }),
      setQuantityById: (id, quantity) =>
        dispatch({ type: 'setQuantityById', payload: { id, quantity } }),
      toggleItem: (id) => dispatch({ type: 'toggle', payload: { id } }),
      deleteItem: (id) => dispatch({ type: 'deleteById', payload: { id } }),
      clearList: () => dispatch({ type: 'clear' }),
      setLanguage: (language) => dispatch({ type: 'setLanguage', payload: { language } }),
    }),
    [],
  )

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions])
  return <ListContext.Provider value={value}>{children}</ListContext.Provider>
}

export function useList() {
  const ctx = useContext(ListContext)
  if (!ctx) throw new Error('useList must be used within <ListProvider>')
  return ctx
}

/**
 * Group items by category in the fixed display order, hiding empty groups.
 * Checked items sink to the bottom within their group.
 */
export function useGroupedItems() {
  const { items } = useList()
  return useMemo(() => {
    const byCat = new Map()
    for (const it of items) {
      if (!byCat.has(it.category)) byCat.set(it.category, [])
      byCat.get(it.category).push(it)
    }
    const groups = []
    for (const cat of CATEGORIES) {
      const list = byCat.get(cat)
      if (!list || list.length === 0) continue
      list.sort((a, b) => Number(a.checked) - Number(b.checked) || a.addedAt - b.addedAt)
      groups.push({ category: cat, label: CATEGORY_LABELS[cat], items: list })
    }
    return groups
  }, [items])
}
