import { FolderOpen } from 'lucide-react'
import type { ReactNode } from 'react'

export function EmptyState({ title = '暂无匹配内容', description = '可以调整筛选条件后重新查看。', action }: { title?: string; description?: string; action?: ReactNode }) {
  return (
    <div className="card flex min-h-64 flex-col items-center justify-center p-8 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-canvas text-muted"><FolderOpen size={24} /></span>
      <h3 className="mt-4 font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
