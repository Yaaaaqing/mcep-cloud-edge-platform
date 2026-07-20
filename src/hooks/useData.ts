import { useCallback, useEffect, useState } from 'react'
import { dataService, type DataKey } from '../services/providers'

export function useData<T>(key: DataKey) {
  const [data, setData] = useState<T>(() => dataService.getSync(key) as T)

  const refresh = useCallback(() => {
    setData(dataService.getSync(key) as T)
    void dataService.get(key).then((value) => setData(value as T))
  }, [key])

  useEffect(() => {
    void dataService.get(key).then((value) => setData(value as T))
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
