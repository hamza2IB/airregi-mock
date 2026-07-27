import { useMemo, useRef, useState } from 'react'
import Icon from '../components/Icon'
import IndustryRow from '../components/industries/IndustryRow'
import IndustryFormModal from '../components/industries/IndustryFormModal'
import IndustryToggleModal from '../components/industries/IndustryToggleModal'
import IndustryDeleteModal from '../components/industries/IndustryDeleteModal'
import { useToast } from '../components/Toast'
import { IND_DATA, IND_NEXT_ID } from '../data/industryData'
import { BIZ_INDUSTRY } from '../data/businessData'

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'inactive', label: 'Inactive' },
]

const GRID = { gridTemplateColumns: '2.5fr 1fr 1fr 1fr' }

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

export default function Industries() {
  const showToast = useToast()
  const [industries, setIndustries] = useState(() => IND_DATA.map((i) => ({ ...i })))
  // Live business→industry assignments; delete unassigns (sets to null).
  const [assignments, setAssignments] = useState(() => ({ ...BIZ_INDUSTRY }))
  const nextIdRef = useRef(IND_NEXT_ID)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const [formOpen, setFormOpen] = useState(false)
  const [editingInd, setEditingInd] = useState(null)
  const [toggleInd, setToggleInd] = useState(null)
  const [deleteInd, setDeleteInd] = useState(null)

  const countFor = (indId) => Object.values(assignments).filter((v) => v === indId).length

  const kpis = useMemo(
    () => ({
      total: industries.length,
      active: industries.filter((i) => i.status === 'active').length,
      classified: Object.values(assignments).filter((v) => v != null).length,
    }),
    [industries, assignments],
  )

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return industries.filter((ind) => {
      if (filter === 'active' && ind.status !== 'active') return false
      if (filter === 'inactive' && ind.status !== 'inactive') return false
      if (q && !ind.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [industries, search, filter])

  const openCreate = () => {
    setEditingInd(null)
    setFormOpen(true)
  }

  const handleSave = (payload, id) => {
    if (id) {
      setIndustries((prev) => prev.map((i) => (i.id === id ? { ...i, ...payload } : i)))
      showToast(`${payload.name} industry updated.`, 'success')
    } else {
      const newId = nextIdRef.current++
      setIndustries((prev) => [...prev, { id: newId, ...payload }])
      showToast(`${payload.name} industry added.`, 'success')
    }
    setFormOpen(false)
    setEditingInd(null)
  }

  const handleToggle = (ind) => {
    const nextStatus = ind.status === 'active' ? 'inactive' : 'active'
    setIndustries((prev) => prev.map((i) => (i.id === ind.id ? { ...i, status: nextStatus } : i)))
    setToggleInd(null)
    showToast(
      `${ind.name} industry ${nextStatus === 'active' ? 'activated' : 'deactivated'}.`,
      nextStatus === 'active' ? 'success' : 'error',
    )
  }

  const handleDelete = (ind) => {
    const affected = Object.entries(assignments).filter(([, v]) => v === ind.id).length
    setAssignments((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((k) => {
        if (next[k] === ind.id) next[k] = null
      })
      return next
    })
    setIndustries((prev) => prev.filter((i) => i.id !== ind.id))
    setDeleteInd(null)
    showToast(
      affected > 0
        ? `${ind.name} industry deleted. ${affected} business(es) unassigned.`
        : `${ind.name} industry deleted.`,
      'success',
    )
  }

  return (
    <div className="adm-content p-8 max-md:p-4">
      {/* Summary KPI strip */}
      <div className="grid grid-cols-3 gap-3 mb-6 max-md:grid-cols-1">
        <KpiCard icon="briefcase-outline" iconCls="bg-navy/10 text-navy" value={kpis.total} valueCls="text-navy-dark" label="Total Industries" />
        <KpiCard icon="checkmark-circle-outline" iconCls="bg-brand-green/10 text-brand-green" value={kpis.active} valueCls="text-brand-green" label="Active" />
        <KpiCard icon="business-outline" iconCls="bg-brand-blue/10 text-brand-blue" value={kpis.classified} valueCls="text-brand-blue" label="Businesses Classified" />
      </div>

      {/* List card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[200px] max-w-xs">
            <Icon name="search-outline" style={{ fontSize: '15px', color: '#94a3b8', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search industries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none"
            />
          </div>

          {/* Status tabs */}
          <div className="flex bg-page border border-border rounded-lg overflow-hidden">
            {STATUS_TABS.map((tab) => {
              const active = filter === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
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

          <div className="ml-auto shrink-0">
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-navy px-4 py-2.5 rounded-xl hover:bg-navy-light transition"
            >
              <Icon name="add-outline" style={{ fontSize: '16px' }} /> Add Industry
            </button>
          </div>
        </div>

        {/* Table header */}
        <div
          className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60"
          style={GRID}
        >
          <div>Industry Name</div>
          <div>Status</div>
          <div>Businesses</div>
          <div>Actions</div>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-300">
          {rows.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[13px] text-gray-400">No industries match your filters.</p>
            </div>
          ) : (
            rows.map((ind) => (
              <IndustryRow
                key={ind.id}
                ind={ind}
                count={countFor(ind.id)}
                onEdit={(i) => {
                  setEditingInd(i)
                  setFormOpen(true)
                }}
                onToggle={setToggleInd}
                onDelete={setDeleteInd}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <IndustryFormModal
        open={formOpen}
        ind={editingInd}
        onClose={() => {
          setFormOpen(false)
          setEditingInd(null)
        }}
        onSave={handleSave}
      />
      <IndustryToggleModal
        ind={toggleInd}
        count={toggleInd ? countFor(toggleInd.id) : 0}
        onClose={() => setToggleInd(null)}
        onConfirm={handleToggle}
      />
      <IndustryDeleteModal
        ind={deleteInd}
        count={deleteInd ? countFor(deleteInd.id) : 0}
        onClose={() => setDeleteInd(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
