import { Bell, ChevronDown, CircleHelp, LogOut, Settings, ShieldCheck, UserRound } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  ['/', '首页'], ['/apps', '应用中心'], ['/data', '数据中心'], ['/access', '接入中心'], ['/edge', '边缘节点'], ['/monitor', '运行监测'],
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [messagesOpen, setMessagesOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 border-b border-line/90 bg-white/90 backdrop-blur-xl">
      <div className="page-shell flex h-[70px] items-center gap-2 xl:gap-4 2xl:gap-6">
        <NavLink to="/" className="flex shrink-0 items-center gap-2.5 xl:gap-3" aria-label="MCEP 首页">
          <img src={`${import.meta.env.BASE_URL}brand/mcep-symbol.png`} alt="" className="h-auto w-12 object-contain xl:w-[58px]" />
          <strong className="text-xl font-bold tracking-[.04em] text-ink xl:text-2xl">MCEP</strong>
        </NavLink>
        <nav className="flex min-w-0 flex-1 items-center justify-center gap-0.5 xl:gap-1">
          {navItems.map(([path, label]) => (
            <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => `focus-ring whitespace-nowrap rounded-xl px-1.5 py-2.5 text-xs font-medium transition xl:px-2.5 xl:text-[13px] 2xl:px-3 2xl:text-sm ${isActive ? 'bg-brand/8 text-brand' : 'text-muted hover:bg-canvas hover:text-ink'}`}>{label}</NavLink>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-0.5 xl:gap-1.5">
          <NavLink to="/docs" className="focus-ring flex items-center gap-1.5 rounded-xl p-2.5 text-sm text-muted hover:bg-canvas hover:text-ink"><CircleHelp size={18} /><span className="hidden 2xl:inline">帮助文档</span></NavLink>
          <div className="relative">
            <button className="focus-ring rounded-xl p-2.5 text-muted hover:bg-canvas" aria-label="消息" onClick={() => { setMessagesOpen((value) => !value); setMenuOpen(false) }}><Bell size={19} /></button>
            {messagesOpen && <div className="absolute right-0 top-12 w-72 rounded-2xl border border-line bg-white p-4 shadow-xl"><p className="text-sm font-semibold text-ink">平台消息</p><p className="mt-2 text-sm leading-6 text-muted">当前没有新的平台消息。联调进度请以各应用详情和运行监测台账为准。</p></div>}
          </div>
          <div className="relative ml-1">
            <button className="focus-ring flex items-center gap-2 rounded-xl p-1.5 pr-2 text-sm hover:bg-canvas" onClick={() => { setMenuOpen((value) => !value); setMessagesOpen(false) }}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand to-cyan text-xs font-semibold text-white">雅</span>
              <span className="hidden font-medium text-ink xl:inline">雅青</span><ChevronDown size={15} className="hidden text-muted xl:block" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-12 w-52 rounded-2xl border border-line bg-white p-2 shadow-xl">
                <div className="border-b border-line px-3 py-2.5"><p className="text-sm font-semibold text-ink">雅青</p><p className="mt-1 flex items-center gap-1 text-xs text-brand"><ShieldCheck size={13} />平台管理员</p></div>
                <NavLink to="/admin" onClick={() => setMenuOpen(false)} className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-text hover:bg-canvas"><Settings size={16} />演示管理端</NavLink>
                <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-canvas" onClick={() => { window.alert('雅青｜流控所｜平台管理员'); setMenuOpen(false) }}><UserRound size={16} />个人信息</button>
                <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-canvas" onClick={() => { window.alert('当前为公开演示环境，不提供账号登录与退出。'); setMenuOpen(false) }}><LogOut size={16} />退出登录</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
