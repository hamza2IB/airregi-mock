import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import ReceiptDetailSlideover from '../components/inventory/ReceiptDetailSlideover'
import AdjustmentDetailSlideover from '../components/inventory/AdjustmentDetailSlideover'
import { STOCK_RECEIPTS, STOCK_ADJUSTMENTS, rcptUnits } from '../data/warehouseData'
import { adjReasonMeta } from '../data/inventoryData'

const PAGE_SIZE = 12
const COLS = '0.95fr 0.8fr 1.7fr 1.25fr 0.8fr 0.7fr 0.8fr'

// Normalise both sources into one movement shape, newest first.
function buildMovements() {
  const rcv = STOCK_RECEIPTS.map((r) => ({
    kind: 'received',
    id: r.id,
    date: r.date,
    time: r.time,
    by: r.by,
    ts: new Date(`${r.date} ${r.time}`).getTime(),
    change: rcptUnits(r),
    supplier: r.supplier,
    ref: r.ref,
    lines: r.lines,
    raw: r,
  }))
  const adj = STOCK_ADJUSTMENTS.map((a) => ({
    kind: 'adjustment',
    id: a.id,
    date: a.date,
    time: a.time,
    by: a.by,
    ts: new Date(`${a.date} ${a.time}`).getTime(),
    change: a.after - a.before,
    name: a.name,
    variant: a.variant,
    sku: a.sku,
    reason: a.reason,
    raw: a,
  }))
  return [...rcv, ...adj].sort((x, y) => y.ts - x.ts)
}

function KpiCard({ icon, iconBg, iconColor, value, valueCls, label }) {
  return (
    <div className="bg-white rounded-xl border border-border px-4 py-3.5 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon name={icon} className={iconColor} size={18} />
      </div>
      <div>
        <p className={`text-[22px] font-extrabold leading-none ${valueCls}`}>{value}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}

const TABS = [
  { k: 'all', label: 'All' },
  { k: 'received', label: 'Stock In' },
  { k: 'adjustment', label: 'Adjustments' },
]

export default function StockMovements({ onNavigate, onViewSku }) {
  const showToast = useToast()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState(null)

  const resetPage = () => setPage(1)
  const setTab = (k) => { setFilter(k); resetPage() }

  const all = useMemo(() => buildMovements(), [])

  const kpis = useMemo(() => {
    let received = 0
    let adjNet = 0
    all.forEach((m) => {
      if (m.kind === 'received') received += m.change
      else adjNet += m.change
    })
    return { total: all.length, received, adjNet, net: received + adjNet }
  }, [all])

  const data = useMemo(() => {
    const q = search.toLowerCase()
    return all.filter((m) => {
      const matchF = filter === 'all' || m.kind === filter
      if (!matchF) return false
      if (!q) return true
      if (m.kind === 'received') {
        return (
          m.id.toLowerCase().includes(q) ||
          m.supplier.toLowerCase().includes(q) ||
          (m.ref || '').toLowerCase().includes(q) ||
          m.by.toLowerCase().includes(q) ||
          m.lines.some((l) => l.name.toLowerCase().includes(q) || l.sku.toLowerCase().includes(q))
        )
      }
      return (
        m.id.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.sku.toLowerCase().includes(q) ||
        m.reason.toLowerCase().includes(q) ||
        m.by.toLowerCase().includes(q)
      )
    })
  }, [all, search, filter])

  const total = data.length
  const pages = Math.ceil(total / PAGE_SIZE) || 1
  const curPage = Math.min(page, pages)
  const items = data.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE)

  const pills = useMemo(() => {
    const maxPills = 5
    let start = Math.max(1, curPage - Math.floor(maxPills / 2))
    let end = Math.min(pages, start + maxPills - 1)
    if (end - start < maxPills - 1) start = Math.max(1, end - maxPills + 1)
    const arr = []
    for (let i = start; i <= end; i++) arr.push(i)
    return arr
  }, [curPage, pages])

  return (
    <div className="p-8 max-md:p-3.5">
      {/* Purpose banner */}
      <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3 mb-6">
        <Icon name="information-circle-outline" size={15} style={{ color: '#3366cc', flexShrink: 0, marginTop: 1 }} />
        <p className="text-[11px] text-gray-600 leading-relaxed">
          <strong className="text-navy-dark">One audit trail for every stock movement.</strong> Supplier deliveries (Stock In) and manual corrections (Adjustments) in a single ledger — filter by type below. To record a movement, use{' '}
          <button onClick={() => onNavigate?.('inventory')} className="text-brand-blue font-semibold hover:underline">Receive Stock or Adjust Stock</button> on Stock Levels.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3 mb-6 max-md:grid-cols-2">
        <KpiCard icon="swap-vertical-outline" iconBg="bg-navy/10" iconColor="text-navy" value={kpis.total} valueCls="text-navy-dark" label="Total Movements" />
        <KpiCard icon="arrow-down-circle-outline" iconBg="bg-brand-green/10" iconColor="text-brand-green" value={`+${kpis.received.toLocaleString()}`} valueCls="text-brand-green" label="Units Received" />
        <KpiCard icon="create-outline" iconBg="bg-brand-orange/10" iconColor="text-brand-orange" value={`${kpis.adjNet >= 0 ? '+' : ''}${kpis.adjNet.toLocaleString()}`} valueCls={kpis.adjNet >= 0 ? 'text-navy-dark' : 'text-brand-red'} label="Net Adjusted" />
        <KpiCard icon="trending-up-outline" iconBg="bg-brand-blue/10" iconColor="text-brand-blue" value={`${kpis.net >= 0 ? '+' : ''}${kpis.net.toLocaleString()}`} valueCls={kpis.net >= 0 ? 'text-navy-dark' : 'text-brand-red'} label="Net Change" />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[200px] max-w-xs">
            <Icon name="search-outline" size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search product, SKU, supplier, ref, user…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage() }}
              className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none"
            />
          </div>
          <div className="flex bg-page border border-border rounded-lg overflow-hidden">
            {TABS.map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`px-3 py-1.5 text-[11px] transition ${filter === t.k ? 'font-semibold bg-navy text-white' : 'font-medium text-gray-500 hover:bg-white/60'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="ml-auto shrink-0">
            <button onClick={() => showToast('Stock movements exported (CSV).', 'success')} className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-600 bg-page border border-border px-3.5 py-2.5 rounded-xl hover:bg-white transition">
              <Icon name="download-outline" size={15} /> Export
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60 max-md:hidden" style={{ gridTemplateColumns: COLS }}>
          <div>Date</div>
          <div>Type</div>
          <div>Details</div>
          <div>Reason</div>
          <div>By</div>
          <div className="text-right">Change</div>
          <div className="text-center">View</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <Icon name="file-tray-outline" size={30} style={{ color: '#cbd5e1' }} />
              <p className="text-[13px] text-gray-400 mt-2">No movements match your filters</p>
            </div>
          ) : (
            items.map((m) => {
              const isRcv = m.kind === 'received'
              const meta = isRcv ? null : adjReasonMeta(m.reason)
              const avatarCls = isRcv ? 'text-brand-green bg-brand-green/10' : meta.cls
              const avatarIcon = isRcv ? 'arrow-down-circle-outline' : meta.icon
              const positive = m.change >= 0
              return (
                <div
                  key={m.id}
                  onClick={() => setDetail(m)}
                  className="grid items-center px-5 py-3 hover:bg-gray-50/50 transition cursor-pointer max-md:grid-cols-[1fr_auto] max-md:gap-2"
                  style={{ gridTemplateColumns: COLS }}
                >
                  <div className="max-md:hidden">
                    <p className="text-[12px] font-semibold text-navy-dark">{m.date}</p>
                    <p className="text-[10px] text-gray-400">{m.time}</p>
                  </div>
                  <div className="max-md:hidden">
                    {isRcv ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-brand-green bg-brand-green/10">
                        <Icon name="arrow-down-circle-outline" size={11} />Stock In
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-brand-orange bg-brand-orange/10">
                        <Icon name="create-outline" size={11} />Adjustment
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${avatarCls}`}>
                      <Icon name={avatarIcon} size={17} />
                    </div>
                    <div className="min-w-0">
                      {isRcv ? (
                        <>
                          <p className="text-[12.5px] font-semibold text-navy-dark truncate">{m.supplier}</p>
                          <p className="text-[10px] text-gray-400 truncate">{m.lines.length} item{m.lines.length > 1 ? 's' : ''} · {m.ref || m.id}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-[12.5px] font-semibold text-navy-dark truncate">{m.name} — {m.variant}</p>
                          <p className="text-[10px] text-gray-400 font-mono truncate">{m.sku}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="max-md:hidden pr-2">
                    {isRcv ? (
                      <span className="text-[11px] text-gray-300">—</span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.cls}`}>
                        <Icon name={meta.icon} size={11} />{m.reason}
                      </span>
                    )}
                  </div>
                  <span className="text-[11.5px] text-gray-600 truncate pr-2 max-md:hidden">{m.by}</span>
                  <p className={`text-[13px] font-extrabold text-right ${positive ? 'text-brand-green' : 'text-brand-red'}`}>{positive ? '+' : ''}{m.change.toLocaleString()}</p>
                  <div className="flex items-center justify-center max-md:hidden">
                    <button
                      onClick={(e) => { e.stopPropagation(); setDetail(m) }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30 hover:bg-gray-50 transition shrink-0 whitespace-nowrap"
                    >
                      <Icon name="eye-outline" size={12} />View
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer / pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-gray-50/40">
          <p className="text-[11px] text-gray-400">
            {total ? `Showing ${Math.min((curPage - 1) * PAGE_SIZE + 1, total)}–${Math.min(curPage * PAGE_SIZE, total)} of ${total}` : 'Showing 0 of 0'}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition">
              <Icon name="chevron-back-outline" size={13} />
            </button>
            {pills.map((i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-7 h-7 rounded-lg border text-[11px] font-semibold transition ${i === curPage ? 'bg-navy text-white border-navy' : 'border-border bg-white text-gray-500 hover:border-navy/30 hover:text-navy'}`}
              >
                {i}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/30 transition">
              <Icon name="chevron-forward-outline" size={13} />
            </button>
          </div>
        </div>
      </div>

      <ReceiptDetailSlideover
        rcpt={detail?.kind === 'received' ? detail.raw : null}
        onClose={() => setDetail(null)}
        onViewSku={(sku) => { setDetail(null); onViewSku?.(sku) }}
      />
      <AdjustmentDetailSlideover
        adj={detail?.kind === 'adjustment' ? detail.raw : null}
        onClose={() => setDetail(null)}
        onViewSku={(sku) => { setDetail(null); onViewSku?.(sku) }}
      />
    </div>
  )
}
