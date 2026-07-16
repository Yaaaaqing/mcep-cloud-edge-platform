import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  const navigate = useNavigate()
  return <div className="page-shell grid min-h-[65vh] place-items-center"><div className="text-center"><p className="text-sm font-semibold text-brand">404</p><h1 className="mt-3 text-4xl font-semibold text-ink">页面不存在</h1><p className="mt-4 text-muted">当前地址未匹配平台功能，请返回首页继续使用。</p><Button className="mt-7" icon={<ArrowLeft size={17} />} onClick={() => navigate('/')}>返回首页</Button></div></div>
}
