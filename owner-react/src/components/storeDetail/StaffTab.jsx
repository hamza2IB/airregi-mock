import { useMemo, useState } from 'react'
import Icon from '../Icon'
import { useToast } from '../Toast'
import { ROLE_COLORS, STAFF_ROLES, initials } from '../../data/storeDetailData'

function StatusBadge({ status }) {
  const map = {
    active: 'bg-brand-green/10 text-brand-green',
    invited: 'bg-brand-blue/10 text-brand-blue',
    inactive: 'bg-gray-100 text-gray-500',
  }
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${map[status] || map.inactive}`}>{status}</span>
}

export default function StaffTab({ store, users, setUsers, onInvite }) {
  const showToast = useToast()
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')

  const staff = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter(
      (u) =>
        u.store === store.name &&
        (!role || u.role === role) &&
        (!q || u.name.toLowerCase().includes(q) || u.phone.includes(q))
    )
  }, [users, store.name, role, search])

  const toggle = (u) => {
    const next = u.status === 'active' ? 'inactive' : 'active'
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: next } : x)))
    showToast(`${u.name} ${next === 'active' ? 'activated' : 'deactivated'}`, next === 'active' ? 'success' : 'info')
  }

  return (
    <div className="p-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[180px] max-w-sm">
          <Icon name="search-outline" style={{ fontSize: '14px', color: '#94a3b8', flexShrink: 0 }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search staff…" className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none" />
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="text-[11px] font-medium text-gray-600 bg-page border border-border rounded-lg px-3 py-2 cursor-pointer">
          <option value="">All Roles</option>
          {STAFF_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <button onClick={onInvite} className="flex items-center gap-1.5 bg-navy text-white px-4 py-2 rounded-xl text-[12px] font-semibold hover:bg-navy-light transition shrink-0">
          <Icon name="person-add-outline" style={{ fontSize: '15px' }} /> Invite Staff
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60 max-md:hidden" style={{ gridTemplateColumns: '1.6fr 0.9fr 1fr 0.7fr 2.1fr' }}>
          <div>Name / Phone</div><div>Role</div><div>Last Login</div>
          <div>Status</div><div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-gray-100">
          {staff.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[13px] text-gray-400">No staff {role ? 'with this role ' : ''}assigned yet.</p>
              <button onClick={onInvite} className="mt-3 text-[12px] font-semibold text-brand-blue hover:underline">Invite staff →</button>
            </div>
          ) : (
            staff.map((u) => (
              <div key={u.id} className="grid items-center px-5 py-3 hover:bg-gray-50/60 transition max-md:grid-cols-1 max-md:gap-2" style={{ gridTemplateColumns: '1.6fr 0.9fr 1fr 0.7fr 2.1fr' }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center font-bold text-navy text-[10px] shrink-0">{initials(u.name)}</div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-navy-dark truncate leading-tight">{u.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{u.phone}</p>
                  </div>
                </div>
                <div><span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-500'}`}>{u.role.replace('_', ' ')}</span></div>
                <div><p className="text-[11px] text-gray-400">{u.lastLogin}</p></div>
                <div><StatusBadge status={u.status} /></div>
                <div className="flex items-center justify-end gap-1.5">
                  <button onClick={() => showToast(`Edit ${u.name}`, 'info')} title="Edit role" className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30 hover:bg-gray-50 transition whitespace-nowrap shrink-0">
                    <Icon name="create-outline" style={{ fontSize: '11px' }} />Edit
                  </button>
                  <button onClick={() => toggle(u)} title={u.status === 'active' ? 'Deactivate' : 'Activate'} className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border transition whitespace-nowrap shrink-0 ${u.status === 'active' ? 'border-brand-orange/20 bg-brand-orange/5 text-brand-orange hover:bg-brand-orange/10' : 'border-brand-green/20 bg-brand-green/5 text-brand-green hover:bg-brand-green/10'}`}>
                    <Icon name={u.status === 'active' ? 'pause-circle-outline' : 'play-circle-outline'} style={{ fontSize: '11px' }} />{u.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => showToast(`Password reset link sent to ${u.phone}`, 'success')} title="Reset password" className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30 hover:bg-gray-50 transition whitespace-nowrap shrink-0">
                    <Icon name="key-outline" style={{ fontSize: '11px' }} />Reset
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
