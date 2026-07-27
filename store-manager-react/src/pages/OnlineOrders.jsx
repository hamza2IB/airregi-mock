import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import OrderDetailSlideover from '../components/orders/OrderDetailSlideover'
import OrderRejectModal from '../components/orders/OrderRejectModal'
import StockCheckModal from '../components/orders/StockCheckModal'
import { SM_ORD_STATUS, SM_ORD_FLOW, PAY_BADGE } from '../data/dashboardData'
import { useOrderActions } from '../hooks/useOrderActions'

const COLS = '1.2fr 1.2fr .7fr .5fr .8fr 1.5fr .6fr 1.5fr'
const PAGE_SIZE = 10

const TABS = ['all', 'pending', 'confirmed', 'packing', 'shipped', 'delivered', 'cancelled']

function Kpi({ icon, iconBg, iconColor, value, valueCls, label }) {
  return (
    <div className="bg-white rounded-xl border border-border px-4 py-3.5 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon name={icon} className={iconColor} style={{ fontSize: '18px' }} />
      </div>
      <div>
        <p className={`text-[22px] font-extrabold leading-none ${valueCls}`}>{value}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function OnlineOrders({ orders, patchOrder }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const oa = useOrderActions({ patchOrder })

  const kpi = {
    action: orders.filter((o) => ['pending', 'confirmed', 'packing'].includes(o.status)).length,
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    packing: orders.filter((o) => o.status === 'packing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return orders.filter((o) => {
      const ms = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)
      const mf = filter === 'all' || o.status === filter
      return ms && mf
    })
  }, [orders, search, filter])

  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const curPage = Math.min(page, pages)
  const pageItems = filtered.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE)
  const setTab = (f) => { setFilter(f); setPage(1) }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        <div className="rounded-xl px-4 py-3.5 flex items-center gap-3 text-white" style={{ background: 'linear-gradient(135deg,#1a2d6b,#0a1535)' }}>
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0"><Icon name="flash-outline" style={{ fontSize: '18px', color: '#fff' }} /></div>
          <div>
            <p className="text-[22px] font-extrabold leading-none">{kpi.action}</p>
            <p className="text-[10px] text-white/70 font-medium mt-0.5">Needs Action</p>
          </div>
        </div>
        <Kpi icon="globe-outline" iconBg="bg-navy/10" iconColor="text-navy" value={kpi.total} valueCls="text-navy-dark" label="Total Orders" />
        <Kpi icon="hourglass-outline" iconBg="bg-brand-orange/10" iconColor="text-brand-orange" value={kpi.pending} valueCls="text-brand-orange" label="Pending" />
        <Kpi icon="checkmark-circle-outline" iconBg="bg-brand-blue/10" iconColor="text-brand-blue" value={kpi.confirmed} valueCls="text-brand-blue" label="Confirmed" />
        <Kpi icon="cube-outline" iconBg="bg-brand-purple/10" iconColor="text-brand-purple" value={kpi.packing} valueCls="text-brand-purple" label="Packing" />
        <Kpi icon="checkmark-done-outline" iconBg="bg-brand-green/10" iconColor="text-brand-green" value={kpi.shipped} valueCls="text-brand-green" label="Shipped" />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[200px] max-w-xs">
            <Icon name="search-outline" style={{ fontSize: '15px', color: '#94a3b8', flexShrink: 0 }} />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} type="text" placeholder="Search order #, customer…" className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none" />
          </div>
          <div className="flex bg-page border border-border rounded-lg overflow-hidden overflow-x-auto thin-scroll">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-[11px] capitalize whitespace-nowrap transition ${filter === t ? 'font-semibold bg-navy text-white' : 'font-medium text-gray-500 hover:bg-white/60'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[880px]">
            <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60" style={{ gridTemplateColumns: COLS }}>
              <div>Order #</div><div>Customer</div><div>Date</div>
              <div className="text-right">Items</div><div className="text-right">Total</div>
              <div className="text-center">Payment</div><div className="text-center">Status</div><div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-gray-100">
              {pageItems.length === 0 ? (
                <div className="py-16 text-center">
                  <Icon name="globe-outline" size={30} style={{ color: '#cbd5e1' }} />
                  <p className="text-[13px] text-gray-400 mt-2">No orders match your filters</p>
                </div>
              ) : (
                pageItems.map((o) => {
                  const ps = PAY_BADGE[o.payStatus] || { cls: 'text-gray-500 bg-gray-100', label: o.payStatus }
                  const isCOD = o.payment === 'Cash on Delivery'
                  const flow = SM_ORD_FLOW[o.status]
                  const canAccept = o.status === 'pending'
                  return (
                    <div key={o.id} className="grid items-center px-5 py-3.5 hover:bg-gray-50/50 transition" style={{ gridTemplateColumns: COLS }}>
                      <p className="text-[12px] font-mono font-semibold text-brand-blue">{o.id}</p>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-navy-dark truncate">{o.customer}</p>
                        <p className="text-[10px] text-gray-400 truncate">{o.area}</p>
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
                      <div className="text-center"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${SM_ORD_STATUS[o.status] || 'text-gray-500 bg-gray-100'}`}>{o.status}</span></div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <button onClick={() => oa.setViewOrder(o)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30 hover:bg-gray-50 transition shrink-0 whitespace-nowrap">
                          <Icon name="eye-outline" style={{ fontSize: '12px' }} />View
                        </button>
                        {canAccept ? (
                          <button onClick={() => oa.acceptOrder(o)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-green/30 bg-brand-green/10 text-brand-green hover:bg-brand-green/20 transition shrink-0 whitespace-nowrap">
                            <Icon name="checkmark-outline" style={{ fontSize: '12px' }} />Accept
                          </button>
                        ) : flow ? (
                          <button onClick={() => oa.advanceOrder(o)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-blue/30 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 transition shrink-0 whitespace-nowrap">
                            <Icon name={flow.icon} style={{ fontSize: '12px' }} />{flow.label}
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

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-gray-50/40">
          <p className="text-[11px] text-gray-400">{total ? `Showing ${(curPage - 1) * PAGE_SIZE + 1}–${Math.min(curPage * PAGE_SIZE, total)} of ${total}` : 'Showing 0 of 0'}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={curPage === 1} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition disabled:opacity-40"><Icon name="chevron-back-outline" style={{ fontSize: '13px' }} /></button>
            {Array.from({ length: pages }, (_, idx) => idx + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-lg text-[11px] font-semibold flex items-center justify-center transition ${p === curPage ? 'bg-navy text-white' : 'border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30'}`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={curPage === pages} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition disabled:opacity-40"><Icon name="chevron-forward-outline" style={{ fontSize: '13px' }} /></button>
          </div>
        </div>
      </div>

      <OrderDetailSlideover order={oa.viewOrder} onClose={() => oa.setViewOrder(null)} onAccept={oa.acceptOrder} onReject={oa.rejectOpen} onAdvance={oa.advanceOrder} />
      <StockCheckModal state={oa.stockCheck} onClose={() => oa.setStockCheck(null)} onAcceptPartial={oa.confirmPartialAccept} onReject={oa.rejectOpen} />
      <OrderRejectModal order={oa.rejectFor} onClose={() => oa.setRejectFor(null)} onConfirm={oa.confirmReject} />
    </div>
  )
}
