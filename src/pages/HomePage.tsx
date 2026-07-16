import { Activity, AppWindow, ArrowRight, CheckCircle2, Cpu, Database, Link2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppCard } from '../components/AppCard'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { Button } from '../components/ui/Button'
import { deliveryRoadmap } from '../data/platform'
import { useData } from '../hooks/useData'
import type { DataResource, EdgeNode, HomeContent, PlatformApp } from '../types'

export function HomePage() {
  const navigate = useNavigate()
  const { data: apps } = useData<PlatformApp[]>('apps')
  const { data: resources } = useData<DataResource[]>('resources')
  const { data: edgeNodes } = useData<EdgeNode[]>('edgeNodes')
  const { data: home } = useData<HomeContent>('homeContent')
  const featured = apps.filter((app) => app.featured).slice(0, 3)
  const onlineEdges = edgeNodes.filter((node) => node.status === '在线').length
  const kpis = [
    { label: '已接入应用', value: apps.filter((app) => app.accessStatus === '已接入').length, icon: AppWindow, accent: 'green' as const },
    { label: '联调中应用', value: apps.filter((app) => app.operationStatus === '联调中').length, icon: Activity, accent: 'blue' as const },
    { label: '技术对接中', value: apps.filter((app) => app.accessStatus === '技术对接中').length, icon: Link2, accent: 'orange' as const },
    { label: '数据资源', value: resources.length, icon: Database, accent: 'cyan' as const },
    { label: '边缘节点', value: onlineEdges ? `${onlineEdges} 在线` : '规划建设中', icon: Cpu, accent: 'blue' as const },
  ]

  return (
    <>
      <section className="mesh-bg border-b border-line/70">
        <div className="page-shell grid min-h-[530px] grid-cols-[minmax(0,52fr)_minmax(0,48fr)] items-center gap-6 py-12 xl:min-h-[580px] xl:gap-10 xl:py-16">
          <div className="min-w-0 pr-2">
            <p className="text-sm font-semibold tracking-[.08em] text-brand">MCEP｜高端机床云边协同应用平台</p>
            <h1 className="mt-5 whitespace-pre-line break-keep text-[32px] font-semibold leading-[1.23] tracking-[-.035em] text-ink xl:text-[42px] 2xl:text-[52px]">{home.heroTitle}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted xl:text-lg xl:leading-8">{home.heroDescription}</p>
            <div className="mt-7 flex flex-wrap gap-3 xl:mt-9">
              <Button className="h-12 px-5 xl:px-6" icon={<ArrowRight size={18} />} onClick={() => navigate('/apps')}>进入应用中心</Button>
              <Button className="h-12 px-5 xl:px-6" variant="secondary" icon={<Link2 size={18} />} onClick={() => navigate('/access')}>查看接入流程</Button>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted xl:mt-9 xl:gap-x-8">
              {['统一入口', '数据协同', '状态可追踪'].map((item) => <span key={item} className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-500" />{item}</span>)}
            </div>
            <p className="mt-6 max-w-xl text-xs leading-5 text-muted/90">{home.announcement}</p>
          </div>
          <div className="flex min-w-0 items-center justify-center rounded-[22px] border border-white/80 bg-white/70 p-3 shadow-[0_22px_70px_rgba(36,107,253,.10)] backdrop-blur xl:p-5">
            <img src={`${import.meta.env.BASE_URL}brand/home-architecture.png`} alt="MCEP 云端平台、工业应用、数据资源、边缘节点与机床设备协同架构图" className="h-auto max-h-[460px] w-full object-contain" />
          </div>
        </div>
      </section>

      <section className="page-shell relative z-10 -mt-6 grid grid-cols-3 gap-4 min-[1400px]:grid-cols-5 xl:gap-5">
        {kpis.map((item) => <StatCard key={item.label} label={item.label} value={item.value} icon={item.icon} accent={item.accent} />)}
      </section>

      <section className="page-shell py-16 xl:py-20">
        <PageHeader eyebrow="重点建设成果" title="典型应用接入取得阶段性成果" description="以两个已接入应用、一个联调应用和高校软件试点验证平台的应用、数据与协同链路。" actions={<Button variant="secondary" onClick={() => navigate('/apps')}>查看全部应用<ArrowRight size={16} /></Button>} />
        <div className="grid grid-cols-3 gap-5 2xl:gap-6">{featured.map((app) => <AppCard key={app.id} app={app} onAction={() => navigate(`/apps?app=${app.id}`)} />)}</div>
      </section>

      <section className="border-y border-line bg-white py-16 xl:py-20">
        <div className="page-shell">
          <PageHeader eyebrow="9.30 交付倒排" title="围绕最终交付明确五个关键节点" description="按流程、试点、边缘节点、数据验证和最终交付逐项收口，确保阶段成果可检查、可演示。" />
          <div className="relative grid gap-4 min-[1400px]:grid-cols-5 min-[1400px]:gap-0">
            <div className="absolute left-[10%] right-[10%] top-6 hidden h-px bg-gradient-to-r from-brand/20 via-brand/60 to-cyan/40 min-[1400px]:block" />
            {deliveryRoadmap.map((item, index) => <div className="relative flex items-center gap-4 rounded-2xl border border-line bg-canvas/60 p-5 min-[1400px]:flex-col min-[1400px]:border-0 min-[1400px]:bg-transparent min-[1400px]:p-0 min-[1400px]:text-center" key={item.title}>
              <span className={`z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border-[7px] border-white text-sm font-semibold shadow-sm ${index === deliveryRoadmap.length - 1 ? 'bg-gradient-to-br from-brand to-cyan text-white' : 'bg-brand text-white'}`}>{index + 1}</span>
              <div className="min-[1400px]:mt-5"><h3 className="font-semibold text-ink">{item.title}</h3><p className="mt-1.5 text-sm font-medium text-brand">{item.date}</p></div>
            </div>)}
          </div>
        </div>
      </section>
    </>
  )
}
