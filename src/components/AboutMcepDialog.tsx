import { useEffect, useState } from 'react'
import { runtimeConfig } from '../services/runtimeConfig'
import { Modal } from './Modal'

type BuildInfo = {
  applicationName: string
  version: string
  gitCommit: string
  buildTime: string
  dataMode: string
  basePath: string
  initialProductDesigner: string
  initialReleaseYear: number
}

export function AboutMcepDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null)

  useEffect(() => {
    let active = true
    void fetch(`${import.meta.env.BASE_URL}build-info.json`)
      .then((response) => response.ok ? response.json() as Promise<BuildInfo> : Promise.reject(new Error('build-info unavailable')))
      .then((value) => { if (active) setBuildInfo(value) })
      .catch(() => undefined)
    return () => { active = false }
  }, [])

  const details = [
    ['软件版本', buildInfo?.version ?? 'V1.0'],
    ['Git Commit', buildInfo?.gitCommit ?? runtimeConfig.gitCommit],
    ['构建时间', buildInfo?.buildTime ? new Date(buildInfo.buildTime).toLocaleString('zh-CN') : new Date(runtimeConfig.buildTime).toLocaleString('zh-CN')],
    ['数据模式', (buildInfo?.dataMode ?? runtimeConfig.dataMode) === 'mock' ? '示例数据模式' : 'API 数据模式'],
    ['Base Path', buildInfo?.basePath ?? runtimeConfig.basePath],
  ]

  return <Modal open={open} onClose={onClose} title="关于 MCEP" description="平台定位、贡献信息与当前构建版本" width="max-w-3xl">
    <div className="space-y-6">
      <section><p className="text-xs font-semibold uppercase tracking-widest text-brand">平台名称</p><h3 className="mt-2 text-xl font-semibold text-ink">MCEP高端机床云边协同应用平台</h3><p className="mt-3 text-sm leading-7 text-muted">面向机床动态性能软件成果的统一接入、数据汇聚、边缘协同与运行管理平台。</p></section>
      <section className="rounded-2xl border border-line bg-canvas/50 p-5"><p className="text-xs font-semibold uppercase tracking-widest text-brand">贡献信息</p><p className="mt-3 text-sm leading-7 text-ink">初始产品策划、总体架构、交互设计及前端原型研发：王雅青</p><p className="text-sm leading-7 text-muted">所属单位：控制与流体技术研究所</p><p className="text-sm leading-7 text-muted">初始版本：V1.0</p></section>
      <section><p className="text-xs font-semibold uppercase tracking-widest text-brand">权属说明</p><p className="mt-2 text-sm leading-7 text-muted">本项目软件成果及相关知识产权归所属公司所有。</p></section>
      <section><p className="text-xs font-semibold uppercase tracking-widest text-brand">版本信息</p><dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">{details.map(([label, value]) => <div className="rounded-xl border border-line px-4 py-3" key={label}><dt className="text-xs text-muted">{label}</dt><dd className="mt-1.5 break-words font-mono text-sm text-ink">{value}</dd></div>)}</dl></section>
    </div>
  </Modal>
}
