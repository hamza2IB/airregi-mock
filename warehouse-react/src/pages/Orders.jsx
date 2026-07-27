import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import OrderDetailSlideover from '../components/orders/OrderDetailSlideover'
import StockCheckModal from '../components/orders/StockCheckModal'
import OrderRejectModal from '../components/orders/OrderRejectModal'
import { ORD_STATUS_COLORS, ORD_NEXT, PAY_STATUS, checkOrderStock } from '../data/warehouseData'

const ORD_PAGE = 10
const COLS = '1.2fr 1.2fr .7fr .5fr .8fr 1.5fr .5fr 1.5fr'

function KpiCard({ icon, iconBg, iconColor, value, valueCls, label, onClick }) {
  return (
    <div className={`bg-white rounded-xl border border-border px-4 py-3.5 flex items-center gap-3 ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon name={icon} className={iconColor} size={18} />
      </div>
      <div>
        <p className={`text-[22px] font-extrabold leading-none ${valueCls}`}>{value}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function OrdStatusBadge({ status }) {
  const c = ORD_STATUS_COLORS[status] || { cls: 'text-gray-500 bg-gray-100' }
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${c.cls}`}>{status}</span>
}

const TABS = ['all', 'pending', 'confirmed', 'packing', 'shipped', 'delivered', 'cancelled']

export default function Orders({ orders, setOrders }) {
  const showToast = useToast()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)

  const [viewOrder, setViewOrder] = useState(null)
  const [stockCheck, setStockCheck] = useState(null)
  const [orderRejectFor, setOrderRejectFor] = useState(null)

  const patchOrder = (id, patch) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)))

  const kpis = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    packing: orders.filter((o) => o.status === 'packing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    refunds: orders.reduce((c, o) => c + (o.refunds || []).filter((r) => r.status === 'pending').length, 0),
  }

  const data = useMemo(() => {
    const q = search.toLowerCase()
    return orders.filter((o) => {
      const ms = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)
      const mf = filter === 'all' || o.status === filter
      return ms && mf
    })
  }, [orders, search, filter])

  const total = data.length
  const pages = Math.ceil(total / ORD_PAGE) || 1
  const curPage = Math.min(page, pages)
  const items = data.slice((curPage - 1) * ORD_PAGE, curPage * ORD_PAGE)

  const pills = useMemo(() => {
    const maxPills = 5
    let start = Math.max(1, curPage - Math.floor(maxPills / 2))
    let end = Math.min(pages, start + maxPills - 1)
    if (end - start < maxPills - 1) start = Math.max(1, end - maxPills + 1)
    const arr = []
    for (let i = start; i <= end; i++) arr.push(i)
    return arr
  }, [curPage, pages])

  const setTab = (f) => { setFilter(f); setPage(1) }

  // ── Order actions (mirrors Dashboard) ──
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
    const items2 = checked.filter((l) => l.fulfillable > 0).map((l) => ({ name: l.name, variant: l.variant, sku: l.sku, qty: l.fulfillable, price: l.price }))
    const subtotal = items2.reduce((s, l) => s + l.qty * l.price, 0)
    const isBankTransfer = o.payment !== 'Cash on Delivery' && o.paymentStatus === 'paid'
    const patch = { status: 'confirmed', partialFulfillment: true, removedItems: removed, items_detail: items2, subtotal, total: subtotal + o.deliveryFee }
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

  const confirmRejectOrder = (o, reason) => {
    const isBankTransfer = o.payment !== 'Cash on Delivery' && o.paymentStatus === 'paid'
    const patch = { status: 'cancelled' }
    let refundMsg = ''
    if (isBankTransfer) {
      patch.refunds = [...(o.refunds || []), { amount: o.total, status: 'pending', reason: `Order rejected — ${reason}`, items: o.items_detail.map((l) => ({ name: l.name, variant: l.variant, sku: l.sku, removedQty: l.qty, unitPrice: l.price, amount: l.qty * l.price })), date: 'Jul 21, 2026', refId: null }]
      refundMsg = ` Full refund of Rs.${o.total.toLocaleString()} pending.`
    }
    patchOrder(o.id, patch)
    setOrderRejectFor(null)
    showToast(`${o.id} rejected — "${reason}".${refundMsg} Customer notified.`, 'info')
  }

  return (
    <div className="p-8 max-md:p-3.5">
      {/* KPI strip */}
      <div className="grid grid-cols-6 gap-3 mb-6 max-md:grid-cols-2">
        <KpiCard icon="globe-outline" iconBg="bg-navy/10" iconColor="text-navy" value={kpis.total} valueCls="text-navy-dark" label="Total Orders" />
        <KpiCard icon="hourglass-outline" iconBg="bg-brand-orange/10" iconColor="text-brand-orange" value={kpis.pending} valueCls="text-brand-orange" label="Pending" onClick={() => setTab('pending')} />
        <KpiCard icon="checkmark-circle-outline" iconBg="bg-brand-blue/10" iconColor="text-brand-blue" value={kpis.confirmed} valueCls="text-brand-blue" label="Confirmed" onClick={() => setTab('confirmed')} />
        <KpiCard icon="cube-outline" iconBg="bg-brand-purple/10" iconColor="text-brand-purple" value={kpis.packing} valueCls="text-brand-purple" label="Packing" onClick={() => setTab('packing')} />
        <KpiCard icon="checkmark-done-outline" iconBg="bg-brand-green/10" iconColor="text-brand-green" value={kpis.shipped} valueCls="text-brand-green" label="Shipped" onClick={() => setTab('shipped')} />
        <KpiCard icon="arrow-undo-outline" iconBg="bg-brand-orange/10" iconColor="text-brand-orange" value={kpis.refunds} valueCls="text-brand-orange" label="Refunds Pending" onClick={() => { setFilter('all'); setSearch(''); setPage(1) }} />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[200px] max-w-xs">
            <Icon name="search-outline" size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search order #, customer…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none"
            />
          </div>
          <div className="flex bg-page border border-border rounded-lg overflow-hidden flex-wrap">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-[11px] capitalize transition ${filter === t ? 'font-semibold bg-navy text-white' : 'font-medium text-gray-500 hover:bg-white/60'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table with horizontal scroll */}
        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[1000px]">
            <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60" style={{ gridTemplateColumns: COLS }}>
              <div>Order #</div>
              <div>Customer</div>
              <div>Date</div>
              <div className="text-right">Items</div>
              <div className="text-right">Total</div>
              <div className="text-center">Payment</div>
              <div className="text-center">Status</div>
              <div className="text-right">Actions</div>
            </div>

            <div className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <div className="py-16 text-center">
                  <Icon name="globe-outline" size={30} style={{ color: '#cbd5e1' }} />
                  <p className="text-[13px] text-gray-400 mt-2">No orders found</p>
                </div>
              ) : (
                items.map((o) => {
                  const ps = PAY_STATUS[o.paymentStatus] || { cls: 'text-gray-500 bg-gray-100', label: o.paymentStatus }
                  const isCOD = o.payment === 'Cash on Delivery'
                  const canAccept = o.status === 'pending'
                  const nextFlow = ORD_NEXT[o.status]
                  const refundDue = (o.refunds || []).some((r) => r.status === 'pending')
                  return (
                    <div key={o.id} className="grid items-center px-5 py-3.5 hover:bg-gray-50/50 transition" style={{ gridTemplateColumns: COLS }}>
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
                          <Icon name={isCOD ? 'cash-outline' : 'phone-portrait-outline'} size={11} style={{ color: '#94a3b8', flexShrink: 0 }} />
                          <p className="text-[11px] font-medium text-navy-dark truncate">{o.payment}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ps.cls} mt-0.5 inline-block`}>{ps.label}</span>
                        {refundDue && (
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full text-brand-orange bg-brand-orange/10 mt-0.5 inline-flex items-center gap-0.5">
                            <Icon name="arrow-undo-outline" size={8} />Refund Due
                          </span>
                        )}
                      </div>
                      <div className="text-center"><OrdStatusBadge status={o.status} /></div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <button onClick={() => setViewOrder(o)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30 hover:bg-gray-50 transition shrink-0 whitespace-nowrap">
                          <Icon name="eye-outline" size={12} />View
                        </button>
                        {canAccept ? (
                          <button onClick={() => acceptOrder(o)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-green/30 bg-brand-green/10 text-brand-green hover:bg-brand-green/20 transition shrink-0 whitespace-nowrap">
                            <Icon name="checkmark-outline" size={12} />Accept
                          </button>
                        ) : nextFlow ? (
                          <button onClick={() => advanceOrder(o)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-blue/30 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 transition shrink-0 whitespace-nowrap">
                            <Icon name={nextFlow.icon} size={12} />{nextFlow.label}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer / pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-gray-50/40">
          <p className="text-[11px] text-gray-400">
            {total ? `Showing ${Math.min((curPage - 1) * ORD_PAGE + 1, total)}–${Math.min(curPage * ORD_PAGE, total)} of ${total}` : 'Showing 0 of 0'}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy transition">
              <Icon name="chevron-back-outline" size={13} />
            </button>
            {pills.map((i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-7 h-7 rounded-lg border text-[11px] font-semibold transition ${i === curPage ? 'bg-navy text-white border-navy' : 'border-border bg-white text-gray-500 hover:border-navy/30 hover:text-navy'}`}
              >
                {i}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy transition">
              <Icon name="chevron-forward-outline" size={13} />
            </button>
          </div>
        </div>
      </div>

      <OrderDetailSlideover order={viewOrder} onClose={() => setViewOrder(null)} onAccept={acceptOrder} onReject={rejectOrderOpen} onAdvance={advanceOrder} />
      <StockCheckModal state={stockCheck} onClose={() => setStockCheck(null)} onAcceptPartial={confirmPartialAccept} onReject={rejectOrderOpen} />
      <OrderRejectModal order={orderRejectFor} onClose={() => setOrderRejectFor(null)} onConfirm={confirmRejectOrder} />
    </div>
  )
}
