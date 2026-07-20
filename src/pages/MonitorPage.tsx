import { Activity, AlertTriangle, Clock3, Radio, TestTube2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { StatusBadge } from '../components/StatusBadge'
import { monitorMeta } from '../data/monitor'
import { useData } from '../hooks/useData'
import type { MonitorRecord } from '../types'

export function MonitorPage() {
  const { data: records } = useData<MonitorRecord[]>('monitors')
  const connected = records.filter((item) => !item.isDemo && item.checkSource !== '待接入自动监测' && item.lastCheckedAt !== '尚未接入').length
  const waiting = records.filter((item) => item.checkSource === '待接入自动监测').length
  const failures = records.reduce((sum, item) => sum + item.consecutiveFailures, 0)
  const demoCount = records.filter((item) => item.isDemo).length

  return <div className="page-shell py-8 lg:py-10">
    <PageHeader eyebrow="运行监测" title="监测对象与接入配置台账" description="先登记检查对象、方式、来源和责任人，待真实监测接口接入后再展示运行结果；当前不模拟生产在线状态。" />
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-800 sm:px-5"><strong>状态说明：</strong>{monitorMeta.note} 页面更新时间以管理端台账为准，真实检查时间：{monitorMeta.lastCheckedAt}。</div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 min-[1400px]:grid-cols-5 xl:gap-5">
      <StatCard label="监测对象" value={records.length} icon={Activity} />
      <StatCard label="已接入自动监测" value={connected} icon={Radio} accent="cyan" />
      <StatCard label="待接入对象" value={waiting} icon={Clock3} accent="orange" />
      <StatCard label="连续失败次数" value={failures} icon={AlertTriangle} accent="orange" />
      <StatCard label="演示记录" value={demoCount} note="明确标记为演示" icon={TestTube2} />
    </div>
    <div className="card mt-8 min-w-0 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-5 sm:px-6"><div><h2 className="font-semibold text-ink">监测配置列表</h2><p className="mt-1 text-xs text-muted">当前为配置演示数据，不代表生产运行结果</p></div><span className="rounded-full bg-canvas px-3 py-1.5 text-xs text-muted">{monitorMeta.databaseSummary}</span></div>
      <div className="space-y-3 p-4 md:hidden">{records.map((item) => <article className="rounded-2xl border border-line p-4" key={item.id}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="font-semibold text-ink">{item.appName}</h3><p className="mt-1 break-words text-xs text-muted">{item.targetName}</p></div><StatusBadge status={item.serviceStatus} /></div><dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2"><div><dt className="text-xs text-muted">对象类型</dt><dd className="mt-1 text-ink">{item.targetType}</dd></div><div><dt className="text-xs text-muted">检查方式</dt><dd className="mt-1 text-ink">{item.checkMethod}</dd></div><div><dt className="text-xs text-muted">最近检查</dt><dd className="mt-1 text-ink">{item.lastCheckedAt}</dd></div><div><dt className="text-xs text-muted">责任人</dt><dd className="mt-1 text-ink">{item.responsiblePerson}</dd></div><div className="sm:col-span-2"><dt className="text-xs text-muted">检查来源 / 最近错误</dt><dd className="mt-1 text-ink">{item.checkSource} · {item.latestError}</dd></div></dl></article>)}</div>
      <div className="thin-scrollbar hidden overflow-x-auto md:block"><table className="min-w-[1500px] w-full"><thead className="table-head"><tr>{['监测对象', '对象类型', '服务状态', '检查方式', '检查来源', '最近检查', '连续失败', '最近错误', '责任人', '数据性质'].map((item) => <th className="px-5 py-4" key={item}>{item}</th>)}</tr></thead><tbody>{records.map((item) => <tr key={item.id}><td className="table-cell"><p className="font-medium text-ink">{item.appName}</p><p className="mt-1 text-xs text-muted">{item.targetName}</p></td><td className="table-cell">{item.targetType}</td><td className="table-cell"><StatusBadge status={item.serviceStatus} /></td><td className="table-cell">{item.checkMethod}</td><td className="table-cell">{item.checkSource}</td><td className="table-cell">{item.lastCheckedAt}</td><td className="table-cell">{item.consecutiveFailures}</td><td className="table-cell">{item.latestError}</td><td className="table-cell">{item.responsiblePerson}</td><td className="table-cell"><StatusBadge status={item.isDemo ? '演示数据' : item.checkSource} /></td></tr>)}</tbody></table></div>
    </div>
  </div>
}
