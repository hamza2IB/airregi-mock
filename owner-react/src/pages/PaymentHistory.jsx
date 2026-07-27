import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import PaymentDetailSlideover from '../components/subscription/PaymentDetailSlideover'
import RenewalSlideover from '../components/subscription/RenewalSlideover'
import { PAYMENT_BADGE } from '../data/subscriptionData'

const PAGE_SIZE = 5
const COLS = '1fr 0.7fr 1fr 1.4fr 0.8fr 0.7fr'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'verified', label: 'Verified' },
  { key: 'pending', label: 'Pending' },
  { key: 'rejected', label: 'Rejected' },
]
const TAB_ACTIVE = 'px-3 py-1.5 text-[11px] font-semibold bg-navy text-white'
const TAB_IDLE = 'px-3 py-1.5 text-[11px] font-medium text-gray-500 hover:bg-white/60 transition'

const amountNum = (a) => parseInt(a.replace(/[^0-9]/g, ''), 10) || 0

function Kpi({ icon, wrap, value, valueCls, label }) {
  return (
    <div className="bg-white rounded-xl border border-border px-4 py-3.5 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${wrap}`}>
        <Icon name={icon} style={{ fontSize: '18px' }} />
      </div>
      <div>
        <p className={`text-[20px] font-extrabold leading-none ${valueCls}`}>{value}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function PaymentHistory({ payments, setPayments, onBack }) {
  const showToast = useToast()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [page, setPage] = useState(1)
  const [viewPayment, setViewPayment] = useState(null)
  const [renewal, setRenewal] = useState(null)

  const years = useMemo(
    () => [...new Set(payments.map((p) => p.date.split(', ')[1]))].sort((a, b) => b - a),
    [payments]
  )
  const monthsForYear = useMemo(() => {
    if (!year) return []
    const present = new Set(payments.filter((p) => p.date.includes(year)).map((p) => p.date.split(', ')[0].split(' ')[0]))
    return MONTHS.filter((m) => present.has(m))
  }, [payments, year])

  const kpis = useMemo(() => {
    const verified = payments.filter((p) => p.status === 'verified')
    return {
      totalPaid: 'Rs.' + verified.reduce((s, p) => s + amountNum(p.amount), 0).toLocaleString(),
      count: payments.length,
      verified: verified.length,
      rejected: payments.filter((p) => p.status === 'rejected').length,
    }
  }, [payments])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return payments.filter((p) => {
      const statusMatch = status === 'all' || p.status === status
      const qMatch = !q || p.plan.toLowerCase().includes(q) || p.bank.toLowerCase().includes(q) || p.ref.toLowerCase().includes(q)
      const yrMatch = !year || p.date.includes(year)
      const moMatch = !month || p.date.startsWith(month)
      return statusMatch && qMatch && yrMatch && moMatch
    })
  }, [payments, search, status, year, month])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const curPage = Math.min(page, totalPages)
  const start = (curPage - 1) * PAGE_SIZE
  const paged = filtered.slice(start, start + PAGE_SIZE)

  const resetPage = () => setPage(1)

  return (
    <div className="p-8 max-md:p-3.5">
      {/* Back + heading */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center hover:bg-gray-50 transition shrink-0">
          <Icon name="arrow-back-outline" className="text-navy" style={{ fontSize: '16px' }} />
        </button>
        <div>
          <h2 className="text-[18px] font-extrabold text-navy-dark leading-tight">Payment History</h2>
          <p className="text-[12px] text-gray-400 mt-0.5">All subscription bank transfer records</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3 mb-6 max-md:grid-cols-2">
        <Kpi icon="cash-outline" wrap="bg-brand-green/10 text-brand-green" value={kpis.totalPaid} valueCls="text-navy-dark" label="Total Paid" />
        <Kpi icon="receipt-outline" wrap="bg-navy/10 text-navy" value={kpis.count} valueCls="text-navy-dark" label="Total Payments" />
        <Kpi icon="checkmark-circle-outline" wrap="bg-brand-green/10 text-brand-green" value={kpis.verified} valueCls="text-brand-green" label="Verified" />
        <Kpi icon="close-circle-outline" wrap="bg-brand-red/10 text-brand-red" value={kpis.rejected} valueCls="text-brand-red" label="Rejected" />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[180px] max-w-xs">
            <Icon name="search-outline" style={{ fontSize: '15px', color: '#94a3b8', flexShrink: 0 }} />
            <input value={search} onChange={(e) => { setSearch(e.target.value); resetPage() }} type="text" placeholder="Search plan, bank, ref #…" className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none" />
          </div>
          <div className="flex bg-page border border-border rounded-lg overflow-hidden">
            {STATUS_TABS.map((t) => (
              <button key={t.key} onClick={() => { setStatus(t.key); resetPage() }} className={status === t.key ? TAB_ACTIVE : TAB_IDLE}>{t.label}</button>
            ))}
          </div>
          <select value={year} onChange={(e) => { setYear(e.target.value); setMonth(''); resetPage() }} className="text-[11px] font-medium text-gray-600 bg-page border border-border rounded-lg px-3 py-2 cursor-pointer">
            <option value="">All Years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={month} onChange={(e) => { setMonth(e.target.value); resetPage() }} disabled={!year} className="text-[11px] font-medium text-gray-600 bg-page border border-border rounded-lg px-3 py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="">All Months</option>
            {monthsForYear.map((m) => <option key={m} value={m}>{m} {year}</option>)}
          </select>
          <div className="ml-auto shrink-0">
            <button onClick={() => showToast('Exporting CSV…', 'info')} className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 bg-page border border-border px-3 py-2 rounded-lg hover:bg-white transition">
              <Icon name="download-outline" style={{ fontSize: '14px' }} /> Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[720px]">
            <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60" style={{ gridTemplateColumns: COLS }}>
              <div>Date</div><div>Plan</div><div>Amount</div><div>Bank / Ref #</div>
              <div className="text-center">Status</div><div className="text-right">Receipt</div>
            </div>
            <div className="divide-y divide-gray-100">
              {paged.length === 0 && <div className="py-12 text-center text-[12px] text-gray-400">No payments match your filters.</div>}
              {paged.map((p, i) => (
                <div key={i} className="grid items-center px-5 py-2.5 hover:bg-gray-50/60 transition" style={{ gridTemplateColumns: COLS }}>
                  <div>
                    <p className="text-[11px] font-medium text-gray-700">{p.date}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{p.time}</p>
                  </div>
                  <span className="text-[11px] font-semibold bg-navy/10 text-navy px-2 py-0.5 rounded-full w-fit">{p.plan}</span>
                  <p className="text-[13px] font-extrabold text-navy-dark">{p.amount}</p>
                  <div>
                    <p className="text-[12px] font-semibold text-gray-700">{p.bank}</p>
                    <p className="text-[10px] font-mono text-gray-400 mt-0.5">{p.ref}</p>
                  </div>
                  <div className="text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${PAYMENT_BADGE[p.status]}`}>{p.status}</span>
                    {p.note && <p className="text-[9px] text-brand-red mt-0.5">{p.note}</p>}
                  </div>
                  <div className="flex items-center justify-end">
                    <button onClick={() => setViewPayment(p)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30 hover:bg-gray-50 transition">
                      <Icon name="eye-outline" style={{ fontSize: '12px', flexShrink: 0 }} />View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-gray-50/40">
          <p className="text-[11px] text-gray-400">
            {filtered.length ? `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length} payment${filtered.length !== 1 ? 's' : ''}` : 'No payments found'}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition">
              <Icon name="chevron-back-outline" style={{ fontSize: '13px' }} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-lg text-[12px] font-semibold flex items-center justify-center transition ${p === curPage ? 'bg-navy text-white' : 'border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30'}`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition">
              <Icon name="chevron-forward-outline" style={{ fontSize: '13px' }} />
            </button>
          </div>
        </div>
      </div>

      <PaymentDetailSlideover payment={viewPayment} onClose={() => setViewPayment(null)} onSubmitNew={() => { setViewPayment(null); setRenewal({ mode: 'renew' }) }} />
      <RenewalSlideover item={renewal} onClose={() => setRenewal(null)} onSubmit={(payload) => { setPayments((prev) => [payload, ...prev]); setRenewal(null) }} />
    </div>
  )
}
