import { useCallback, useRef, useState } from 'react'

/**
 * Toast queue with auto-dismiss (SP-023). Error toasts linger a bit longer.
 */
export function useToasts({ timeout = 3200 } = {}) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((cur) => cur.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (toast) => {
      const id = ++idRef.current
      const t = { id, type: 'info', ...toast }
      setToasts((cur) => [...cur.slice(-2), t]) // keep at most 3 on screen
      const ms = t.type === 'error' ? timeout + 1800 : timeout
      setTimeout(() => dismiss(id), ms)
      return id
    },
    [dismiss, timeout],
  )

  return { toasts, push, dismiss }
}
