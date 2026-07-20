import type { ReactNode } from 'react'

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-col items-start justify-between gap-5 min-[900px]:flex-row min-[900px]:items-end xl:gap-8">
      <div className="max-w-3xl">
        {eyebrow && <p className="section-kicker">{eyebrow}</p>}
        <h1 className="break-keep text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
        <p className="mt-3 leading-7 text-muted">{description}</p>
      </div>
      {actions && <div className="flex w-full flex-wrap items-center gap-3 min-[900px]:w-auto min-[900px]:shrink-0">{actions}</div>}
    </div>
  )
}
