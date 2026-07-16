import type { LucideIcon } from 'lucide-react'

export function StatCard({ label, value, note, icon: Icon, accent = 'blue' }: { label: string; value: string | number; note?: string; icon?: LucideIcon; accent?: 'blue' | 'cyan' | 'green' | 'orange' }) {
  const accents = {
    blue: 'bg-blue-50 text-brand', cyan: 'bg-cyan-50 text-cyan-600', green: 'bg-emerald-50 text-emerald-600', orange: 'bg-orange-50 text-orange-600',
  }
  return (
    <div className="card flex items-center justify-between p-5">
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">{value}</p>
        {note && <p className="mt-1 text-xs text-muted">{note}</p>}
      </div>
      {Icon && <span className={`grid h-12 w-12 place-items-center rounded-2xl ${accents[accent]}`}><Icon size={22} /></span>}
    </div>
  )
}
