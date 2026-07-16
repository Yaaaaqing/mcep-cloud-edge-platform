import { Box, Cloud, Cpu, Database, MonitorCog } from 'lucide-react'

const nodes = [
  { label: '云端平台', icon: Cloud, position: 'left-[39%] top-5', active: true },
  { label: '工业应用', icon: Box, position: 'left-[5%] top-[42%]' },
  { label: '数据资源', icon: Database, position: 'right-[5%] top-[42%]' },
  { label: '边缘节点', icon: Cpu, position: 'left-[22%] bottom-5' },
  { label: '机床设备', icon: MonitorCog, position: 'right-[22%] bottom-5' },
]

export function ArchitectureDiagram() {
  return (
    <div className="relative h-[360px] overflow-hidden rounded-[24px] border border-white/70 bg-white/75 shadow-[0_24px_80px_rgba(36,107,253,.12)] backdrop-blur">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(36,107,253,.08)_0,transparent_58%)]" />
      <div className="absolute left-[23%] top-[30%] h-px w-[53%] rotate-[16deg] bg-gradient-to-r from-brand/10 via-brand/50 to-cyan/20" />
      <div className="absolute left-[23%] top-[52%] h-px w-[53%] -rotate-[16deg] bg-gradient-to-r from-cyan/20 via-brand/50 to-brand/10" />
      <div className="absolute left-1/2 top-[23%] h-[54%] w-px bg-gradient-to-b from-brand/60 via-cyan/50 to-brand/20" />
      <div className="absolute left-[25%] top-[58%] h-px w-1/2 bg-gradient-to-r from-brand/20 via-cyan/70 to-brand/20" />
      {nodes.map(({ label, icon: Icon, position, active }) => (
        <div key={label} className={`absolute ${position} z-10 flex w-28 flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center shadow-sm ${active ? 'border-brand/20 bg-gradient-to-br from-brand to-[#1750c9] text-white' : 'border-line bg-white text-ink'}`}>
          <Icon size={22} strokeWidth={1.8} />
          <span className="text-sm font-medium">{label}</span>
        </div>
      ))}
      <span className="absolute left-[51%] top-[46%] h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_0_6px_rgba(36,205,227,.12)]" />
    </div>
  )
}
