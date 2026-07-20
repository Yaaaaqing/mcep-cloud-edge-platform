import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { versionInfo } from '../services/runtimeConfig'
import { AboutMcepDialog } from './AboutMcepDialog'
import { DataModeNotice } from './DataModeNotice'
import { Header } from './Header'
import { BrandLogo } from './BrandLogo'

export function Layout() {
  const [aboutOpen, setAboutOpen] = useState(false)
  return (
    <div className="min-h-screen bg-canvas">
      <Header onOpenAbout={() => setAboutOpen(true)} />
      <DataModeNotice />
      <main><Outlet /></main>
      <footer className="mt-16 border-t border-line bg-white">
        <div className="page-shell flex min-h-24 flex-col items-start justify-between gap-4 py-5 text-sm text-muted sm:flex-row sm:items-center">
          <BrandLogo variant="compact" className="w-[180px]" />
          <div className="flex flex-wrap items-center gap-2 text-left sm:justify-end sm:text-right"><button className="focus-ring rounded-lg px-2 py-1 text-muted transition hover:bg-canvas hover:text-brand" onClick={() => setAboutOpen(true)}>关于 MCEP</button><span>{versionInfo.softwareVersion} · 构建 {new Date(versionInfo.buildTime).toLocaleString('zh-CN')} · Commit {versionInfo.gitCommit} · {versionInfo.dataMode === 'mock' ? '示例数据' : 'API'} 模式</span></div>
        </div>
      </footer>
      <AboutMcepDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  )
}
