import { Cloud, Cpu, MoveRight, Router, Settings } from 'lucide-react'

const topology = [
  { title: 'MCEP 云端平台', sub: '应用与数据统一管理', icon: Cloud, tone: 'bg-brand text-white' },
  { title: '边缘节点', sub: '协议适配与任务协同', icon: Cpu, tone: 'bg-white text-brand' },
  { title: '工业网络', sub: 'OPC UA · MQTT · HTTPS', icon: Router, tone: 'bg-white text-brand' },
  { title: '机床设备', sub: '试验台与采集对象', icon: Settings, tone: 'bg-white text-brand' },
]

export function EdgeTopology() {
  return (
    <div className="mesh-bg card flex items-center justify-between gap-4 p-8">
      {topology.map(({ title, sub, icon: Icon, tone }, index) => (
        <div className="contents" key={title}>
          <div className={`flex min-w-48 items-center gap-4 rounded-2xl border border-line/80 p-5 shadow-sm ${tone}`}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-current/10"><Icon size={22} /></span>
            <div><p className="font-semibold">{title}</p><p className={`mt-1 text-xs ${index === 0 ? 'text-white/70' : 'text-muted'}`}>{sub}</p></div>
          </div>
          {index < topology.length - 1 && <MoveRight className="shrink-0 text-brand/50" size={24} />}
        </div>
      ))}
    </div>
  )
}
