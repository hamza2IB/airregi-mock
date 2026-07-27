import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileBottomNav from './MobileBottomNav'
import { PAGE_META } from '../../data/navMeta'

// Map the current URL to a PAGE_META key (handles nested detail routes).
function pageKeyFromPath(pathname) {
  const seg = pathname.split('/').filter(Boolean)
  if (seg.length === 0) return 'dashboard'
  if (seg[0] === 'stores' && seg[1]) return 'store-detail'
  if (seg[0] === 'subscription' && seg[1] === 'payments') return 'payments'
  return seg[0]
}

export default function OwnerLayout({ onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const activePage = pageKeyFromPath(pathname)
  const meta = PAGE_META[activePage] || PAGE_META.dashboard

  // Close the mobile drawer and scroll to top on route change.
  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen">
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onLogout={onLogout}
      />
      <main className="flex-1 min-w-0 flex flex-col">
        <Header meta={meta} onOpenMobileSidebar={() => setMobileOpen(true)} />
        <Outlet />
        {/* Spacer so content clears the fixed bottom nav on mobile */}
        <div className="md:hidden h-[66px]"></div>
      </main>
      <MobileBottomNav onOpenMore={() => setMobileOpen(true)} />
    </div>
  )
}
