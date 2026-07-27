import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { initialsOf } from '../data/dashboardData'
import ShiftDetailSlideover from '../components/shifts/ShiftDetailSlideover'
import {
  fmtRs, shiftExpected, shiftVariance, varianceState, varianceBadge,
  SM_SHIFT_PERIODS, SM_SHIFT_PERIOD_DATES,
} from '../data/shiftData'

const COLS = '1.4fr 0.8fr 1.3fr 1fr 1fr 1fr 0.7fr'
const PAGE_SIZE = 8

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'balanced', label: 'Balanced' },
  { key: 'short', label: 'Short' },
  { key: 'over', label: 'Over' },
]

function Kpi({ icon, iconBg, iconColor, value, valueCls, label }) {
  return (
    <div className="bg-white rounded-xl border border-border px-4 py-3.5 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon name={icon} className={iconColor} style={{ fontSize: '18px' }} />
      </div>
      <div>
        <p className={`text-[20px] font-extrabold leading-none ${valueCls}`}>{value}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function CashierShifts({ shifts }) {
  const [period, setPeriod] = useState('all')
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [viewShift, setViewShift] = useState(null)

  const closedShifts = shifts.filter((s) => s.status === 'closed')

  const kpi = {
    total: closedShifts.length,
    balanced: closedShifts.filter((s) => shiftVariance(s) === 0).length,
    short: closedShifts.filter((s) => shiftVariance(s) < 0).length,
    over: closedShifts.filter((s) => shiftVariance(s) > 0).length,
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const pd = SM_SHIFT_PERIOD_DATES[period]
    return closedShifts.filter((s) => {
      const mq = !q || s.cashier.toLowerCase().includes(q) || s.register.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
      let mp = true
      if (pd) mp = Array.isArray(pd) ? pd.some((d) => (s.closed || '').includes(d)) : (s.closed || '').includes(pd)
      const ms = status === 'all' || varianceState(shiftVariance(s)) === status
      return mq && mp && ms
    })
  }, [closedShifts, search, period, status])

  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const curPage = Math.min(page, pages)
  const pageItems = filtered.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE)


  const liveOrder = viewShift ? shifts.find((s) => s.id === viewShift.id) || viewShift : null

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Kpi icon="time-outline" iconBg="bg-navy/10" iconColor="text-navy" value={kpi.total} valueCls="text-navy-dark" label="Total Shifts" />
        <Kpi icon="checkmark-circle-outline" iconBg="bg-brand-green/10" iconColor="text-brand-green" value={kpi.balanced} valueCls="text-brand-green" label="Balanced" />
        <Kpi icon="arrow-down-circle-outline" iconBg="bg-brand-red/10" iconColor="text-brand-red" value={kpi.short} valueCls="text-brand-red" label="Short" />
        <Kpi icon="arrow-up-circle-outline" iconBg="bg-brand-orange/10" iconColor="text-brand-orange" value={kpi.over} valueCls="text-brand-orange" label="Over" />
      </div>

      {/* Closing history */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <p className="text-[13px] font-semibold text-navy-dark mr-auto">Shift Closing History</p>
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[180px] max-w-xs order-3 md:order-none">
            <Icon name="search-outline" style={{ fontSize: '15px', color: '#94a3b8', flexShrink: 0 }} />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} type="text" placeholder="Search cashier, register…" className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none" />
          </div>
          <div className="flex bg-page border border-border rounded-lg overflow-hidden">
            {SM_SHIFT_PERIODS.map((p) => (
              <button key={p.key} onClick={() => { setPeriod(p.key); setPage(1) }} className={`px-3 py-1.5 text-[11px] whitespace-nowrap transition ${period === p.key ? 'font-semibold bg-navy text-white' : 'font-medium text-gray-500 hover:bg-white/60'}`}>{p.label}</button>
            ))}
          </div>
          <div className="flex bg-page border border-border rounded-lg overflow-hidden">
            {STATUS_TABS.map((t) => (
              <button key={t.key} onClick={() => { setStatus(t.key); setPage(1) }} className={`px-3 py-1.5 text-[11px] whitespace-nowrap transition ${status === t.key ? 'font-semibold bg-navy text-white' : 'font-medium text-gray-500 hover:bg-white/60'}`}>{t.label}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[820px]">
            <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60" style={{ gridTemplateColumns: COLS }}>
              <div>Cashier</div><div>Register</div><div>Closed</div>
              <div className="text-right">Expected</div><div className="text-right">Counted</div>
              <div className="text-right">Variance</div><div className="text-right">Actions</div>
            </div>
            {pageItems.length === 0 ? (
              <div className="py-16 text-center">
                <Icon name="time-outline" size={32} style={{ color: '#cbd5e1' }} />
                <p className="text-[13px] text-gray-400 mt-2">No shifts match your filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pageItems.map((s) => {
                  const diff = shiftVariance(s)
                  const vb = varianceBadge(diff)
                  return (
                    <div key={s.id} className="grid items-center px-5 py-3.5 hover:bg-gray-50/50 transition" style={{ gridTemplateColumns: COLS }}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-navy/10 flex items-center justify-center text-[10px] font-bold text-navy shrink-0">{initialsOf(s.cashier)}</div>
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-navy-dark truncate leading-tight">{s.cashier}</p>
                          <p className="text-[10px] text-gray-400 font-mono truncate">{s.id}</p>
                        </div>
                      </div>
                      <p className="text-[12px] font-medium text-navy-dark">{s.register}</p>
                      <p className="text-[11px] text-gray-500">{s.closed}</p>
                      <p className="text-[11px] text-gray-500 text-right">{fmtRs(shiftExpected(s))}</p>
                      <p className="text-[12px] font-semibold text-navy-dark text-right">{fmtRs(s.counted)}</p>
                      <div className="flex items-center justify-end gap-1.5">
                        <Icon name={vb.icon} className={vb.color} style={{ fontSize: '14px', flexShrink: 0 }} />
                        <span className={`text-[10px] font-bold ${vb.color} ${vb.bg} px-2 py-0.5 rounded-full whitespace-nowrap`}>{diff === 0 ? 'Balanced' : vb.label}</span>
                      </div>
                      <div className="flex items-center justify-end">
                        <button onClick={() => setViewShift(s)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30 hover:bg-gray-50 transition">
                          <Icon name="eye-outline" style={{ fontSize: '12px' }} />View
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-gray-50/40">
          <p className="text-[11px] text-gray-400">{total ? `Showing ${(curPage - 1) * PAGE_SIZE + 1}–${Math.min(curPage * PAGE_SIZE, total)} of ${total}` : 'Showing 0 of 0'}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={curPage === 1} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition disabled:opacity-40"><Icon name="chevron-back-outline" style={{ fontSize: '13px' }} /></button>
            {Array.from({ length: pages }, (_, idx) => idx + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-lg text-[11px] font-semibold flex items-center justify-center transition ${p === curPage ? 'bg-navy text-white' : 'border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30'}`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={curPage === pages} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition disabled:opacity-40"><Icon name="chevron-forward-outline" style={{ fontSize: '13px' }} /></button>
          </div>
        </div>
      </div>

      <ShiftDetailSlideover shift={liveOrder} onClose={() => setViewShift(null)} />
    </div>
  )
}
