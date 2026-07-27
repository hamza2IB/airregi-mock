import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import BusinessRow from '../components/businesses/BusinessRow'
import BusinessDrawer from '../components/businesses/BusinessDrawer'
import SuspendModal from '../components/businesses/SuspendModal'
import ReactivateModal from '../components/businesses/ReactivateModal'
import RejectModal from '../components/dashboard/RejectModal'
import { useToast } from '../components/Toast'
import { BIZ_DATA } from '../data/businessData'

const PER_PAGE = 10

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'Pending' },
  { key: 'suspended', label: 'Suspended' },
  { key: 'banned', label: 'Banned' },
]

const SORT_OPTIONS = [
  { value: 'name', label: 'Sort: Name A–Z' },
  { value: 'name-desc', label: 'Sort: Name Z–A' },
  { value: 'joined', label: 'Sort: Joined (newest)' },
  { value: 'expiry', label: 'Sort: Expiry (soonest)' },
  { value: 'stores', label: 'Sort: Stores (most)' },
]

const GRID = { gridTemplateColumns: '2fr 1.4fr 0.8fr 0.8fr 0.5fr 0.5fr 0.6fr 1.3fr 1.4fr' }

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

export default function Businesses({ onNavigate }) {
  const showToast = useToast()
  const [businesses, setBusinesses] = useState(() => BIZ_DATA.map((b) => ({ ...b })))
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pkgFilter, setPkgFilter] = useState('')
  const [sortKey, setSortKey] = useState('name')
  const [page, setPage] = useState(1)

  const [drawerBiz, setDrawerBiz] = useState(null)
  const [suspendBiz, setSuspendBiz] = useState(null)
  const [reactivateBiz, setReactivateBiz] = useState(null)
  const [rejectBiz, setRejectBiz] = useState(null)

  const counts = useMemo(() => {
    const by = (s) => businesses.filter((b) => b.status === s).length
    return {
      total: businesses.length,
      active: by('active'),
      pending: by('pending'),
      suspended: by('suspended'),
      banned: by('banned'),
    }
  }, [businesses])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = businesses.filter((b) => {
      const ms = statusFilter === 'all' || b.status === statusFilter
      const mq =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.owner.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q)
      const mp = !pkgFilter || b.pkg === pkgFilter
      return ms && mq && mp
    })

    const dir = sortKey.endsWith('-desc') ? -1 : 1
    const k = sortKey.replace('-desc', '')
    return [...list].sort((a, b) => {
      if (k === 'name') return dir * a.name.localeCompare(b.name)
      if (k === 'stores') return dir * (b.stores - a.stores)
      if (k === 'expiry') return dir * ((a.daysLeft ?? 9999) - (b.daysLeft ?? 9999))
      if (k === 'joined') return dir * (new Date(b.joined) - new Date(a.joined))
      return 0
    })
  }, [businesses, search, statusFilter, pkgFilter, sortKey])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PER_PAGE
  const pageItems = filtered.slice(start, start + PER_PAGE)

  const resetPage = () => setPage(1)

  // ── Mutations ──
  const applySuspend = (biz, reason) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === biz.id ? { ...b, status: 'suspended', suspendReason: reason } : b)),
    )
    setSuspendBiz(null)
    showToast(`${biz.name} has been suspended.`, 'error')
  }

  const applyReactivate = (biz) => {
    const wasBanned = biz.status === 'banned'
    setBusinesses((prev) =>
      prev.map((b) => (b.id === biz.id ? { ...b, status: 'active', suspendReason: undefined } : b)),
    )
    setReactivateBiz(null)
    showToast(`${biz.name} has been ${wasBanned ? 'restored' : 'reactivated'}.`, 'success')
  }

  const applyReject = (target) => {
    setRejectBiz(null)
    showToast(`${target.name} registration rejected. Applicant notified.`, 'error')
  }

  const goPayments = () => {
    setDrawerBiz(null)
    onNavigate?.('payments')
  }

  return (
    <div className="adm-content p-8 max-md:p-4">
      {/* Summary KPI strip */}
      <div className="grid grid-cols-5 gap-3 mb-6 max-md:grid-cols-2">
        <KpiCard icon="business-outline" iconCls="bg-brand-blue/10 text-brand-blue" value={counts.total} valueCls="text-navy-dark" label="Total" />
        <KpiCard icon="checkmark-circle-outline" iconCls="bg-brand-green/10 text-brand-green" value={counts.active} valueCls="text-brand-green" label="Active" />
        <KpiCard icon="hourglass-outline" iconCls="bg-brand-purple/10 text-brand-purple" value={counts.pending} valueCls="text-brand-purple" label="Pending" />
        <KpiCard icon="pause-circle-outline" iconCls="bg-brand-orange/10 text-brand-orange" value={counts.suspended} valueCls="text-brand-orange" label="Suspended" />
        <KpiCard icon="ban-outline" iconCls="bg-brand-red/10 text-brand-red" value={counts.banned} valueCls="text-brand-red" label="Banned" />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[200px] max-w-xs">
            <Icon name="search-outline" style={{ fontSize: '15px', color: '#94a3b8', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search name, owner, city…"
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
              const active = statusFilter === tab.key
              const count = tab.key === 'all' ? counts.total : counts[tab.key]
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setStatusFilter(tab.key)
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

          {/* Package filter */}
          <select
            value={pkgFilter}
            onChange={(e) => {
              setPkgFilter(e.target.value)
              resetPage()
            }}
            className="text-[11px] font-medium text-gray-600 bg-page border border-border rounded-lg px-3 py-2 cursor-pointer"
          >
            <option value="">All Packages</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Pro">Pro</option>
            <option value="Starter">Starter</option>
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

        {/* Table header */}
        <div
          className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60"
          style={GRID}
        >
          <div>Business</div>
          <div>Owner</div>
          <div>Package</div>
          <div>Status</div>
          <div>Stores</div>
          <div>Staff</div>
          <div>Products</div>
          <div>Subscription</div>
          <div>Actions</div>
        </div>

        {/* Table body */}
        <div className="divide-y divide-gray-300">
          {pageItems.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[13px] text-gray-400">No businesses match your filters.</p>
            </div>
          ) : (
            pageItems.map((b) => (
              <BusinessRow
                key={b.id}
                b={b}
                onView={setDrawerBiz}
                onSuspend={setSuspendBiz}
                onReject={setRejectBiz}
                onReactivate={setReactivateBiz}
                onGoPayments={goPayments}
              />
            ))
          )}
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-gray-50/40">
          <p className="text-[11px] text-gray-400">
            {filtered.length === 0
              ? 'No results'
              : `Showing ${start + 1}–${Math.min(start + PER_PAGE, filtered.length)} of ${filtered.length} businesses`}
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

      {/* Drawer + modals */}
      <BusinessDrawer
        biz={drawerBiz}
        onClose={() => setDrawerBiz(null)}
        onSuspend={(b) => {
          setDrawerBiz(null)
          setSuspendBiz(b)
        }}
        onReject={(b) => {
          setDrawerBiz(null)
          setRejectBiz(b)
        }}
        onReactivate={(b) => {
          setDrawerBiz(null)
          setReactivateBiz(b)
        }}
        onGoPayments={goPayments}
      />

      <SuspendModal biz={suspendBiz} onClose={() => setSuspendBiz(null)} onConfirm={applySuspend} />
      <ReactivateModal biz={reactivateBiz} onClose={() => setReactivateBiz(null)} onConfirm={applyReactivate} />
      <RejectModal
        target={rejectBiz ? { rejectType: 'new-reg', name: rejectBiz.name, payment: { ref: '—' } } : null}
        onClose={() => setRejectBiz(null)}
        onConfirm={applyReject}
      />
    </div>
  )
}

// Simple client-side CSV export of the currently filtered rows.
function exportCsv(rows) {
  const headers = ['Business', 'City', 'Owner', 'Package', 'Status', 'Stores', 'Staff', 'Products', 'Joined', 'Subscription End']
  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`
  const lines = [
    headers.join(','),
    ...rows.map((b) =>
      [b.name, b.city, b.owner, b.pkg, b.status, b.stores, b.staff, b.products, b.joined, b.subEnd]
        .map(escape)
        .join(','),
    ),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'businesses.csv'
  a.click()
  URL.revokeObjectURL(url)
}
