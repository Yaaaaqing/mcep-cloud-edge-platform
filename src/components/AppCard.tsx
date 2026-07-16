import { ArrowUpRight, Building2, CalendarClock, Database, MapPin, UserRound } from 'lucide-react'
import type { PlatformApp } from '../types'
import { StatusBadge } from './StatusBadge'
import { Button } from './ui/Button'

export function AppCard({ app, onAction }: { app: PlatformApp; onAction?: (app: PlatformApp) => void }) {
  const handleAction = () => {
    if (app.externalUrl) {
      window.open(app.externalUrl, '_blank', 'noopener,noreferrer')
      return
    }
    onAction?.(app)
  }

  return (
    <article className="card group flex h-full flex-col p-6 transition hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-[0_16px_40px_rgba(23,32,51,.09)]">
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand/10 to-cyan/15 text-brand">
          <Building2 size={23} strokeWidth={1.8} />
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={app.accessStatus} />
          <StatusBadge status={app.operationStatus} />
        </div>
      </div>
      <h3 className="mt-5 text-lg font-semibold leading-7 text-ink">{app.name}</h3>
      <p className="mt-2 min-h-[72px] text-sm leading-6 text-muted">{app.description}</p>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-5 text-xs text-muted">
        <span className="flex items-center gap-2"><Building2 size={14} />{app.organization}</span>
        <span className="flex items-center gap-2"><MapPin size={14} />{app.deployment}</span>
        <span className="flex items-center gap-2"><Database size={14} />{app.database}</span>
        <span className="flex items-center gap-2"><UserRound size={14} />{app.owner}</span>
        <span className="col-span-2 flex items-center gap-2"><CalendarClock size={14} />更新于 {app.updatedAt}</span>
      </div>
      <Button variant="secondary" className="mt-5 w-full" icon={<ArrowUpRight size={16} />} onClick={handleAction}>
        {app.externalUrl ? '进入应用' : '查看详情'}
      </Button>
    </article>
  )
}
