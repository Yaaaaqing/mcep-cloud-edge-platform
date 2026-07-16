import { AlertTriangle, CheckCircle2, Clock3, Database, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/ui/Button'
import { monitorMeta } from '../data/monitor'
import { useData } from '../hooks/useData'
import type { MonitorRecord } from '../types'

export function MonitorPage() {
  const { data: records } = useData<MonitorRecord[]>('monitors')
  const [checkedAt, setCheckedAt] = useState(monitorMeta.lastCheckedAt)
  const normal = records.filter((item) => item.serviceStatus === '正常').length
  const tuning = records.filter((item) => item.serviceStatus === '联调中').length
  const errors = records.filter((item) => item.serviceStatus === '异常').length
  return (
    <div className="page-shell py-8 lg:py-10">
      <PageHeader eyebrow="运行监测" title="应用、数据库与接口状态总览" description="集中维护接入应用的服务与依赖状态，为联调和问题沟通提供统一视图。" actions={<Button variant="secondary" icon={<RefreshCw size={16} />} onClick={() => setCheckedAt(new Date().toLocaleString('zh-CN'))}>刷新状态</Button>} />
      <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800"><strong>状态说明：</strong>{monitorMeta.note} 状态更新时间：{checkedAt}</div>
      <div className="grid grid-cols-3 gap-4 min-[1400px]:grid-cols-5 xl:gap-5"><StatCard label="应用正常数量" value={normal} icon={CheckCircle2} accent="green" /><StatCard label="联调中数量" value={tuning} icon={RefreshCw} /><StatCard label="异常数量" value={errors} icon={AlertTriangle} accent="orange" /><StatCard label="数据库连接状态" value="台账" note={monitorMeta.databaseSummary} icon={Database} accent="cyan" /><StatCard label="最近检查时间" value={checkedAt.split(' ')[1] || checkedAt} note={checkedAt.split(' ')[0]} icon={Clock3} /></div>
      <div className="card mt-8 min-w-0 overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5"><div><h2 className="font-semibold text-ink">监测列表</h2><p className="mt-1 text-xs text-muted">联调维护数据可由演示管理端更新</p></div><span className="flex items-center gap-2 text-xs text-muted"><span className="h-2 w-2 rounded-full bg-brand" />最后更新 {checkedAt}</span></div><div className="thin-scrollbar overflow-x-auto"><table className="min-w-[920px] w-full"><thead className="table-head"><tr>{['应用名称', '服务状态', '数据库状态', '接口状态', '最近访问时间', '当前版本'].map((item) => <th className="px-5 py-4" key={item}>{item}</th>)}</tr></thead><tbody>{records.map((item) => <tr key={item.id}><td className="table-cell font-medium text-ink">{item.appName}</td><td className="table-cell"><StatusBadge status={item.serviceStatus} /></td><td className="table-cell"><StatusBadge status={item.databaseStatus} /></td><td className="table-cell"><StatusBadge status={item.apiStatus} /></td><td className="table-cell">{item.lastAccess}</td><td className="table-cell font-mono text-xs">{item.version}</td></tr>)}</tbody></table></div></div>
    </div>
  )
}
