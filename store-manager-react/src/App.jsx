import { useState } from 'react'
import StoreLayout from './components/layout/StoreLayout'
import Dashboard from './pages/Dashboard'
import StockLevels from './pages/StockLevels'
import StockTransfers from './pages/StockTransfers'
import OnlineOrders from './pages/OnlineOrders'
import Refunds from './pages/Refunds'
import CashierShifts from './pages/CashierShifts'
import StoreSales from './pages/StoreSales'
import Icon from './components/Icon'
import { ToastProvider, useToast } from './components/Toast'
import { PAGE_META } from './data/navMeta'
import { SM_INV } from './data/inventoryData'
import { SM_ORDERS, seedOrderRefunds } from './data/dashboardData'
import { SM_TRANSFERS, SM_INBOUND, SM_STORE_NAME, SM_MANAGER, nextTransferId } from './data/transferData'
import { SM_SHIFTS } from './data/shiftData'

// Placeholder for store pages not yet converted (built page-by-page).
function ComingSoon({ page }) {
  const meta = PAGE_META[page] || {}
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col items-center justify-center text-center bg-white border border-border rounded-2xl py-20 px-6">
        <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center mb-4">
          <Icon name="construct-outline" className="text-navy" style={{ fontSize: '28px' }} />
        </div>
        <p className="text-[16px] font-extrabold text-navy-dark">{meta.heading || 'Coming soon'}</p>
        <p className="text-[12.5px] text-gray-400 mt-1.5 max-w-[360px]">This section is part of the Store Manager portal and will be built next. The layout and navigation are ready.</p>
      </div>
    </div>
  )
}

// Merged transfers (both directions), newest first — shared across pages.
const INITIAL_TRANSFERS = [...SM_TRANSFERS, ...SM_INBOUND]
  .map((t) => ({ ...t, ts: Date.parse(t.date) }))
  .sort((a, b) => b.ts - a.ts || b.id.localeCompare(a.id))

function Shell() {
  const showToast = useToast()
  const [activePage, setActivePage] = useState('dashboard')

  // ── App-level shared state: inventory, stock movements, transfers, and online orders ──
  const [inv, setInv] = useState(SM_INV)
  const [movements, setMovements] = useState([])
  const [transfers, setTransfers] = useState(INITIAL_TRANSFERS)
  const [orders, setOrders] = useState(() => seedOrderRefunds(SM_ORDERS))
  const [shifts] = useState(SM_SHIFTS)

  const patchOrder = (id, patch) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)))
  const patchRefund = (orderId, idx, patch) => setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, refunds: (o.refunds || []).map((r, i) => (i === idx ? { ...r, ...patch } : r)) } : o)))
  const pendingRefunds = orders.reduce((n, o) => n + (o.refunds || []).filter((r) => r.status === 'pending').length, 0)

  const patchTransfer = (id, patch) => setTransfers((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  const addTransfer = (t) => setTransfers((prev) => [{ ...t, ts: Date.now() }, ...prev])
  const adjustStock = (sku, delta) => setInv((prev) => prev.map((i) => (i.sku === sku ? { ...i, onHand: Math.max(0, i.onHand + delta) } : i)))
  const setStockOnHand = (sku, value) => setInv((prev) => prev.map((i) => (i.sku === sku ? { ...i, onHand: value } : i)))
  const addMovements = (arr) => { if (arr && arr.length) setMovements((prev) => [...arr, ...prev]) }

  // Create a new outbound stock request → appears on the Transfers page + dashboard,
  // and logs a "requested" movement per SKU in each product's stock history.
  const submitStockRequest = ({ lines, fulfiller, priority }) => {
    const reqId = nextTransferId()
    const units = lines.reduce((s, l) => s + l.qty, 0)
    addTransfer({
      id: reqId, dir: 'out', store: SM_STORE_NAME, fulfilledBy: fulfiller, date: 'Now',
      items: lines.length, units, status: 'pending', urgent: priority === 'Urgent',
      requestedBy: SM_MANAGER, approvedBy: null, rejectedBy: null, rejectReason: null,
      lines: lines.map((l) => ({ ...l })),
    })
    addMovements(lines.map((l) => ({ sku: l.sku, type: 'request', qty: 0, note: `Requested ${l.qty} from ${fulfiller} (${reqId}${priority === 'Urgent' ? ', Urgent' : ''})`, by: SM_MANAGER, date: 'Now' })))
    showToast(`${reqId} sent to ${fulfiller} — ${lines.length} item(s), ${units} units.`, 'success')
    return reqId
  }

  const handleNavigate = (page) => { setActivePage(page); window.scrollTo(0, 0) }

  const shared = { inv, movements, transfers, orders, patchOrder, patchTransfer, adjustStock, setStockOnHand, addMovements, submitStockRequest }

  return (
    <StoreLayout
      activePage={activePage}
      onNavigate={handleNavigate}
      onLogout={() => showToast('Logged out', 'info')}
      onAlerts={() => showToast('No new alerts', 'info')}
      refundBadge={pendingRefunds}
    >
      {activePage === 'dashboard' ? (
        <Dashboard onNavigate={handleNavigate} {...shared} />
      ) : activePage === 'inventory' ? (
        <StockLevels onNavigate={handleNavigate} {...shared} />
      ) : activePage === 'requests' ? (
        <StockTransfers onNavigate={handleNavigate} {...shared} />
      ) : activePage === 'orders' ? (
        <OnlineOrders orders={orders} patchOrder={patchOrder} />
      ) : activePage === 'refunds' ? (
        <Refunds orders={orders} patchRefund={patchRefund} />
      ) : activePage === 'shifts' ? (
        <CashierShifts shifts={shifts} />
      ) : activePage === 'sales' ? (
        <StoreSales />
      ) : (
        <ComingSoon page={activePage} />
      )}
    </StoreLayout>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  )
}
