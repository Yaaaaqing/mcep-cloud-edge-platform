import { Activity, AppWindow, ArrowRight, CheckCircle2, Cpu, Database, FileCode2, Link2, ServerCog } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { Button } from '../components/ui/Button'
import { deliveryRoadmap } from '../data/platform'
import { useData } from '../hooks/useData'
import type { DataResource, EdgeNode, HomeContent, MonitorRecord, PlatformApp } from '../types'

export function HomePage() {
  const navigate = useNavigate()
  const { data: apps } = useData<PlatformApp[]>('apps')
  const { data: resources } = useData<DataResource[]>('resources')
  const { data: edgeNodes } = useData<EdgeNode[]>('edgeNodes')
  const { data: monitors } = useData<MonitorRecord[]>('monitors')
  const { data: home } = useData<HomeContent>('homeContent')
  const edgeGroups = new Set(edgeNodes.map((node) => node.groupId).filter(Boolean)).size
  const integratedResources = resources.filter((resource) => resource.status !== '待接入').length
  const monitoredTargets = monitors.filter((item) => !item.isDemo && item.checkSource !== '待接入自动监测' && item.lastCheckedAt !== '尚未接入').length
  const kpis = [
    { label: '已登记应用', value: apps.length, icon: AppWindow, accent: 'blue' as const },
    { label: '已接入数据资源', value: integratedResources, icon: Database, accent: 'cyan' as const },
    { label: '边缘节点组', value: edgeGroups, icon: Cpu, accent: 'blue' as const },
    { label: '待评估软件', value: apps.filter((app) => app.xinchuangStatus === '待评估').length, icon: Activity, accent: 'orange' as const },
    { label: '已接入运行监测', value: monitoredTargets, icon: Link2, accent: 'green' as const },
  ]
  const achievements = [
    { title: '数控系统配置清单管理平台', tag: '应用入口', description: '业务应用已登记，展示统一入口、认证与运行维护信息。', icon: AppWindow, route: '/apps?app=app-001' },
    { title: '关键功能部件动态特性辨识软件', tag: '高校软件评估', description: '记录大连理工大学软件形态、Python 环境与待评估部署条件。', icon: ServerCog, route: '/apps?app=uni-dlut-dynamics' },
    { title: 'SINUMERIK 伺服 Trace 数据', tag: '真实数据资源', description: '保留原始 XML，提供稀疏数据复原、统计、曲线预览与标准化下载。', icon: FileCode2, route: '/data' },
    { title: '六组边缘设备建设台账', tag: '云边协同基础', description: '登记 6 台计算设备与 6 台存储设备，当前均不虚构在线状态。', icon: Cpu, route: '/edge' },
  ]

  return (
    <>
      <section className="mesh-bg border-b border-line/70">
        <div className="page-shell grid items-center gap-8 py-10 lg:min-h-[530px] lg:grid-cols-[minmax(0,52fr)_minmax(0,48fr)] lg:gap-6 lg:py-12 xl:min-h-[580px] xl:gap-10 xl:py-16">
          <div className="min-w-0 pr-2">
            <p className="text-sm font-semibold tracking-[.08em] text-brand">MCEP高端机床云边协同应用平台</p>
            <h1 className="mt-5 whitespace-pre-line break-keep text-[29px] font-semibold leading-[1.23] tracking-[-.035em] text-ink sm:text-[34px] xl:text-[42px] 2xl:text-[52px]">{home.heroTitle}</h1>
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
          <div className="relative flex min-w-0 items-center justify-center rounded-[22px] border border-white/80 bg-white/70 p-2 shadow-[0_22px_70px_rgba(36,107,253,.10)] backdrop-blur sm:p-3 xl:p-5">
            <img src={`${import.meta.env.BASE_URL}brand/home-architecture.png`} alt="MCEP 云端平台、工业应用、数据资源、边缘节点与机床设备协同架构图" className="h-auto max-h-[460px] w-full object-contain" />
            <img src={`${import.meta.env.BASE_URL}brand/mcep-origin-mark.svg`} alt="MCEP初始设计标记" className="absolute bottom-5 right-5 hidden h-8 w-auto opacity-40 min-[1180px]:block xl:h-9" />
          </div>
        </div>
      </section>

      <section className="page-shell relative z-10 mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:-mt-6 lg:grid-cols-3 min-[1400px]:grid-cols-5 xl:gap-5">
        {kpis.map((item) => <StatCard key={item.label} label={item.label} value={item.value} icon={item.icon} accent={item.accent} />)}
      </section>

      <section className="page-shell py-16 xl:py-20">
        <PageHeader eyebrow="重点建设内容" title="围绕软件、数据与边缘设备形成可交付台账" description="平台当前聚焦成果登记、技术评估、数据接入和监测配置，不用演示数据替代生产运行结论。" actions={<Button variant="secondary" onClick={() => navigate('/apps')}>查看全部应用<ArrowRight size={16} /></Button>} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 min-[1400px]:grid-cols-4 2xl:gap-6">{achievements.map(({ title, tag, description, icon: Icon, route }) => <article className="card flex h-full flex-col p-5 sm:p-6" key={title}><span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand/10 to-cyan/15 text-brand"><Icon size={23} /></span><p className="mt-5 text-xs font-semibold tracking-wide text-brand">{tag}</p><h3 className="mt-2 text-lg font-semibold leading-7 text-ink">{title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-muted">{description}</p><Button variant="secondary" className="mt-5 w-full" onClick={() => navigate(route)}>查看详情<ArrowRight size={16} /></Button></article>)}</div>
      </section>

      <section className="border-y border-line bg-white py-16 xl:py-20">
        <div className="page-shell">
          <PageHeader eyebrow="交付推进路径" title="围绕工程化交付明确五项建设任务" description="以真实台账持续补充技术评估、部署实施、数据接入与运行验收信息。" />
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
