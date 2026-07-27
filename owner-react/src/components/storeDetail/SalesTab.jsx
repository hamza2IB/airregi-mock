import { useMemo, useState } from 'react'
import Icon from '../Icon'
import ActionButton from '../ActionButton'
import Pager from './Pager'
import { TXN_DATA, PAY_COLORS } from '../../data/dashboardData'
import { SD_SALES, SALES_PERIODS, fmtRs, initials } from '../../data/storeDetailData'

const PAGE_SIZE = 8
const CH_TABS = [
  { key: 'all', label: 'All' },
  { key: 'POS', label: 'POS' },
  { key: 'EC', label: 'Online' },
]
const CH_LABEL = { all: 'All Channels', POS: 'POS Only', EC: 'Online / EC' }
const P_LABEL = { today: 'Today', yesterday: 'Yesterday', all: 'All Time', week: 'This Week', month: 'This Month', year: 'This Year' }

export default function SalesTab({ onViewTxn }) {
  const [period, setPeriod] = useState('today')
  const [ch, setCh] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const d = period === 'all' ? SD_SALES.year : SD_SALES[period] || SD_SALES.today
  const heroRev = ch === 'POS' ? d.pos : ch === 'EC' ? d.ec : d.rev
  const heroOrders = ch === 'POS' ? Math.round(d.orders * 0.82) : ch === 'EC' ? Math.round(d.orders * 0.18) : d.orders

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return TXN_DATA.filter((t) => {
      const chMatch = ch === 'all' || t.channel === ch
      const qMatch = !q || t.id.toLowerCase().includes(q) || t.cashier.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q)
      return chMatch && qMatch
    })
  }, [ch, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const curPage = Math.min(page, totalPages)
  const start = (curPage - 1) * PAGE_SIZE
  const paged = filtered.slice(start, start + PAGE_SIZE)

  const periodTab = (key, label) => (
    <button key={key} onClick={() => { setPeriod(key); setPage(1) }} className={`period-tab ${period === key ? 'active' : ''}`}>{label}</button>
  )

  return (
    <div className="p-5">
      {/* Period tabs */}
      <div className="flex items-center gap-3 mb-4 flex-wrap justify-end">
        <div className="flex items-center gap-1 bg-white border border-border rounded-xl p-1">
          {SALES_PERIODS.map((p) => periodTab(p.key, p.label))}
        </div>
      </div>

      {/* Sales hero */}
      <div className="bg-gradient-to-br from-navy-dark to-navy rounded-2xl p-5 text-white relative overflow-hidden mb-5">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium">{P_LABEL[period]} · {CH_LABEL[ch]}</p>
            <span className="text-[10px] font-semibold text-brand-green bg-brand-green/20 px-2 py-0.5 rounded-full">{d.trend}</span>
          </div>
          <p className="text-[32px] font-extrabold leading-tight">{fmtRs(heroRev)}</p>
          <div className="flex items-center gap-6 mt-3 pt-3 border-t border-white/10 flex-wrap">
            <div><p className="text-[9px] text-white/50 uppercase tracking-wider mb-0.5">Orders</p><p className="text-[16px] font-bold">{heroOrders}</p></div>
            <div className="w-px h-6 bg-white/15"></div>
            <div><p className="text-[9px] text-white/50 uppercase tracking-wider mb-0.5">POS Revenue</p><p className="text-[16px] font-bold">{fmtRs(d.pos)}</p></div>
            <div className="w-px h-6 bg-white/15"></div>
            <div><p className="text-[9px] text-white/50 uppercase tracking-wider mb-0.5">Online Revenue</p><p className="text-[16px] font-bold">{fmtRs(d.ec)}</p></div>
          </div>
        </div>
      </div>

      {/* Channel + search */}
      <div className="flex items-center gap-3 mb-4 flex-wrap justify-end">
        <div className="flex items-center gap-1 bg-white border border-border rounded-xl p-1">
          {CH_TABS.map((c) => (
            <button key={c.key} onClick={() => { setCh(c.key); setPage(1) }} className={`period-tab ${ch === c.key ? 'active' : ''}`}>{c.label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[180px] max-w-xs">
          <Icon name="search-outline" style={{ fontSize: '14px', color: '#94a3b8', flexShrink: 0 }} />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} type="text" placeholder="Search order ID, customer…" className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <p className="text-[12px] font-semibold text-navy-dark">All Transactions</p>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold bg-navy/10 text-navy px-2 py-0.5 rounded-full">POS</span>
            <span className="text-[10px] font-bold bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full">EC</span>
          </div>
        </div>
        <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/30 max-md:hidden" style={{ gridTemplateColumns: '1fr 0.6fr 1.2fr 0.9fr 0.8fr 0.8fr 0.5fr' }}>
          <div>Order ID</div><div>Channel</div><div>Cashier / Customer</div>
          <div className="text-right">Amount</div><div>Payment</div><div>Date / Time</div><div></div>
        </div>
        <div className="divide-y divide-gray-100">
          {paged.length === 0 && <div className="py-10 text-center text-[12px] text-gray-400">No transactions match your filters.</div>}
          {paged.map((t) => {
            const isOnline = t.cashier === 'Online Order'
            return (
              <div key={t.id} className="grid items-center px-5 py-2.5 hover:bg-gray-50/60 transition max-md:grid-cols-2 max-md:gap-2" style={{ gridTemplateColumns: '1fr 0.6fr 1.2fr 0.9fr 0.8fr 0.8fr 0.5fr' }}>
                <div>
                  <p className="text-[11px] font-bold font-mono text-navy-dark">{t.id}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{t.items} item{t.items !== 1 ? 's' : ''}</p>
                </div>
                <div><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.channel === 'POS' ? 'bg-navy/10 text-navy' : 'bg-brand-blue/10 text-brand-blue'}`}>{t.channel}</span></div>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500 shrink-0">
                    {isOnline ? <Icon name="globe-outline" style={{ fontSize: '10px' }} /> : initials(t.cashier)}
                  </div>
                  <p className="text-[11px] text-gray-600 truncate">{isOnline ? t.customer : t.cashier}</p>
                </div>
                <p className="text-right text-[12px] font-bold text-navy-dark">{t.amount}</p>
                <div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${PAY_COLORS[t.pay] || 'bg-gray-100 text-gray-500'}`}>
                    <Icon name={t.payIcon} style={{ fontSize: '9px' }} />{t.pay}
                  </span>
                </div>
                <div><p className="text-[11px] text-gray-700">{t.date}</p><p className="text-[10px] text-gray-400">{t.time}</p></div>
                <div className="flex justify-end">
                  <ActionButton icon="eye-outline" label="View" onClick={() => onViewTxn(t)} />
                </div>
              </div>
            )
          })}
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-gray-50/40">
          <p className="text-[11px] text-gray-400">
            {filtered.length ? `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length}` : 'No results'}
          </p>
          <Pager totalPages={totalPages} curPage={curPage} setPage={setPage} />
        </div>
      </div>
    </div>
  )
}
