import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { navMeta } from '../../data/revenueData'

export default function AdminLayout({ onLogout }) {
  const { pathname } = useLocation()
  const activePage = pathname.replace(/^\//, '') || 'dashboard'
  const meta = navMeta[activePage] || navMeta.dashboard

  // Scroll to top whenever the route changes.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 min-w-0">
        <Header meta={meta} />
        <Outlet />
      </main>
    </div>
  )
}
