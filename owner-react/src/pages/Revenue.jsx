import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import ActionButton from '../components/ActionButton'
import { useToast } from '../components/Toast'
import TransactionDetailSlideover from '../components/dashboard/TransactionDetailSlideover'
import { TXN_DATA, PAY_COLORS } from '../data/dashboardData'
import { INITIAL_STORES } from '../data/storesData'
import { REV_PERIODS, REV_STORES, REV_STORE_OPTIONS, REV_PERIOD_TABS, fmtRs } from '../data/revenueData'

const PAGE_SIZE = 5
const COLS = '1.4fr 1.6fr 0.7fr 1.4fr 0.9fr 0.8fr 0.8fr 0.6fr'
const CH_TABS = [
  { key: 'all', label: 'All' },
  { key: 'POS', label: 'POS' },
  { key: 'EC', label: 'Online' },
]
const TAB_ACTIVE = 'px-3 py-1.5 text-[11px] font-semibold bg-navy text-white'
const TAB_IDLE = 'px-3 py-1.5 text-[11px] font-medium text-gray-500 hover:bg-white/60 transition'

const storeFullName = (id) => INITIAL_STORES.find((s) => s.id === id)?.name || '—'

export default function Revenue() {
  const showToast = useToast()
  const [period, setPeriod] = useState('today')
  const [storeId, setStoreId] = useState(0)
  const [ch, setCh] = useState('all')
  const [page, setPage] = useState(1)
  const [viewTxn, setViewTxn] = useState(null)

  const d = REV_PERIODS[period]

  const hero = useMemo(() => {
    const storeData = storeId ? (REV_STORES[period] || []).filter((s) => s.id === storeId) : null
    const totalRev = storeData ? storeData.reduce((s, x) => s + x.rev, 0) : d.rev
    const totalOrd = storeData ? storeData.reduce((s, x) => s + x.orders, 0) : d.orders
    const posRev = storeData ? Math.round(totalRev * 0.82) : d.pos
    const onlineRev = storeData ? Math.round(totalRev * 0.18) : d.online
    const scope = storeId ? storeFullName(storeId) : 'All Stores'
    return { totalRev, totalOrd, posRev, onlineRev, scope }
  }, [period, storeId, d])

  const filtered = useMemo(() => {
    const storeName = storeId ? storeFullName(storeId) : ''
    return TXN_DATA.filter((t) => {
      const chMatch = ch === 'all' || t.channel === ch
      const storeMatch = !storeName || `Al Fatah ${t.store}` === storeName || storeName.includes(t.store)
      return chMatch && storeMatch
    })
  }, [ch, storeId])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const curPage = Math.min(page, totalPages)
  const start = (curPage - 1) * PAGE_SIZE
  const paged = filtered.slice(start, start + PAGE_SIZE)

  return (
    <div className="p-8 max-md:p-3.5">
      {/* Period selector + store filter + export */}
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <div className="flex items-center gap-1 bg-white border border-border rounded-xl p-1">
          {REV_PERIOD_TABS.map((p) => (
            <button key={p.key} onClick={() => { setPeriod(p.key); setPage(1) }} className={`period-tab ${period === p.key ? 'active' : ''}`}>{p.label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select value={storeId} onChange={(e) => { setStoreId(parseInt(e.target.value, 10)); setPage(1) }} className="text-[11px] font-medium text-gray-600 bg-white border border-border rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:border-navy">
            <option value={0}>All Stores</option>
            {REV_STORE_OPTIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <button onClick={() => showToast('Exporting report…', 'info')} className="flex items-center gap-1.5 border border-border bg-white text-navy-dark px-4 py-2 rounded-xl text-[12px] font-semibold hover:bg-gray-50 transition">
            <Icon name="download-outline" /> Export
          </button>
        </div>
      </div>
      <p className="text-[11px] text-gray-400 font-medium mb-5">{d.label}</p>

      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-dark to-navy rounded-2xl p-6 text-white relative overflow-hidden mb-5">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
            <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium">Total Revenue — {hero.scope}</p>
            <span className="text-[11px] font-semibold text-brand-green bg-brand-green/20 px-2.5 py-0.5 rounded-full">{d.trend}</span>
          </div>
          <p className="text-[38px] font-extrabold leading-tight">{fmtRs(hero.totalRev)}</p>
          <div className="flex items-center gap-8 mt-4 pt-4 border-t border-white/10 flex-wrap">
            <div><p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Orders</p><p className="text-[20px] font-bold">{hero.totalOrd.toLocaleString()}</p></div>
            <div className="w-px h-8 bg-white/15"></div>
            <div><p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">POS Revenue</p><p className="text-[20px] font-bold">{fmtRs(hero.posRev)}</p></div>
            <div className="w-px h-8 bg-white/15"></div>
            <div><p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mb-1">Online Revenue</p><p className="text-[20px] font-bold">{fmtRs(hero.onlineRev)}</p></div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl border border-border overflow-hidden mb-5">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-2">
          <div>
            <p className="text-[14px] font-semibold text-navy-dark">All Transactions</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{d.label} · {hero.scope} · {ch === 'all' ? 'All channels' : ch === 'POS' ? 'POS' : 'Online'}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-page border border-border rounded-lg overflow-hidden">
              {CH_TABS.map((c) => (
                <button key={c.key} onClick={() => { setCh(c.key); setPage(1) }} className={ch === c.key ? TAB_ACTIVE : TAB_IDLE}>{c.label}</button>
              ))}
            </div>
            <span className="text-[10px] font-semibold bg-navy/10 text-navy px-2.5 py-1 rounded-full">POS</span>
            <span className="text-[10px] font-semibold bg-brand-blue/10 text-brand-blue px-2.5 py-1 rounded-full">EC</span>
          </div>
        </div>

        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[900px]">
            <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60" style={{ gridTemplateColumns: COLS }}>
              <div>Order ID</div><div>Store</div><div>Channel</div><div>Cashier / Staff</div>
              <div className="text-right">Amount</div><div>Payment</div><div>Date / Time</div><div></div>
            </div>
            <div className="divide-y divide-gray-100">
              {paged.length === 0 && <div className="py-10 text-center text-[12px] text-gray-400">No transactions match your filters.</div>}
              {paged.map((t) => {
                const isOnline = t.cashier === 'Online Order'
                return (
                  <div key={t.id} className="grid items-center px-5 py-2.5 hover:bg-gray-50/60 transition" style={{ gridTemplateColumns: COLS }}>
                    <div>
                      <p className="text-[11px] font-bold font-mono text-navy-dark">{t.id}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{t.items} item{t.items !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-extrabold text-white shrink-0" style={{ background: t.storeColor }}>
                        {t.storeShort.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-navy-dark truncate leading-tight">Al Fatah {t.store}</p>
                        <p className="text-[10px] text-gray-400">Lahore</p>
                      </div>
                    </div>
                    <div><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.channel === 'POS' ? 'bg-navy/10 text-navy' : 'bg-brand-blue/10 text-brand-blue'}`}>{t.channel}</span></div>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500 shrink-0">
                        {isOnline ? <Icon name="globe-outline" style={{ fontSize: '11px' }} /> : t.cashier.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <p className="text-[11px] text-gray-600 truncate">{t.cashier}</p>
                    </div>
                    <div className="text-right"><p className="text-[12.5px] font-bold text-navy-dark">{t.amount}</p></div>
                    <div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${PAY_COLORS[t.pay] || 'bg-gray-100 text-gray-500'}`}>
                        <Icon name={t.payIcon} style={{ fontSize: '10px' }} />{t.pay}
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-gray-700">{t.date}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{t.time}</p>
                    </div>
                    <div className="flex items-center justify-end">
                      <ActionButton icon="eye-outline" label="View" onClick={() => setViewTxn(t)} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-gray-50/40">
          <p className="text-[11px] text-gray-400">
            {filtered.length ? `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length}` : 'No results'}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition">
              <Icon name="chevron-back-outline" style={{ fontSize: '13px' }} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-lg text-[12px] font-semibold flex items-center justify-center transition ${p === curPage ? 'bg-navy text-white' : 'border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30'}`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition">
              <Icon name="chevron-forward-outline" style={{ fontSize: '13px' }} />
            </button>
          </div>
        </div>
      </div>

      <TransactionDetailSlideover txn={viewTxn} onClose={() => setViewTxn(null)} />
    </div>
  )
}
