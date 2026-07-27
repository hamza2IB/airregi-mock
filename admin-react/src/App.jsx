import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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

export default function App() {
  // Persist the (mock) auth flag for the tab session so deep-links / reloads
  // keep you signed in instead of bouncing to /login.
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin-authed') === '1')

  const signIn = () => {
    sessionStorage.setItem('admin-authed', '1')
    setAuthed(true)
  }
  const signOut = () => {
    sessionStorage.removeItem('admin-authed')
    setAuthed(false)
  }

  return (
    <ToastProvider>
      <Routes>
        {/* Auth — redirect into the app once signed in */}
        <Route
          path="/login"
          element={authed ? <Navigate to="/dashboard" replace /> : <AuthFlow onAuthenticated={signIn} />}
        />

        {/* Protected app shell — everything below requires auth */}
        <Route
          element={authed ? <AdminLayout onLogout={signOut} /> : <Navigate to="/login" replace />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/payments" element={<PaymentVerification />} />
          <Route path="/platform-users" element={<PlatformUsers />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/categories" element={<Industries />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/settings" element={<PlatformSettings />} />
        </Route>

        {/* Defaults */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ToastProvider>
  )
}
