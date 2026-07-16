import { useCallback, useEffect, useState } from 'react'
import { dataService, type DataKey } from '../services/storage'

export function useData<T>(key: DataKey) {
  const [data, setData] = useState<T>(() => dataService.getSync(key) as T)

  const refresh = useCallback(() => {
    setData(dataService.getSync(key) as T)
  }, [key])

  useEffect(() => {
    const listener = (event: Event) => {
      const changed = (event as CustomEvent<{ key: string }>).detail?.key
      if (changed === key || changed === 'all') refresh()
    }
    window.addEventListener('mcep:data-change', listener)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('mcep:data-change', listener)
      window.removeEventListener('storage', refresh)
    }
  }, [key, refresh])

  return { data, refresh }
}
