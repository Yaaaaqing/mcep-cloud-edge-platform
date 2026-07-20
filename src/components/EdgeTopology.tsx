import { Cloud, Cpu, MoveRight, Settings } from 'lucide-react'

const topology = [
  { title: 'MCEP 云端平台', sub: '应用与数据统一管理', icon: Cloud, tone: 'bg-brand text-white' },
  { title: '边缘节点', sub: '协议适配与任务协同', icon: Cpu, tone: 'bg-white text-brand' },
  { title: '机床设备', sub: '试验台与采集对象', icon: Settings, tone: 'bg-white text-brand' },
]

export function EdgeTopology() {
  return (
    <div className="mesh-bg card flex flex-col items-stretch justify-between gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-6 xl:p-8">
      {topology.map(({ title, sub, icon: Icon, tone }, index) => (
        <div className="contents" key={title}>
          <div className={`flex w-full items-center gap-4 rounded-2xl border border-line/80 p-4 shadow-sm sm:min-w-0 sm:flex-1 sm:p-5 ${tone}`}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-current/10"><Icon size={22} /></span>
            <div><p className="font-semibold">{title}</p><p className={`mt-1 text-xs ${index === 0 ? 'text-white/70' : 'text-muted'}`}>{sub}</p></div>
          </div>
          {index < topology.length - 1 && <MoveRight className="self-center shrink-0 rotate-90 text-brand/50 sm:rotate-0" size={24} />}
        </div>
      ))}
    </div>
  )
}
