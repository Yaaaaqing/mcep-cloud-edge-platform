import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export function Modal({ open, onClose, title, description, children, width = 'max-w-4xl' }: { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; width?: string }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/35 p-3 backdrop-blur-sm sm:p-6" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} className={`max-h-[calc(100dvh-24px)] w-[calc(100vw-24px)] ${width} overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:w-full`} onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-4 sm:px-6 sm:py-5">
          <div><h2 className="text-xl font-semibold text-ink">{title}</h2>{description && <p className="mt-1 text-sm text-muted">{description}</p>}</div>
          <button className="focus-ring rounded-lg p-2 text-muted hover:bg-canvas" onClick={onClose} aria-label="关闭"><X size={20} /></button>
        </div>
        <div className="thin-scrollbar max-h-[calc(100dvh-104px)] overflow-y-auto p-4 sm:max-h-[calc(90vh-84px)] sm:p-6">{children}</div>
      </div>
    </div>
  )
}
