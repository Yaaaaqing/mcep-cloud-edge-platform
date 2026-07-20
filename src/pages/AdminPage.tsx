import { Activity, AppWindow, BookOpen, ChevronRight, ClipboardCheck, CloudCog, Database, Download, FileClock, FileText, Home, Plus, Radio, RotateCcw, Save, Search, ShieldAlert, Trash2, UserCog, Users, Waypoints } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/ui/Button'
import { useData } from '../hooks/useData'
import { dataService, type DataKey } from '../services/providers'
import { initialCloudResources } from '../data/cloudResources'
import type { CloudResource, HomeContent, PlatformApp } from '../types'
import { downloadFile } from '../utils/download'

type Field = { key: string; label: string; options?: string[]; textarea?: boolean; list?: boolean; numeric?: boolean; boolean?: boolean }
type ModuleConfig = { id: string; title: string; description: string; key?: DataKey; icon: LucideIcon; columns?: Field[]; fields?: Field[]; defaults?: Record<string, unknown> }

const deploymentModes = ['独立云端部署', '边缘端部署', '云边协同部署', '仅成果数据接入', '待评估']
const accessStages = ['成果登记', '数据接入', '应用入口', '认证与监测', '云边协同']
const xinchuangStatuses = ['待评估', '评估中', '可适配', '需要改造', '不适合云端']

const modules: ModuleConfig[] = [
  {
    id: 'apps', title: '应用管理', description: '维护软件成果、部署方式、接入阶段与适配信息。', key: 'apps', icon: AppWindow,
    columns: [{ key: 'name', label: '软件名称' }, { key: 'organization', label: '建设单位' }, { key: 'deploymentMode', label: '部署方式' }, { key: 'accessStage', label: '接入阶段' }, { key: 'xinchuangStatus', label: '信创适配' }],
    fields: [
      { key: 'name', label: '软件名称' }, { key: 'organization', label: '建设单位' }, { key: 'description', label: '简介', textarea: true }, { key: 'category', label: '软件类型' },
      { key: 'softwareVersion', label: '软件版本' }, { key: 'architecture', label: '软件架构' }, { key: 'runtime', label: '运行环境' }, { key: 'operatingSystem', label: '操作系统' }, { key: 'cpuArchitecture', label: 'CPU 架构' },
      { key: 'deploymentMode', label: '部署方式', options: deploymentModes }, { key: 'accessStage', label: '接入阶段', options: accessStages }, { key: 'xinchuangStatus', label: '信创适配', options: xinchuangStatuses },
      { key: 'hasWeb', label: '是否有 Web 端', options: ['是', '否', '待确认'] }, { key: 'ssoStatus', label: '统一认证状态' }, { key: 'healthCheckUrl', label: '健康检查地址或说明' }, { key: 'dataAccessModes', label: '数据接入方式（逗号分隔）', list: true },
      { key: 'resourceStatus', label: '资源状态' }, { key: 'database', label: '数据库' }, { key: 'responsibleDepartment', label: '责任部门' }, { key: 'owner', label: '应用负责人' }, { key: 'technicalContact', label: '技术联系人' }, { key: 'maintenanceOwner', label: '运维责任方' }, { key: 'edgeGroupId', label: '边缘节点组' }, { key: 'updatedAt', label: '更新时间' },
    ],
    defaults: { accessStatus: '规划接入', operationStatus: '未运行', deployment: '待评估', database: '待确认', softwareVersion: '待确认', architecture: '待确认', runtime: '待确认', operatingSystem: '待确认', cpuArchitecture: '待确认', deploymentMode: '待评估', accessStage: '成果登记', xinchuangStatus: '待评估', hasWeb: '待确认', ssoStatus: '待评估', healthCheckUrl: '待确认', dataAccessModes: ['待确认'], resourceStatus: '待梳理', responsibleDepartment: '待确认', owner: '待确认', technicalContact: '待确认', maintenanceOwner: '待确认', updatedAt: '待更新', category: '高校科研软件', featured: false },
  },
  {
    id: 'resources', title: '数据资源管理', description: '维护来源、集成方式、版本、同步和质量信息。', key: 'resources', icon: Database,
    columns: [{ key: 'name', label: '资源名称' }, { key: 'source', label: '来源应用' }, { key: 'sourceOrganization', label: '来源单位' }, { key: 'integrationMode', label: '集成方式' }, { key: 'qualityStatus', label: '质量状态' }],
    fields: [
      { key: 'name', label: '资源名称' }, { key: 'source', label: '来源应用' }, { key: 'sourceAppId', label: '来源应用 ID' }, { key: 'sourceOrganization', label: '来源单位' }, { key: 'sourceCategory', label: '来源分类', options: ['高校交付成果数据', '后续业务数据', '边缘节点数据', '平台管理数据'] },
      { key: 'type', label: '数据类型', options: ['结构化数据', 'CSV文件', 'XML文件', '接口数据', '文档资料'] }, { key: 'category', label: '资源分类' }, { key: 'fileFormat', label: '文件格式' }, { key: 'dataVersion', label: '数据版本' }, { key: 'generatedAt', label: '生成时间' },
      { key: 'integrationMode', label: '集成方式', options: ['文件上传', 'API定时同步', '增量同步', '实时或事件传输'] }, { key: 'syncFrequency', label: '同步频率' }, { key: 'lastSyncAt', label: '最近同步' }, { key: 'updateCapability', label: '更新能力', options: ['一次性交付', '支持人工更新', '支持API更新', '待确认'] },
      { key: 'relatedMachine', label: '关联机床' }, { key: 'relatedComponent', label: '关联部件' }, { key: 'volume', label: '数据量' }, { key: 'storageLocation', label: '存储位置' }, { key: 'fileHash', label: '文件哈希' }, { key: 'qualityStatus', label: '质量状态' }, { key: 'status', label: '资源状态' }, { key: 'organization', label: '责任单位' }, { key: 'permission', label: '权限范围' }, { key: 'description', label: '说明', textarea: true },
    ],
    defaults: { type: '结构化数据', sourceCategory: '高校交付成果数据', integrationMode: '文件上传', updateCapability: '待确认', sourceOrganization: '待确认', relatedMachine: '待确认', relatedComponent: '待确认', dataVersion: '待确认', generatedAt: '待确认', syncFrequency: '待确认', lastSyncAt: '尚未同步', storageLocation: '待确认', fileHash: '待接收文件后计算', qualityStatus: '元数据待补充', status: '待接入', permission: '项目成员可见', updatedAt: '尚未接入', updateMode: '待确认', volume: '待确认' },
  },
  { id: 'cloudResources', title: '云资源台账', description: '登记已申请虚拟机与数据库资源，确认实际用途和复用条件。', icon: CloudCog },
  {
    id: 'edges', title: '边缘设备管理', description: '维护六组计算与存储设备的硬件及接入台账。', key: 'edgeNodes', icon: Waypoints,
    columns: [{ key: 'code', label: '设备编号' }, { key: 'deviceType', label: '设备类型' }, { key: 'groupId', label: '节点组' }, { key: 'machine', label: '关联机床' }, { key: 'status', label: '状态' }],
    fields: [
      { key: 'code', label: '设备编号' }, { key: 'name', label: '设备名称' }, { key: 'deviceType', label: '设备类型', options: ['边缘计算设备', '边缘存储设备'] }, { key: 'model', label: '型号' }, { key: 'groupId', label: '节点组' }, { key: 'organization', label: '部署单位' }, { key: 'machine', label: '关联机床' },
      { key: 'cpu', label: 'CPU' }, { key: 'memory', label: '内存' }, { key: 'storage', label: '存储' }, { key: 'gpu', label: 'GPU' }, { key: 'operatingSystem', label: '操作系统' }, { key: 'protocol', label: '通信协议' }, { key: 'ip', label: 'IP 地址' }, { key: 'deployedApps', label: '已部署软件（逗号分隔）', list: true }, { key: 'localDatabase', label: '本地数据库' }, { key: 'cloudConnectionStatus', label: '云端连接状态' }, { key: 'lastHeartbeat', label: '最近心跳' }, { key: 'lastUploadAt', label: '最近上传' }, { key: 'pendingFileCount', label: '待传文件数', numeric: true }, { key: 'syncStatus', label: '同步状态' }, { key: 'status', label: '接入状态', options: ['规划建设中', '待部署', '待接入', '在线', '异常'] }, { key: 'note', label: '备注', textarea: true },
    ],
    defaults: { deviceType: '边缘计算设备', model: 'Dell Precision T5860 定制 4U', organization: '部署单位待确认', machine: '关联机床待确认', operatingSystem: 'Windows 11 Pro', os: 'Windows 11 Pro', protocol: 'HTTPS（拟）', ip: '待分配', deployedApps: [], localDatabase: '待确认', cloudConnectionStatus: '待接入', lastHeartbeat: '尚未接入', lastUploadAt: '尚未上传', pendingFileCount: 0, syncStatus: '待接入', status: '待部署', lastSeen: '尚未接入' },
  },
  {
    id: 'access', title: '接入申请管理', description: '维护软件接入清单与实施进展，不建设复杂审批流。', key: 'accessApplications', icon: ClipboardCheck,
    columns: [{ key: 'appName', label: '软件名称' }, { key: 'organization', label: '建设单位' }, { key: 'recommendedDeployment', label: '推荐部署方式' }, { key: 'currentStage', label: '当前阶段' }, { key: 'currentOwner', label: '当前责任人' }, { key: 'currentBlocker', label: '当前卡点' }, { key: 'nextAction', label: '下一步动作' }, { key: 'estimatedCompletion', label: '预计完成时间' }],
    fields: [{ key: 'appName', label: '软件名称' }, { key: 'organization', label: '建设单位' }, { key: 'recommendedDeployment', label: '推荐部署方式', options: deploymentModes }, { key: 'currentStage', label: '当前阶段', options: accessStages }, { key: 'currentOwner', label: '当前责任人' }, { key: 'currentBlocker', label: '当前卡点', textarea: true }, { key: 'nextAction', label: '下一步动作', textarea: true }, { key: 'estimatedCompletion', label: '预计完成时间' }, { key: 'status', label: '台账状态', options: ['草稿', '已登记', '实施中', '已完成', '暂停'] }],
    defaults: { recommendedDeployment: '待评估', currentStage: '成果登记', currentOwner: '待确认', currentBlocker: '待确认', nextAction: '待补充', estimatedCompletion: '待确认', status: '已登记', createdAt: '待更新' },
  },
  {
    id: 'monitors', title: '运行监测管理', description: '维护检查对象、方式、来源与责任人，演示状态必须显式标记。', key: 'monitors', icon: Radio,
    columns: [{ key: 'appName', label: '监测对象' }, { key: 'targetType', label: '对象类型' }, { key: 'checkSource', label: '检查来源' }, { key: 'serviceStatus', label: '服务状态' }, { key: 'lastCheckedAt', label: '最近检查' }],
    fields: [{ key: 'appName', label: '对象名称' }, { key: 'targetName', label: '监测目标' }, { key: 'targetType', label: '对象类型', options: ['MCEP平台', '独立云端应用', 'API', '数据库', '边缘节点'] }, { key: 'serviceStatus', label: '服务状态', options: ['正常', '联调中', '异常', '未接入', '待检查'] }, { key: 'checkMethod', label: '检查方式' }, { key: 'checkSource', label: '检查来源' }, { key: 'lastCheckedAt', label: '最近检查' }, { key: 'consecutiveFailures', label: '连续失败次数', numeric: true }, { key: 'latestError', label: '最近错误' }, { key: 'responsiblePerson', label: '责任人' }, { key: 'isDemo', label: '是否演示数据', boolean: true }],
    defaults: { targetType: '独立云端应用', serviceStatus: '未接入', databaseStatus: '未接入', apiStatus: '未接入', checkMethod: '待配置', checkSource: '待接入自动监测', lastCheckedAt: '尚未接入', consecutiveFailures: 0, latestError: '无检查数据', responsiblePerson: '待确认', isDemo: false, lastAccess: '尚未接入', version: '待确认' },
  },
  { id: 'users', title: '用户与联系人', description: '维护平台用户、所属单位、角色和接入联系人。', key: 'users', icon: Users, columns: [{ key: 'name', label: '姓名' }, { key: 'organization', label: '所属单位' }, { key: 'role', label: '角色' }, { key: 'status', label: '状态' }], fields: [{ key: 'name', label: '姓名' }, { key: 'organization', label: '所属单位' }, { key: 'role', label: '角色', options: ['平台管理员', '应用负责人', '接入联系人', '普通用户'] }, { key: 'status', label: '状态', options: ['启用', '停用'] }, { key: 'lastLogin', label: '最近登录' }], defaults: { role: '接入联系人', status: '启用', lastLogin: '尚未登录' } },
  { id: 'docs', title: '文档管理', description: '维护帮助中心规范、指南与说明。', key: 'documents', icon: BookOpen, columns: [{ key: 'title', label: '文档标题' }, { key: 'category', label: '分类' }, { key: 'updatedAt', label: '更新时间' }], fields: [{ key: 'title', label: '文档标题' }, { key: 'category', label: '分类' }, { key: 'updatedAt', label: '更新时间' }, { key: 'description', label: '摘要', textarea: true }], defaults: { category: '平台说明', updatedAt: '待更新' } },
  { id: 'home', title: '首页配置', description: '维护首页主标题、说明和平台公告。', icon: Home },
  { id: 'logs', title: '操作日志', description: '记录本地演示环境中的关键维护操作。', icon: FileClock },
]

function GenericManager({ config, onLog }: { config: ModuleConfig; onLog: (text: string) => void }) {
  const { data } = useData<Record<string, any>[]>(config.key!)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Record<string, any> | null>(null)
  const filtered = useMemo(() => data.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase())), [data, search])
  const update = (field: Field, rawValue: string) => setEditing((current) => ({ ...current, [field.key]: field.list ? rawValue.split(/[,，]/).map((item) => item.trim()).filter(Boolean) : field.numeric ? Number(rawValue) : field.boolean ? rawValue === 'true' : rawValue }))
  const save = () => { if (!editing) return; const record: Record<string, any> = { ...config.defaults, ...editing, id: editing.id || `${config.id}-${Date.now()}` }; dataService.upsert(config.key as any, record); onLog(`${editing.id ? '编辑' : '新增'}：${record.name || record.title || record.appName || record.id}`); setEditing(null) }
  const remove = (row: Record<string, any>) => { if (!window.confirm(`确定删除“${row.name || row.title || row.appName || row.id}”吗？`)) return; dataService.remove(config.key as any, row.id); onLog(`删除：${row.name || row.title || row.appName || row.id}`) }
  const displayValue = (row: Record<string, any>, column: Field) => column.key.toLowerCase().includes('status')
    ? <StatusBadge status={String(row[column.key] ?? '未设置')} />
    : Array.isArray(row[column.key]) ? row[column.key].join('、') : String(row[column.key] ?? '—')

  return <div className="min-w-0">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><label className="relative w-full max-w-80"><Search className="absolute left-3.5 top-3.5 text-muted" size={16} /><input className="input pl-10" placeholder="搜索当前模块" value={search} onChange={(event) => setSearch(event.target.value)} /></label><Button icon={<Plus size={16} />} onClick={() => setEditing({ ...config.defaults })}>新增记录</Button></div>
    <div className="space-y-3 md:hidden">{filtered.map((row) => <article className="rounded-2xl border border-line p-4" key={row.id}><dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">{config.columns?.map((column) => <div key={column.key}><dt className="text-xs text-muted">{column.label}</dt><dd className="mt-1 break-words text-sm font-medium text-ink">{displayValue(row, column)}</dd></div>)}</dl><div className="mt-4 flex justify-end gap-2 border-t border-line pt-3"><Button variant="ghost" className="h-9 px-3" onClick={() => setEditing({ ...row })}>编辑</Button><Button variant="danger" className="h-9 px-3" onClick={() => remove(row)}><Trash2 size={14} />删除</Button></div></article>)}{!filtered.length && <div className="rounded-2xl bg-canvas p-8 text-center text-sm text-muted">暂无记录，可点击“新增记录”开始维护。</div>}</div>
    <div className="thin-scrollbar hidden overflow-x-auto rounded-2xl border border-line md:block"><table className="min-w-[980px] w-full"><thead className="table-head"><tr>{config.columns?.map((column) => <th className="px-4 py-3.5" key={column.key}>{column.label}</th>)}<th className="px-4 py-3.5 text-right">操作</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.id}>{config.columns?.map((column) => <td className="table-cell max-w-xs truncate" key={column.key}>{displayValue(row, column)}</td>)}<td className="table-cell"><div className="flex justify-end gap-1"><Button variant="ghost" className="h-8 px-3" onClick={() => setEditing({ ...row })}>编辑</Button><Button variant="danger" className="h-8 px-3" onClick={() => remove(row)}><Trash2 size={14} /></Button></div></td></tr>)}</tbody></table>{!filtered.length && <div className="p-10 text-center text-sm text-muted">暂无记录，可点击“新增记录”开始维护。</div>}</div>
    <Modal open={!!editing} onClose={() => setEditing(null)} title={`${editing?.id ? '编辑' : '新增'}${config.title}`} description="保存后将立即同步至对应前台页面。" width="max-w-5xl"><div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{config.fields?.map((field) => <label key={field.key} className={field.textarea ? 'sm:col-span-2' : ''}><span className="label">{field.label}</span>{field.options ? <select className="input" value={String(editing?.[field.key] ?? '')} onChange={(event) => update(field, event.target.value)}><option value="">请选择</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : field.boolean ? <select className="input" value={String(Boolean(editing?.[field.key]))} onChange={(event) => update(field, event.target.value)}><option value="false">否</option><option value="true">是</option></select> : field.textarea ? <textarea className="textarea" value={String(editing?.[field.key] ?? '')} onChange={(event) => update(field, event.target.value)} /> : <input className="input" type={field.numeric ? 'number' : 'text'} value={field.list && Array.isArray(editing?.[field.key]) ? editing[field.key].join('，') : String(editing?.[field.key] ?? '')} onChange={(event) => update(field, event.target.value)} />}</label>)}</div><div className="mt-6 flex flex-wrap justify-end gap-3"><Button variant="secondary" onClick={() => setEditing(null)}>取消</Button><Button icon={<Save size={16} />} onClick={save}>保存并同步</Button></div></Modal>
  </div>
}

const emptyCloudResource: CloudResource = {
  id: '', instanceName: '', resourceType: '待确认', cpuArchitecture: '待确认', cpuCores: 0, memoryGB: 0, diskGB: 0, operatingSystem: '待确认', internalIp: '待确认', runningStatus: '未知', managementStatus: '待确认', applicant: '待确认', owner: '待确认', purpose: '待确认', relatedAppId: '', confirmed: false, remark: '', updatedAt: '待更新',
}

function cloudResourcesToMarkdown(resources: CloudResource[], apps: PlatformApp[]) {
  const appName = (id: string) => apps.find((app) => app.id === id)?.name ?? '未关联'
  const lines = [
    '# MCEP 云资源台账',
    '',
    '> 公开示例数据已脱敏。现有资源用途需由数科公司核实后再确定是否新增申请。',
    '',
    `生成时间：${new Date().toLocaleString('zh-CN')}`,
    '',
    '| 实例名称 | 资源类型 | 规格 | 操作系统 | 脱敏IP | 运行状态 | 管理状态 | 当前用途 | 关联应用 | 已确认 | 更新时间 |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ]
  resources.forEach((item) => lines.push(`| ${item.instanceName} | ${item.resourceType} | ${item.cpuCores}核 / ${item.memoryGB}GB / ${item.diskGB}GB | ${item.operatingSystem} | ${item.internalIp} | ${item.runningStatus} | ${item.managementStatus} | ${item.purpose} | ${appName(item.relatedAppId)} | ${item.confirmed ? '是' : '否'} | ${item.updatedAt} |`))
  return lines.join('\n')
}

function CloudResourceManager({ onLog }: { onLog: (text: string) => void }) {
  const { data: resources } = useData<CloudResource[]>('cloudResources')
  const { data: apps } = useData<PlatformApp[]>('apps')
  const [editing, setEditing] = useState<CloudResource | null>(null)
  const appName = (id: string) => apps.find((app) => app.id === id)?.name ?? '未关联'
  const update = <K extends keyof CloudResource>(key: K, value: CloudResource[K]) => setEditing((current) => current ? { ...current, [key]: value } : current)
  const save = () => {
    if (!editing) return
    const record = { ...editing, id: editing.id || `cloud-${Date.now()}` }
    dataService.upsert('cloudResources', record)
    onLog(`${editing.id ? '编辑' : '新增'}云资源：${record.instanceName}`)
    setEditing(null)
  }
  const remove = (resource: CloudResource) => {
    if (!window.confirm(`确定删除云资源“${resource.instanceName}”吗？`)) return
    dataService.remove('cloudResources', resource.id)
    onLog(`删除云资源：${resource.instanceName}`)
  }
  const restore = () => {
    if (!window.confirm('确定恢复云资源初始脱敏台账吗？当前云资源编辑将被覆盖。')) return
    dataService.saveList('cloudResources', initialCloudResources)
    onLog('恢复云资源初始脱敏台账')
  }
  const exportJson = () => downloadFile('MCEP-云资源台账.json', JSON.stringify({ generatedAt: new Date().toISOString(), privacyNotice: '公开示例数据已脱敏，完整资源信息不进入版本控制。', cloudResources: resources }, null, 2), 'application/json')

  return <div className="min-w-0">
    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-800 sm:px-5"><ShieldAlert className="mt-0.5 shrink-0" size={18} /><p><strong>资源核实提示：</strong>现有资源用途需由数科公司核实后再确定是否新增申请。当前公开示例数据已脱敏。</p></div>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted">共登记 {resources.length} 项云资源；本页面不提供申请、启停或远程管理。</p><div className="flex flex-wrap gap-2"><Button variant="secondary" icon={<RotateCcw size={15} />} onClick={restore}>恢复初始数据</Button><Button variant="secondary" icon={<Download size={15} />} onClick={exportJson}>导出 JSON</Button><Button variant="secondary" icon={<Download size={15} />} onClick={() => downloadFile('MCEP-云资源台账.md', cloudResourcesToMarkdown(resources, apps), 'text/markdown;charset=utf-8')}>导出 Markdown</Button><Button icon={<Plus size={16} />} onClick={() => setEditing({ ...emptyCloudResource })}>新增资源</Button></div></div>
    <div className="space-y-3 md:hidden">{resources.map((item) => <article className="rounded-2xl border border-line p-4" key={item.id}><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-ink">{item.instanceName}</h3><p className="mt-1 text-xs text-muted">{item.resourceType} · {item.cpuCores}核 / {item.memoryGB}GB / {item.diskGB}GB</p></div><StatusBadge status={item.runningStatus} /></div><dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"><div><dt className="text-xs text-muted">操作系统 / 脱敏 IP</dt><dd className="mt-1 text-sm text-ink">{item.operatingSystem} · {item.internalIp}</dd></div><div><dt className="text-xs text-muted">管理状态</dt><dd className="mt-1"><StatusBadge status={item.managementStatus} /></dd></div><div><dt className="text-xs text-muted">当前用途</dt><dd className="mt-1 text-sm text-ink">{item.purpose}</dd></div><div><dt className="text-xs text-muted">关联应用 / 更新时间</dt><dd className="mt-1 text-sm text-ink">{appName(item.relatedAppId)} · {item.updatedAt}</dd></div></dl><div className="mt-4 flex justify-end gap-2 border-t border-line pt-3"><Button variant="ghost" className="h-9 px-3" onClick={() => setEditing({ ...item })}>编辑</Button><Button variant="danger" className="h-9 px-3" onClick={() => remove(item)}><Trash2 size={14} />删除</Button></div></article>)}</div>
    <div className="thin-scrollbar hidden overflow-x-auto rounded-2xl border border-line md:block"><table className="min-w-[1550px] w-full"><thead className="table-head"><tr>{['实例名称', '资源类型', '规格', '操作系统', '脱敏IP', '运行状态', '管理状态', '当前用途', '关联应用', '是否已确认', '更新时间', '操作'].map((label) => <th className="px-4 py-3.5" key={label}>{label}</th>)}</tr></thead><tbody>{resources.map((item) => <tr key={item.id}><td className="table-cell font-medium text-ink">{item.instanceName}</td><td className="table-cell">{item.resourceType}</td><td className="table-cell whitespace-nowrap">{item.cpuCores}核 / {item.memoryGB}GB / {item.diskGB}GB</td><td className="table-cell">{item.operatingSystem}</td><td className="table-cell font-mono text-xs">{item.internalIp}</td><td className="table-cell"><StatusBadge status={item.runningStatus} /></td><td className="table-cell"><StatusBadge status={item.managementStatus} /></td><td className="table-cell max-w-xs">{item.purpose}</td><td className="table-cell max-w-xs">{appName(item.relatedAppId)}</td><td className="table-cell"><StatusBadge status={item.confirmed ? '已确认' : '待确认'} /></td><td className="table-cell">{item.updatedAt}</td><td className="table-cell"><div className="flex gap-1"><Button variant="ghost" className="h-8 px-3" onClick={() => setEditing({ ...item })}>编辑</Button><Button variant="danger" className="h-8 px-3" onClick={() => remove(item)}><Trash2 size={14} /></Button></div></td></tr>)}</tbody></table></div>
    <Modal open={!!editing} onClose={() => setEditing(null)} title={`${editing?.id ? '编辑' : '新增'}云资源`} description="仅维护资源台账；完整内网信息请保存在本地私有配置中。" width="max-w-5xl">{editing && <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <label><span className="label">实例名称</span><input className="input" value={editing.instanceName} onChange={(event) => update('instanceName', event.target.value)} /></label>
      <label><span className="label">资源类型</span><select className="input" value={editing.resourceType} onChange={(event) => update('resourceType', event.target.value as CloudResource['resourceType'])}>{['应用虚拟机', '数据库虚拟机', '文件或数据资源', '待确认'].map((option) => <option key={option}>{option}</option>)}</select></label>
      <label><span className="label">CPU 架构</span><input className="input" value={editing.cpuArchitecture} onChange={(event) => update('cpuArchitecture', event.target.value)} /></label>
      <label><span className="label">CPU 核数</span><input className="input" type="number" value={editing.cpuCores} onChange={(event) => update('cpuCores', Number(event.target.value))} /></label>
      <label><span className="label">内存（GB）</span><input className="input" type="number" value={editing.memoryGB} onChange={(event) => update('memoryGB', Number(event.target.value))} /></label>
      <label><span className="label">磁盘（GB）</span><input className="input" type="number" value={editing.diskGB} onChange={(event) => update('diskGB', Number(event.target.value))} /></label>
      <label><span className="label">操作系统</span><input className="input" value={editing.operatingSystem} onChange={(event) => update('operatingSystem', event.target.value)} /></label>
      <label><span className="label">脱敏 IP</span><input className="input" value={editing.internalIp} onChange={(event) => update('internalIp', event.target.value)} /></label>
      <label><span className="label">运行状态</span><select className="input" value={editing.runningStatus} onChange={(event) => update('runningStatus', event.target.value as CloudResource['runningStatus'])}>{['运行中', '已停止', '待开通', '未知'].map((option) => <option key={option}>{option}</option>)}</select></label>
      <label><span className="label">管理状态</span><select className="input" value={editing.managementStatus} onChange={(event) => update('managementStatus', event.target.value as CloudResource['managementStatus'])}>{['验证通过', '待验证', '待确认'].map((option) => <option key={option}>{option}</option>)}</select></label>
      <label><span className="label">申请人</span><input className="input" value={editing.applicant} onChange={(event) => update('applicant', event.target.value)} /></label>
      <label><span className="label">责任人</span><input className="input" value={editing.owner} onChange={(event) => update('owner', event.target.value)} /></label>
      <label className="sm:col-span-2"><span className="label">当前用途</span><input className="input" value={editing.purpose} onChange={(event) => update('purpose', event.target.value)} /></label>
      <label><span className="label">关联应用</span><select className="input" value={editing.relatedAppId} onChange={(event) => update('relatedAppId', event.target.value)}><option value="">未关联 / 待确认</option>{apps.map((app) => <option value={app.id} key={app.id}>{app.name}</option>)}</select></label>
      <label><span className="label">是否已确认</span><select className="input" value={String(editing.confirmed)} onChange={(event) => update('confirmed', event.target.value === 'true')}><option value="false">否</option><option value="true">是</option></select></label>
      <label><span className="label">更新时间</span><input className="input" value={editing.updatedAt} onChange={(event) => update('updatedAt', event.target.value)} /></label>
      <label className="sm:col-span-2"><span className="label">备注</span><textarea className="textarea" value={editing.remark} onChange={(event) => update('remark', event.target.value)} /></label>
    </div>}<div className="mt-6 flex justify-end gap-3"><Button variant="secondary" onClick={() => setEditing(null)}>取消</Button><Button icon={<Save size={16} />} onClick={save}>保存并同步</Button></div></Modal>
  </div>
}

function HomeManager({ onLog }: { onLog: (text: string) => void }) {
  const { data } = useData<HomeContent>('homeContent')
  const [form, setForm] = useState(data)
  return <div className="max-w-4xl space-y-5"><label><span className="label">首页主标题</span><textarea className="textarea text-lg font-medium" value={form.heroTitle} onChange={(event) => setForm({ ...form, heroTitle: event.target.value })} /></label><label><span className="label">平台说明</span><textarea className="textarea" value={form.heroDescription} onChange={(event) => setForm({ ...form, heroDescription: event.target.value })} /></label><label><span className="label">首页公告</span><input className="input" value={form.announcement} onChange={(event) => setForm({ ...form, announcement: event.target.value })} /></label><Button icon={<Save size={16} />} onClick={() => { dataService.saveHomeContent(form); onLog('更新：首页内容') }}>保存并同步到首页</Button></div>
}

export function AdminPage() {
  const [active, setActive] = useState('apps')
  const [logs, setLogs] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('mcep:operation-logs') ?? '[]') } catch { return [] } })
  const config = modules.find((item) => item.id === active)!
  const ConfigIcon = config.icon
  const addLog = (text: string) => { const next = [`${new Date().toLocaleString('zh-CN')} · 雅青 · ${text}`, ...logs].slice(0, 100); setLogs(next); localStorage.setItem('mcep:operation-logs', JSON.stringify(next)) }
  const reset = () => { if (window.confirm('确定恢复全部示例初始数据吗？本地编辑内容将被清除。')) { dataService.reset(); addLog('恢复全部示例初始数据') } }
  return <div className="page-shell py-8 lg:py-10"><PageHeader eyebrow="管理端" title="平台内容与交付台账管理" description="当前使用浏览器 localStorage 保存配置演示数据；编辑会同步到前台，但不代表已接入正式后端或审批系统。" actions={<Button variant="secondary" icon={<RotateCcw size={16} />} onClick={reset}>恢复初始数据</Button>} /><div className="grid min-w-0 gap-4 md:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-5 2xl:grid-cols-[270px_minmax(0,1fr)] 2xl:gap-6"><aside className="card h-fit p-2 xl:p-3"><div className="mb-2 flex items-center gap-3 border-b border-line px-2 py-4 xl:px-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand text-white"><UserCog size={20} /></span><div className="min-w-0"><p className="truncate font-semibold text-ink">配置管理</p><p className="mt-0.5 truncate text-xs text-muted">示例数据模式</p></div></div>{modules.map(({ id, title, icon: Icon }) => <button key={id} onClick={() => setActive(id)} className={`focus-ring flex w-full items-center gap-2 rounded-xl px-2 py-3 text-left text-xs transition xl:gap-3 xl:px-3 xl:text-sm ${active === id ? 'bg-brand text-white' : 'text-muted hover:bg-canvas hover:text-ink'}`}><Icon size={17} className="shrink-0" /><span className="min-w-0 flex-1 truncate">{title}</span><ChevronRight size={15} className="shrink-0 opacity-60" /></button>)}</aside><section className="card min-h-[680px] min-w-0 p-4 sm:p-5 xl:p-7"><div className="mb-7 flex flex-wrap items-start justify-between gap-3 border-b border-line pb-5"><div><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand"><ConfigIcon size={20} /></span><h2 className="text-xl font-semibold text-ink">{config.title}</h2></div><p className="mt-3 text-sm text-muted">{config.description}</p></div><span className="rounded-full bg-canvas px-3 py-1.5 text-xs text-muted">示例数据模式</span></div>{config.key && <GenericManager config={config} onLog={addLog} />}{active === 'cloudResources' && <CloudResourceManager onLog={addLog} />}{active === 'home' && <HomeManager onLog={addLog} />}{active === 'logs' && <div><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted">共记录 {logs.length} 条本地操作</p><Button variant="danger" onClick={() => { setLogs([]); localStorage.removeItem('mcep:operation-logs') }}>清空日志</Button></div><div className="space-y-2">{logs.length ? logs.map((log, index) => <div className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm" key={`${log}-${index}`}><Activity size={16} className="shrink-0 text-brand" /><span>{log}</span></div>) : <div className="rounded-2xl bg-canvas p-10 text-center text-sm text-muted"><FileText className="mx-auto mb-3" />暂无本地操作记录</div>}</div></div>}</section></div></div>
}
