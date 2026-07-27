import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { SS_DATA, SS_PERIODS, SS_PAYMENTS, SS_CASHIERS, ssPayBadge, ssPayIcon, rs, receiptOf } from '../data/salesData'

const PAGE_SIZE = 5

function Stat({ icon, iconBg, iconColor, value, valueCls, label }) {
  return (
    <div className="bg-white rounded-xl border border-border px-4 py-3.5 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon name={icon} className={iconColor} style={{ fontSize: '18px' }} />
      </div>
      <div>
        <p className={`text-[22px] font-extrabold leading-none ${valueCls}`}>{value}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function TxnRow({ o }) {
  const [open, setOpen] = useState(false)
  const itemCount = o.items.reduce((a, i) => a + i.qty, 0)
  const rc = receiptOf(o)
  return (
    <div>
      <div onClick={() => setOpen((v) => !v)} className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50/70 transition">
        <div className="flex items-center gap-4 min-w-0">
          <div className={`w-9 h-9 rounded-lg ${ssPayBadge(o.payment)} flex items-center justify-center shrink-0`}>
            <Icon name={ssPayIcon(o.payment)} style={{ fontSize: '16px' }} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-semibold text-navy-dark">#{o.id}</p>
              <span className={`text-[10px] ${ssPayBadge(o.payment)} px-2 py-0.5 rounded-full font-medium`}>{o.payment}</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">{o.cashier} · {itemCount} items · {o.date}{o.time ? ' · ' + o.time : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <p className="text-[14px] font-bold text-navy-dark">{rs(o.total)}</p>
          <Icon name="chevron-forward-outline" className="text-gray-300" style={{ fontSize: '14px', transition: 'transform .15s', transform: open ? 'rotate(90deg)' : 'none' }} />
        </div>
      </div>
      {open && (
        <div>
          <div className="mx-5 mb-4 rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Transaction #{o.id}</p>
              <p className="text-[10px] text-gray-400">{o.date}{o.time ? ' · ' + o.time : ''}</p>
            </div>
            <div className="px-4 py-2 bg-white">
              {o.items.map((i, idx) => (
                <div key={idx} className={`flex items-center justify-between py-2.5 ${idx < o.items.length - 1 ? 'border-b border-dashed border-gray-200' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-navy/5 flex items-center justify-center text-[10px] font-bold text-navy shrink-0">{i.qty}</span>
                    <div className="min-w-0">
                      <span className="text-[12px] text-gray-700 font-medium">{i.name}</span>
                      <p className="text-[9px] text-gray-400 font-mono mt-0.5">{i.sku || '—'}</p>
                    </div>
                  </div>
                  <span className="text-[12px] text-navy-dark font-semibold shrink-0 ml-3">{rs(i.price)}</span>
                </div>
              ))}
            </div>
            {/* Receipt breakdown */}
            <div className="px-4 py-3 bg-white border-t border-dashed border-gray-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500">Subtotal <span className="text-gray-400">({rc.itemCount} item{rc.itemCount !== 1 ? 's' : ''})</span></span>
                <span className="text-[12px] font-semibold text-navy-dark">{rs(rc.subtotal)}</span>
              </div>
              {rc.discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">Discount</span>
                  <span className="text-[12px] font-semibold text-brand-green">−{rs(rc.discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500">Tax (5% GST)</span>
                <span className="text-[12px] font-semibold text-navy-dark">{rs(rc.tax)}</span>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t-2 border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1.5"><Icon name="person-outline" style={{ fontSize: '12px' }} />{o.cashier}</span>
                <span className="flex items-center gap-1.5"><Icon name={ssPayIcon(o.payment)} style={{ fontSize: '12px' }} />{o.payment}</span>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Total</p>
                <p className="text-[14px] font-bold text-navy-dark leading-tight">{rs(o.total)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function StoreSales() {
  const [period, setPeriod] = useState('today')
  const [pay, setPay] = useState('')
  const [cashier, setCashier] = useState('')
  const [page, setPage] = useState(1)

  const orders = useMemo(() => {
    let list = SS_DATA[period] || []
    if (pay) list = list.filter((o) => o.payment === pay)
    if (cashier) list = list.filter((o) => o.cashier === cashier)
    return list
  }, [period, pay, cashier])

  const stats = useMemo(() => {
    const totalSales = orders.reduce((s, o) => s + o.total, 0)
    const totalItems = orders.reduce((s, o) => o.items.reduce((a, i) => a + i.qty, 0) + s, 0)
    return {
      sales: rs(totalSales),
      count: orders.length,
      avg: orders.length ? rs(Math.round(totalSales / orders.length)) : 'Rs.0',
      items: totalItems,
    }
  }, [orders])

  const total = orders.length
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const curPage = Math.min(page, pages)
  const startIdx = (curPage - 1) * PAGE_SIZE
  const endIdx = Math.min(startIdx + PAGE_SIZE, total)
  const paged = orders.slice(startIdx, endIdx)

  const setTab = (p) => { setPeriod(p); setPage(1) }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Purpose banner */}
      <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3 mb-6">
        <Icon name="information-circle-outline" style={{ fontSize: '15px', color: '#3366cc', flexShrink: 0, marginTop: '1px' }} />
        <p className="text-[11px] text-gray-600 leading-relaxed"><strong className="text-navy-dark">In-store point-of-sale transactions rung up at this branch.</strong> Filter by period, payment method, or cashier. Click any transaction to see its line items.</p>
      </div>

      {/* Filter row */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex bg-white border border-border rounded-lg overflow-hidden">
          {SS_PERIODS.map((p) => (
            <button key={p.key} onClick={() => setTab(p.key)} className={`px-3.5 py-2 text-[11px] whitespace-nowrap transition ${period === p.key ? 'font-semibold bg-navy text-white' : 'font-medium text-gray-500 hover:bg-gray-50'}`}>{p.label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select value={pay} onChange={(e) => { setPay(e.target.value); setPage(1) }} className="bg-white border border-border rounded-lg px-3 h-[36px] text-[11px] text-gray-600 focus:outline-none focus:border-navy cursor-pointer">
            <option value="">All Payments</option>
            {SS_PAYMENTS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={cashier} onChange={(e) => { setCashier(e.target.value); setPage(1) }} className="bg-white border border-border rounded-lg px-3 h-[36px] text-[11px] text-gray-600 focus:outline-none focus:border-navy cursor-pointer">
            <option value="">All Cashiers</option>
            {SS_CASHIERS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat icon="cash-outline" iconBg="bg-navy/10" iconColor="text-navy" value={stats.sales} valueCls="text-navy-dark" label="Total Sales" />
        <Stat icon="receipt-outline" iconBg="bg-brand-blue/10" iconColor="text-brand-blue" value={stats.count} valueCls="text-brand-blue" label="Orders" />
        <Stat icon="stats-chart-outline" iconBg="bg-brand-purple/10" iconColor="text-brand-purple" value={stats.avg} valueCls="text-brand-purple" label="Avg Order" />
        <Stat icon="cube-outline" iconBg="bg-brand-green/10" iconColor="text-brand-green" value={stats.items} valueCls="text-brand-green" label="Items Sold" />
      </div>

      {/* Orders list */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {total === 0 ? (
          <div className="px-6 py-16 text-center">
            <Icon name="receipt-outline" style={{ fontSize: '32px', color: '#cbd5e1' }} />
            <p className="text-[13px] text-gray-400 font-medium mt-2">No transactions found</p>
            <p className="text-[11px] text-gray-300 mt-1">Try changing the filter or period.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paged.map((o) => <TxnRow key={o.id + o.date} o={o} />)}
          </div>
        )}

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-gray-50/50">
          <p className="text-[11px] text-gray-500">Showing <span className="font-semibold text-navy-dark">{total > 0 ? startIdx + 1 : 0}–{endIdx}</span> of <span className="font-semibold text-navy-dark">{total}</span> orders</p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={curPage <= 1} className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center text-sm disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-100"><Icon name="chevron-back-outline" /></button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] transition ${p === curPage ? 'bg-navy text-white font-bold' : 'bg-gray-100 text-gray-600 font-medium hover:bg-gray-200'}`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={curPage >= pages} className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center text-sm disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-100"><Icon name="chevron-forward-outline" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
