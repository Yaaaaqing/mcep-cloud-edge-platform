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
  const [deploymentMode, setDeploymentMode] = useState('')
  const [accessStage, setAccessStage] = useState('')
  const [selected, setSelected] = useState<PlatformApp | null>(() => apps.find((app) => app.id === searchParams.get('app')) ?? null)

  const options = (key: keyof PlatformApp) => Array.from(new Set(apps.map((app) => String(app[key]))))
  const filtered = useMemo(() => apps.filter((app) => {
    const keyword = `${app.name}${app.description}${app.organization}${app.category}`.toLowerCase()
    return keyword.includes(search.trim().toLowerCase())
      && (!organization || app.organization === organization)
      && (!category || app.category === category)
      && (!deploymentMode || app.deploymentMode === deploymentMode)
      && (!accessStage || app.accessStage === accessStage)
  }), [apps, search, organization, category, deploymentMode, accessStage])

  return (
    <div className="page-shell py-8 lg:py-10">
      <PageHeader eyebrow="应用中心" title="软件成果与应用接入台账" description="统一登记软件形态、部署方式、接入阶段和信创适配状态；未完成技术评估的事项明确标记为待确认。" />
      <div className="card mb-7 grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-5">
        <label className="relative sm:col-span-2 xl:col-span-1"><Search className="absolute left-3.5 top-3.5 text-muted" size={17} /><input className="input pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索应用名称、简介或单位" /></label>
        <select className="input" value={organization} onChange={(event) => setOrganization(event.target.value)} aria-label="建设单位筛选"><option value="">全部建设单位</option>{options('organization').map((item) => <option key={item}>{item}</option>)}</select>
        <select className="input" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="应用类型筛选"><option value="">全部应用类型</option>{options('category').map((item) => <option key={item}>{item}</option>)}</select>
        <select className="input" value={deploymentMode} onChange={(event) => setDeploymentMode(event.target.value)} aria-label="部署方式筛选"><option value="">全部部署方式</option>{options('deploymentMode').map((item) => <option key={item}>{item}</option>)}</select>
        <select className="input" value={accessStage} onChange={(event) => setAccessStage(event.target.value)} aria-label="接入阶段筛选"><option value="">全部接入阶段</option>{options('accessStage').map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      <div className="mb-5 flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-muted"><SlidersHorizontal size={16} />共 {filtered.length} 个应用</span><span className="text-xs text-muted">更新时间以各应用卡片为准</span></div>
      {filtered.length ? <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3 2xl:gap-6">{filtered.map((app) => <AppCard key={app.id} app={app} onAction={setSelected} />)}</div> : <EmptyState />}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} description="软件成果、部署条件与交付责任信息">
        {selected && <div>
          <div className="grid grid-cols-1 gap-4 rounded-2xl bg-canvas p-4 sm:grid-cols-3 sm:p-5">
            <div><p className="text-sm text-muted">接入状态</p><div className="mt-2"><StatusBadge status={selected.accessStatus} /></div></div>
            <div><p className="text-sm text-muted">运行状态</p><div className="mt-2"><StatusBadge status={selected.operationStatus} /></div></div>
            <div className="sm:text-right"><p className="text-sm text-muted">信创适配</p><div className="mt-2"><StatusBadge status={selected.xinchuangStatus} /></div></div>
          </div>
          <p className="mt-6 leading-7 text-text">{selected.description}</p>
          <div className="mt-6 space-y-5">{[
            ['基本信息', [['建设单位', selected.organization], ['应用类型', selected.category], ['软件版本', selected.softwareVersion], ['是否有 Web 端', selected.hasWeb]]],
            ['部署环境', [['软件架构', selected.architecture], ['运行环境', selected.runtime], ['操作系统', selected.operatingSystem], ['CPU 架构', selected.cpuArchitecture], ['推荐部署方式', selected.deploymentMode], ['信创适配', selected.xinchuangStatus]]],
            ['云资源与数据库', [['当前部署位置', selected.deployment], ['数据库', selected.database], ['资源状态', selected.resourceStatus], ['边缘节点组', selected.edgeGroupId ?? '未关联']]],
            ['数据接入', [['接入阶段', selected.accessStage], ['数据接入方式', selected.dataAccessModes.join('、')], ['统一认证', selected.ssoStatus], ['健康检查', selected.healthCheckUrl]]],
            ['负责人和运维信息', [['责任部门', selected.responsibleDepartment], ['应用负责人', selected.owner], ['技术联系人', selected.technicalContact], ['运维责任方', selected.maintenanceOwner], ['更新时间', selected.updatedAt]]],
          ].map(([title, rows]) => <section className="rounded-2xl border border-line p-4 sm:p-5" key={title as string}><h3 className="font-semibold text-ink">{title as string}</h3><dl className="mt-4 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">{(rows as string[][]).map(([label, value]) => <div key={label}><dt className="text-xs text-muted">{label}</dt><dd className="mt-1.5 break-words text-sm font-medium text-ink">{value}</dd></div>)}</dl></section>)}</div>
        </div>}
      </Modal>
    </div>
  )
}
