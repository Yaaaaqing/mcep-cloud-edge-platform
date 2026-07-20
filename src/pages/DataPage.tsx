import { Database, FileCode2, FileSpreadsheet, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DataPreviewDialog } from '../components/DataPreviewDialog'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { TraceResourceDetails } from '../components/TraceResourceDetails'
import { Button } from '../components/ui/Button'
import { useData } from '../hooks/useData'
import type { DataResource } from '../types'

export function DataPage() {
  const { data: resources } = useData<DataResource[]>('resources')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [fileFormat, setFileFormat] = useState('')
  const [source, setSource] = useState('')
  const [organization, setOrganization] = useState('')
  const [selectedId, setSelectedId] = useState(resources[0]?.id ?? '')
  const [previewOpen, setPreviewOpen] = useState(false)
  const filtered = useMemo(() => resources.filter((item) => {
    const keyword = [item.name, item.source, item.description, item.category, item.subType, item.sourceFile, item.fileFormat].filter(Boolean).join(' ').toLowerCase()
    return keyword.includes(search.trim().toLowerCase()) && (!category || item.category === category) && (!fileFormat || item.fileFormat === fileFormat) && (!source || item.source === source) && (!organization || item.organization === organization)
  }), [resources, search, category, fileFormat, source, organization])
  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? null
  const unique = (key: keyof DataResource) => Array.from(new Set(resources.map((item) => String(item[key]))))
  return (
    <div className="page-shell py-8 lg:py-10">
      <PageHeader eyebrow="数据中心" title="交付成果与业务数据资源目录" description="统一登记数据来源、集成方式、版本、质量和更新能力；目录状态不等同于生产数据已实时同步。" />
      <div className="card mb-6 grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-5">
        <label className="relative sm:col-span-2 xl:col-span-1"><Search className="absolute left-3.5 top-3.5 text-muted" size={17} /><input className="input pl-10" placeholder="搜索名称、SINUMERIK、Trace 或文件名" value={search} onChange={(e) => { setSearch(e.target.value); setSelectedId('') }} /></label>
        <select className="input" value={category} onChange={(e) => { setCategory(e.target.value); setSelectedId('') }}><option value="">全部资源分类</option>{unique('category').filter((item) => item !== 'undefined').map((item) => <option key={item}>{item}</option>)}</select>
        <select className="input" value={fileFormat} onChange={(e) => { setFileFormat(e.target.value); setSelectedId('') }}><option value="">全部文件格式</option>{unique('fileFormat').filter((item) => item !== 'undefined').map((item) => <option key={item}>{item}</option>)}</select>
        <select className="input" value={source} onChange={(e) => { setSource(e.target.value); setSelectedId('') }}><option value="">全部来源应用</option>{unique('source').map((item) => <option key={item}>{item}</option>)}</select>
        <select className="input" value={organization} onChange={(e) => { setOrganization(e.target.value); setSelectedId('') }}><option value="">全部责任单位</option>{unique('organization').map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      {filtered.length ? <div className="grid min-w-0 gap-5 min-[1180px]:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)] xl:gap-6">
        <aside className="card overflow-hidden"><div className="border-b border-line px-5 py-4"><p className="font-semibold text-ink">数据目录</p><p className="mt-1 text-xs text-muted">共 {filtered.length} 项资源</p></div><div className="thin-scrollbar max-h-[420px] overflow-auto p-2 min-[1180px]:max-h-[760px]">{filtered.map((item) => <button key={item.id} onClick={() => setSelectedId(item.id)} className={`focus-ring mb-1 w-full rounded-xl p-4 text-left transition ${selected?.id === item.id ? 'bg-brand/8 ring-1 ring-inset ring-brand/15' : 'hover:bg-canvas'}`}><div className="flex items-start gap-3"><span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.type === 'CSV文件' ? 'bg-emerald-50 text-emerald-600' : item.type === 'XML文件' ? 'bg-cyan-50 text-cyan-700' : 'bg-blue-50 text-brand'}`}>{item.type === 'CSV文件' ? <FileSpreadsheet size={18} /> : item.type === 'XML文件' ? <FileCode2 size={18} /> : <Database size={18} />}</span><div className="min-w-0"><p className="text-sm font-medium leading-6 text-ink">{item.name}</p><p className="mt-1 text-xs text-muted">{item.source} · {item.sourceOrganization}</p><p className="mt-1 text-xs text-muted">{item.type} · {item.integrationMode} · {item.dataVersion}</p>{item.id === 'sinumerik-x-bk300-1' && <p className="mt-1 text-xs text-muted">{item.signalCount} 路信号 · {item.recordCount} 个采样点</p>}<div className="mt-2 flex flex-wrap gap-1">{item.status && <StatusBadge status={item.status} />}{item.previewStatus && <StatusBadge status={item.previewStatus} />}{item.qualityStatus && <StatusBadge status={item.qualityStatus} />}</div></div></div></button>)}</div></aside>
        {selected?.id === 'sinumerik-x-bk300-1' ? <TraceResourceDetails resource={selected} /> : selected && <section className="card p-4 sm:p-5 xl:p-7"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6"><div><div className="flex flex-wrap gap-2"><StatusBadge status={selected.type} />{selected.status && <StatusBadge status={selected.status} />}{selected.qualityStatus && <StatusBadge status={selected.qualityStatus} />}</div><h2 className="mt-4 text-xl font-semibold text-ink sm:text-2xl">{selected.name}</h2><p className="mt-2 text-sm text-muted">资源编号：{selected.id.toUpperCase()}</p></div>{selected.type === 'CSV文件' && <Button icon={<FileSpreadsheet size={17} />} onClick={() => setPreviewOpen(true)}>预览 CSV 数据</Button>}</div><p className="mt-6 max-w-4xl leading-7 text-text">{selected.description}</p><dl className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">{[['来源应用', selected.source], ['来源单位', selected.sourceOrganization], ['来源分类', selected.sourceCategory], ['资源分类', selected.category ?? selected.type], ['数据类型', selected.type], ['集成方式', selected.integrationMode], ['数据版本', selected.dataVersion], ['生成时间', selected.generatedAt], ['更新能力', selected.updateCapability], ['同步频率', selected.syncFrequency], ['最近同步', selected.lastSyncAt], ['数据量', selected.volume], ['关联机床', selected.relatedMachine], ['关联部件', selected.relatedComponent], ['存储位置', selected.storageLocation], ['责任单位', selected.organization], ['权限范围', selected.permission], ['文件校验值', selected.fileHash]].map(([label, value]) => <div className="rounded-xl border border-line bg-canvas/35 p-4" key={label}><dt className="text-xs text-muted">{label}</dt><dd className="mt-2 break-words text-sm font-medium text-ink">{value}</dd></div>)}</dl><div className="mt-7 rounded-2xl border border-brand/10 bg-brand/[.035] p-5"><h3 className="font-semibold text-ink">使用说明</h3><p className="mt-2 text-sm leading-6 text-muted">数据访问需遵循平台权限范围。当前为配置演示数据，不连接真实生产数据库；“待接入”资源不代表已完成同步。</p></div></section>}
      </div> : <EmptyState />}
      <DataPreviewDialog open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  )
}
