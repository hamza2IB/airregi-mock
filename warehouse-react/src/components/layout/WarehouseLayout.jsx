import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileBottomNav from './MobileBottomNav'
import { PAGE_META } from '../../data/navMeta'

export default function WarehouseLayout({ activePage, onNavigate, onLogout, onAlerts, onScan, issuesBadge, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const meta = PAGE_META[activePage] || PAGE_META.dashboard

  const navigate = (page) => {
    setMobileOpen(false)
    onNavigate(page)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activePage={activePage}
        onNavigate={navigate}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onLogout={onLogout}
        issuesBadge={issuesBadge}
      />
      <main className="flex-1 min-w-0 flex flex-col">
        <Header meta={meta} onOpenMobileSidebar={() => setMobileOpen(true)} onAlerts={onAlerts} onScan={onScan} />
        {children}
        <div className="md:hidden h-[66px]"></div>
      </main>
      <MobileBottomNav activePage={activePage} onNavigate={navigate} onOpenMore={() => setMobileOpen(true)} />
    </div>
  )
}
