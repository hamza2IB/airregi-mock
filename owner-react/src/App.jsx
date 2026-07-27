import { useState } from 'react'
import OwnerLayout from './components/layout/OwnerLayout'
import Dashboard from './pages/Dashboard'
import CompanyProfile from './pages/CompanyProfile'
import Stores from './pages/Stores'
import StoreDetail from './pages/StoreDetail'
import Products from './pages/Products'
import Categories from './pages/Categories'
import UsersStaff from './pages/UsersStaff'
import Subscription from './pages/Subscription'
import PaymentHistory from './pages/PaymentHistory'
import Revenue from './pages/Revenue'
import Settings from './pages/Settings'
import Icon from './components/Icon'
import { ToastProvider, useToast } from './components/Toast'
import { PAGE_META } from './data/navMeta'
import { INITIAL_STORES } from './data/storesData'
import { PAYMENTS_DATA } from './data/subscriptionData'

// Placeholder for owner pages not yet converted (built page-by-page).
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
  const [selectedStoreId, setSelectedStoreId] = useState(null)
  const [stores, setStores] = useState(INITIAL_STORES)
  const [payments, setPayments] = useState(PAYMENTS_DATA)

  const handleNavigate = (page) => {
    setActivePage(page)
    window.scrollTo(0, 0)
  }

  const openStore = (id) => {
    setSelectedStoreId(id)
    handleNavigate('store-detail')
  }

  const selectedStore = stores.find((s) => s.id === selectedStoreId) || null
  const sidebarPage = activePage === 'store-detail' ? 'stores' : activePage === 'payments' ? 'subscription' : activePage
  const known = ['dashboard', 'company', 'stores', 'store-detail', 'products', 'categories', 'users', 'subscription', 'payments', 'revenue', 'settings']

  return (
    <OwnerLayout activePage={sidebarPage} onNavigate={handleNavigate} onLogout={() => showToast('Logged out', 'info')}>
      {activePage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
      {activePage === 'company' && <CompanyProfile />}
      {activePage === 'stores' && <Stores stores={stores} setStores={setStores} onOpenStore={openStore} />}
      {activePage === 'store-detail' && <StoreDetail store={selectedStore} setStores={setStores} onBack={() => handleNavigate('stores')} />}
      {activePage === 'products' && <Products />}
      {activePage === 'categories' && <Categories />}
      {activePage === 'users' && <UsersStaff />}
      {activePage === 'subscription' && <Subscription payments={payments} setPayments={setPayments} onNavigate={handleNavigate} />}
      {activePage === 'payments' && <PaymentHistory payments={payments} setPayments={setPayments} onBack={() => handleNavigate('subscription')} />}
      {activePage === 'revenue' && <Revenue />}
      {activePage === 'settings' && <Settings onNavigate={handleNavigate} />}
      {!known.includes(activePage) && <ComingSoon page={activePage} />}
    </OwnerLayout>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  )
}
