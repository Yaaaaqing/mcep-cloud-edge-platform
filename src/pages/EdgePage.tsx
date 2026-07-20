import { Cpu, Database, HardDrive, Network, Server } from 'lucide-react'
import { EdgeTopology } from '../components/EdgeTopology'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { StatusBadge } from '../components/StatusBadge'
import { useData } from '../hooks/useData'
import type { EdgeNode } from '../types'

export function EdgePage() {
  const { data: nodes } = useData<EdgeNode[]>('edgeNodes')
  const groupIds = Array.from(new Set(nodes.map((node) => node.groupId).filter(Boolean))) as string[]
  const computeCount = nodes.filter((node) => node.deviceType === '边缘计算设备').length
  const storageCount = nodes.filter((node) => node.deviceType === '边缘存储设备').length

  return <div className="page-shell py-8 lg:py-10">
    <PageHeader eyebrow="边缘节点" title="六组边缘计算与存储设备建设台账" description="设备参数按采购配置登记；部署位置、关联机床、应用和云端连接状态须以现场实施结果为准，不虚构心跳或上传记录。" />
    <EdgeTopology />
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
      <StatCard label="边缘节点组" value={groupIds.length} icon={Network} />
      <StatCard label="设备总数" value={nodes.length} icon={Server} accent="cyan" />
      <StatCard label="计算设备" value={computeCount} icon={Cpu} />
      <StatCard label="存储设备" value={storageCount} icon={HardDrive} accent="orange" />
    </div>

    <section className="mt-12">
      <div><p className="section-kicker">节点组视图</p><h2 className="section-title">每组一台计算设备与一台存储设备</h2><p className="mt-3 text-sm text-muted">当前六组设备均处于待部署状态，以下同步时间和云端状态没有使用模拟在线数据。</p></div>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">{groupIds.map((groupId) => {
        const groupNodes = nodes.filter((node) => node.groupId === groupId)
        const compute = groupNodes.find((node) => node.deviceType === '边缘计算设备')
        const storage = groupNodes.find((node) => node.deviceType === '边缘存储设备')
        return <article className="card p-4 sm:p-6" key={groupId}>
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-brand">{groupId}</p><h3 className="mt-2 text-lg font-semibold text-ink">边缘节点组 {groupId.slice(-2)}</h3></div><StatusBadge status={compute?.status ?? '待部署'} /></div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-canvas p-4"><p className="flex items-center gap-2 text-sm font-semibold text-ink"><Cpu size={16} className="text-brand" />计算设备</p><p className="mt-2 text-xs leading-6 text-muted">{compute?.cpu}<br />{compute?.memory} · {compute?.storage}<br />{compute?.gpu}</p></div>
            <div className="rounded-xl bg-canvas p-4"><p className="flex items-center gap-2 text-sm font-semibold text-ink"><Database size={16} className="text-cyan-600" />存储设备</p><p className="mt-2 text-xs leading-6 text-muted">{storage?.cpu}<br />{storage?.memory} · {storage?.storage}<br />本地数据库：{storage?.localDatabase}</p></div>
          </div>
          <dl className="mt-5 grid grid-cols-1 gap-x-5 gap-y-3 text-sm sm:grid-cols-2">
            <div><dt className="text-xs text-muted">关联机床</dt><dd className="mt-1 text-ink">{compute?.machine}</dd></div>
            <div><dt className="text-xs text-muted">已部署应用</dt><dd className="mt-1 text-ink">{compute?.deployedApps.length ? compute.deployedApps.join('、') : '尚未部署'}</dd></div>
            <div><dt className="text-xs text-muted">云端连接</dt><dd className="mt-1 text-ink">{compute?.cloudConnectionStatus}</dd></div>
            <div><dt className="text-xs text-muted">最近同步</dt><dd className="mt-1 text-ink">{storage?.lastUploadAt}</dd></div>
          </dl>
        </article>
      })}</div>
    </section>

    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker">设备台账</p><h2 className="section-title">硬件配置与接入状态</h2></div><p className="text-sm text-muted">数据可在管理端维护</p></div>
      <div className="card mt-6 overflow-hidden"><div className="thin-scrollbar overflow-x-auto"><table className="min-w-[1900px] w-full"><thead className="table-head"><tr>{['设备编号', '设备类型', '型号', '节点组', 'CPU', '内存', '存储', 'GPU', '操作系统', '关联机床', 'IP地址', '接入状态', '云端连接', '最近心跳', '最近上传', '待传文件', '同步状态'].map((item) => <th className="px-4 py-4" key={item}>{item}</th>)}</tr></thead><tbody>{nodes.map((node) => <tr key={node.id}><td className="table-cell font-mono text-xs text-brand">{node.code}</td><td className="table-cell font-medium text-ink">{node.deviceType}</td><td className="table-cell">{node.model}</td><td className="table-cell">{node.groupId ?? '未分组'}</td><td className="table-cell">{node.cpu}</td><td className="table-cell">{node.memory}</td><td className="table-cell">{node.storage}</td><td className="table-cell">{node.gpu}</td><td className="table-cell">{node.operatingSystem}</td><td className="table-cell">{node.machine}</td><td className="table-cell font-mono text-xs">{node.ip}</td><td className="table-cell"><StatusBadge status={node.status} /></td><td className="table-cell"><StatusBadge status={node.cloudConnectionStatus} /></td><td className="table-cell">{node.lastHeartbeat}</td><td className="table-cell">{node.lastUploadAt}</td><td className="table-cell">{node.pendingFileCount}</td><td className="table-cell"><StatusBadge status={node.syncStatus} /></td></tr>)}</tbody></table></div></div>
    </section>
  </div>
}
