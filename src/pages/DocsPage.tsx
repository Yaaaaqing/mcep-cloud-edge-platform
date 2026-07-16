import { BookOpen, ChevronRight, FileText, Search } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { useData } from '../hooks/useData'
import type { DocumentRecord } from '../types'

export function DocsPage() {
  const { data: documents } = useData<DocumentRecord[]>('documents')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<DocumentRecord | null>(null)
  const filtered = documents.filter((doc) => `${doc.title}${doc.category}${doc.description}`.toLowerCase().includes(search.trim().toLowerCase()))
  return <div className="page-shell py-8 lg:py-10"><PageHeader eyebrow="帮助文档" title="平台使用与接入知识库" description="查阅应用部署、网络认证、数据管理与测试上线相关规范。" /><div className="mesh-bg card mb-8 flex flex-wrap items-center justify-between gap-5 p-7"><div><h2 className="text-xl font-semibold text-ink">需要查找什么？</h2><p className="mt-2 text-sm text-muted">输入业务关键词，快速定位相关文档。</p></div><label className="relative w-full max-w-[460px]"><Search className="absolute left-4 top-3.5 text-muted" size={18} /><input className="input h-12 pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索文档标题、分类或内容" /></label></div>{filtered.length ? <div className="grid grid-cols-2 gap-5">{filtered.map((doc) => <article key={doc.id} className="card group flex gap-5 p-6 transition hover:border-brand/20"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-brand"><FileText size={22} /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold text-brand">{doc.category}</span><span className="text-xs text-muted">更新于 {doc.updatedAt}</span></div><h3 className="mt-2 font-semibold text-ink">{doc.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{doc.description}</p><button className="mt-4 flex items-center gap-1 text-sm font-medium text-brand" onClick={() => setSelected(doc)}>阅读文档<ChevronRight size={16} /></button></div></article>)}</div> : <EmptyState /> }<div className="mt-8 rounded-2xl border border-line bg-white p-6"><div className="flex items-center gap-3"><BookOpen className="text-brand" /><div><h3 className="font-semibold text-ink">文档内容由演示管理端统一维护</h3><p className="mt-1 text-sm text-muted">管理员可以新增、编辑或删除文档目录，修改会同步显示在此页面。</p></div></div></div><Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title ?? ''} description={selected ? `${selected.category} · 更新于 ${selected.updatedAt}` : ''}>{selected && <div><p className="leading-7 text-text">{selected.description}</p><div className="mt-6 rounded-2xl border border-brand/10 bg-brand/[.035] p-5"><h3 className="font-semibold text-ink">文档说明</h3><p className="mt-2 text-sm leading-6 text-muted">当前展示的是演示版文档摘要。正式规范内容将在项目交付阶段按确认版本发布。</p></div></div>}</Modal></div>
}
