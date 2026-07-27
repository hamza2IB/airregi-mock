import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import PaymentHistoryRow from '../components/revenue/PaymentHistoryRow'
import { useToast } from '../components/Toast'
import {
  PH_DATA,
  PH_QUICK_RANGES,
  PH_QUICK_RANGE_LABEL,
  PH_YEARS,
  PH_BIZ_NAMES,
  phMonthsForYear,
  phQuickRangeBounds,
} from '../data/paymentHistory'

const PER_PAGE = 10
const GRID = { gridTemplateColumns: '1.8fr 0.9fr 0.9fr 1fr 1.2fr 1fr 0.9fr' }

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'verified', label: 'Verified' },
  { key: 'rejected', label: 'Rejected' },
]

function pillWindow(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1, current - 2, current + 2])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out = []
  let prev = 0
  sorted.forEach((p) => {
    if (prev && p - prev > 1) out.push('…')
    out.push(p)
    prev = p
  })
  return out
}

function KpiCard({ icon, iconCls, value, valueCls, label }) {
  return (
    <div className="bg-white rounded-xl border border-border px-4 py-3.5 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconCls}`}>
        <Icon name={icon} style={{ fontSize: '18px' }} />
      </div>
      <div>
        <p className={`font-extrabold leading-none ${valueCls}`}>{value}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function Revenue() {
  const showToast = useToast()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [biz, setBiz] = useState('')
  const [pkg, setPkg] = useState('')
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [quickRange, setQuickRange] = useState('all')
  const [page, setPage] = useState(1)

  const monthOptions = useMemo(() => (year ? phMonthsForYear(year) : []), [year])

  // Global KPIs (from the full ledger, not the filtered view).
  const kpis = useMemo(() => {
    const verified = PH_DATA.filter((p) => p.status === 'verified')
    return {
      total: 'Rs.' + verified.reduce((s, p) => s + p.amount, 0).toLocaleString(),
      count: PH_DATA.length,
      verified: verified.length,
      rejected: PH_DATA.filter((p) => p.status === 'rejected').length,
    }
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const range = quickRange !== 'all' ? phQuickRangeBounds(quickRange) : null
    return PH_DATA.filter((p) => {
      const ms = status === 'all' || p.status === status
      const mq =
        !q ||
        p.bizName.toLowerCase().includes(q) ||
        p.ref.toLowerCase().includes(q) ||
        p.bank.toLowerCase().includes(q)
      const mb = !biz || p.bizName === biz
      const mp = !pkg || p.pkg === pkg
      const my = !year || p.dateSort.slice(0, 4) === year
      const mm = !month || p.dateSort.slice(0, 7) === month
      const mr = !range || (p.dateSort >= range.from && p.dateSort <= range.to)
      return ms && mq && mb && mp && my && mm && mr
    }).sort((a, b) => new Date(b.dateSort) - new Date(a.dateSort))
  }, [search, status, biz, pkg, year, month, quickRange])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PER_PAGE
  const pageItems = filtered.slice(start, start + PER_PAGE)

  const resetPage = () => setPage(1)

  // ── Mutually-exclusive filter setters ──
  const applyQuickRange = (r) => {
    setQuickRange(r)
    if (r !== 'all') {
      setYear('')
      setMonth('')
    }
    resetPage()
  }
  const applyYear = (y) => {
    setYear(y)
    setMonth('')
    setQuickRange('all')
    resetPage()
  }
  const applyMonth = (m) => {
    setMonth(m)
    setQuickRange('all')
    resetPage()
  }

  // ── Active filter chips ──
  const monthLabel = monthOptions.find((o) => o.value === month)?.label
  const chips = []
  if (search.trim()) chips.push({ kind: 'search', label: `Search: "${search.trim()}"` })
  if (status !== 'all') chips.push({ kind: 'status', label: `Status: ${status === 'verified' ? 'Verified' : 'Rejected'}` })
  if (biz) chips.push({ kind: 'biz', label: `Business: ${biz}` })
  if (pkg) chips.push({ kind: 'pkg', label: `Package: ${pkg}` })
  if (year) chips.push({ kind: 'yearmonth', label: month ? `Date: ${monthLabel} ${year}` : `Year: ${year}` })
  if (quickRange !== 'all') chips.push({ kind: 'range', label: PH_QUICK_RANGE_LABEL[quickRange] })

  const clearOne = (kind) => {
    if (kind === 'search') setSearch('')
    else if (kind === 'status') setStatus('all')
    else if (kind === 'biz') setBiz('')
    else if (kind === 'pkg') setPkg('')
    else if (kind === 'yearmonth') {
      setYear('')
      setMonth('')
    } else if (kind === 'range') setQuickRange('all')
    resetPage()
  }

  const clearAll = () => {
    setSearch('')
    setStatus('all')
    setBiz('')
    setPkg('')
    setYear('')
    setMonth('')
    setQuickRange('all')
    resetPage()
  }

  const exportCsv = () => {
    const headers = ['Business', 'Package', 'Type', 'Amount (PKR)', 'Bank', 'Reference', 'Date', 'Status']
    const escape = (v) => `"${String(v).replace(/"/g, '""')}"`
    const lines = [
      headers.join(','),
      ...filtered.map((p) =>
        [
          p.bizName,
          p.pkg,
          p.type === 'renewal' ? 'Renewal' : 'New Registration',
          p.amount,
          p.bank,
          p.ref,
          p.date,
          p.status === 'verified' ? 'Verified' : 'Rejected',
        ]
          .map(escape)
          .join(','),
      ),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'payment-history.csv'
    a.click()
    URL.revokeObjectURL(url)
    showToast(`Exported ${filtered.length} payment record(s) to CSV.`, 'success')
  }

  const selectCls = 'text-[11px] font-medium text-gray-600 bg-page border border-border rounded-lg px-3 py-2 cursor-pointer'

  return (
    <div className="adm-content p-8 max-md:p-4">
      {/* Payment History heading */}
      <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold mb-3">Payment History</p>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3 mb-6 max-md:grid-cols-2">
        <KpiCard icon="cash-outline" iconCls="bg-brand-green/10 text-brand-green" value={<span className="text-[20px]">{kpis.total}</span>} valueCls="text-navy-dark" label="Total Collected" />
        <KpiCard icon="receipt-outline" iconCls="bg-navy/10 text-navy" value={<span className="text-[22px]">{kpis.count}</span>} valueCls="text-navy-dark" label="Total Transactions" />
        <KpiCard icon="checkmark-circle-outline" iconCls="bg-brand-blue/10 text-brand-blue" value={<span className="text-[22px]">{kpis.verified}</span>} valueCls="text-brand-blue" label="Verified" />
        <KpiCard icon="close-circle-outline" iconCls="bg-brand-red/10 text-brand-red" value={<span className="text-[22px]">{kpis.rejected}</span>} valueCls="text-brand-red" label="Rejected" />
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Quick range chips */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border flex-wrap">
          <span className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.06em] mr-1">Quick range</span>
          {PH_QUICK_RANGES.map((r) => {
            const active = quickRange === r.key
            return (
              <button
                key={r.key}
                onClick={() => applyQuickRange(r.key)}
                className={
                  active
                    ? 'px-3 py-1.5 text-[11px] font-semibold rounded-full bg-navy text-white transition'
                    : 'px-3 py-1.5 text-[11px] font-medium rounded-full bg-page border border-border text-gray-500 hover:bg-white transition'
                }
              >
                {r.label}
              </button>
            )
          })}
        </div>

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

          {/* Status tabs */}
          <div className="flex bg-page border border-border rounded-lg overflow-hidden">
            {STATUS_TABS.map((tab) => {
              const active = status === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setStatus(tab.key)
                    resetPage()
                  }}
                  className={
                    active
                      ? 'px-3 py-1.5 text-[11px] font-semibold bg-navy text-white'
                      : 'px-3 py-1.5 text-[11px] font-medium text-gray-500 hover:bg-white/60 transition'
                  }
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Business filter */}
          <select value={biz} onChange={(e) => { setBiz(e.target.value); resetPage() }} className={`${selectCls} max-w-[160px]`}>
            <option value="">All Businesses</option>
            {PH_BIZ_NAMES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          {/* Package filter */}
          <select value={pkg} onChange={(e) => { setPkg(e.target.value); resetPage() }} className={selectCls}>
            <option value="">All Packages</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Pro">Pro</option>
            <option value="Starter">Starter</option>
          </select>

          {/* Year filter */}
          <select value={year} onChange={(e) => applyYear(e.target.value)} className={selectCls}>
            <option value="">All Years</option>
            {PH_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* Month filter — scoped to year */}
          <select value={month} onChange={(e) => applyMonth(e.target.value)} disabled={!year} className={`${selectCls} disabled:opacity-50 disabled:cursor-not-allowed`}>
            <option value="">{year ? `All ${year} Months` : 'All Months'}</option>
            {monthOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <div className="ml-auto shrink-0">
            <button
              onClick={exportCsv}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 bg-page border border-border px-3 py-2 rounded-lg hover:bg-white transition"
            >
              <Icon name="download-outline" style={{ fontSize: '14px' }} /> Export CSV
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {chips.length > 0 && (
          <div className="flex items-center gap-2 px-5 py-2.5 border-b border-border bg-gray-50/60 flex-wrap">
            {chips.map((c) => (
              <span
                key={c.kind}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-navy-dark bg-white border border-border pl-2.5 pr-1.5 py-1 rounded-full"
              >
                {c.label}
                <button
                  onClick={() => clearOne(c.kind)}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-red hover:bg-brand-red/10 transition"
                >
                  <Icon name="close" style={{ fontSize: '11px' }} />
                </button>
              </span>
            ))}
            <button onClick={clearAll} className="text-[11px] font-semibold text-brand-blue hover:underline ml-1">
              Clear all
            </button>
          </div>
        )}

        {/* Table header */}
        <div
          className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60"
          style={GRID}
        >
          <div>Business</div>
          <div>Package</div>
          <div>Type</div>
          <div>Amount</div>
          <div>Bank / Ref</div>
          <div>Date</div>
          <div>Status</div>
        </div>

        {/* Table body */}
        <div className="divide-y divide-gray-300">
          {pageItems.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[13px] text-gray-400">No payments match your filters.</p>
            </div>
          ) : (
            pageItems.map((p) => <PaymentHistoryRow key={p.id} p={p} />)
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
              {pillWindow(currentPage, totalPages).map((p, i) =>
                p === '…' ? (
                  <span key={`e${i}`} className="w-7 h-7 flex items-center justify-center text-[11px] text-gray-400">…</span>
                ) : (
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
                ),
              )}
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
    </div>
  )
}
