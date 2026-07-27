import { useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import TransferDetailSlideover from '../components/transfers/TransferDetailSlideover'
import DispatchModal from '../components/transfers/DispatchModal'
import RejectTransferModal from '../components/transfers/RejectTransferModal'
import OrderDetailSlideover from '../components/orders/OrderDetailSlideover'
import StockCheckModal from '../components/orders/StockCheckModal'
import OrderRejectModal from '../components/orders/OrderRejectModal'
import {
  TRANSFER_DATA,
  ORDER_DATA,
  TRANSFER_STATUS,
  ORD_STATUS_COLORS,
  ORD_NEXT,
  PAY_STATUS,
  INV_DATA,
  WH_MANAGER,
  checkOrderStock,
  storeMeta,
  storeInitial,
  initialsOf,
} from '../data/warehouseData'

const TR_COLS = '0.9fr 2fr 0.9fr 1fr 0.5fr 0.5fr 0.85fr 1fr'
const ORD_COLS = '1.2fr 1.2fr .7fr .5fr .8fr 1.5fr .5fr 1.5fr'

function KpiCard({ icon, iconBg, iconColor, badge, badgeCls, value, valueCls, label, sub, onClick }) {
  return (
    <div className={`kpi-card ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon name={icon} className={`${iconColor} text-xl`} />
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeCls}`}>{badge}</span>
      </div>
      <p className={`text-[28px] font-extrabold leading-none mb-1 ${valueCls}`}>{value}</p>
      <p className="text-[11px] text-gray-500 font-medium">{label}</p>
      <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
    </div>
  )
}

function StoreCell({ name, urgent }) {
  const m = storeMeta(name)
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-extrabold text-white shrink-0" style={{ background: m.color }}>
        {storeInitial(name)}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[12.5px] font-semibold text-navy-dark truncate leading-tight">{name}</p>
          {urgent && <span className="text-[9px] font-bold text-white bg-brand-red px-1.5 py-0.5 rounded-full">URGENT</span>}
        </div>
        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{m.code}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const cls = TRANSFER_STATUS[status] || 'text-gray-500 bg-gray-100'
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
}

function OrdStatusBadge({ status }) {
  const c = ORD_STATUS_COLORS[status] || { cls: 'text-gray-500 bg-gray-100' }
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${c.cls}`}>{status}</span>
}

export default function Dashboard({ onNavigate }) {
  const showToast = useToast()
  const [transfers, setTransfers] = useState(TRANSFER_DATA)
  const [orders, setOrders] = useState(ORDER_DATA)

  const [viewTransfer, setViewTransfer] = useState(null)
  const [dispatchFor, setDispatchFor] = useState(null)
  const [rejectTransferFor, setRejectTransferFor] = useState(null)

  const [viewOrder, setViewOrder] = useState(null)
  const [stockCheck, setStockCheck] = useState(null) // { order, checked }
  const [orderRejectFor, setOrderRejectFor] = useState(null)

  const patchTransfer = (id, patch) => setTransfers((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  const patchOrder = (id, patch) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)))

  const pendingTransfers = transfers.filter((t) => t.status === 'pending').length
  const dispatchedTransfers = transfers.filter((t) => t.status === 'dispatched').length
  const topTransfers = transfers.slice(0, 5)

  const ordPending = orders.filter((o) => o.status === 'pending').length
  const ordShipped = orders.filter((o) => o.status === 'shipped').length
  const topOrders = orders.slice(0, 5)

  // ── Transfer actions ──
  const approveTransfer = (t) => { setViewTransfer(null); setDispatchFor(t) }
  const rejectTransferOpen = (t) => { setViewTransfer(null); setRejectTransferFor(t) }

  const confirmDispatch = (t, lines, total, reqTotal) => {
    lines.forEach((l) => {
      if (!l.dispatched) return
      const item = INV_DATA.find((i) => i.sku === l.sku)
      if (item) item.onHand = Math.max(0, item.onHand - l.dispatched)
    })
    const partial = total < reqTotal
    patchTransfer(t.id, { status: 'dispatched', approvedBy: WH_MANAGER, dispatchedOn: 'Jul 21, 2026', partial, requestedUnits: reqTotal, units: total, lines })
    setDispatchFor(null)
    showToast(partial ? `${t.id} partially dispatched — ${total} of ${reqTotal} units sent to ${t.store}.` : `${t.id} approved — ${total} units dispatched to ${t.store}.`, partial ? 'info' : 'success')
  }

  const confirmRejectTransfer = (t, label, note) => {
    patchTransfer(t.id, { status: 'rejected', rejectedBy: WH_MANAGER, rejectReason: label + (note ? ` — ${note}` : '') })
    setRejectTransferFor(null)
    showToast(`${t.id} rejected — "${label}". ${t.store} notified.`, 'info')
  }

  // ── Order actions ──
  const acceptOrder = (o) => {
    const checked = checkOrderStock(o)
    if (checked.every((l) => l.stockState === 'full')) {
      patchOrder(o.id, { status: 'confirmed' })
      setViewOrder(null)
      showToast(`${o.id} accepted. All items in stock. Customer notified.`, 'success')
      return
    }
    setViewOrder(null)
    setStockCheck({ order: o, checked })
  }

  const confirmPartialAccept = ({ order: o, checked }) => {
    const removed = checked.filter((l) => l.fulfillable < l.qty).map((l) => ({ name: l.name, variant: l.variant, sku: l.sku, removedQty: l.qty - l.fulfillable, unitPrice: l.price, amount: (l.qty - l.fulfillable) * l.price }))
    const refundAmount = removed.reduce((s, l) => s + l.amount, 0)
    const items = checked.filter((l) => l.fulfillable > 0).map((l) => ({ name: l.name, variant: l.variant, sku: l.sku, qty: l.fulfillable, price: l.price }))
    const subtotal = items.reduce((s, l) => s + l.qty * l.price, 0)
    const isBankTransfer = o.payment !== 'Cash on Delivery' && o.paymentStatus === 'paid'
    const patch = { status: 'confirmed', partialFulfillment: true, removedItems: removed, items_detail: items, subtotal, total: subtotal + o.deliveryFee }
    if (isBankTransfer && refundAmount > 0) {
      patch.refunds = [...(o.refunds || []), { amount: refundAmount, status: 'pending', reason: 'Partial order — items out of stock', items: removed, date: 'Jul 21, 2026', refId: null }]
    }
    patchOrder(o.id, patch)
    setStockCheck(null)
    showToast(isBankTransfer && refundAmount > 0 ? `${o.id} partially accepted. Refund of Rs.${refundAmount.toLocaleString()} pending. Customer notified.` : `${o.id} partially accepted. Unavailable items removed. Customer notified.`, isBankTransfer && refundAmount > 0 ? 'info' : 'success')
  }

  const advanceOrder = (o) => {
    const nf = ORD_NEXT[o.status]
    if (!nf) return
    patchOrder(o.id, { status: nf.next })
    setViewOrder(null)
    showToast(`${o.id} → ${nf.next}. Customer notified.`, 'success')
  }

  const rejectOrderOpen = (o) => { setViewOrder(null); setStockCheck(null); setOrderRejectFor(o) }

  const confirmRejectOrder = (o, reason, note) => {
    const isBankTransfer = o.payment !== 'Cash on Delivery' && o.paymentStatus === 'paid'
    const patch = { status: 'cancelled' }
    let refundMsg = ''
    if (isBankTransfer) {
      patch.refunds = [...(o.refunds || []), { amount: o.total, status: 'pending', reason: `Order rejected — ${reason}`, items: o.items_detail.map((l) => ({ name: l.name, variant: l.variant, sku: l.sku, removedQty: l.qty, unitPrice: l.price, amount: l.qty * l.price })), date: 'Jul 21, 2026', refId: null }]
      refundMsg = ` Full refund of Rs.${o.total.toLocaleString()} pending.`
    }
    patchOrder(o.id, patch)
    setOrderRejectFor(null)
    showToast(`${o.id} rejected — "${reason}".${refundMsg} Customer notified.`, isBankTransfer ? 'info' : 'info')
  }

  return (
    <div className="p-8 max-md:p-3.5">
      <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold mb-3">Warehouse Health</p>
      <div className="grid grid-cols-4 gap-4 mb-6 max-md:grid-cols-2">
        <KpiCard icon="cube-outline" iconBg="bg-brand-blue/10" iconColor="text-brand-blue" badge="↑ 12 new" badgeCls="text-brand-green bg-brand-green/10" value="1,248" valueCls="text-navy-dark" label="Total SKUs" sub="38,420 total units" />
        <KpiCard icon="arrow-down-circle-outline" iconBg="bg-brand-purple/10" iconColor="text-brand-purple" badge="Action needed" badgeCls="text-brand-purple bg-brand-purple/10" value="5" valueCls="text-brand-purple" label="Store Requests Pending" sub="2 urgent · 3 normal" onClick={() => onNavigate('transfers')} />
        <KpiCard icon="alert-circle-outline" iconBg="bg-brand-orange/10" iconColor="text-brand-orange" badge="Reorder needed" badgeCls="text-brand-orange bg-brand-orange/10" value="23" valueCls="text-brand-orange" label="Low Stock SKUs" sub="7 out of stock" onClick={() => onNavigate('inventory')} />
        <KpiCard icon="globe-outline" iconBg="bg-brand-blue/10" iconColor="text-brand-blue" badge="↑ 3 today" badgeCls="text-brand-green bg-brand-green/10" value="18" valueCls="text-navy-dark" label="Online Orders" sub="5 pending · 13 fulfilled" onClick={() => onNavigate('orders')} />
      </div>

      {/* Recent Stock Transfers */}
      <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold mb-3">Recent Stock Transfers</p>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-2">
          <div>
            <p className="text-[13px] font-semibold text-navy-dark">Top 5 Stock Transfers</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Latest transfer activity across all stores</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-brand-purple/10 text-brand-purple px-2.5 py-1 rounded-full">{pendingTransfers} Pending</span>
            <span className="text-[10px] font-bold bg-brand-orange/10 text-brand-orange px-2.5 py-1 rounded-full">{dispatchedTransfers} Dispatched</span>
            <button onClick={() => onNavigate('transfers')} className="text-[11px] font-semibold text-brand-blue hover:underline ml-1">View all →</button>
          </div>
        </div>
        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[820px]">
            <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60" style={{ gridTemplateColumns: TR_COLS }}>
              <div>Transfer #</div><div>Store</div><div>Requested</div><div>Requested By</div>
              <div className="text-right">Items</div><div className="text-right">Units</div>
              <div className="text-center">Status</div><div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-gray-100">
              {topTransfers.map((t) => {
                const canAct = t.status === 'pending'
                return (
                  <div key={t.id} className="grid items-center px-5 py-3 hover:bg-gray-50/50 transition" style={{ gridTemplateColumns: TR_COLS }}>
                    <p className="text-[12px] font-mono font-semibold text-brand-blue">{t.id}</p>
                    <StoreCell name={t.store} urgent={t.urgent} />
                    <p className="text-[11px] text-gray-500">{t.date}</p>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-brand-purple/15 flex items-center justify-center shrink-0 text-[9px] font-extrabold text-brand-purple">{initialsOf(t.requestedBy)}</div>
                      <p className="text-[11px] text-gray-600 font-medium truncate">{t.requestedBy}</p>
                    </div>
                    <p className="text-[13px] font-bold text-navy-dark text-right">{t.items}</p>
                    <p className="text-[13px] font-bold text-navy-dark text-right">{t.units}</p>
                    <div className="text-center"><StatusBadge status={t.status} /></div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <button onClick={() => setViewTransfer(t)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30 hover:bg-gray-50 transition">
                        <Icon name="eye-outline" style={{ fontSize: '12px', flexShrink: 0 }} />View
                      </button>
                      {canAct ? (
                        <button onClick={() => approveTransfer(t)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-green/30 bg-brand-green/10 text-brand-green hover:bg-brand-green/20 transition">
                          <Icon name="checkmark-outline" style={{ fontSize: '12px', flexShrink: 0 }} />Approve
                        </button>
                      ) : t.status === 'dispatched' ? (
                        <span className="text-[9px] text-brand-orange italic">Awaiting receipt</span>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-border bg-gray-50/40 flex items-center justify-between">
          <p className="text-[11px] text-gray-400">Showing latest 5 transfers</p>
          <button onClick={() => onNavigate('transfers')} className="text-[11px] font-semibold text-brand-blue hover:underline">View all transfers →</button>
        </div>
      </div>

      {/* Recent Online Orders */}
      <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold mb-3 mt-6">Recent Online Orders</p>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-2">
          <div>
            <p className="text-[13px] font-semibold text-navy-dark">Top 5 Online Orders</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Latest customer orders across all channels</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-brand-orange/10 text-brand-orange px-2.5 py-1 rounded-full">{ordPending} Pending</span>
            <span className="text-[10px] font-bold bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full">{ordShipped} Shipped</span>
            <button onClick={() => onNavigate('orders')} className="text-[11px] font-semibold text-brand-blue hover:underline ml-1">View all →</button>
          </div>
        </div>
        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[820px]">
            <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60" style={{ gridTemplateColumns: ORD_COLS }}>
              <div>Order #</div><div>Customer</div><div>Date</div>
              <div className="text-right">Items</div><div className="text-right">Total</div>
              <div className="text-center">Payment</div><div className="text-center">Status</div><div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-gray-100">
              {topOrders.map((o) => {
                const ps = PAY_STATUS[o.paymentStatus] || { cls: 'text-gray-500 bg-gray-100', label: o.paymentStatus }
                const isCOD = o.payment === 'Cash on Delivery'
                const canAccept = o.status === 'pending'
                const nextFlow = ORD_NEXT[o.status]
                return (
                  <div key={o.id} className="grid items-center px-5 py-3.5 hover:bg-gray-50/50 transition" style={{ gridTemplateColumns: ORD_COLS }}>
                    <p className="text-[12px] font-mono font-semibold text-brand-blue">{o.id}</p>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-navy-dark truncate">{o.customer}</p>
                      <p className="text-[10px] text-gray-400">{o.area}</p>
                    </div>
                    <p className="text-[11px] text-gray-500">{o.date.split(' ').slice(0, 3).join(' ')}</p>
                    <p className="text-[13px] font-bold text-navy-dark text-right">{o.items_detail.length}</p>
                    <p className="text-[12px] font-bold text-navy-dark text-right">Rs.{o.total.toLocaleString()}</p>
                    <div className="min-w-0 flex flex-col items-center">
                      <div className="flex items-center gap-1.5">
                        <Icon name={isCOD ? 'cash-outline' : 'phone-portrait-outline'} style={{ fontSize: '11px', color: '#94a3b8', flexShrink: 0 }} />
                        <p className="text-[11px] font-medium text-navy-dark truncate">{o.payment}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ps.cls} mt-0.5 inline-block`}>{ps.label}</span>
                    </div>
                    <div className="text-center"><OrdStatusBadge status={o.status} /></div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <button onClick={() => setViewOrder(o)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30 hover:bg-gray-50 transition">
                        <Icon name="eye-outline" style={{ fontSize: '12px', flexShrink: 0 }} />View
                      </button>
                      {canAccept ? (
                        <button onClick={() => acceptOrder(o)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-green/30 bg-brand-green/10 text-brand-green hover:bg-brand-green/20 transition">
                          <Icon name="checkmark-outline" style={{ fontSize: '12px', flexShrink: 0 }} />Accept
                        </button>
                      ) : nextFlow ? (
                        <button onClick={() => advanceOrder(o)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-blue/30 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 transition">
                          <Icon name={nextFlow.icon} style={{ fontSize: '12px', flexShrink: 0 }} />{nextFlow.label}
                        </button>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-border bg-gray-50/40 flex items-center justify-between">
          <p className="text-[11px] text-gray-400">Showing latest 5 orders</p>
          <button onClick={() => onNavigate('orders')} className="text-[11px] font-semibold text-brand-blue hover:underline">View all orders →</button>
        </div>
      </div>

      {/* Transfer slideover + modals */}
      <TransferDetailSlideover transfer={viewTransfer} onClose={() => setViewTransfer(null)} onApprove={approveTransfer} onReject={rejectTransferOpen} />
      <DispatchModal transfer={dispatchFor} onClose={() => setDispatchFor(null)} onConfirm={confirmDispatch} />
      <RejectTransferModal transfer={rejectTransferFor} onClose={() => setRejectTransferFor(null)} onConfirm={confirmRejectTransfer} />

      {/* Order slideover + modals */}
      <OrderDetailSlideover order={viewOrder} onClose={() => setViewOrder(null)} onAccept={acceptOrder} onReject={rejectOrderOpen} onAdvance={advanceOrder} />
      <StockCheckModal state={stockCheck} onClose={() => setStockCheck(null)} onAcceptPartial={confirmPartialAccept} onReject={rejectOrderOpen} />
      <OrderRejectModal order={orderRejectFor} onClose={() => setOrderRejectFor(null)} onConfirm={confirmRejectOrder} />
    </div>
  )
}
