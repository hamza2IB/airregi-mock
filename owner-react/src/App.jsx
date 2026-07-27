import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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
import { ToastProvider, useToast } from './components/Toast'
import { INITIAL_STORES } from './data/storesData'
import { PAYMENTS_DATA } from './data/subscriptionData'

function Shell() {
  const showToast = useToast()
  // Shared, app-level state that must persist across routes.
  const [stores, setStores] = useState(INITIAL_STORES)
  const [payments, setPayments] = useState(PAYMENTS_DATA)

  return (
    <Routes>
      <Route element={<OwnerLayout onLogout={() => showToast('Logged out', 'info')} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/company" element={<CompanyProfile />} />
        <Route path="/stores" element={<Stores stores={stores} setStores={setStores} />} />
        <Route path="/stores/:storeId" element={<StoreDetail stores={stores} setStores={setStores} />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/users" element={<UsersStaff />} />
        <Route path="/subscription" element={<Subscription payments={payments} setPayments={setPayments} />} />
        <Route path="/subscription/payments" element={<PaymentHistory payments={payments} setPayments={setPayments} />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Defaults */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  )
}
