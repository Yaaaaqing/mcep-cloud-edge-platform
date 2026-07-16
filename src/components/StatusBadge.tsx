import type { ReactNode } from 'react'

const styles: Record<string, string> = {
  业务运营中: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  正常: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  启用: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  已完成: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  已接入: 'bg-slate-100 text-ink ring-ink/10',
  云端已部署: 'bg-cyan-50 text-cyan-700 ring-cyan-600/10',
  联调中: 'bg-blue-50 text-brand ring-brand/10',
  持续推进: 'bg-blue-50 text-brand ring-brand/10',
  正在推进: 'bg-blue-50 text-brand ring-brand/10',
  按计划推进: 'bg-blue-50 text-brand ring-brand/10',
  技术对接中: 'bg-orange-50 text-orange-700 ring-orange-600/10',
  待上云: 'bg-purple-50 text-purple-700 ring-purple-600/10',
  未运行: 'bg-slate-100 text-slate-600 ring-slate-500/10',
  规划接入: 'bg-slate-100 text-slate-600 ring-slate-500/10',
  规划建设中: 'bg-slate-100 text-slate-600 ring-slate-500/10',
  待部署: 'bg-violet-50 text-violet-700 ring-violet-600/10',
  待接入: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  在线: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  异常: 'bg-red-50 text-red-700 ring-red-600/10',
  未接入: 'bg-slate-100 text-slate-600 ring-slate-500/10',
  待检查: 'bg-amber-50 text-amber-700 ring-amber-600/10',
}

export function StatusBadge({ status, icon }: { status: string; icon?: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status] ?? 'bg-slate-100 text-slate-600 ring-slate-500/10'}`}>
      {icon}
      {status}
    </span>
  )
}
