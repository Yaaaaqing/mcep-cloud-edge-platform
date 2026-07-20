import { Bell, ChevronDown, CircleHelp, LogOut, Menu, Settings, ShieldCheck, UserRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'

const navItems = [
  ['/', '首页'], ['/apps', '应用中心'], ['/data', '数据中心'], ['/access', '接入中心'], ['/edge', '边缘节点'], ['/monitor', '运行监测'],
]

export function Header({ onOpenAbout }: { onOpenAbout: () => void }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [messagesOpen, setMessagesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileOpen(false) }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [mobileOpen])

  return <>
    <header className="sticky top-0 z-50 border-b border-line/90 bg-white/95 backdrop-blur-xl">
      <div className="page-shell flex h-[60px] items-center justify-between gap-3 min-[1100px]:h-[72px]">
        <NavLink to="/" className="focus-ring flex shrink-0 items-center rounded-lg" aria-label="MCEP高端机床云边协同应用平台">
          <span className="hidden sm:block"><BrandLogo variant="full" /></span>
          <span className="block sm:hidden"><BrandLogo variant="compact" /></span>
        </NavLink>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 min-[1100px]:flex min-[1280px]:gap-1">
          {navItems.map(([path, label]) => (
            <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => `focus-ring whitespace-nowrap rounded-xl px-2 py-2.5 text-[13px] font-medium transition min-[1280px]:px-2.5 min-[1440px]:px-3 min-[1440px]:text-sm ${isActive ? 'bg-brand/8 text-brand' : 'text-muted hover:bg-canvas hover:text-ink'}`}>{label}</NavLink>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-1 min-[1100px]:flex">
          <NavLink to="/docs" className="focus-ring flex items-center gap-1.5 rounded-xl p-2.5 text-sm text-muted hover:bg-canvas hover:text-ink"><CircleHelp size={18} /><span className="hidden min-[1440px]:inline">帮助文档</span></NavLink>
          <div className="relative">
            <button className="focus-ring rounded-xl p-2.5 text-muted hover:bg-canvas" aria-label="消息" onClick={() => { setMessagesOpen((value) => !value); setUserMenuOpen(false) }}><Bell size={19} /></button>
            {messagesOpen && <div className="absolute right-0 top-12 w-72 rounded-2xl border border-line bg-white p-4 shadow-xl"><p className="text-sm font-semibold text-ink">平台消息</p><p className="mt-2 text-sm leading-6 text-muted">当前没有新的平台消息。联调进度请以各应用详情和运行监测台账为准。</p></div>}
          </div>
          <div className="relative">
            <button className="focus-ring flex items-center gap-2 rounded-xl p-1.5 pr-2 text-sm hover:bg-canvas" onClick={() => { setUserMenuOpen((value) => !value); setMessagesOpen(false) }}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand to-cyan text-xs font-semibold text-white">雅</span>
              <span className="hidden font-medium text-ink min-[1280px]:inline">雅青</span><ChevronDown size={15} className="hidden text-muted min-[1280px]:block" />
            </button>
            {userMenuOpen && <div className="absolute right-0 top-12 w-52 rounded-2xl border border-line bg-white p-2 shadow-xl"><div className="border-b border-line px-3 py-2.5"><p className="text-sm font-semibold text-ink">雅青</p><p className="mt-1 flex items-center gap-1 text-xs text-brand"><ShieldCheck size={13} />平台管理员</p></div><NavLink to="/admin" onClick={() => setUserMenuOpen(false)} className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-text hover:bg-canvas"><Settings size={16} />管理端</NavLink><button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-canvas" onClick={() => { window.alert('雅青｜流控所｜平台管理员'); setUserMenuOpen(false) }}><UserRound size={16} />个人信息</button><button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-canvas" onClick={() => { window.alert('当前为配置演示环境，不提供账号登录与退出。'); setUserMenuOpen(false) }}><LogOut size={16} />退出登录</button></div>}
          </div>
        </div>

        <button className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line text-ink min-[1100px]:hidden" onClick={() => setMobileOpen(true)} aria-label="打开导航菜单" aria-expanded={mobileOpen}><Menu size={22} /></button>
      </div>

    </header>

    {mobileOpen && createPortal(<div className="fixed inset-x-0 bottom-0 top-[60px] z-[70] min-[1100px]:hidden" role="dialog" aria-modal="true" aria-label="移动端导航菜单">
        <button className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} aria-label="关闭导航菜单" />
        <aside className="absolute bottom-0 right-0 top-0 flex w-[min(88vw,360px)] flex-col overflow-y-auto bg-white p-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-line pb-4"><p className="font-semibold text-ink">平台导航</p><button className="focus-ring grid h-9 w-9 place-items-center rounded-xl text-muted hover:bg-canvas" onClick={() => setMobileOpen(false)} aria-label="关闭导航菜单"><X size={20} /></button></div>
          <nav className="mt-4 space-y-1">{[...navItems, ['/docs', '帮助文档']].map(([path, label]) => <NavLink key={path} to={path} end={path === '/'} onClick={() => setMobileOpen(false)} className={({ isActive }) => `focus-ring flex items-center rounded-xl px-4 py-3 text-sm font-medium ${isActive ? 'bg-brand/8 text-brand' : 'text-text hover:bg-canvas'}`}>{label}</NavLink>)}</nav>
          <button className="focus-ring mt-1 flex items-center rounded-xl px-4 py-3 text-left text-sm font-medium text-text hover:bg-canvas" onClick={() => { setMobileOpen(false); onOpenAbout() }}>关于 MCEP</button>
          <div className="mt-auto rounded-2xl bg-canvas p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand to-cyan text-sm font-semibold text-white">雅</span><div><p className="text-sm font-semibold text-ink">雅青</p><p className="mt-0.5 text-xs text-muted">平台管理员</p></div></div><NavLink to="/admin" onClick={() => setMobileOpen(false)} className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-sm text-brand"><Settings size={16} />进入管理端</NavLink></div>
        </aside>
      </div>, document.body)}
  </>
}
