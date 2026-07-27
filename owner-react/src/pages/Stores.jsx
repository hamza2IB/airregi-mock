import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import ActionButton from '../components/ActionButton'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'
import StoreFormSlideover from '../components/stores/StoreFormSlideover'
import { STORES_PAGE_SIZE, storeAvatarColor } from '../data/storesData'

function KpiCard({ icon, iconWrap, value, valueCls, label }) {
  return (
    <div className="bg-white rounded-xl border border-border px-4 py-3.5 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconWrap}`}>
        <Icon name={icon} style={{ fontSize: '18px' }} />
      </div>
      <div>
        <p className={`text-[22px] font-extrabold leading-none ${valueCls}`}>{value}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}

const FTAB_ACTIVE = 'store-ftab px-3 py-1.5 text-[11px] font-semibold bg-navy text-white'
const FTAB_IDLE = 'store-ftab px-3 py-1.5 text-[11px] font-medium text-gray-500 hover:bg-white/60 transition'

export default function Stores({ stores, setStores }) {
  const showToast = useToast()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage] = useState(1)
  const [formItem, setFormItem] = useState(null) // { store } | null
  const [confirm, setConfirm] = useState(null)

  const total = stores.length
  const activeCount = stores.filter((s) => s.status === 'active').length
  const inactiveCount = total - activeCount

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return stores.filter(
      (s) =>
        (statusFilter === 'all' || s.status === statusFilter) &&
        (!typeFilter || s.type === typeFilter) &&
        (!q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.manager.toLowerCase().includes(q))
    )
  }, [stores, search, statusFilter, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / STORES_PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * STORES_PAGE_SIZE
  const paged = filtered.slice(start, start + STORES_PAGE_SIZE)

  const resetPage = () => setPage(1)

  const goto = (dir) => setPage((p) => Math.min(Math.max(1, p + dir), totalPages))

  const toggleStatus = (s) => {
    const next = s.status === 'active' ? 'inactive' : 'active'
    setConfirm({
      title: next === 'inactive' ? 'Deactivate Store' : 'Activate Store',
      msg: `Are you sure you want to ${next === 'inactive' ? 'deactivate' : 'activate'} ${s.name}?`,
      confirmLabel: next === 'inactive' ? 'Deactivate' : 'Activate',
      tone: next === 'inactive' ? 'danger' : 'success',
      onConfirm: () => {
        setStores((prev) => prev.map((x) => (x.id === s.id ? { ...x, status: next } : x)))
        showToast(`${s.name} ${next === 'active' ? 'activated' : 'deactivated'}`, next === 'active' ? 'success' : 'info')
      },
    })
  }

  const handleSave = (payload, editingId) => {
    if (editingId) {
      setStores((prev) => prev.map((x) => (x.id === editingId ? { ...x, ...payload } : x)))
    } else {
      setStores((prev) => {
        const newId = Math.max(...prev.map((s) => s.id)) + 1
        return [...prev, { id: newId, manager: '—', staff: 0, revenue: '—', status: 'active', ...payload }]
      })
    }
    setFormItem(null)
  }

  return (
    <div className="p-8 max-md:p-3.5">
      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-3 mb-6 max-md:grid-cols-1">
        <KpiCard icon="storefront-outline" iconWrap="bg-brand-blue/10 text-brand-blue" value={total} valueCls="text-navy-dark" label="Total Stores" />
        <KpiCard icon="checkmark-circle-outline" iconWrap="bg-brand-green/10 text-brand-green" value={activeCount} valueCls="text-brand-green" label="Active" />
        <KpiCard icon="pause-circle-outline" iconWrap="bg-gray-100 text-gray-400" value={inactiveCount} valueCls="text-gray-400" label="Inactive" />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[200px] max-w-xs">
            <Icon name="search-outline" style={{ fontSize: '15px', color: '#94a3b8', flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage() }}
              type="text"
              placeholder="Search name, city, manager…"
              className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none"
            />
          </div>

          <div className="flex bg-page border border-border rounded-lg overflow-hidden">
            {['all', 'active', 'inactive'].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); resetPage() }}
                className={statusFilter === s ? FTAB_ACTIVE : FTAB_IDLE}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); resetPage() }}
            className="text-[11px] font-medium text-gray-600 bg-page border border-border rounded-lg px-3 py-2 cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="Retail">Retail</option>
            <option value="Warehouse">Warehouse</option>
          </select>

          <div className="ml-auto shrink-0">
            <button
              onClick={() => setFormItem({ store: null })}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-navy px-4 py-2.5 rounded-xl hover:bg-navy-light transition"
            >
              <Icon name="add-outline" style={{ fontSize: '16px' }} /> Add Store
            </button>
          </div>
        </div>

        {/* Table header */}
        <div
          className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60 max-md:hidden"
          style={{ gridTemplateColumns: '1.9fr 0.7fr 1.1fr 1.3fr 0.7fr 1.9fr' }}
        >
          <div>Store</div>
          <div>Type</div>
          <div>Location</div>
          <div>Manager</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Body */}
        <div className="divide-y divide-gray-100">
          {paged.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-[13px] text-gray-400">No stores match your filters.</p>
            </div>
          )}
          {paged.map((s) => (
            <StoreRow key={s.id} s={s} onView={() => navigate(`/stores/${s.id}`)} onEdit={() => setFormItem({ store: s })} onToggle={() => toggleStatus(s)} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-gray-50/40">
          <p className="text-[11px] text-gray-400">
            {filtered.length === 0
              ? 'No results'
              : `Showing ${start + 1}–${Math.min(start + STORES_PAGE_SIZE, filtered.length)} of ${filtered.length} store${filtered.length !== 1 ? 's' : ''}`}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => goto(-1)} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition">
              <Icon name="chevron-back-outline" style={{ fontSize: '13px' }} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-[12px] font-semibold flex items-center justify-center transition ${
                    p === currentPage ? 'bg-navy text-white' : 'border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button onClick={() => goto(1)} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition">
              <Icon name="chevron-forward-outline" style={{ fontSize: '13px' }} />
            </button>
          </div>
        </div>
      </div>

      <StoreFormSlideover item={formItem} onClose={() => setFormItem(null)} onSave={handleSave} />
      <ConfirmModal state={confirm} onClose={() => setConfirm(null)} />
    </div>
  )
}

function StoreRow({ s, onView, onEdit, onToggle }) {
  const initial = s.name.charAt(0).toUpperCase()
  const isWarehouse = s.type === 'Warehouse'
  const typeBg = isWarehouse ? 'bg-brand-purple/10 text-brand-purple' : 'bg-brand-blue/10 text-brand-blue'

  return (
    <div
      className="grid items-center px-5 py-2.5 hover:bg-gray-50/60 transition max-md:grid-cols-1 max-md:gap-2"
      style={{ gridTemplateColumns: '1.9fr 0.7fr 1.1fr 1.3fr 0.7fr 1.9fr' }}
    >
      {/* Store */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-extrabold text-white shrink-0" style={{ background: storeAvatarColor(s.name) }}>
          {initial}
        </div>
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold text-navy-dark truncate leading-tight">{s.name}</p>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{s.code}</p>
        </div>
      </div>
      {/* Type */}
      <div><span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${typeBg}`}>{s.type}</span></div>
      {/* Location */}
      <div className="min-w-0">
        <p className="text-[12px] text-gray-700 font-medium truncate">{s.city}</p>
        <p className="text-[10px] text-gray-400 truncate">{s.area}</p>
      </div>
      {/* Manager */}
      <div className="min-w-0">
        <p className="text-[12px] text-gray-700 truncate">{s.manager}</p>
      </div>
      {/* Status */}
      <div>
        {s.status === 'active' ? (
          <span className="text-[10px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">Active</span>
        ) : (
          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Inactive</span>
        )}
      </div>
      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <ActionButton icon="eye-outline" label="View" onClick={onView} />
        <ActionButton icon="create-outline" label="Edit" onClick={onEdit} />
        {s.status === 'active' ? (
          <ActionButton icon="pause-circle-outline" label="Suspend" onClick={onToggle} tone="orange" title="Deactivate" />
        ) : (
          <ActionButton icon="play-circle-outline" label="Activate" onClick={onToggle} tone="green" />
        )}
      </div>
    </div>
  )
}
