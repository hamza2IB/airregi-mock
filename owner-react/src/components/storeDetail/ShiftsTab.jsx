import { useMemo, useState } from 'react'
import Icon from '../Icon'
import ActionButton from '../ActionButton'
import Pager from './Pager'
import ShiftDetailSlideover from '../dashboard/ShiftDetailSlideover'
import { SHIFTS_DATA } from '../../data/dashboardData'
import { SHIFT_PERIODS, SHIFT_PERIOD_DATES, fmtRs, initials } from '../../data/storeDetailData'

const SHIFT_COLS = '1.4fr 1.2fr 1fr 0.9fr 0.9fr 0.9fr 0.7fr'

function storeSquare(store) {
  const bg = store === 'Main Branch' ? '#1a2d6b' : store === 'DHA Branch' ? '#3366cc' : '#7c4dff'
  const label =
    store.split(' ').filter((w) => !['Al', 'Fatah', 'Branch'].includes(w)).map((w) => w[0]).join('').substring(0, 2) ||
    store.substring(0, 2).toUpperCase()
  return { bg, label }
}

const PAGE_SIZE = 5
const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'balanced', label: 'Balanced' },
  { key: 'short', label: 'Short' },
  { key: 'over', label: 'Over' },
]
const TAB_ACTIVE = 'px-3 py-1.5 text-[11px] font-semibold bg-navy text-white'
const TAB_IDLE = 'px-3 py-1.5 text-[11px] font-medium text-gray-500 hover:bg-white/60 transition'
const PERIOD_LABEL = { all: 'All shifts', today: 'Today', yesterday: 'Yesterday', week: 'This Week', month: 'This Month' }

const diffLabelOf = (diff) => (diff === 0 ? 'balanced' : diff < 0 ? 'short' : 'over')

function KpiCard({ icon, wrap, value, valueCls, label }) {
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

export default function ShiftsTab() {
  const [period, setPeriod] = useState('all')
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [viewShift, setViewShift] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const pd = SHIFT_PERIOD_DATES[period]
    return SHIFTS_DATA.filter((s) => {
      const cashierMatch = !q || s.cashier.toLowerCase().includes(q)
      let periodMatch = true
      if (pd) periodMatch = Array.isArray(pd) ? pd.some((d) => s.date.includes(d)) : s.date.includes(pd)
      const statusMatch = status === 'all' || diffLabelOf(s.diff) === status
      return cashierMatch && periodMatch && statusMatch
    })
  }, [period, status, search])

  const kpis = {
    total: filtered.length,
    balanced: filtered.filter((s) => s.diff === 0).length,
    short: filtered.filter((s) => s.diff < 0).length,
    over: filtered.filter((s) => s.diff > 0).length,
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const curPage = Math.min(page, totalPages)
  const start = (curPage - 1) * PAGE_SIZE
  const paged = filtered.slice(start, start + PAGE_SIZE)

  const filterLabel = PERIOD_LABEL[period] + (search ? ` · Cashier: "${search}"` : '')

  return (
    <div className="p-5">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3 mb-5 max-md:grid-cols-2">
        <KpiCard icon="time-outline" wrap="bg-navy/10 text-navy" value={kpis.total} valueCls="text-navy-dark" label="Total Shifts" />
        <KpiCard icon="checkmark-circle-outline" wrap="bg-brand-green/10 text-brand-green" value={kpis.balanced} valueCls="text-brand-green" label="Balanced" />
        <KpiCard icon="arrow-down-circle-outline" wrap="bg-brand-red/10 text-brand-red" value={kpis.short} valueCls="text-brand-red" label="Short" />
        <KpiCard icon="arrow-up-circle-outline" wrap="bg-brand-orange/10 text-brand-orange" value={kpis.over} valueCls="text-brand-orange" label="Over" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-1 bg-white border border-border rounded-xl p-1">
          {SHIFT_PERIODS.map((p) => (
            <button key={p.key} onClick={() => { setPeriod(p.key); setPage(1) }} className={`period-tab ${period === p.key ? 'active' : ''}`}>{p.label}</button>
          ))}
        </div>
        <div className="flex bg-page border border-border rounded-lg overflow-hidden">
          {STATUS_TABS.map((t) => (
            <button key={t.key} onClick={() => { setStatus(t.key); setPage(1) }} className={status === t.key ? TAB_ACTIVE : TAB_IDLE}>{t.label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[180px] max-w-xs">
          <Icon name="search-outline" style={{ fontSize: '14px', color: '#94a3b8', flexShrink: 0 }} />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} type="text" placeholder="Search cashier name…" className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <p className="text-[13px] font-semibold text-navy-dark">Shift Closing History</p>
          <p className="text-[11px] text-gray-400">{filterLabel}</p>
        </div>
        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[780px]">
            <div className="grid px-5 py-2 bg-gray-50/60 border-b border-border text-[10px] font-semibold text-gray-400 uppercase tracking-[0.07em]" style={{ gridTemplateColumns: SHIFT_COLS }}>
              <div>Cashier</div><div>Store</div><div>Date / Time</div>
              <div className="text-right">Expected</div><div className="text-right">Actual</div>
              <div className="text-right">Result</div><div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-gray-100">
              {paged.length === 0 && <div className="py-12 text-center text-[12px] text-gray-400">No shifts match your filters.</div>}
              {paged.map((s, i) => {
                const isBalanced = s.diff === 0
                const isShort = s.diff < 0
                const statusIcon = isBalanced ? 'checkmark-circle' : isShort ? 'arrow-down-circle' : 'arrow-up-circle'
                const statusColor = isBalanced ? 'text-brand-green' : isShort ? 'text-brand-red' : 'text-brand-orange'
                const diffBg = isBalanced ? 'bg-brand-green/10' : isShort ? 'bg-brand-red/10' : 'bg-brand-orange/10'
                const diffLabel = isBalanced ? 'Balanced' : isShort ? `−Rs.${Math.abs(s.diff)}` : `+Rs.${s.diff}`
                const avatarBg = isBalanced ? 'bg-navy/10 text-navy' : isShort ? 'bg-brand-red/10 text-brand-red' : 'bg-brand-orange/10 text-brand-orange'
                const sq = storeSquare(s.store)
                return (
                  <div key={i} className="grid items-center px-5 py-3 hover:bg-gray-50/60 transition" style={{ gridTemplateColumns: SHIFT_COLS }}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-full ${avatarBg} flex items-center justify-center text-[10px] font-bold shrink-0`}>{initials(s.cashier)}</div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-navy-dark truncate leading-tight">{s.cashier}</p>
                        <p className="text-[10px] text-gray-400 truncate">{s.register}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-extrabold text-white shrink-0" style={{ background: sq.bg }}>{sq.label}</div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-navy-dark truncate leading-tight">Al Fatah {s.store}</p>
                        <p className="text-[10px] text-gray-400">Lahore</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-gray-700">{s.date}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{s.time}</p>
                    </div>
                    <div className="text-right"><p className="text-[11px] text-gray-500">{fmtRs(s.expected)}</p></div>
                    <div className="text-right"><p className="text-[12px] font-semibold text-navy-dark">{fmtRs(s.actual)}</p></div>
                    <div className="flex items-center justify-end gap-1.5">
                      <Icon name={statusIcon} className={statusColor} style={{ fontSize: '14px', flexShrink: 0 }} />
                      <span className={`text-[10px] font-bold ${statusColor} ${diffBg} px-2 py-0.5 rounded-full whitespace-nowrap`}>{diffLabel}</span>
                    </div>
                    <div className="flex items-center justify-end">
                      <ActionButton icon="eye-outline" label="View" onClick={() => setViewShift(s)} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-gray-50/40">
          <p className="text-[11px] text-gray-400">
            {filtered.length ? `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length} shift${filtered.length !== 1 ? 's' : ''}` : 'No shifts found'}
          </p>
          <Pager totalPages={totalPages} curPage={curPage} setPage={setPage} />
        </div>
      </div>

      <ShiftDetailSlideover shift={viewShift} onClose={() => setViewShift(null)} />
    </div>
  )
}
