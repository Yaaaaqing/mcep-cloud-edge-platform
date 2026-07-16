import { Cpu, HardDrive, Network, Server } from 'lucide-react'
import { EdgeTopology } from '../components/EdgeTopology'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { StatusBadge } from '../components/StatusBadge'
import { useData } from '../hooks/useData'
import type { EdgeNode } from '../types'

export function EdgePage() {
  const { data: nodes } = useData<EdgeNode[]>('edgeNodes')
  const count = (status: string) => nodes.filter((node) => node.status === status).length
  return (
    <div className="page-shell py-10">
      <PageHeader eyebrow="边缘节点" title="云端平台与设备现场的协同台账" description="当前以规划、待部署和待接入节点为主，按实际建设进度维护，不虚构在线状态。" />
      <EdgeTopology />
      <div className="mt-6 grid grid-cols-4 gap-5"><StatCard label="节点总数" value={nodes.length} icon={Cpu} /><StatCard label="规划建设中" value={count('规划建设中')} icon={Network} accent="cyan" /><StatCard label="待部署" value={count('待部署')} icon={Server} accent="orange" /><StatCard label="待接入" value={count('待接入')} icon={HardDrive} accent="blue" /></div>
      <section className="mt-12"><div className="flex items-end justify-between"><div><p className="section-kicker">节点台账</p><h2 className="section-title">边缘节点建设与接入信息</h2></div><p className="text-sm text-muted">数据可在管理后台维护</p></div><div className="card mt-6 overflow-hidden"><div className="overflow-x-auto thin-scrollbar"><table className="min-w-[1400px] w-full"><thead className="table-head"><tr>{['节点编号', '节点名称', '所属单位', '关联机床', '操作系统', '通信协议', 'IP地址', '接入状态', '最近在线时间', '备注'].map((item) => <th className="px-4 py-4" key={item}>{item}</th>)}</tr></thead><tbody>{nodes.map((node) => <tr key={node.id}><td className="table-cell font-mono text-xs text-brand">{node.code}</td><td className="table-cell font-medium text-ink">{node.name}</td><td className="table-cell">{node.organization}</td><td className="table-cell">{node.machine}</td><td className="table-cell">{node.os}</td><td className="table-cell">{node.protocol}</td><td className="table-cell font-mono text-xs">{node.ip}</td><td className="table-cell"><StatusBadge status={node.status} /></td><td className="table-cell">{node.lastSeen}</td><td className="table-cell max-w-xs leading-6">{node.note}</td></tr>)}</tbody></table></div></div></section>
    </div>
  )
}
