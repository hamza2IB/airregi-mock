import { useState } from 'react'
import WarehouseLayout from './components/layout/WarehouseLayout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Inventory from './pages/Inventory'
import Transfers from './pages/Transfers'
import Barcodes from './pages/Barcodes'
import Orders from './pages/Orders'
import Refunds from './pages/Refunds'
import CustomerIssues from './pages/CustomerIssues'
import Icon from './components/Icon'
import { ToastProvider, useToast } from './components/Toast'
import { PAGE_META } from './data/navMeta'
import { ORDER_DATA } from './data/warehouseData'
import { WM_ISSUES } from './data/issuesData'

// Placeholder for warehouse pages not yet converted (built page-by-page).
function ComingSoon({ page }) {
  const meta = PAGE_META[page] || {}
  return (
    <div className="p-8 max-md:p-3.5">
      <div className="bg-white rounded-xl border border-border p-10 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-4">
          <Icon name="cube-outline" className="text-brand-blue" size={26} />
        </div>
        <p className="text-[16px] font-bold text-navy-dark mb-1">{meta.heading || 'Coming Soon'}</p>
        <p className="text-[12px] text-gray-500 max-w-sm">This page is being converted next. The Dashboard is ready.</p>
      </div>
    </div>
  )
}

function Shell() {
  const showToast = useToast()
  const [activePage, setActivePage] = useState('dashboard')
  // Orders + their refunds are shared so the Orders and Refunds pages stay in sync.
  const [orders, setOrders] = useState(ORDER_DATA)
  // Customer issues raised from the shopping app against orders this warehouse fulfils.
  const [issues, setIssues] = useState(WM_ISSUES)
  const openIssues = issues.filter((i) => i.status !== 'resolved').length

  const patchIssue = (id, changes) =>
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, ...changes } : i)))

  const handleNavigate = (page) => {
    setActivePage(page)
    window.scrollTo(0, 0)
  }

  return (
    <WarehouseLayout
      activePage={activePage}
      onNavigate={handleNavigate}
      onLogout={() => showToast('Logged out', 'info')}
      onAlerts={() => handleNavigate('products')}
      issuesBadge={openIssues}
    >
      {activePage === 'dashboard' ? (
        <Dashboard onNavigate={handleNavigate} />
      ) : activePage === 'products' ? (
        <Products />
      ) : activePage === 'inventory' ? (
        <Inventory onNavigate={handleNavigate} />
      ) : activePage === 'transfers' ? (
        <Transfers />
      ) : activePage === 'barcodes' ? (
        <Barcodes />
      ) : activePage === 'orders' ? (
        <Orders orders={orders} setOrders={setOrders} />
      ) : activePage === 'refunds' ? (
        <Refunds orders={orders} setOrders={setOrders} />
      ) : activePage === 'issues' ? (
        <CustomerIssues issues={issues} patchIssue={patchIssue} />
      ) : (
        <ComingSoon page={activePage} />
      )}
    </WarehouseLayout>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  )
}
