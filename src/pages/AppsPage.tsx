import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppCard } from '../components/AppCard'
import { EmptyState } from '../components/EmptyState'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { useData } from '../hooks/useData'
import type { PlatformApp } from '../types'

export function AppsPage() {
  const { data: apps } = useData<PlatformApp[]>('apps')
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [organization, setOrganization] = useState('')
  const [category, setCategory] = useState('')
  const [accessStatus, setAccessStatus] = useState('')
  const [operationStatus, setOperationStatus] = useState('')
  const [selected, setSelected] = useState<PlatformApp | null>(() => apps.find((app) => app.id === searchParams.get('app')) ?? null)

  const options = (key: keyof PlatformApp) => Array.from(new Set(apps.map((app) => String(app[key]))))
  const filtered = useMemo(() => apps.filter((app) => {
    const keyword = `${app.name}${app.description}${app.organization}${app.category}`.toLowerCase()
    return keyword.includes(search.trim().toLowerCase())
      && (!organization || app.organization === organization)
      && (!category || app.category === category)
      && (!accessStatus || app.accessStatus === accessStatus)
      && (!operationStatus || app.operationStatus === operationStatus)
  }), [apps, search, organization, category, accessStatus, operationStatus])

  return (
    <div className="page-shell py-8 lg:py-10">
      <PageHeader eyebrow="应用中心" title="工业应用统一入口" description="集中展示已接入、云端部署、技术对接与规划应用，分别维护接入状态和运行状态。" />
      <div className="card mb-7 grid grid-cols-2 gap-4 p-5 xl:grid-cols-5">
        <label className="relative col-span-2 xl:col-span-1"><Search className="absolute left-3.5 top-3.5 text-muted" size={17} /><input className="input pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索应用名称、简介或单位" /></label>
        <select className="input" value={organization} onChange={(event) => setOrganization(event.target.value)} aria-label="建设单位筛选"><option value="">全部建设单位</option>{options('organization').map((item) => <option key={item}>{item}</option>)}</select>
        <select className="input" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="应用类型筛选"><option value="">全部应用类型</option>{options('category').map((item) => <option key={item}>{item}</option>)}</select>
        <select className="input" value={accessStatus} onChange={(event) => setAccessStatus(event.target.value)} aria-label="接入状态筛选"><option value="">全部接入状态</option>{options('accessStatus').map((item) => <option key={item}>{item}</option>)}</select>
        <select className="input" value={operationStatus} onChange={(event) => setOperationStatus(event.target.value)} aria-label="运行状态筛选"><option value="">全部运行状态</option>{options('operationStatus').map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      <div className="mb-5 flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-muted"><SlidersHorizontal size={16} />共 {filtered.length} 个应用</span><span className="text-xs text-muted">更新时间以各应用卡片为准</span></div>
      {filtered.length ? <div className="grid grid-cols-2 gap-5 2xl:grid-cols-3 2xl:gap-6">{filtered.map((app) => <AppCard key={app.id} app={app} onAction={setSelected} />)}</div> : <EmptyState />}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} description="应用接入与运行信息">
        {selected && <div>
          <div className="grid grid-cols-3 gap-4 rounded-2xl bg-canvas p-5">
            <div><p className="text-sm text-muted">接入状态</p><div className="mt-2"><StatusBadge status={selected.accessStatus} /></div></div>
            <div><p className="text-sm text-muted">运行状态</p><div className="mt-2"><StatusBadge status={selected.operationStatus} /></div></div>
            <div className="text-right"><p className="text-sm text-muted">责任联系人</p><p className="mt-2 font-semibold text-ink">{selected.owner}</p></div>
          </div>
          <p className="mt-6 leading-7 text-text">{selected.description}</p>
          <dl className="mt-6 grid grid-cols-2 gap-4">{[
            ['建设单位', selected.organization], ['应用类型', selected.category], ['部署位置', selected.deployment], ['数据库类型', selected.database], ['更新时间', selected.updatedAt], ['访问说明', selected.externalUrl ? '已配置真实业务地址，可从应用卡片进入。' : '当前未配置真实访问地址，仅展示接入详情。'],
          ].map(([label, value]) => <div className="rounded-xl border border-line p-4" key={label}><dt className="text-xs text-muted">{label}</dt><dd className="mt-2 text-sm font-medium text-ink">{value}</dd></div>)}</dl>
        </div>}
      </Modal>
    </div>
  )
}
