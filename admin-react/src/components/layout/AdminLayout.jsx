import Sidebar from './Sidebar'
import Header from './Header'
import { navMeta } from '../../data/revenueData'

export default function AdminLayout({ activePage, onNavigate, onLogout, children }) {
  const meta = navMeta[activePage] || navMeta.dashboard

  return (
    <div className="flex min-h-screen">
      <Sidebar activePage={activePage} onNavigate={onNavigate} onLogout={onLogout} />
      <main className="flex-1 min-w-0">
        <Header meta={meta} />
        {children}
      </main>
    </div>
  )
}
