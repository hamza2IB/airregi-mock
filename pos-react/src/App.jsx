import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Register from './register/Register.jsx'
import Display from './display/Display.jsx'

export default function App() {
  return (
    <Routes>
      {/* Cashier-facing view (primary monitor) */}
      <Route path="/register" element={<Register />} />
      {/* Customer-facing view (secondary monitor) */}
      <Route path="/display" element={<Display />} />

      <Route path="/" element={<Landing />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// Simple launcher so you can open each screen on its own monitor.
function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div>
        <h1 className="text-[26px] font-bold text-navy">Air Register POS</h1>
        <p className="text-[14px] text-gray-500 mt-1">Open each view on its own screen</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/register" className="tap-btn px-8 py-5 bg-navy text-white rounded-2xl font-semibold shadow-lg shadow-navy/20 min-w-[220px]">
          Cashier — /register
        </Link>
        <Link to="/display" className="tap-btn px-8 py-5 bg-white border-2 border-navy text-navy rounded-2xl font-semibold min-w-[220px]">
          Customer — /display
        </Link>
      </div>
      <p className="text-[12px] text-gray-400 max-w-md">
        Both screens sync in real time over BroadcastChannel. Open them in two windows
        (or drag the customer window to the second monitor) and add items on the cashier side.
      </p>
    </div>
  )
}
