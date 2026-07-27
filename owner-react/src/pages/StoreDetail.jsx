import { useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import { storeAvatarColor } from '../data/storesData'
import { SD_SALES, BANNER_PERIODS, BANNER_DATE_LABELS, BANNER_REV_LABELS, USERS_DATA, fmtRs, initials } from '../data/storeDetailData'
import SalesTab from '../components/storeDetail/SalesTab'
import InventoryTab from '../components/storeDetail/InventoryTab'
import StaffTab from '../components/storeDetail/StaffTab'
import ShiftsTab from '../components/storeDetail/ShiftsTab'
import InviteStaffSlideover from '../components/storeDetail/InviteStaffSlideover'
import TransactionDetailSlideover from '../components/dashboard/TransactionDetailSlideover'
import StoreFormSlideover from '../components/stores/StoreFormSlideover'

const TABS = [
  { key: 'sales', label: 'Sales', icon: 'trending-up-outline' },
  { key: 'inventory', label: 'Inventory', icon: 'cube-outline' },
  { key: 'staff', label: 'Staff', icon: 'people-outline' },
  { key: 'shifts', label: 'All Closings', icon: 'time-outline' },
]

export default function StoreDetail({ store, setStores, onBack }) {
  const showToast = useToast()
  const [bannerPeriod, setBannerPeriod] = useState('today')
  const [tab, setTab] = useState('sales')
  const [users, setUsers] = useState(USERS_DATA)
  const [viewTxn, setViewTxn] = useState(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)

  if (!store) {
    return (
      <div className="p-8">
        <button onClick={onBack} className="text-[12px] font-semibold text-brand-blue hover:underline">← Back to Stores</button>
        <p className="mt-4 text-[13px] text-gray-400">Store not found.</p>
      </div>
    )
  }

  const b = SD_SALES[bannerPeriod] || SD_SALES.today
  const isActive = store.status === 'active'

  const handleInvite = (payload) => {
    const newId = Math.max(...users.map((u) => u.id)) + 1
    setUsers((prev) => [...prev, { id: newId, store: store.name, status: 'invited', lastLogin: '—', ...payload }])
    setInviteOpen(false)
  }

  const handleSaveEdit = (payload, editingId) => {
    if (editingId) setStores((prev) => prev.map((x) => (x.id === editingId ? { ...x, ...payload } : x)))
    setEditItem(null)
  }

  return (
    <div className="p-8 max-md:p-3.5">
      {/* Back bar + breadcrumb */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center hover:bg-gray-50 transition shrink-0">
          <Icon name="arrow-back-outline" className="text-navy" style={{ fontSize: '16px' }} />
        </button>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <span className="hover:text-navy cursor-pointer" onClick={onBack}>Stores</span>
          <Icon name="chevron-forward-outline" style={{ fontSize: '10px' }} />
          <span className="font-semibold text-gray-600 truncate max-w-[220px]">{store.name}</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-1 ${isActive ? 'bg-brand-green/10 text-brand-green' : 'bg-gray-100 text-gray-400'}`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Banner period selector */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-1 bg-white border border-border rounded-xl p-1">
          {BANNER_PERIODS.map((p) => (
            <button key={p.key} onClick={() => setBannerPeriod(p.key)} className={`period-tab ${bannerPeriod === p.key ? 'active' : ''}`}>{p.label}</button>
          ))}
        </div>
        <button onClick={() => showToast('Exporting store report…', 'info')} className="flex items-center gap-1.5 border border-border bg-white text-navy-dark px-4 py-2 rounded-xl text-[12px] font-semibold hover:bg-gray-50 transition">
          <Icon name="download-outline" /> Export
        </button>
      </div>
      <p className="text-[11px] text-gray-400 font-medium mb-3">{BANNER_DATE_LABELS[bannerPeriod]}</p>

      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-dark to-navy rounded-2xl p-6 text-white relative overflow-hidden mb-5">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[20px] font-extrabold text-white shrink-0" style={{ background: storeAvatarColor(store.name) }}>
              {store.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[22px] font-extrabold leading-tight">{store.name}</p>
              <p className="text-[12px] text-white/60 mt-0.5">{store.code} · {store.city}, {store.area}</p>
              <p className="text-[11px] text-white/45 mt-0.5">{store.area}, {store.city}, Punjab, Pakistan</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => setEditItem({ store })} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[12px] font-semibold transition border border-white/20">
              <Icon name="create-outline" style={{ fontSize: '14px' }} /> Edit Store
            </button>
            <button onClick={() => setInviteOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-green/20 hover:bg-brand-green/30 text-white text-[12px] font-semibold transition border border-brand-green/30">
              <Icon name="person-add-outline" style={{ fontSize: '14px' }} /> Invite Staff
            </button>
          </div>
        </div>
        {/* Banner KPI strip */}
        <div className="flex items-center gap-8 mt-5 pt-5 border-t border-white/10 flex-wrap">
          <div>
            <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">{BANNER_REV_LABELS[bannerPeriod]}</p>
            <p className="text-[20px] font-bold">{fmtRs(b.rev)}</p>
          </div>
          <div className="w-px h-8 bg-white/15"></div>
          <div><p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Orders</p><p className="text-[20px] font-bold">{b.orders}</p></div>
          <div className="w-px h-8 bg-white/15"></div>
          <div><p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">POS Revenue</p><p className="text-[20px] font-bold">{fmtRs(b.pos)}</p></div>
          <div className="w-px h-8 bg-white/15"></div>
          <div><p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Online Revenue</p><p className="text-[20px] font-bold">{fmtRs(b.ec)}</p></div>
          <div className="w-px h-8 bg-white/15"></div>
          <div><p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Staff</p><p className="text-[20px] font-bold">{store.staff}</p></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex border-b border-border overflow-x-auto thin-scroll">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 text-[13px] font-semibold whitespace-nowrap border-b-2 transition ${tab === t.key ? 'border-navy text-navy-dark' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              style={{ padding: '10px 18px' }}
            >
              <Icon name={t.icon} style={{ fontSize: '14px' }} />{t.label}
            </button>
          ))}
        </div>

        {tab === 'sales' && <SalesTab onViewTxn={setViewTxn} />}
        {tab === 'inventory' && <InventoryTab />}
        {tab === 'staff' && <StaffTab store={store} users={users} setUsers={setUsers} onInvite={() => setInviteOpen(true)} />}
        {tab === 'shifts' && <ShiftsTab />}
      </div>

      {/* Slideovers */}
      <TransactionDetailSlideover txn={viewTxn} onClose={() => setViewTxn(null)} />
      <InviteStaffSlideover open={inviteOpen} onClose={() => setInviteOpen(false)} onInvite={handleInvite} />
      <StoreFormSlideover item={editItem} onClose={() => setEditItem(null)} onSave={handleSaveEdit} />
    </div>
  )
}
