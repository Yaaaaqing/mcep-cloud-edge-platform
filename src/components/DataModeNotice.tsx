import { AlertTriangle, DatabaseZap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { dataService, type ProviderStatus } from '../services/providers'

export function DataModeNotice() {
  const [status, setStatus] = useState<ProviderStatus>(() => dataService.getStatus())

  useEffect(() => {
    const listener = (event: Event) => setStatus((event as CustomEvent<ProviderStatus>).detail)
    window.addEventListener('mcep:provider-status', listener)
    return () => window.removeEventListener('mcep:provider-status', listener)
  }, [])

  const unavailable = status.state === 'unavailable'
  return <div className={`border-b py-2 text-xs ${unavailable ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-blue-100 bg-blue-50/80 text-blue-800'}`}><div className="page-shell flex items-start justify-center gap-2 text-center sm:items-center">{unavailable ? <AlertTriangle className="mt-0.5 shrink-0 sm:mt-0" size={14} /> : <DatabaseZap className="mt-0.5 shrink-0 sm:mt-0" size={14} />}<span><strong>{status.mode === 'mock' ? '示例数据模式' : 'API 数据模式'}</strong><span className="mx-1.5">·</span>{status.mode === 'mock' ? '当前为配置演示数据，不代表生产运行结果' : status.message}</span></div></div>
}
