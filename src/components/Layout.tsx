import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <main><Outlet /></main>
      <footer className="mt-16 border-t border-line bg-white">
        <div className="page-shell flex min-h-24 flex-wrap items-center justify-between gap-4 py-5 text-sm text-muted">
          <div className="flex items-center gap-3"><img src={`${import.meta.env.BASE_URL}brand/mcep-symbol.png`} className="h-8 w-12 object-contain" alt="" /><span>MCEP｜高端机床云边协同应用平台</span></div>
          <span>Machine Tool Cloud-Edge Platform · 演示环境</span>
        </div>
      </footer>
    </div>
  )
}
