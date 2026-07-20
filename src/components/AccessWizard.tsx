import { Check, ChevronLeft, ChevronRight, Download, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { dataService } from '../services/providers'
import type { AccessApplication } from '../types'
import { downloadFile } from '../utils/download'
import { StatusBadge } from './StatusBadge'
import { Button } from './ui/Button'

const steps = ['软件基本信息', '部署与适配评估', '资源需求概要', '数据接入', '实施安排']

const initialForm: AccessApplication = {
  id: '', appName: '', organization: '', appOwner: '', technicalContact: '', architecture: '', hasWeb: '待确认', usesDatabase: '待确认',
  currentDeployment: '', cpuArchitecture: '待确认', os: '', runtime: '', gpu: '待确认', supportsContainer: '待确认', requiresGraphicalDesktop: '待确认', supportsOffline: '待确认', xinchuangStatus: '待评估', recommendedDeployment: '待评估',
  appVmRequired: '待确认', appVmNotes: '', databaseVmRequired: '待确认', databaseType: '待确认', groupDataPlatform: '待确认', domainPath: '', sso: '待确认', portRequirements: '',
  cloudDataContent: '', initialIntegrationMode: '文件上传', laterUpdateMode: '待确认', dataFormats: '', dataVolume: '', rawDataLocation: '', hasDataDictionary: '待确认', apiInfo: '',
  currentStage: '成果登记', currentOwner: '', currentBlocker: '', nextAction: '', estimatedCompletion: '', testResult: '待测试', launchConfirmation: '待确认', status: '草稿', createdAt: '',
}

const labels: Record<keyof AccessApplication, string> = {
  id: '申请编号', appName: '软件名称', organization: '建设单位', appOwner: '应用负责人', technicalContact: '技术联系人', architecture: '软件架构', hasWeb: '是否有 Web 端', usesDatabase: '是否使用数据库',
  currentDeployment: '当前部署与运行方式', cpuArchitecture: 'CPU 架构', os: '操作系统', runtime: '运行环境', gpu: 'GPU 需求', supportsContainer: '是否支持 Docker', requiresGraphicalDesktop: '是否需要图形桌面', supportsOffline: '是否支持离线运行', xinchuangStatus: '信创适配状态', recommendedDeployment: '推荐部署方式',
  appVmRequired: '是否需要应用虚机', appVmNotes: '应用虚机需求说明', databaseVmRequired: '是否需要数据库虚机', databaseType: '数据库类型', groupDataPlatform: '是否进入集团数据平台', domainPath: '域名或访问路径', sso: '统一认证', portRequirements: '端口与网络需求',
  cloudDataContent: '拟上云数据内容', initialIntegrationMode: '初始接入方式', laterUpdateMode: '后续更新方式', dataFormats: '数据格式', dataVolume: '数据规模', rawDataLocation: '原始数据位置', hasDataDictionary: '是否有数据字典', apiInfo: 'API 信息',
  currentStage: '当前阶段', currentOwner: '当前责任人', currentBlocker: '当前阻塞项', nextAction: '下一步动作', estimatedCompletion: '计划完成时间', testResult: '测试结果', launchConfirmation: '上线确认', status: '台账状态', createdAt: '创建时间',
}

const checklistGroups: Array<[string, Array<keyof AccessApplication>]> = [
  ['一、软件基本信息', ['appName', 'organization', 'appOwner', 'technicalContact', 'architecture', 'hasWeb', 'usesDatabase']],
  ['二、部署与适配评估', ['currentDeployment', 'cpuArchitecture', 'os', 'runtime', 'supportsContainer', 'gpu', 'requiresGraphicalDesktop', 'supportsOffline', 'xinchuangStatus', 'recommendedDeployment']],
  ['三、资源需求概要', ['appVmRequired', 'appVmNotes', 'databaseVmRequired', 'databaseType', 'groupDataPlatform', 'domainPath', 'sso', 'portRequirements']],
  ['四、数据接入', ['cloudDataContent', 'initialIntegrationMode', 'laterUpdateMode', 'dataFormats', 'dataVolume', 'rawDataLocation', 'hasDataDictionary', 'apiInfo']],
  ['五、实施安排', ['currentStage', 'currentOwner', 'currentBlocker', 'nextAction', 'estimatedCompletion', 'testResult', 'launchConfirmation']],
]

function Field({ label, name, value, onChange, placeholder, type = 'text', options, required, error }: { label: string; name: keyof AccessApplication; value: string; onChange: (name: keyof AccessApplication, value: string) => void; placeholder?: string; type?: 'text' | 'textarea'; options?: string[]; required?: boolean; error?: string }) {
  const controlClass = `${type === 'textarea' ? 'textarea' : 'input'} ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`
  return <label><span className="label">{label}{required && <em className="ml-1 not-italic text-red-500">*</em>}</span>{options ? <select className={controlClass} value={value} onChange={(event) => onChange(name, event.target.value)}><option value="">请选择</option>{options.map((option) => <option key={option}>{option}</option>)}</select> : type === 'textarea' ? <textarea className={controlClass} value={value} onChange={(event) => onChange(name, event.target.value)} placeholder={placeholder} /> : <input className={controlClass} value={value} onChange={(event) => onChange(name, event.target.value)} placeholder={placeholder} />}{error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}</label>
}

function groupedChecklist(form: AccessApplication) {
  return Object.fromEntries(checklistGroups.map(([title, keys]) => [title.replace(/^.、/, ''), Object.fromEntries(keys.map((key) => [labels[key], form[key] || '待补充']))]))
}

function toMarkdown(form: AccessApplication) {
  const lines = ['# MCEP 软件接入清单', '', `- 生成时间：${new Date().toLocaleString('zh-CN')}`, `- 申请编号：${form.id}`, `- 台账状态：${form.status}`, '']
  checklistGroups.forEach(([title, keys]) => {
    lines.push(`## ${title}`, '', '| 项目 | 内容 |', '| --- | --- |')
    keys.forEach((key) => lines.push(`| ${labels[key]} | ${String(form[key] || '待补充').replace(/\n/g, '<br>')} |`))
    lines.push('')
  })
  return lines.join('\n')
}

export function AccessWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof AccessApplication, string>>>({})
  const [form, setForm] = useState<AccessApplication>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('mcep:access-draft') ?? 'null') as Partial<AccessApplication> | null
      return { ...initialForm, ...saved }
    } catch { return initialForm }
  })

  useEffect(() => { localStorage.setItem('mcep:access-draft', JSON.stringify(form)) }, [form])

  const change = (name: keyof AccessApplication, value: string) => {
    setErrors((current) => ({ ...current, [name]: undefined }))
    setForm((current) => ({ ...current, [name]: value }))
  }

  const validateStep = (targetStep: number) => {
    const nextErrors: Partial<Record<keyof AccessApplication, string>> = {}
    const requireField = (key: keyof AccessApplication, message: string) => { if (!String(form[key] ?? '').trim()) nextErrors[key] = message }
    if (targetStep === 0) {
      requireField('appName', '请填写软件名称')
      requireField('organization', '请填写建设单位')
      if (!form.appOwner.trim() && !form.technicalContact.trim()) {
        nextErrors.appOwner = '应用负责人或技术联系人至少填写一项'
        nextErrors.technicalContact = '应用负责人或技术联系人至少填写一项'
      }
      requireField('architecture', '请填写软件架构或明确标注“待确认”')
    }
    if (targetStep === 1) {
      requireField('currentDeployment', '请填写当前运行方式')
      requireField('os', '请填写操作系统或明确标注“待确认”')
      requireField('runtime', '请填写运行环境或明确标注“待确认”')
      requireField('recommendedDeployment', '请选择推荐部署方式')
    }
    if (targetStep === 2) {
      requireField('appVmRequired', '请选择应用虚机需求')
      requireField('databaseType', '请选择数据库类型')
      requireField('sso', '请选择统一认证需求')
      requireField('portRequirements', '请填写端口需求或明确标注“待确认”')
    }
    if (targetStep === 3) {
      requireField('cloudDataContent', '请填写拟接入的数据内容')
      requireField('initialIntegrationMode', '请选择初始接入方式')
      requireField('dataFormats', '请填写数据格式或明确标注“待确认”')
    }
    if (targetStep === 4) {
      requireField('currentStage', '请选择当前阶段')
      requireField('currentOwner', '请填写当前责任人或明确标注“待确认”')
      requireField('nextAction', '请填写下一步动作')
      requireField('estimatedCompletion', '请填写计划完成时间或明确标注“待确认”')
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const nextStep = () => { if (validateStep(step)) setStep((value) => value + 1) }
  const finish = () => {
    if (!validateStep(4)) return
    const completed = { ...form, id: form.id || `ACC-${Date.now().toString().slice(-8)}`, status: '已登记', createdAt: new Date().toLocaleString('zh-CN') }
    setForm(completed)
    dataService.upsert('accessApplications', completed)
    localStorage.removeItem('mcep:access-draft')
    setSubmitted(true)
  }

  if (submitted) return <div><div className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500 text-white"><Check size={20} /></span><div><h3 className="font-semibold text-emerald-900">软件接入清单已生成</h3><p className="mt-1 text-sm text-emerald-700">编号 {form.id}，已保存到本地实施台账；不代表已完成审批或上线。</p></div></div><StatusBadge status={form.status} /></div><div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">{[['软件名称', form.appName], ['建设单位', form.organization], ['推荐部署方式', form.recommendedDeployment], ['当前阶段', form.currentStage], ['下一步动作', form.nextAction], ['计划完成时间', form.estimatedCompletion]].map(([label, value]) => <div className="rounded-xl border border-line p-4" key={label}><p className="text-xs text-muted">{label}</p><p className="mt-2 break-words text-sm font-medium text-ink">{value}</p></div>)}</div><div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Button icon={<Download size={16} />} onClick={() => downloadFile(`${form.appName || '软件'}-接入清单.json`, JSON.stringify({ meta: { id: form.id, status: form.status, createdAt: form.createdAt }, sections: groupedChecklist(form) }, null, 2), 'application/json')}>下载 JSON</Button><Button variant="secondary" icon={<Download size={16} />} onClick={() => downloadFile(`${form.appName || '软件'}-接入清单.md`, toMarkdown(form), 'text/markdown;charset=utf-8')}>下载 Markdown</Button><Button variant="ghost" onClick={onClose}>完成</Button></div></div>

  return <div className="access-wizard">
    <div className="mb-5 rounded-2xl border border-brand/10 bg-brand/[.04] p-4 sm:hidden"><p className="text-xs font-semibold text-brand">第 {step + 1} 步 / 共 {steps.length} 步</p><p className="mt-1 font-semibold text-ink">{steps[step]}</p></div>
    <div className="thin-scrollbar mb-7 hidden overflow-x-auto pb-2 sm:block"><div className="flex min-w-[680px] items-center">{steps.map((title, index) => <div className="contents" key={title}><button onClick={() => index <= step && setStep(index)} className="group flex min-w-[122px] flex-col items-center gap-2"><span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-semibold transition ${index <= step ? 'bg-brand text-white' : 'bg-canvas text-muted'}`}>{index < step ? <Check size={16} /> : index + 1}</span><span className={`text-xs ${index === step ? 'font-semibold text-brand' : 'text-muted'}`}>{title}</span></button>{index < steps.length - 1 && <span className={`mb-6 h-px flex-1 ${index < step ? 'bg-brand' : 'bg-line'}`} />}</div>)}</div></div>
    <div className="rounded-2xl bg-canvas/60 p-4 sm:p-6">
      {step === 0 && <div className="grid grid-cols-2 gap-5"><Field label="软件名称" name="appName" value={form.appName} onChange={change} required error={errors.appName} /><Field label="建设单位" name="organization" value={form.organization} onChange={change} required error={errors.organization} /><Field label="应用负责人" name="appOwner" value={form.appOwner} onChange={change} error={errors.appOwner} placeholder="姓名及联系方式，未知可填待确认" /><Field label="技术联系人" name="technicalContact" value={form.technicalContact} onChange={change} error={errors.technicalContact} placeholder="姓名及联系方式" /><Field label="软件架构" name="architecture" value={form.architecture} onChange={change} required error={errors.architecture} placeholder="微服务 / 单体 / 本地桌面 / 待确认" /><Field label="是否有 Web 端" name="hasWeb" value={form.hasWeb} onChange={change} options={['是', '否', '待确认']} /><Field label="是否使用数据库" name="usesDatabase" value={form.usesDatabase} onChange={change} options={['是', '否', '待确认']} /></div>}
      {step === 1 && <div className="grid grid-cols-2 gap-5"><Field label="当前部署与运行方式" name="currentDeployment" value={form.currentDeployment} onChange={change} required error={errors.currentDeployment} placeholder="例如本地桌面、校内服务器或待确认" /><Field label="CPU 架构" name="cpuArchitecture" value={form.cpuArchitecture} onChange={change} options={['x86_64', 'ARM64', '待确认']} /><Field label="操作系统" name="os" value={form.os} onChange={change} required error={errors.os} /><Field label="运行环境" name="runtime" value={form.runtime} onChange={change} required error={errors.runtime} placeholder="例如 Python 3.11" /><Field label="是否支持 Docker" name="supportsContainer" value={form.supportsContainer} onChange={change} options={['是', '否', '待确认']} /><Field label="GPU 需求" name="gpu" value={form.gpu} onChange={change} /><Field label="是否需要图形桌面" name="requiresGraphicalDesktop" value={form.requiresGraphicalDesktop} onChange={change} options={['是', '否', '待确认']} /><Field label="是否支持离线运行" name="supportsOffline" value={form.supportsOffline} onChange={change} options={['是', '否', '待确认']} /><Field label="信创适配状态" name="xinchuangStatus" value={form.xinchuangStatus} onChange={change} options={['待评估', '评估中', '可适配', '需要改造', '不适合云端']} /><Field label="推荐部署方式" name="recommendedDeployment" value={form.recommendedDeployment} onChange={change} required error={errors.recommendedDeployment} options={['独立云端部署', '边缘端部署', '云边协同部署', '仅成果数据接入', '待评估']} /></div>}
      {step === 2 && <div className="grid grid-cols-2 gap-5"><Field label="是否需要应用虚机" name="appVmRequired" value={form.appVmRequired} onChange={change} required error={errors.appVmRequired} options={['是', '否', '待确认']} /><Field label="应用虚机需求说明" name="appVmNotes" value={form.appVmNotes} onChange={change} placeholder="CPU、内存、存储及其他约束" /><Field label="是否需要数据库虚机" name="databaseVmRequired" value={form.databaseVmRequired} onChange={change} options={['是', '否', '待确认']} /><Field label="数据库类型" name="databaseType" value={form.databaseType} onChange={change} required error={errors.databaseType} options={['达梦', '金仓', '原有', '无需', '待确认']} /><Field label="是否进入集团数据平台" name="groupDataPlatform" value={form.groupDataPlatform} onChange={change} options={['是', '否', '待确认']} /><Field label="域名或访问路径" name="domainPath" value={form.domainPath} onChange={change} placeholder="可填待分配或不涉及" /><Field label="统一认证" name="sso" value={form.sso} onChange={change} required error={errors.sso} options={['需要', '不需要', '待确认']} /><Field label="端口与网络需求" name="portRequirements" value={form.portRequirements} onChange={change} required error={errors.portRequirements} placeholder="端口、协议、访问方向或待确认" /></div>}
      {step === 3 && <div className="grid grid-cols-2 gap-5"><div className="col-span-2"><Field label="拟上云数据内容" name="cloudDataContent" value={form.cloudDataContent} onChange={change} type="textarea" required error={errors.cloudDataContent} /></div><Field label="初始接入方式" name="initialIntegrationMode" value={form.initialIntegrationMode} onChange={change} required error={errors.initialIntegrationMode} options={['文件上传', 'API定时同步', '增量同步', '实时或事件传输']} /><Field label="后续更新方式" name="laterUpdateMode" value={form.laterUpdateMode} onChange={change} options={['一次性交付', '人工更新', 'API更新', '待确认']} /><Field label="数据格式" name="dataFormats" value={form.dataFormats} onChange={change} required error={errors.dataFormats} placeholder="CSV / XML / JSON / 数据库 / 待确认" /><Field label="数据规模" name="dataVolume" value={form.dataVolume} onChange={change} placeholder="文件数量、容量、记录数或待确认" /><Field label="原始数据位置" name="rawDataLocation" value={form.rawDataLocation} onChange={change} placeholder="交付目录或待确认" /><Field label="是否有数据字典" name="hasDataDictionary" value={form.hasDataDictionary} onChange={change} options={['是', '否', '待确认']} /><div className="col-span-2"><Field label="API 信息" name="apiInfo" value={form.apiInfo} onChange={change} type="textarea" placeholder="地址、认证、字段或明确标注后续待评估" /></div></div>}
      {step === 4 && <div className="grid grid-cols-2 gap-5"><Field label="当前阶段" name="currentStage" value={form.currentStage} onChange={change} required error={errors.currentStage} options={['成果登记', '数据接入', '应用入口', '认证与监测', '云边协同']} /><Field label="当前责任人" name="currentOwner" value={form.currentOwner} onChange={change} required error={errors.currentOwner} /><div className="col-span-2"><Field label="当前阻塞项" name="currentBlocker" value={form.currentBlocker} onChange={change} type="textarea" placeholder="无阻塞可明确填写“无”" /></div><div className="col-span-2"><Field label="下一步动作" name="nextAction" value={form.nextAction} onChange={change} type="textarea" required error={errors.nextAction} /></div><Field label="计划完成时间" name="estimatedCompletion" value={form.estimatedCompletion} onChange={change} required error={errors.estimatedCompletion} placeholder="日期或待确认" /><Field label="测试结果" name="testResult" value={form.testResult} onChange={change} options={['待测试', '通过', '有条件通过', '未通过']} /><Field label="上线确认" name="launchConfirmation" value={form.launchConfirmation} onChange={change} options={['待确认', '同意上线', '暂缓上线']} /></div>}
    </div>
    <div className="mt-6 flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-muted"><Save size={16} />草稿已自动保存</span><div className="flex gap-3">{step > 0 && <Button variant="secondary" icon={<ChevronLeft size={17} />} onClick={() => { setErrors({}); setStep((value) => value - 1) }}>上一步</Button>}{step < steps.length - 1 ? <Button onClick={nextStep}>下一步<ChevronRight size={17} /></Button> : <Button onClick={finish}>生成软件接入清单<Check size={17} /></Button>}</div></div>
  </div>
}
