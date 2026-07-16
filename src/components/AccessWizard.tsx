import { Check, ChevronLeft, ChevronRight, Download, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { dataService } from '../services/storage'
import type { AccessApplication } from '../types'
import { downloadFile } from '../utils/download'
import { StatusBadge } from './StatusBadge'
import { Button } from './ui/Button'

const steps = ['应用基本信息', '部署环境', '网络与认证', '数据与接口', '测试与上线']
const initialForm: AccessApplication = {
  id: '', appName: '', organization: '', appOwner: '', technicalContact: '', appType: '', deploymentMode: '', hasWeb: '是', usesDatabase: '是', os: '', runtime: '', dependencies: '', cpu: '', memory: '', storage: '', gpu: '无', supportsContainer: '待确认', needsInternet: '否', startCommand: '', sourceIp: '', targetIp: '', port: '', protocol: 'HTTPS', sso: '需要', databaseType: '', databaseVersion: '', apiType: 'REST API', apiUrl: '', transferMethod: 'API接口', updateFrequency: '', testResult: '', issueLog: '', launchConfirmation: '', status: '草稿', createdAt: '',
}

function Field({ label, name, value, onChange, placeholder, type = 'text', options, required, error, disabled }: { label: string; name: keyof AccessApplication; value: string; onChange: (name: keyof AccessApplication, value: string) => void; placeholder?: string; type?: 'text' | 'textarea'; options?: string[]; required?: boolean; error?: string; disabled?: boolean }) {
  const controlClass = `${type === 'textarea' ? 'textarea' : 'input'} ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-muted`
  return <label><span className="label">{label}{required && <em className="ml-1 not-italic text-red-500">*</em>}</span>{options ? <select className={controlClass} value={value} disabled={disabled} onChange={(event) => onChange(name, event.target.value)}><option value="">请选择</option>{options.map((option) => <option key={option}>{option}</option>)}</select> : type === 'textarea' ? <textarea className={controlClass} value={value} disabled={disabled} onChange={(event) => onChange(name, event.target.value)} placeholder={placeholder} /> : <input className={controlClass} value={value} disabled={disabled} onChange={(event) => onChange(name, event.target.value)} placeholder={placeholder} />}{error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}</label>
}

function toMarkdown(form: AccessApplication) {
  const lines = ['# MCEP 应用接入清单', '', `- 生成时间：${new Date().toLocaleString('zh-CN')}`, `- 申请编号：${form.id}`, `- 当前状态：${form.status}`, '']
  const groups: [string, (keyof AccessApplication)[]][] = [
    ['一、应用基本信息', ['appName', 'organization', 'appOwner', 'technicalContact', 'appType', 'deploymentMode', 'hasWeb', 'usesDatabase']],
    ['二、部署环境', ['os', 'runtime', 'dependencies', 'cpu', 'memory', 'storage', 'gpu', 'supportsContainer', 'startCommand']],
    ['三、网络与认证', ['needsInternet', 'sourceIp', 'targetIp', 'port', 'protocol', 'sso']],
    ['四、数据与接口', ['databaseType', 'databaseVersion', 'apiType', 'apiUrl', 'transferMethod', 'updateFrequency']],
    ['五、测试与上线', ['testResult', 'issueLog', 'launchConfirmation']],
  ]
  const labels: Record<string, string> = { appName: '应用名称', organization: '建设单位', appOwner: '应用负责人', technicalContact: '技术联系人', appType: '应用类型', deploymentMode: '当前部署方式', hasWeb: '是否已有 Web 端', usesDatabase: '是否使用数据库', os: '操作系统', runtime: '运行环境', dependencies: '依赖包', cpu: 'CPU', memory: '内存', storage: '存储', gpu: 'GPU', supportsContainer: '是否支持容器', startCommand: '启动方式', needsInternet: '是否需要外网', sourceIp: '源 IP', targetIp: '目标 IP', port: '端口', protocol: '通信协议', sso: '统一认证', databaseType: '数据库类型', databaseVersion: '数据库版本', apiType: '接口类型', apiUrl: 'API 地址', transferMethod: '文件传输方式', updateFrequency: '数据更新频率', testResult: '测试结果', issueLog: '问题记录', launchConfirmation: '上线确认' }
  groups.forEach(([title, keys]) => { lines.push(`## ${title}`, '', '| 项目 | 内容 |', '| --- | --- |'); keys.forEach((key) => lines.push(`| ${labels[key]} | ${String(form[key] || '待补充').replace(/\n/g, '<br>')} |`)); lines.push('') })
  return lines.join('\n')
}

export function AccessWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof AccessApplication, string>>>({})
  const [form, setForm] = useState<AccessApplication>(() => {
    try { return JSON.parse(localStorage.getItem('mcep:access-draft') ?? 'null') ?? initialForm } catch { return initialForm }
  })
  useEffect(() => { localStorage.setItem('mcep:access-draft', JSON.stringify(form)) }, [form])
  const change = (name: keyof AccessApplication, value: string) => {
    setErrors((current) => ({ ...current, [name]: undefined }))
    setForm((current) => {
      const next = { ...current, [name]: value }
      if (name === 'usesDatabase' && value === '否') {
        next.databaseType = '不使用数据库'
        next.databaseVersion = ''
      }
      if (name === 'usesDatabase' && value !== '否' && current.databaseType === '不使用数据库') next.databaseType = ''
      if (name === 'databaseType' && value === '不使用数据库') {
        next.usesDatabase = '否'
        next.databaseVersion = ''
      }
      if (name === 'apiType' && value === '暂无接口') next.apiUrl = ''
      return next
    })
  }
  const validateStep = (targetStep: number) => {
    const nextErrors: Partial<Record<keyof AccessApplication, string>> = {}
    const requireField = (key: keyof AccessApplication, message: string) => { if (!String(form[key] ?? '').trim()) nextErrors[key] = message }
    if (targetStep === 0) {
      requireField('appName', '请填写应用名称')
      requireField('organization', '请填写建设单位')
      if (!form.appOwner.trim() && !form.technicalContact.trim()) {
        nextErrors.appOwner = '应用负责人或技术联系人至少填写一项'
        nextErrors.technicalContact = '应用负责人或技术联系人至少填写一项'
      }
    }
    if (targetStep === 1) {
      requireField('os', '请填写操作系统')
      requireField('runtime', '请填写运行环境')
    }
    if (targetStep === 2) {
      requireField('needsInternet', '请选择外网需求')
      requireField('sourceIp', '请填写源 IP 或明确标注“待分配”')
      requireField('targetIp', '请填写目标 IP 或明确标注“待分配”')
      requireField('port', '请填写端口或明确标注“待确认”')
      requireField('protocol', '请选择通信协议')
      requireField('sso', '请选择统一认证需求')
    }
    if (targetStep === 3) {
      const usesDatabase = form.usesDatabase !== '否' && form.databaseType !== '不使用数据库'
      if (usesDatabase) {
        requireField('databaseType', '请选择数据库类型')
        requireField('databaseVersion', '请填写数据库版本')
      }
      if (form.apiType !== '暂无接口') requireField('apiUrl', '请填写 API 地址或明确标注“待分配”')
      requireField('apiType', '请选择接口类型')
      requireField('transferMethod', '请选择数据或文件传输方式')
    }
    if (targetStep === 4) {
      requireField('testResult', '请选择测试结果')
      requireField('launchConfirmation', '请选择上线确认结果')
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }
  const nextStep = () => { if (validateStep(step)) setStep((value) => value + 1) }
  const finish = () => {
    if (!validateStep(4)) return
    const completed = { ...form, id: form.id || `ACC-${Date.now().toString().slice(-8)}`, status: '待审核', createdAt: new Date().toLocaleString('zh-CN') }
    setForm(completed); dataService.upsert('accessApplications', completed); localStorage.removeItem('mcep:access-draft'); setSubmitted(true)
  }
  if (submitted) return <div><div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-white"><Check size={20} /></span><div><h3 className="font-semibold text-emerald-900">应用接入清单已生成</h3><p className="mt-1 text-sm text-emerald-700">编号 {form.id}，已保存到本地并同步至管理后台。</p></div></div><StatusBadge status={form.status} /></div><div className="mt-6 grid grid-cols-2 gap-4">{[['应用名称', form.appName], ['建设单位', form.organization], ['部署环境', `${form.os || '待补充'} / ${form.runtime || '待补充'}`], ['网络策略', `${form.sourceIp || '待分配'} → ${form.targetIp || '待分配'} : ${form.port || '待确认'}`], ['数据库', `${form.databaseType || '不使用或待确认'} ${form.databaseVersion}`], ['测试与上线', `${form.testResult} / ${form.launchConfirmation}`]].map(([label, value]) => <div className="rounded-xl border border-line p-4" key={label}><p className="text-xs text-muted">{label}</p><p className="mt-2 text-sm font-medium text-ink">{value}</p></div>)}</div><div className="mt-6 flex gap-3"><Button icon={<Download size={16} />} onClick={() => downloadFile(`${form.appName || '应用'}-接入清单.json`, JSON.stringify(form, null, 2), 'application/json')}>下载 JSON</Button><Button variant="secondary" icon={<Download size={16} />} onClick={() => downloadFile(`${form.appName || '应用'}-接入清单.md`, toMarkdown(form), 'text/markdown;charset=utf-8')}>下载 Markdown</Button><Button variant="ghost" onClick={onClose}>完成</Button></div></div>
  return (
    <div>
      <div className="thin-scrollbar mb-7 overflow-x-auto pb-2"><div className="flex min-w-[640px] items-center">{steps.map((title, index) => <div className="contents" key={title}><button onClick={() => index <= step && setStep(index)} className="group flex min-w-[112px] flex-col items-center gap-2"><span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-semibold transition ${index <= step ? 'bg-brand text-white' : 'bg-canvas text-muted'}`}>{index < step ? <Check size={16} /> : index + 1}</span><span className={`text-xs ${index === step ? 'font-semibold text-brand' : 'text-muted'}`}>{title}</span></button>{index < steps.length - 1 && <span className={`mb-6 h-px flex-1 ${index < step ? 'bg-brand' : 'bg-line'}`} />}</div>)}</div></div>
      <div className="rounded-2xl bg-canvas/60 p-6">
        {step === 0 && <div className="grid grid-cols-2 gap-5"><Field label="应用名称" name="appName" value={form.appName} onChange={change} required error={errors.appName} placeholder="请输入正式业务名称" /><Field label="建设单位" name="organization" value={form.organization} onChange={change} required error={errors.organization} placeholder="请输入单位全称" /><Field label="应用负责人" name="appOwner" value={form.appOwner} onChange={change} required error={errors.appOwner} placeholder="姓名及联系方式" /><Field label="技术联系人" name="technicalContact" value={form.technicalContact} onChange={change} error={errors.technicalContact} placeholder="姓名及联系方式" /><Field label="应用类型" name="appType" value={form.appType} onChange={change} options={['研发管理', '测试分析', '质量评价', '科研软件', '其他']} /><Field label="当前部署方式" name="deploymentMode" value={form.deploymentMode} onChange={change} options={['本地服务器', '本地工作站', '私有云', '公有云', '尚未部署']} /><Field label="是否已有 Web 端" name="hasWeb" value={form.hasWeb} onChange={change} options={['是', '否', '改造中']} /><Field label="是否使用数据库" name="usesDatabase" value={form.usesDatabase} onChange={change} options={['是', '否', '待确认']} /></div>}
        {step === 1 && <div className="grid grid-cols-2 gap-5"><Field label="操作系统" name="os" value={form.os} onChange={change} required error={errors.os} placeholder="例如 Ubuntu 22.04 / Windows Server" /><Field label="运行环境" name="runtime" value={form.runtime} onChange={change} required error={errors.runtime} placeholder="例如 Java 17、Python 3.11、Node.js" /><Field label="依赖包" name="dependencies" value={form.dependencies} onChange={change} placeholder="列出主要依赖及版本" /><Field label="启动方式" name="startCommand" value={form.startCommand} onChange={change} placeholder="服务、脚本或容器启动说明" /><Field label="CPU" name="cpu" value={form.cpu} onChange={change} placeholder="例如 8 核" /><Field label="内存" name="memory" value={form.memory} onChange={change} placeholder="例如 16 GB" /><Field label="存储" name="storage" value={form.storage} onChange={change} placeholder="例如 500 GB" /><Field label="GPU" name="gpu" value={form.gpu} onChange={change} placeholder="无 / 型号与显存" /><Field label="是否支持容器" name="supportsContainer" value={form.supportsContainer} onChange={change} options={['支持 Docker', '支持 Kubernetes', '不支持', '待确认']} /></div>}
        {step === 2 && <div className="grid grid-cols-2 gap-5"><Field label="是否需要外网" name="needsInternet" value={form.needsInternet} onChange={change} required error={errors.needsInternet} options={['是', '否', '仅安装阶段需要']} /><Field label="统一认证" name="sso" value={form.sso} onChange={change} required error={errors.sso} options={['需要', '不需要', '待确认']} /><Field label="源 IP" name="sourceIp" value={form.sourceIp} onChange={change} required error={errors.sourceIp} placeholder="可填写网段或待分配" /><Field label="目标 IP" name="targetIp" value={form.targetIp} onChange={change} required error={errors.targetIp} placeholder="可填写域名、IP 或待分配" /><Field label="端口" name="port" value={form.port} onChange={change} required error={errors.port} placeholder="例如 443、5432" /><Field label="通信协议" name="protocol" value={form.protocol} onChange={change} required error={errors.protocol} options={['HTTPS', 'HTTP', 'TCP', 'SFTP', 'MQTT', 'OPC UA', '其他']} /></div>}
        {step === 3 && <div className="grid grid-cols-2 gap-5"><Field label="数据库类型" name="databaseType" value={form.databaseType} onChange={change} required={form.usesDatabase !== '否'} error={errors.databaseType} options={['PostgreSQL', 'MySQL', 'SQL Server', 'Oracle', 'SQLite', '不使用数据库', '其他']} />{form.usesDatabase !== '否' && form.databaseType !== '不使用数据库' && <Field label="数据库版本" name="databaseVersion" value={form.databaseVersion} onChange={change} required error={errors.databaseVersion} placeholder="填写具体版本" />}<Field label="接口类型" name="apiType" value={form.apiType} onChange={change} required error={errors.apiType} options={['REST API', 'WebSocket', '消息队列', '数据库视图', '文件交换', '暂无接口']} />{form.apiType !== '暂无接口' && <Field label="API 地址" name="apiUrl" value={form.apiUrl} onChange={change} required error={errors.apiUrl} placeholder="可填写联调地址或待分配" />}<Field label="文件传输方式" name="transferMethod" value={form.transferMethod} onChange={change} required error={errors.transferMethod} options={['API接口', 'SFTP', '对象存储', '人工上传', '不涉及']} /><Field label="数据更新频率" name="updateFrequency" value={form.updateFrequency} onChange={change} placeholder="实时 / 每日 / 按试验批次" /></div>}
        {step === 4 && <div className="grid grid-cols-2 gap-5"><Field label="测试结果" name="testResult" value={form.testResult} onChange={change} required error={errors.testResult} options={['待测试', '通过', '有条件通过', '未通过']} /><Field label="上线确认" name="launchConfirmation" value={form.launchConfirmation} onChange={change} required error={errors.launchConfirmation} options={['待确认', '同意上线', '暂缓上线']} /><div className="col-span-2"><Field label="问题记录" name="issueLog" value={form.issueLog} onChange={change} type="textarea" placeholder="记录当前问题、责任人和计划完成时间" /></div></div>}
      </div>
      <div className="mt-6 flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-muted"><Save size={16} />草稿已自动保存</span><div className="flex gap-3">{step > 0 && <Button variant="secondary" icon={<ChevronLeft size={17} />} onClick={() => { setErrors({}); setStep((value) => value - 1) }}>上一步</Button>}{step < steps.length - 1 ? <Button onClick={nextStep}>下一步<ChevronRight size={17} /></Button> : <Button onClick={finish}>生成应用接入清单<Check size={17} /></Button>}</div></div>
    </div>
  )
}
