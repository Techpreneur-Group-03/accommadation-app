import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

interface Result<T> {
  key: string
  requestKey: string
  data?: T
  error?: string
}

// Loads data for `key` (pass null to wait, e.g. until the user is known) and
// reloads on demand. While reloading, the previous data for the same key is
// kept on screen so toggles don't flash a loading state.
export function useAsyncData<T>(key: string | null, load: () => Promise<T>) {
  const loadRef = useRef(load)
  useLayoutEffect(() => {
    loadRef.current = load
  })

  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState<Result<T> | null>(null)
  const requestKey = key === null ? null : `${key}#${reloadCount}`

  useEffect(() => {
    if (key === null || requestKey === null) return
    let cancelled = false

    loadRef.current().then(
      (data) => {
        if (!cancelled) setResult({ key, requestKey, data })
      },
      (err: unknown) => {
        if (!cancelled) {
          setResult({
            key,
            requestKey,
            error: err instanceof Error ? err.message : "Something went wrong",
          })
        }
      }
    )

    return () => {
      cancelled = true
    }
  }, [key, requestKey])

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])

  const current = result?.key === key ? result : null
  return {
    data: current?.data,
    error: current?.error,
    isLoading: current === null,
    isRefreshing: current !== null && current.requestKey !== requestKey,
    reload,
  }
}
