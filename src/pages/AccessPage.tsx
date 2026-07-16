import { ArrowRight, FileText, Plus, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { AccessWizard } from '../components/AccessWizard'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/ui/Button'
import { responsibilityMatrix, templateItems } from '../data/platform'
import { downloadFile } from '../utils/download'

export function AccessPage() {
  const [wizardOpen, setWizardOpen] = useState(false)
  return (
    <div className="page-shell py-8 lg:py-10">
      <PageHeader eyebrow="接入中心" title="让每一次应用接入都有标准、有记录、有责任" description="通过结构化申请向导整理应用、部署、网络、认证、数据和测试信息，形成可交付的接入清单。" actions={<><Button variant="secondary" icon={<ShieldCheck size={17} />} onClick={() => document.getElementById('standards')?.scrollIntoView()}>查看接入规范</Button><Button icon={<Plus size={17} />} onClick={() => setWizardOpen(true)}>申请新应用接入</Button></>} />
      <section className="mesh-bg card grid grid-cols-[1.1fr_.9fr] items-center gap-7 p-6 xl:gap-10 xl:p-8">
        <div><span className="inline-flex rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand">五步式标准流程</span><h2 className="mt-5 text-2xl font-semibold leading-tight text-ink xl:text-3xl">从信息确认到测试上线，形成完整接入档案</h2><p className="mt-4 max-w-2xl leading-7 text-muted">表单支持自动保存，完成后可生成 JSON 或 Markdown 清单，并自动进入演示管理端的接入申请台账。</p><Button className="mt-6" variant="secondary" onClick={() => document.getElementById('standards')?.scrollIntoView()}>查看接入说明<ArrowRight size={17} /></Button></div>
        <div className="grid grid-cols-2 gap-4">{[['7', '标准模板'], ['5', '接入步骤'], ['3', '责任主体'], ['2', '导出格式']].map(([value, label]) => <div className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm" key={label}><p className="text-3xl font-semibold text-brand">{value}</p><p className="mt-1 text-sm text-muted">{label}</p></div>)}</div>
      </section>
      <section className="mt-14" id="standards"><div className="flex items-end justify-between"><div><p className="section-kicker">模板入口</p><h2 className="section-title">接入材料与实施记录</h2></div><p className="text-sm text-muted">点击模板可下载 Markdown 示例</p></div><div className="mt-6 grid grid-cols-3 gap-4 2xl:grid-cols-4">{templateItems.map((item, index) => <button key={item} onClick={() => downloadFile(`${item}.md`, `# ${item}\n\n> MCEP 接入模板\n\n请按平台接入规范填写并提交。\n`, 'text/markdown;charset=utf-8')} className="card group flex items-center gap-4 p-5 text-left transition hover:border-brand/30"><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${index % 2 ? 'bg-cyan-50 text-cyan-600' : 'bg-blue-50 text-brand'}`}><FileText size={21} /></span><span className="text-sm font-medium leading-6 text-ink">{item}</span><ArrowRight size={16} className="ml-auto text-line transition group-hover:translate-x-1 group-hover:text-brand" /></button>)}</div></section>
      <section className="mt-14"><div><p className="section-kicker">责任边界</p><h2 className="section-title">明确三方职责，减少实施等待</h2><p className="mt-3 text-muted">责任边界用于接入协调和任务确认，可在具体项目中进一步细化负责人和完成时限。</p></div><div className="card thin-scrollbar mt-6 overflow-x-auto"><table className="min-w-[960px] w-full"><thead className="table-head"><tr><th className="px-5 py-4">工作环节</th><th className="px-5 py-4">应用建设单位</th><th className="px-5 py-4">流控所</th><th className="px-5 py-4">数科公司</th></tr></thead><tbody>{responsibilityMatrix.map((row) => <tr key={row.activity}><td className="table-cell font-semibold text-ink">{row.activity}</td><td className="table-cell leading-6">{row.owner}</td><td className="table-cell leading-6">{row.institute}</td><td className="table-cell leading-6">{row.company}</td></tr>)}</tbody></table></div></section>
      <Modal open={wizardOpen} onClose={() => setWizardOpen(false)} title="申请新应用接入" description="请按实际情况填写；未确定的信息可以明确标注“待确认”。" width="max-w-6xl"><AccessWizard onClose={() => setWizardOpen(false)} /></Modal>
    </div>
  )
}
