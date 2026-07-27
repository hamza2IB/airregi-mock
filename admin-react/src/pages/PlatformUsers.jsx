import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import PlatformUserRow from '../components/platform-users/PlatformUserRow'
import PuViewModal from '../components/platform-users/PuViewModal'
import PuSuspendModal from '../components/platform-users/PuSuspendModal'
import { useToast } from '../components/Toast'
import { PU_DATA, PU_ROLE_OPTIONS, PU_BIZ_NAMES } from '../data/platformUsers'

const PER_PAGE = 20

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'suspended', label: 'Suspended' },
]

const SORT_OPTIONS = [
  { value: 'name', label: 'Sort: Name A–Z' },
  { value: 'name-desc', label: 'Sort: Name Z–A' },
  { value: 'joined-desc', label: 'Sort: Joined (newest)' },
  { value: 'joined-asc', label: 'Sort: Joined (oldest)' },
]

const GRID = { gridTemplateColumns: '1.8fr 1fr 1.6fr 0.8fr 0.9fr 1.5fr' }

// Windowed page pills: 1 … 4 5 [6] 7 8 … N (ported from pillWindow).
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
        <p className={`text-[22px] font-extrabold leading-none ${valueCls}`}>{value}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function PlatformUsers() {
  const showToast = useToast()
  const [users, setUsers] = useState(() => PU_DATA.map((u) => ({ ...u })))
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [bizFilter, setBizFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [sortKey, setSortKey] = useState('name')
  const [page, setPage] = useState(1)

  const [viewUser, setViewUser] = useState(null)
  const [suspendUser, setSuspendUser] = useState(null)

  const kpis = useMemo(
    () => ({
      total: users.length,
      staff: users.filter((u) => u.role !== 'customer').length,
      customers: users.filter((u) => u.role === 'customer').length,
      suspended: users.filter((u) => u.status === 'suspended').length,
    }),
    [users],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = users.filter((u) => {
      const ms = statusFilter === 'all' || u.status === statusFilter
      const mq =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.bizName.toLowerCase().includes(q)
      const mr = !roleFilter || u.role === roleFilter
      const mb = !bizFilter || u.bizName === bizFilter
      return ms && mq && mr && mb
    })

    const dir = sortKey.endsWith('-desc') ? -1 : 1
    const k = sortKey.replace('-desc', '').replace('-asc', '')
    return [...list].sort((a, b) => {
      if (k === 'name') return dir * a.name.localeCompare(b.name)
      if (k === 'joined') return dir * (new Date(b.joined) - new Date(a.joined))
      return 0
    })
  }, [users, search, statusFilter, bizFilter, roleFilter, sortKey])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PER_PAGE
  const pageItems = filtered.slice(start, start + PER_PAGE)

  const resetPage = () => setPage(1)

  const applySuspend = (user, reason) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: 'suspended', suspendReason: reason } : u)),
    )
    setSuspendUser(null)
    showToast(`${user.name}'s login has been suspended.`, 'error')
  }

  const applyReactivate = (user) => {
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: 'active', suspendReason: undefined } : u)))
    setViewUser(null)
    showToast(`${user.name}'s login has been reactivated.`, 'success')
  }

  return (
    <div className="adm-content p-8 max-md:p-4">
      {/* Summary KPI strip */}
      <div className="grid grid-cols-4 gap-3 mb-6 max-md:grid-cols-2">
        <KpiCard icon="people-circle-outline" iconCls="bg-navy/10 text-navy" value={kpis.total} valueCls="text-navy-dark" label="Total Platform Users" />
        <KpiCard icon="business-outline" iconCls="bg-brand-blue/10 text-brand-blue" value={kpis.staff} valueCls="text-brand-blue" label="Business Staff" />
        <KpiCard icon="person-outline" iconCls="bg-brand-purple/10 text-brand-purple" value={kpis.customers} valueCls="text-brand-purple" label="Customers" />
        <KpiCard icon="ban-outline" iconCls="bg-brand-red/10 text-brand-red" value={kpis.suspended} valueCls="text-brand-red" label="Suspended" />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[200px] max-w-xs">
            <Icon name="search-outline" style={{ fontSize: '15px', color: '#94a3b8', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search name, email, business…"
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
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Business filter */}
          <select
            value={bizFilter}
            onChange={(e) => {
              setBizFilter(e.target.value)
              resetPage()
            }}
            className="text-[11px] font-medium text-gray-600 bg-page border border-border rounded-lg px-3 py-2 cursor-pointer max-w-[160px]"
          >
            <option value="">All Businesses</option>
            {PU_BIZ_NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value)
              resetPage()
            }}
            className="text-[11px] font-medium text-gray-600 bg-page border border-border rounded-lg px-3 py-2 cursor-pointer"
          >
            <option value="">All Roles</option>
            {PU_ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
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
        </div>

        {/* Table header */}
        <div
          className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60"
          style={GRID}
        >
          <div>User</div>
          <div>Role</div>
          <div>Business / Location</div>
          <div>Status</div>
          <div>Joined</div>
          <div>Actions</div>
        </div>

        {/* Table body */}
        <div className="divide-y divide-gray-300">
          {pageItems.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[13px] text-gray-400">No users match your filters.</p>
            </div>
          ) : (
            pageItems.map((u) => (
              <PlatformUserRow
                key={u.id}
                u={u}
                onView={setViewUser}
                onSuspend={(user) => {
                  setViewUser(null)
                  setSuspendUser(user)
                }}
                onReactivate={applyReactivate}
              />
            ))
          )}
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-gray-50/40">
          <p className="text-[11px] text-gray-400">
            {filtered.length === 0
              ? 'No results'
              : `Showing ${start + 1}–${Math.min(start + PER_PAGE, filtered.length)} of ${filtered.length} users`}
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
                  <span key={`e${i}`} className="w-7 h-7 flex items-center justify-center text-[11px] text-gray-400">
                    …
                  </span>
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

      {/* Modals */}
      <PuViewModal
        user={viewUser}
        onClose={() => setViewUser(null)}
        onSuspend={(user) => {
          setViewUser(null)
          setSuspendUser(user)
        }}
        onReactivate={applyReactivate}
      />
      <PuSuspendModal user={suspendUser} onClose={() => setSuspendUser(null)} onConfirm={applySuspend} />
    </div>
  )
}
