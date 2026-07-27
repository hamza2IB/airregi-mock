import { useState } from 'react'
import AdminLayout from './components/layout/AdminLayout'
import Dashboard from './pages/Dashboard'
import Businesses from './pages/Businesses'
import PaymentVerification from './pages/PaymentVerification'
import PlatformUsers from './pages/PlatformUsers'
import Packages from './pages/Packages'
import Industries from './pages/Industries'
import Revenue from './pages/Revenue'
import PlatformSettings from './pages/PlatformSettings'
import AuthFlow from './auth/AuthFlow'
import { ToastProvider } from './components/Toast'

const PAGES = {
  dashboard: Dashboard,
  businesses: Businesses,
  payments: PaymentVerification,
  'platform-users': PlatformUsers,
  packages: Packages,
  categories: Industries,
  revenue: Revenue,
  settings: PlatformSettings,
}

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [activePage, setActivePage] = useState('dashboard')

  const handleNavigate = (page) => {
    setActivePage(page)
    window.scrollTo(0, 0)
  }

  const handleLogout = () => {
    setActivePage('dashboard')
    setAuthed(false)
  }

  if (!authed) {
    return (
      <ToastProvider>
        <AuthFlow onAuthenticated={() => setAuthed(true)} />
      </ToastProvider>
    )
  }

  const ActivePage = PAGES[activePage] || Dashboard

  return (
    <ToastProvider>
      <AdminLayout activePage={activePage} onNavigate={handleNavigate} onLogout={handleLogout}>
        {/* Businesses needs navigation (e.g. "Go to Payment Queue"); others don't use the prop. */}
        <ActivePage onNavigate={handleNavigate} />
      </AdminLayout>
    </ToastProvider>
  )
}
