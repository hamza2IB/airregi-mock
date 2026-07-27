import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import PaymentCard from '../components/payments/PaymentCard'
import RejectModal from '../components/dashboard/RejectModal'
import { useToast } from '../components/Toast'
import { PV_DATA } from '../data/paymentData'

const PER_PAGE = 5

const TYPE_TABS = [
  { key: 'all', label: 'All' },
  { key: 'new-reg', label: 'New Reg' },
  { key: 'renewal', label: 'Renewals' },
]

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Sort: Newest First' },
  { value: 'date-asc', label: 'Sort: Oldest First' },
  { value: 'amount-desc', label: 'Sort: Amount (high–low)' },
  { value: 'amount-asc', label: 'Sort: Amount (low–high)' },
]

function KpiCard({ icon, iconCls, value, valueCls, label }) {
  return (
    <div className="bg-white rounded-xl border border-border px-4 py-3.5 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconCls}`}>
        <Icon name={icon} style={{ fontSize: '18px' }} />
      </div>
      <div>
        <p className={`text-[22px] font-extrabold leading-none ${valueCls}`}>{value}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function PaymentVerification() {
  const showToast = useToast()
  const [payments, setPayments] = useState(() => PV_DATA.map((p) => ({ ...p })))
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [receiptFilter, setReceiptFilter] = useState('')
  const [sortKey, setSortKey] = useState('date-desc')
  const [page, setPage] = useState(1)
  const [rejectTarget, setRejectTarget] = useState(null)

  const counts = useMemo(
    () => ({
      total: payments.length,
      newReg: payments.filter((p) => p.type === 'new-reg').length,
      renewal: payments.filter((p) => p.type === 'renewal').length,
      banned: payments.filter((p) => p.bizStatus === 'banned').length,
    }),
    [payments],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = payments.filter((p) => {
      const mt = typeFilter === 'all' || p.type === typeFilter
      const mq =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.ref.toLowerCase().includes(q) ||
        p.bank.toLowerCase().includes(q)
      const mr = !receiptFilter || (receiptFilter === 'yes' ? !!p.receipt : !p.receipt)
      return mt && mq && mr
    })
    return [...list].sort((a, b) => {
      if (sortKey === 'date-desc') return new Date(b.dateSort) - new Date(a.dateSort)
      if (sortKey === 'date-asc') return new Date(a.dateSort) - new Date(b.dateSort)
      if (sortKey === 'amount-desc') return b.amount - a.amount
      if (sortKey === 'amount-asc') return a.amount - b.amount
      return 0
    })
  }, [payments, search, typeFilter, receiptFilter, sortKey])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PER_PAGE
  const pageItems = filtered.slice(start, start + PER_PAGE)

  const resetPage = () => setPage(1)

  const handleVerify = (p, message) => {
    setPayments((prev) => prev.filter((x) => x.id !== p.id))
    showToast(message, 'success')
  }

  const handleConfirmReject = (target) => {
    setPayments((prev) => prev.filter((x) => x.name !== target.name))
    setRejectTarget(null)
    const msg =
      target.rejectType === 'new-reg'
        ? `${target.name} registration rejected. Applicant notified.`
        : `${target.name} payment rejected. Owner notified to resubmit.`
    showToast(msg, 'error')
  }

  const handleViewReceipt = (name) => window.alert('Opening receipt for: ' + name)

  return (
    <div className="adm-content p-8 max-md:p-4">
      {/* Summary KPI strip */}
      <div className="grid grid-cols-4 gap-3 mb-6 max-md:grid-cols-2">
        <KpiCard icon="layers-outline" iconCls="bg-navy/10 text-navy" value={counts.total} valueCls="text-navy-dark" label="Total Pending" />
        <KpiCard icon="business-outline" iconCls="bg-brand-purple/10 text-brand-purple" value={counts.newReg} valueCls="text-brand-purple" label="New Registrations" />
        <KpiCard icon="refresh-circle-outline" iconCls="bg-brand-orange/10 text-brand-orange" value={counts.renewal} valueCls="text-brand-orange" label="Renewals" />
        <KpiCard icon="ban-outline" iconCls="bg-brand-red/10 text-brand-red" value={counts.banned} valueCls="text-brand-red" label="From Banned Businesses" />
      </div>

      {/* Queue card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[200px] max-w-xs">
            <Icon name="search-outline" style={{ fontSize: '15px', color: '#94a3b8', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search business, ref#, bank…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                resetPage()
              }}
              className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none"
            />
          </div>

          {/* Type tabs */}
          <div className="flex bg-page border border-border rounded-lg overflow-hidden">
            {TYPE_TABS.map((tab) => {
              const active = typeFilter === tab.key
              const count = tab.key === 'all' ? counts.total : tab.key === 'new-reg' ? counts.newReg : counts.renewal
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setTypeFilter(tab.key)
                    resetPage()
                  }}
                  className={
                    active
                      ? 'px-3 py-1.5 text-[11px] font-semibold bg-navy text-white'
                      : 'px-3 py-1.5 text-[11px] font-medium text-gray-500 hover:bg-white/60 transition'
                  }
                >
                  {tab.label} <span className={active ? 'ml-1 opacity-70' : 'ml-1 opacity-60'}>{count}</span>
                </button>
              )
            })}
          </div>

          {/* Receipt filter */}
          <select
            value={receiptFilter}
            onChange={(e) => {
              setReceiptFilter(e.target.value)
              resetPage()
            }}
            className="text-[11px] font-medium text-gray-600 bg-page border border-border rounded-lg px-3 py-2 cursor-pointer"
          >
            <option value="">Receipt: Any</option>
            <option value="yes">Has Receipt</option>
            <option value="no">No Receipt</option>
          </select>

          {/* Sort */}
          <select
            value={sortKey}
            onChange={(e) => {
              setSortKey(e.target.value)
              resetPage()
            }}
            className="text-[11px] font-medium text-gray-600 bg-page border border-border rounded-lg px-3 py-2 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <div className="ml-auto shrink-0">
            <button
              onClick={() => exportCsv(filtered)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 bg-page border border-border px-3 py-2 rounded-lg hover:bg-white transition"
            >
              <Icon name="download-outline" style={{ fontSize: '14px' }} /> Export CSV
            </button>
          </div>
        </div>

        {/* Queue list */}
        <div className="divide-y divide-gray-300">
          {pageItems.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="text-[13px] text-gray-400">No payments match your filters.</p>
            </div>
          ) : (
            <>
              {pageItems.map((p) => (
                <PaymentCard
                  key={p.id}
                  p={p}
                  onVerify={handleVerify}
                  onReject={setRejectTarget}
                  onViewReceipt={handleViewReceipt}
                />
              ))}
              <div className="px-5 py-4 text-center bg-gray-50/30">
                <p className="text-[11px] text-gray-400">No more payments in queue.</p>
              </div>
            </>
          )}
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-gray-50/40">
          <p className="text-[11px] text-gray-400">
            {filtered.length === 0
              ? 'No results'
              : `Showing ${start + 1}–${Math.min(start + PER_PAGE, filtered.length)} of ${filtered.length} payments`}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition"
            >
              <Icon name="chevron-back-outline" style={{ fontSize: '13px' }} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg border text-[11px] font-semibold transition ${
                    p === currentPage
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-gray-500 border-border hover:border-navy/30 hover:text-navy'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition"
            >
              <Icon name="chevron-forward-outline" style={{ fontSize: '13px' }} />
            </button>
          </div>
        </div>
      </div>

      <RejectModal target={rejectTarget} onClose={() => setRejectTarget(null)} onConfirm={handleConfirmReject} />
    </div>
  )
}

function exportCsv(rows) {
  const headers = ['Business', 'Type', 'Package', 'Amount', 'Bank', 'Ref', 'Date', 'Receipt']
  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`
  const lines = [
    headers.join(','),
    ...rows.map((p) =>
      [p.name, p.type, p.pkg, p.amount, p.bank, p.ref, p.date, p.receipt || 'none'].map(escape).join(','),
    ),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'payment-verification.csv'
  a.click()
  URL.revokeObjectURL(url)
}
