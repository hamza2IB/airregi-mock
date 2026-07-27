import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import ActionButton from '../components/ActionButton'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'
import UserFormSlideover from '../components/users/UserFormSlideover'
import { USERS_DATA, STAFF_ROLES, initials } from '../data/storeDetailData'

const PAGE_SIZE = 8
const STORES = ['Al Fatah Main Branch', 'Al Fatah DHA Branch', 'Al Fatah Johar Town', 'Central Warehouse']
const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'invited', label: 'Invited' },
  { key: 'inactive', label: 'Inactive' },
]

function Kpi({ value, valueCls, label }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 text-center">
      <p className={`text-[22px] font-extrabold ${valueCls}`}>{value}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    active: 'bg-brand-green/10 text-brand-green',
    invited: 'bg-brand-blue/10 text-brand-blue',
    inactive: 'bg-gray-100 text-gray-500',
  }
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${map[status] || map.inactive}`}>{status}</span>
}

export default function UsersStaff() {
  const showToast = useToast()
  const [users, setUsers] = useState(USERS_DATA)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [role, setRole] = useState('')
  const [store, setStore] = useState('')
  const [page, setPage] = useState(1)
  const [form, setForm] = useState(null) // { user } | null
  const [confirm, setConfirm] = useState(null)

  const kpis = useMemo(() => ({
    total: users.length,
    staff: users.filter((u) => u.role !== 'warehouse_manager').length,
    warehouse: users.filter((u) => u.role === 'warehouse_manager').length,
    suspended: users.filter((u) => u.status === 'inactive').length,
  }), [users])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter(
      (u) =>
        (status === 'all' || u.status === status) &&
        (!role || u.role === role) &&
        (!store || u.store === store) &&
        (!q || u.name.toLowerCase().includes(q) || u.phone.includes(q) || u.store.toLowerCase().includes(q))
    )
  }, [users, status, role, store, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const curPage = Math.min(page, totalPages)
  const start = (curPage - 1) * PAGE_SIZE
  const paged = filtered.slice(start, start + PAGE_SIZE)

  const resetPage = () => setPage(1)

  const toggleStatus = (u) => {
    const next = u.status === 'active' ? 'inactive' : 'active'
    setConfirm({
      title: next === 'inactive' ? 'Deactivate User' : 'Activate User',
      msg: `${next === 'inactive' ? 'Deactivate' : 'Activate'} ${u.name}?`,
      confirmLabel: next === 'inactive' ? 'Deactivate' : 'Activate',
      tone: next === 'inactive' ? 'danger' : 'success',
      onConfirm: () => {
        setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: next } : x)))
        showToast(`${u.name} ${next === 'active' ? 'activated' : 'deactivated'}`, next === 'active' ? 'success' : 'info')
      },
    })
  }

  const removeUser = (u) => {
    setConfirm({
      title: 'Delete User',
      msg: `Remove ${u.name} from the system?`,
      confirmLabel: 'Delete',
      tone: 'danger',
      onConfirm: () => {
        setUsers((prev) => prev.filter((x) => x.id !== u.id))
        showToast('User removed', 'error')
      },
    })
  }

  const handleSubmit = (payload, editId) => {
    if (editId != null) {
      setUsers((prev) => prev.map((u) => (u.id === editId ? { ...u, ...payload } : u)))
    } else {
      setUsers((prev) => {
        const newId = Math.max(...prev.map((u) => u.id)) + 1
        return [...prev, { id: newId, status: 'invited', lastLogin: '—', ...payload }]
      })
    }
    setForm(null)
  }

  return (
    <div className="p-8 max-md:p-3.5">
      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4 mb-6 max-md:grid-cols-2">
        <Kpi value={kpis.total} valueCls="text-navy-dark" label="Total Users" />
        <Kpi value={kpis.staff} valueCls="text-brand-blue" label="Store Staff" />
        <Kpi value={kpis.warehouse} valueCls="text-brand-purple" label="Warehouse" />
        <Kpi value="4,821" valueCls="text-brand-green" label="Customers" />
        <Kpi value={kpis.suspended} valueCls="text-brand-red" label="Suspended" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <Icon name="search-outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: '15px' }} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage() }}
            placeholder="Search users..."
            className="w-full bg-white border border-border rounded-xl pl-9 pr-4 h-[42px] text-[13px] text-navy-dark placeholder-gray-400 focus:outline-none focus:border-navy"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-border rounded-xl p-1">
          {STATUS_TABS.map((t) => (
            <button key={t.key} onClick={() => { setStatus(t.key); resetPage() }} className={`period-tab ${status === t.key ? 'active' : ''}`}>{t.label}</button>
          ))}
        </div>
        <select value={role} onChange={(e) => { setRole(e.target.value); resetPage() }} className="bg-white border border-border rounded-xl px-3 h-[42px] text-[12px] font-medium text-gray-600 cursor-pointer focus:outline-none focus:border-navy">
          <option value="">All Roles</option>
          {STAFF_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={store} onChange={(e) => { setStore(e.target.value); resetPage() }} className="bg-white border border-border rounded-xl px-3 h-[42px] text-[12px] font-medium text-gray-600 cursor-pointer focus:outline-none focus:border-navy">
          <option value="">All Stores</option>
          {STORES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => setForm({ user: null })} className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-xl text-[13px] font-semibold hover:bg-navy-light transition shrink-0">
          <Icon name="person-add-outline" style={{ fontSize: '16px' }} /> Invite User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto thin-scroll">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-border bg-gray-50/60">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Name / Phone</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Store</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-[12px] text-gray-400">No users found</td></tr>
              ) : (
                paged.map((u) => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50/60 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-[11px] font-bold text-navy shrink-0">{initials(u.name)}</div>
                        <div>
                          <p className="text-[12px] font-semibold text-navy-dark">{u.name}</p>
                          <p className="text-[10px] text-gray-400">{u.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-brand-blue/10 text-brand-blue">{u.role}</span></td>
                    <td className="px-4 py-3 text-[12px] text-gray-600">{u.store}</td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={u.status} /></td>
                    <td className="px-4 py-3 text-[12px] text-gray-500">{u.lastLogin}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <ActionButton icon="create-outline" label="Edit" onClick={() => setForm({ user: u })} />
                        {u.status === 'active' ? (
                          <ActionButton icon="pause-circle-outline" label="Deactivate" onClick={() => toggleStatus(u)} tone="orange" />
                        ) : (
                          <ActionButton icon="play-circle-outline" label="Activate" onClick={() => toggleStatus(u)} tone="green" />
                        )}
                        <ActionButton icon="trash-outline" label="Delete" onClick={() => removeUser(u)} tone="red" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-gray-50/40">
          <p className="text-[11px] text-gray-500">
            {filtered.length ? `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length}` : 'No users found'}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition">
              <Icon name="chevron-back-outline" style={{ fontSize: '12px' }} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-lg text-[12px] font-semibold flex items-center justify-center transition ${p === curPage ? 'bg-navy text-white' : 'border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30'}`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition">
              <Icon name="chevron-forward-outline" style={{ fontSize: '12px' }} />
            </button>
          </div>
        </div>
      </div>

      <UserFormSlideover item={form} onClose={() => setForm(null)} onSubmit={handleSubmit} />
      <ConfirmModal state={confirm} onClose={() => setConfirm(null)} />
    </div>
  )
}
