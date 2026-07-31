import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import RefundDetailSlideover from '../components/refunds/RefundDetailSlideover'
import RefundConfirmModal from '../components/refunds/RefundConfirmModal'

function KpiCard({ icon, iconBg, iconColor, value, valueCls, label }) {
  return (
    <div className="bg-white rounded-xl border border-border px-4 py-3.5 flex items-center gap-3">
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

const TABS = ['all', 'pending', 'processed']
const COLS = '0.9fr 1.2fr 1.6fr 0.9fr 0.9fr 0.85fr 1.1fr'

export default function Refunds({ orders, setOrders }) {
  const showToast = useToast()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [viewRefund, setViewRefund] = useState(null) // { order, refund, idx }
  const [processState, setProcessState] = useState(null) // { order, refund, idx }

  // Flatten refunds across all orders; pending first.
  const allRefunds = useMemo(() => {
    const list = []
    orders.forEach((o) => (o.refunds || []).forEach((r, idx) => list.push({ order: o, refund: r, idx })))
    return list.sort((a, b) => (a.refund.status !== b.refund.status ? (a.refund.status === 'pending' ? -1 : 1) : 0))
  }, [orders])

  const kpis = useMemo(() => {
    const pending = allRefunds.filter((r) => r.refund.status === 'pending')
    const processed = allRefunds.filter((r) => r.refund.status === 'processed')
    return {
      pendingCount: pending.length,
      pendingAmount: pending.reduce((s, r) => s + r.refund.amount, 0),
      processedCount: processed.length,
      processedAmount: processed.reduce((s, r) => s + r.refund.amount, 0),
    }
  }, [allRefunds])

  const rows = useMemo(() => {
    const q = search.toLowerCase()
    return allRefunds.filter(({ order, refund }) => {
      const ms = !q || order.id.toLowerCase().includes(q) || order.customer.toLowerCase().includes(q)
      const mf = filter === 'all' || refund.status === filter
      return ms && mf
    })
  }, [allRefunds, search, filter])

  const processRefund = (refId) => {
    const { order, idx } = processState
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? { ...o, refunds: o.refunds.map((r, i) => (i === idx ? { ...r, status: 'processed', refId, processedDate: 'Jul 21, 2026' } : r)) }
          : o,
      ),
    )
    const amount = processState.refund.amount
    setProcessState(null)
    showToast(`Refund of Rs.${amount.toLocaleString()} marked as processed for ${order.id}.`, 'success')
  }

  return (
    <div className="p-8 max-md:p-3.5">
      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3 mb-6 max-md:grid-cols-2">
        <KpiCard icon="time-outline" iconBg="bg-brand-orange/10" iconColor="text-brand-orange" value={kpis.pendingCount} valueCls="text-brand-orange" label="Pending Refunds" />
        <KpiCard icon="cash-outline" iconBg="bg-brand-red/10" iconColor="text-brand-red" value={`Rs.${kpis.pendingAmount.toLocaleString()}`} valueCls="text-brand-red text-[20px]" label="Amount Owed to Customers" />
        <KpiCard icon="checkmark-circle-outline" iconBg="bg-brand-green/10" iconColor="text-brand-green" value={kpis.processedCount} valueCls="text-brand-green" label="Processed" />
        <KpiCard icon="layers-outline" iconBg="bg-navy/10" iconColor="text-navy" value={`Rs.${kpis.processedAmount.toLocaleString()}`} valueCls="text-navy-dark text-[20px]" label="Total Refunded" />
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2.5 bg-brand-orange/5 border border-brand-orange/20 rounded-xl px-4 py-3 mb-6">
        <Icon name="information-circle-outline" size={15} style={{ color: '#ff9800', flexShrink: 0, marginTop: 1 }} />
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Refunds are created automatically when an online order paid via <strong className="text-navy-dark">Bank Transfer / JazzCash / EasyPaisa</strong> is partially accepted due to stock shortages. Process each refund and record a reference number once the money has been returned to the customer.
        </p>
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
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none"
            />
          </div>
          <div className="flex bg-page border border-border rounded-lg overflow-hidden">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 text-[11px] capitalize transition ${filter === t ? 'font-semibold bg-navy text-white' : 'font-medium text-gray-500 hover:bg-white/60'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[880px]">
            <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60" style={{ gridTemplateColumns: COLS }}>
              <div>Order #</div>
              <div>Customer</div>
              <div>Reason</div>
              <div className="text-center">Amount</div>
              <div>Payment</div>
              <div className="text-center">Status</div>
              <div className="text-right">Actions</div>
            </div>

            {rows.length === 0 ? (
              <div className="py-16 text-center">
                <Icon name="checkmark-done-circle-outline" size={32} style={{ color: '#cbd5e1' }} />
                <p className="text-[13px] text-gray-400 mt-2">No refunds match your filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {rows.map(({ order: o, refund: r, idx }) => {
                  const isPending = r.status === 'pending'
                  return (
                    <div key={`${o.id}-${idx}`} className="grid items-center px-5 py-3.5 hover:bg-gray-50/50 transition" style={{ gridTemplateColumns: COLS }}>
                      <p className="text-[12px] font-mono font-semibold text-brand-blue cursor-pointer hover:underline" onClick={() => setViewRefund({ order: o, refund: r, idx })}>{o.id}</p>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-navy-dark truncate">{o.customer}</p>
                        <p className="text-[10px] text-gray-400">{o.area}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-gray-600">{r.reason}</p>
                        <p className="text-[10px] text-gray-400">{r.items.length} item{r.items.length !== 1 ? 's' : ''} affected</p>
                      </div>
                      <p className="text-[13px] font-bold text-brand-red text-center">Rs.{r.amount.toLocaleString()}</p>
                      <div>
                        <p className="text-[11px] font-medium text-navy-dark">{o.payment}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{o.paymentRef || '—'}</p>
                      </div>
                      <div className="text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isPending ? 'text-brand-orange bg-brand-orange/10' : 'text-brand-green bg-brand-green/10'}`}>{isPending ? 'Pending' : 'Processed'}</span>
                        {!isPending && r.refId && <p className="text-[9px] text-gray-400 font-mono mt-1">{r.refId}</p>}
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <button onClick={() => setViewRefund({ order: o, refund: r, idx })} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30 hover:bg-gray-50 transition shrink-0 whitespace-nowrap">
                          <Icon name="eye-outline" size={12} />View
                        </button>
                        {isPending && (
                          <button onClick={() => setProcessState({ order: o, refund: r, idx })} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-orange/30 bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 transition shrink-0 whitespace-nowrap">
                            <Icon name="checkmark-outline" size={12} />Process
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <RefundDetailSlideover entry={viewRefund} onClose={() => setViewRefund(null)} onProcess={(e) => { setViewRefund(null); setProcessState(e) }} />
      <RefundConfirmModal state={processState} onClose={() => setProcessState(null)} onConfirm={processRefund} />
    </div>
  )
}
