import { ArrowUpRight, Building2, Layers3, MonitorCog, ShieldCheck } from 'lucide-react'
import type { PlatformApp } from '../types'
import { StatusBadge } from './StatusBadge'
import { Button } from './ui/Button'

export function AppCard({ app, onAction }: { app: PlatformApp; onAction?: (app: PlatformApp) => void }) {
  const handleAction = () => onAction?.(app)
  const currentStatus = app.operationStatus === '未运行' ? app.accessStatus : app.operationStatus

  return (
    <article className="card group flex h-full flex-col p-6 transition hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-[0_16px_40px_rgba(23,32,51,.09)]">
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand/10 to-cyan/15 text-brand">
          <Building2 size={23} strokeWidth={1.8} />
        </div>
        <StatusBadge status={currentStatus} />
      </div>
      <h3 className="mt-5 text-lg font-semibold leading-7 text-ink">{app.name}</h3>
      <p className="mt-2 flex items-center gap-2 text-sm text-muted"><Building2 size={15} />{app.organization}</p>
      <div className="mt-5 grid gap-3 border-t border-line pt-5 text-xs text-muted">
        <span className="flex items-center justify-between gap-3"><span className="flex items-center gap-2"><MonitorCog size={14} />部署方式</span><strong className="font-medium text-ink">{app.deploymentMode}</strong></span>
        <span className="flex items-center justify-between gap-3"><span className="flex items-center gap-2"><Layers3 size={14} />接入阶段</span><strong className="font-medium text-ink">{app.accessStage}</strong></span>
        <span className="flex items-center justify-between gap-3"><span className="flex items-center gap-2"><ShieldCheck size={14} />信创适配</span><StatusBadge status={app.xinchuangStatus} /></span>
      </div>
      <Button variant="secondary" className="mt-5 w-full" icon={<ArrowUpRight size={16} />} onClick={handleAction}>
        查看交付信息
      </Button>
    </article>
  )
}
