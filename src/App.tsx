import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })))
const AppsPage = lazy(() => import('./pages/AppsPage').then((module) => ({ default: module.AppsPage })))
const DataPage = lazy(() => import('./pages/DataPage').then((module) => ({ default: module.DataPage })))
const AccessPage = lazy(() => import('./pages/AccessPage').then((module) => ({ default: module.AccessPage })))
const EdgePage = lazy(() => import('./pages/EdgePage').then((module) => ({ default: module.EdgePage })))
const MonitorPage = lazy(() => import('./pages/MonitorPage').then((module) => ({ default: module.MonitorPage })))
const DocsPage = lazy(() => import('./pages/DocsPage').then((module) => ({ default: module.DocsPage })))
const AdminPage = lazy(() => import('./pages/AdminPage').then((module) => ({ default: module.AdminPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))

export default function App() {
  return <BrowserRouter basename={import.meta.env.BASE_URL}><Suspense fallback={<div className="page-shell grid min-h-[70vh] place-items-center"><div className="text-center"><span className="mx-auto block h-9 w-9 animate-spin rounded-full border-2 border-line border-t-brand" /><p className="mt-4 text-sm text-muted">正在加载平台页面…</p></div></div>}><Routes><Route element={<Layout />}><Route path="/" element={<HomePage />} /><Route path="/apps" element={<AppsPage />} /><Route path="/data" element={<DataPage />} /><Route path="/access" element={<AccessPage />} /><Route path="/edge" element={<EdgePage />} /><Route path="/monitor" element={<MonitorPage />} /><Route path="/docs" element={<DocsPage />} /><Route path="/admin" element={<AdminPage />} /><Route path="*" element={<NotFoundPage />} /></Route></Routes></Suspense></BrowserRouter>
}
