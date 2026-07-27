import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import OrderDetailSlideover from '../components/orders/OrderDetailSlideover'
import OrderRejectModal from '../components/orders/OrderRejectModal'
import StockCheckModal from '../components/orders/StockCheckModal'
import {
  DASH_DATA,
  DASH_PERIODS,
  SM_ORD_STATUS,
  SM_ORD_FLOW,
  SM_ORD_RANK,
  PAY_BADGE,
  fmtRs,
  initialsOf,
} from '../data/dashboardData'
import { SM_TR_STATUS, storeMeta, storeInitial, trParty } from '../data/transferData'
import TransferDetailSlideover from '../components/transfers/TransferDetailSlideover'
import DispatchModal from '../components/transfers/DispatchModal'
import RejectTransferModal from '../components/transfers/RejectTransferModal'
import { useTransferActions } from '../hooks/useTransferActions'
import { useOrderActions } from '../hooks/useOrderActions'

const QUEUE_COLS = '1.2fr 1.2fr .7fr .5fr .8fr 1.5fr .6fr 1.4fr'
const TR_COLS = '0.9fr 1.7fr .8fr 1fr .5fr .5fr .8fr 1fr'

function ChannelCard({ icon, iconBg, iconColor, title, orders, pct, amount, barColor }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon name={icon} className={iconColor} style={{ fontSize: '18px' }} />
        </div>
        <div>
          <p className="text-[12px] font-semibold text-navy-dark">{title}</p>
          <p className="text-[10px] text-gray-400">{orders.toLocaleString()} orders</p>
        </div>
        <span className="ml-auto text-[13px] font-bold text-navy-dark">{pct}%</span>
      </div>
      <p className="text-[22px] font-extrabold text-navy-dark mb-2">{fmtRs(amount)}</p>
      <div className="prog-bar">
        <div className="prog-bar-fill" style={{ width: `${pct}%`, background: barColor }}></div>
      </div>
    </div>
  )
}

function PayCard({ icon, iconBg, iconColor, label, amount, orders, pct, barColor }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-center gap-2 mb-2.5">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon name={icon} className={iconColor} style={{ fontSize: '16px' }} />
        </div>
        <p className="text-[12px] font-semibold text-gray-700">{label}</p>
      </div>
      <p className="text-[18px] font-bold text-navy-dark">{fmtRs(amount)}</p>
      <div className="flex items-center justify-between mt-2 mb-1.5">
        <span className="text-[10px] text-gray-500">{orders.toLocaleString()} orders</span>
        <span className="text-[10px] font-semibold text-gray-500">{pct}%</span>
      </div>
      <div className="prog-bar">
        <div className="prog-bar-fill" style={{ width: `${pct}%`, background: barColor }}></div>
      </div>
    </div>
  )
}

function CmpRow({ label, orders, amount, pct, barColor, bold }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: barColor }}></div>
          <span className={`text-[12px] ${bold ? 'font-semibold text-navy-dark' : 'font-medium text-gray-600'}`}>{label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-gray-500">{orders.toLocaleString()} orders</span>
          <span className={`text-[14px] font-bold ${bold ? 'text-navy-dark' : 'text-gray-700'}`}>{fmtRs(amount)}</span>
        </div>
      </div>
      <div className="w-full h-5 bg-gray-100 rounded-lg overflow-hidden">
        <div className="h-5 rounded-lg transition-all duration-500" style={{ width: `${pct}%`, background: barColor }}></div>
      </div>
    </div>
  )
}

export default function Dashboard({ onNavigate, inv, transfers, patchTransfer, adjustStock, addMovements, orders, patchOrder }) {
  const showToast = useToast()
  const [period, setPeriod] = useState('today')

  const tr = useTransferActions({ patchTransfer, adjustStock, addMovements })
  const oa = useOrderActions({ patchOrder })
  const availOf = (sku) => inv.find((i) => i.sku === sku)?.onHand ?? 0

  const d = DASH_DATA[period]
  const cmp = d.comparison
  const g2 = Math.round(((cmp.col1.amount - cmp.col2.amount) / cmp.col2.amount) * 100)
  const g3 = Math.round(((cmp.col1.amount - cmp.col3.amount) / cmp.col3.amount) * 100)

  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const packingCount = orders.filter((o) => o.status === 'packing').length

  const topTransfers = transfers.slice(0, 5)
  const trPending = transfers.filter((t) => t.status === 'pending').length
  const trTransit = transfers.filter((t) => t.status === 'dispatched').length

  const queue = useMemo(
    () =>
      [...orders]
        .filter((o) => ['pending', 'confirmed', 'packing', 'shipped'].includes(o.status))
        .sort((a, b) => SM_ORD_RANK[a.status] - SM_ORD_RANK[b.status])
        .slice(0, 5),
    [orders],
  )

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Period selector + Export */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1 bg-white border border-border rounded-xl p-1 overflow-x-auto thin-scroll min-w-0">
          {DASH_PERIODS.map((p) => (
            <button key={p.key} onClick={() => setPeriod(p.key)} className={`period-tab ${period === p.key ? 'active' : ''}`}>{p.label}</button>
          ))}
        </div>
        <button onClick={() => showToast('Exporting report…', 'info')} className="shrink-0 flex items-center gap-1.5 border border-border bg-white text-navy-dark px-3 sm:px-4 py-2 rounded-xl text-[12px] font-semibold hover:bg-gray-50 transition">
          <Icon name="download-outline" /> Export
        </button>
      </div>
      <p className="text-[11px] text-gray-400 font-medium mb-5">{d.periodLabel}</p>

      {/* Period-filtered group */}
      <div className="rounded-2xl border-2 border-dashed border-brand-blue/20 p-4 mb-5 relative flex flex-col gap-5">
        <span className="absolute -top-2.5 left-4 bg-page px-2 text-[9px] uppercase tracking-wider font-semibold text-brand-blue/60">Filtered by period</span>

        {/* Hero sales card */}
        <div className="bg-gradient-to-br from-navy-dark to-navy rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium">Total Sales — Main Branch</p>
              <span className={`shrink-0 text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${d.trendUp ? 'text-brand-green bg-brand-green/20' : 'text-brand-red bg-brand-red/20'}`}>{d.trend}</span>
            </div>
            <p className="text-[30px] sm:text-[38px] font-extrabold leading-tight">{fmtRs(d.totalSales)}</p>
            <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-8 mt-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Total Orders</p>
                <p className="text-[18px] sm:text-[20px] font-bold">{d.totalOrders.toLocaleString()}</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/15"></div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Customers Served</p>
                <p className="text-[18px] sm:text-[20px] font-bold">{d.customers.toLocaleString()}</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/15"></div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Items Sold</p>
                <p className="text-[18px] sm:text-[20px] font-bold">{d.itemsSold.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Channel split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChannelCard icon="storefront-outline" iconBg="bg-navy/10" iconColor="text-navy" title="In-Store (POS)" orders={d.pos.orders} pct={d.pos.pct} amount={d.pos.amount} barColor="#1a2d6b" />
          <ChannelCard icon="globe-outline" iconBg="bg-brand-blue/10" iconColor="text-brand-blue" title="Online (EC App)" orders={d.ec.orders} pct={d.ec.pct} amount={d.ec.amount} barColor="#3366cc" />
        </div>

        {/* Payment breakdown */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-brand-purple/10 flex items-center justify-center">
              <Icon name="card-outline" className="text-brand-purple" style={{ fontSize: '18px' }} />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-navy-dark">Payment Breakdown</p>
              <p className="text-[11px] text-gray-400">How customers are paying</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PayCard icon="cash-outline" iconBg="bg-brand-green/10" iconColor="text-brand-green" label="Cash" {...d.payments.cash} barColor="#2dd36f" />
            <PayCard icon="card-outline" iconBg="bg-brand-blue/10" iconColor="text-brand-blue" label="Card" {...d.payments.card} barColor="#3366cc" />
            <PayCard icon="qr-code-outline" iconBg="bg-brand-purple/10" iconColor="text-brand-purple" label="App QR" {...d.payments.qr} barColor="#7c4dff" />
            <PayCard icon="bicycle-outline" iconBg="bg-brand-orange/10" iconColor="text-brand-orange" label="COD (Online)" {...d.payments.cod} barColor="#ff9800" />
          </div>
        </div>

        {/* Sales comparison */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-lg bg-navy/10 flex items-center justify-center">
              <Icon name="stats-chart-outline" className="text-navy" style={{ fontSize: '18px' }} />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-navy-dark">Sales Comparison</p>
              <p className="text-[11px] text-gray-400">{cmp.subtitle}</p>
            </div>
          </div>
          <div className="space-y-5">
            <CmpRow label={cmp.col1.label} orders={cmp.col1.orders} amount={cmp.col1.amount} pct={100} barColor="#3366cc" bold />
            <CmpRow label={cmp.col2.label} orders={cmp.col2.orders} amount={cmp.col2.amount} pct={Math.round((cmp.col2.amount / cmp.col1.amount) * 100)} barColor="rgba(26,45,107,0.3)" />
            <CmpRow label={cmp.col3.label} orders={cmp.col3.orders} amount={cmp.col3.amount} pct={Math.round((cmp.col3.amount / cmp.col1.amount) * 100)} barColor="rgba(26,45,107,0.15)" />
          </div>
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5 bg-brand-green/10 px-3 py-1.5 rounded-lg">
              <Icon name="trending-up" className="text-brand-green" style={{ fontSize: '13px' }} />
              <span className="text-[11px] font-semibold text-brand-green">{(g2 >= 0 ? '+' : '') + g2}% vs {cmp.col2.label.toLowerCase()}</span>
            </div>
            <span className="text-[10px] text-gray-300">|</span>
            <span className="text-[10px] text-gray-500">{(g3 >= 0 ? '+' : '') + g3}% vs {cmp.col3.label.toLowerCase()}</span>
          </div>
        </div>
      </div>

      {/* Fulfilment Queue */}
      <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold mb-3">Fulfilment Queue</p>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between gap-x-3 gap-y-2 flex-wrap px-5 py-4 border-b border-border">
          <div>
            <p className="text-[13px] font-semibold text-navy-dark">Pending Online Orders</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Orders awaiting acceptance &amp; fulfilment</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold bg-brand-orange/10 text-brand-orange px-2.5 py-1 rounded-full">{pendingCount} Pending</span>
            <span className="text-[10px] font-bold bg-brand-purple/10 text-brand-purple px-2.5 py-1 rounded-full">{packingCount} Packing</span>
            <button onClick={() => onNavigate('orders')} className="text-[11px] font-semibold text-brand-blue hover:underline ml-1">View all →</button>
          </div>
        </div>

        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[820px]">
            <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60" style={{ gridTemplateColumns: QUEUE_COLS }}>
              <div>Order #</div><div>Customer</div><div>Date</div>
              <div className="text-right">Items</div><div className="text-right">Total</div>
              <div className="text-center">Payment</div><div className="text-center">Status</div><div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-gray-100">
              {queue.length === 0 ? (
                <div className="py-14 text-center">
                  <Icon name="checkmark-done-circle-outline" size={30} style={{ color: '#cbd5e1' }} />
                  <p className="text-[13px] text-gray-400 mt-2">No pending orders — all caught up!</p>
                </div>
              ) : (
                queue.map((o) => {
                  const ps = PAY_BADGE[o.payStatus] || { cls: 'text-gray-500 bg-gray-100', label: o.payStatus }
                  const isCOD = o.payment === 'Cash on Delivery'
                  const flow = SM_ORD_FLOW[o.status]
                  const canAccept = o.status === 'pending'
                  return (
                    <div key={o.id} className="grid items-center px-5 py-3.5 hover:bg-gray-50/50 transition" style={{ gridTemplateColumns: QUEUE_COLS }}>
                      <p className="text-[12px] font-mono font-semibold text-brand-blue">{o.id}</p>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-navy-dark truncate">{o.customer}</p>
                        <p className="text-[10px] text-gray-400 truncate">{o.area}</p>
                      </div>
                      <p className="text-[11px] text-gray-500">{o.date.split(' ').slice(0, 3).join(' ')}</p>
                      <p className="text-[13px] font-bold text-navy-dark text-right">{o.items}</p>
                      <p className="text-[12px] font-bold text-navy-dark text-right">{fmtRs(o.total)}</p>
                      <div className="min-w-0 flex flex-col items-center">
                        <div className="flex items-center gap-1.5">
                          <Icon name={isCOD ? 'cash-outline' : 'phone-portrait-outline'} style={{ fontSize: '11px', color: '#94a3b8', flexShrink: 0 }} />
                          <p className="text-[11px] font-medium text-navy-dark truncate">{o.payment}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ps.cls} mt-0.5 inline-block`}>{ps.label}</span>
                      </div>
                      <div className="text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${SM_ORD_STATUS[o.status] || 'text-gray-500 bg-gray-100'}`}>{o.status}</span>
                      </div>
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

        <div className="px-5 py-3 border-t border-border bg-gray-50/40 flex items-center justify-between gap-2 flex-wrap">
          <p className="text-[11px] text-gray-400">Showing latest pending orders</p>
          <button onClick={() => onNavigate('orders')} className="text-[11px] font-semibold text-brand-blue hover:underline">View all orders →</button>
        </div>
      </div>

      {/* Recent Stock Transfers */}
      <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold mb-3 mt-6">Recent Stock Transfers</p>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between gap-x-3 gap-y-2 flex-wrap px-5 py-4 border-b border-border">
          <div>
            <p className="text-[13px] font-semibold text-navy-dark">Top 5 Stock Transfers</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Latest replenishment activity for this branch</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold bg-brand-purple/10 text-brand-purple px-2.5 py-1 rounded-full">{trPending} Pending</span>
            <span className="text-[10px] font-bold bg-brand-orange/10 text-brand-orange px-2.5 py-1 rounded-full">{trTransit} Dispatched</span>
            <button onClick={() => onNavigate('requests')} className="text-[11px] font-semibold text-brand-blue hover:underline ml-1">View all →</button>
          </div>
        </div>

        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[820px]">
            <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60" style={{ gridTemplateColumns: TR_COLS }}>
              <div>Transfer #</div><div>Branch / Warehouse</div><div>Requested</div><div>Requested By</div>
              <div className="text-right">Items</div><div className="text-right">Units</div>
              <div className="text-center">Status</div><div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-gray-100">
              {topTransfers.map((t) => {
                const st = SM_TR_STATUS[t.status] || SM_TR_STATUS.pending
                const party = trParty(t)
                const m = storeMeta(party)
                const outgoing = t.dir === 'out'
                return (
                  <div key={t.id} className="grid items-center px-5 py-3 hover:bg-gray-50/50 transition" style={{ gridTemplateColumns: TR_COLS }}>
                    <p className="text-[12px] font-mono font-semibold text-brand-blue">{t.id}</p>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-extrabold text-white shrink-0" style={{ background: m.color }}>{storeInitial(party)}</div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[12px] font-semibold text-navy-dark truncate leading-tight">{party}</p>
                          {t.urgent && <span className="text-[9px] font-bold text-white bg-brand-red px-1.5 py-0.5 rounded-full shrink-0">URGENT</span>}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-gray-400 font-mono">{m.code}</span>
                          <span className={`text-[8px] font-bold uppercase tracking-wide px-1 py-px rounded ${outgoing ? 'text-brand-blue bg-brand-blue/10' : 'text-brand-purple bg-brand-purple/10'}`}>{outgoing ? 'Outgoing' : 'Incoming'}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500">{t.date}</p>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-brand-purple/15 flex items-center justify-center shrink-0 text-[9px] font-extrabold text-brand-purple">{initialsOf(t.requestedBy)}</div>
                      <p className="text-[11px] text-gray-600 font-medium truncate">{t.requestedBy}</p>
                    </div>
                    <p className="text-[13px] font-bold text-navy-dark text-right">{t.items}</p>
                    <p className="text-[13px] font-bold text-navy-dark text-right">{t.units}</p>
                    <div className="text-center"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span></div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <button onClick={() => tr.setViewTransfer(t)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30 hover:bg-gray-50 transition shrink-0 whitespace-nowrap">
                        <Icon name="eye-outline" style={{ fontSize: '12px' }} />View
                      </button>
                      {!outgoing && t.status === 'pending' ? (
                        <button onClick={() => tr.approveTransfer(t)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-green/30 bg-brand-green/10 text-brand-green hover:bg-brand-green/20 transition shrink-0 whitespace-nowrap">
                          <Icon name="checkmark-outline" style={{ fontSize: '12px' }} />Approve
                        </button>
                      ) : outgoing && t.status === 'dispatched' ? (
                        <button onClick={() => tr.confirmReceipt(t)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-green/30 bg-brand-green/10 text-brand-green hover:bg-brand-green/20 transition shrink-0 whitespace-nowrap">
                          <Icon name="checkmark-done-outline" style={{ fontSize: '12px' }} />Receive
                        </button>
                      ) : !outgoing && t.status === 'dispatched' ? (
                        <span className="text-[9px] text-brand-orange italic whitespace-nowrap">Awaiting receipt</span>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border bg-gray-50/40 flex items-center justify-between gap-2 flex-wrap">
          <p className="text-[11px] text-gray-400">Showing latest 5 transfers</p>
          <button onClick={() => onNavigate('requests')} className="text-[11px] font-semibold text-brand-blue hover:underline">View all transfers →</button>
        </div>
      </div>

      <OrderDetailSlideover order={oa.viewOrder} onClose={() => oa.setViewOrder(null)} onAccept={oa.acceptOrder} onReject={oa.rejectOpen} onAdvance={oa.advanceOrder} />
      <StockCheckModal state={oa.stockCheck} onClose={() => oa.setStockCheck(null)} onAcceptPartial={oa.confirmPartialAccept} onReject={oa.rejectOpen} />
      <OrderRejectModal order={oa.rejectFor} onClose={() => oa.setRejectFor(null)} onConfirm={oa.confirmReject} />

      <TransferDetailSlideover transfer={tr.viewTransfer} onClose={() => tr.setViewTransfer(null)} onApprove={tr.approveTransfer} onReject={tr.rejectTransferOpen} onReceipt={tr.confirmReceipt} onCancel={tr.cancelTransfer} />
      <DispatchModal transfer={tr.dispatchFor} onClose={() => tr.setDispatchFor(null)} onConfirm={tr.confirmDispatch} availOf={availOf} />
      <RejectTransferModal transfer={tr.rejectTransferFor} onClose={() => tr.setRejectTransferFor(null)} onConfirm={tr.confirmRejectTransfer} />
    </div>
  )
}
