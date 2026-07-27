import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import ReceiveStockSlideover from '../components/inventory/ReceiveStockSlideover'
import AdjustStockSlideover from '../components/inventory/AdjustStockSlideover'
import StockHistorySlideover from '../components/inventory/StockHistorySlideover'
import { INV_DATA } from '../data/warehouseData'
import { invStatus } from '../data/inventoryData'

const INV_PAGE = 10
const COLS = '1.8fr 0.9fr 0.9fr 1fr 0.75fr 0.8fr 0.9fr 1.1fr'

function KpiCard({ icon, iconBg, iconColor, value, valueCls, label, onClick }) {
  return (
    <div className={`bg-white rounded-xl border border-border px-4 py-3.5 flex items-center gap-3 ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
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
  { k: 'low', label: 'Low' },
  { k: 'out', label: 'Out' },
  { k: 'ok', label: 'In Stock' },
]

export default function Inventory({ onNavigate }) {
  const showToast = useToast()
  const [inv, setInv] = useState(INV_DATA)
  const [movements, setMovements] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [cat, setCat] = useState('')
  const [page, setPage] = useState(1)

  const [receiveSession, setReceiveSession] = useState(null)
  const [adjustSession, setAdjustSession] = useState(null)
  const [historyItem, setHistoryItem] = useState(null)

  const categories = useMemo(() => [...new Set(inv.map((i) => i.cat))].sort(), [inv])

  const kpis = {
    total: inv.length,
    units: inv.reduce((s, i) => s + (i.onHand || 0), 0),
    low: inv.filter((i) => i.onHand > 0 && i.onHand <= i.reorder).length,
    out: inv.filter((i) => i.onHand === 0).length,
  }

  const data = useMemo(() => {
    const q = search.toLowerCase()
    return inv.filter((i) => {
      const matchS = !q || i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q) || i.variant.toLowerCase().includes(q)
      const matchC = !cat || i.cat === cat
      let matchF = true
      if (filter === 'low') matchF = i.onHand > 0 && i.onHand <= i.reorder
      else if (filter === 'out') matchF = i.onHand === 0
      else if (filter === 'ok') matchF = i.onHand > i.reorder
      return matchS && matchC && matchF
    })
  }, [inv, search, cat, filter])

  const total = data.length
  const pages = Math.ceil(total / INV_PAGE) || 1
  const curPage = Math.min(page, pages)
  const items = data.slice((curPage - 1) * INV_PAGE, curPage * INV_PAGE)

  const pills = useMemo(() => {
    const maxPills = 5
    let start = Math.max(1, curPage - Math.floor(maxPills / 2))
    let end = Math.min(pages, start + maxPills - 1)
    if (end - start < maxPills - 1) start = Math.max(1, end - maxPills + 1)
    const arr = []
    for (let i = start; i <= end; i++) arr.push(i)
    return arr
  }, [curPage, pages])

  const resetPage = () => setPage(1)
  const setTab = (k) => { setFilter(k); resetPage() }

  // Prepend a movement to the log.
  const logMovement = (sku, type, qty, note, balance) =>
    setMovements((prev) => [{ sku, type, qty, note: note || '', by: 'Zain Khan', date: 'Jul 21, 2026', balance }, ...prev])

  // ── Receive stock ──
  const handleReceive = ({ name, rows }) => {
    let totalUnits = 0
    const moves = []
    setInv((prev) =>
      prev.map((it) => {
        const r = rows.find((x) => x.sku === it.sku)
        if (!r) return it
        const nextOnHand = (it.onHand || 0) + r.qty
        totalUnits += r.qty
        const parts = []
        if (r.batch) parts.push('Batch ' + r.batch)
        if (r.expiry) parts.push('Exp ' + r.expiry)
        moves.push({ sku: r.sku, type: 'received', qty: r.qty, note: 'Supplier stock received' + (parts.length ? ' · ' + parts.join(' · ') : ''), balance: nextOnHand })
        return { ...it, onHand: nextOnHand }
      }),
    )
    setMovements((prev) => [...moves.reverse().map((m) => ({ ...m, by: 'Zain Khan', date: 'Jul 21, 2026' })), ...prev])
    setReceiveSession(null)
    showToast(`Received ${totalUnits.toLocaleString()} units of ${name} across ${rows.length} variant${rows.length > 1 ? 's' : ''}.`, 'success')
  }

  // ── Adjust stock ──
  const handleAdjust = ({ sku, label, newQty, delta, reason, note }) => {
    setInv((prev) => prev.map((it) => (it.sku === sku ? { ...it, onHand: newQty } : it)))
    logMovement(sku, 'adjustment', delta, reason + (note ? ' — ' + note : ''), newQty)
    setAdjustSession(null)
    showToast(`Stock adjusted for ${label} (${delta > 0 ? '+' : ''}${delta}). New physical stock: ${newQty}.`, 'success')
  }

  // History footer shortcuts.
  const historyAddStock = (sku) => { setHistoryItem(null); setReceiveSession({ sku }) }
  const historyAdjust = (sku) => { setHistoryItem(null); setAdjustSession({ sku }) }

  return (
    <div className="p-8 max-md:p-3.5">
      {/* Purpose banner */}
      <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3 mb-6">
        <Icon name="information-circle-outline" size={15} style={{ color: '#3366cc', flexShrink: 0, marginTop: 1 }} />
        <p className="text-[11px] text-gray-600 leading-relaxed">
          <strong className="text-navy-dark">Products define what you sell. Inventory manages how much you have.</strong> Add received stock, correct counts, and review the full movement history for every SKU below. To create or edit a product, use{' '}
          <button onClick={() => onNavigate?.('products')} className="text-brand-blue font-semibold hover:underline">Product Master</button>.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3 mb-6 max-md:grid-cols-2">
        <KpiCard icon="cube-outline" iconBg="bg-navy/10" iconColor="text-navy" value={kpis.total} valueCls="text-navy-dark" label="Stocked SKUs" />
        <KpiCard icon="layers-outline" iconBg="bg-brand-blue/10" iconColor="text-brand-blue" value={kpis.units.toLocaleString()} valueCls="text-brand-blue" label="Total Physical Stock" />
        <KpiCard icon="alert-circle-outline" iconBg="bg-brand-orange/10" iconColor="text-brand-orange" value={kpis.low} valueCls="text-brand-orange" label="Low Stock" onClick={() => setTab('low')} />
        <KpiCard icon="close-circle-outline" iconBg="bg-brand-red/10" iconColor="text-brand-red" value={kpis.out} valueCls="text-brand-red" label="Out of Stock" onClick={() => setTab('out')} />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[200px] max-w-xs">
            <Icon name="search-outline" size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search product, SKU, variant…"
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
          <select
            value={cat}
            onChange={(e) => { setCat(e.target.value); resetPage() }}
            className="text-[11px] font-medium text-gray-600 bg-page border border-border rounded-lg px-3 py-2 cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <button onClick={() => setAdjustSession({})} className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-navy px-4 py-2.5 rounded-xl hover:bg-navy-light transition">
              <Icon name="create-outline" size={16} /> Adjust Stock
            </button>
            <button onClick={() => setReceiveSession({})} className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-navy px-4 py-2.5 rounded-xl hover:bg-navy-light transition">
              <Icon name="arrow-down-circle-outline" size={16} /> Add Stock
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60 max-md:hidden" style={{ gridTemplateColumns: COLS }}>
          <div>Product</div>
          <div>SKU</div>
          <div>Category</div>
          <div className="text-right whitespace-nowrap">Physical Stock</div>
          <div className="text-right">Reserved</div>
          <div className="text-right">Available</div>
          <div className="text-center">Status</div>
          <div className="text-center">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <Icon name="cube-outline" size={30} style={{ color: '#cbd5e1' }} />
              <p className="text-[13px] text-gray-400 mt-2">No stock items found</p>
            </div>
          ) : (
            items.map((i) => {
              const st = invStatus(i)
              const avail = i.onHand - i.reserved
              return (
                <div key={i.sku} className="grid items-center px-5 py-3 hover:bg-gray-50/50 transition max-md:grid-cols-[1fr_auto] max-md:gap-2" style={{ gridTemplateColumns: COLS }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-navy/8 flex items-center justify-center shrink-0"><Icon name="cube-outline" className="text-navy" size={16} /></div>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-semibold text-navy-dark truncate">{i.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{i.variant}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 font-mono truncate pr-2 max-md:hidden">{i.sku}</p>
                  <p className="text-[11px] text-gray-500 truncate pr-2 max-md:hidden">{i.cat}</p>
                  <p className="text-[13px] font-bold text-navy-dark text-right max-md:hidden">{i.onHand}</p>
                  <p className="text-[12px] text-gray-500 text-right max-md:hidden">{i.reserved}</p>
                  <p className={`text-[13px] font-semibold text-right max-md:hidden ${avail <= 0 ? 'text-brand-red' : 'text-navy-dark'}`}>{avail}</p>
                  <div className="text-center max-md:hidden"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span></div>
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => setReceiveSession({ sku: i.sku })} title="Add stock" className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-brand-green hover:border-brand-green/40 transition">
                      <Icon name="add-outline" size={15} />
                    </button>
                    <button onClick={() => setAdjustSession({ sku: i.sku })} title="Adjust stock" className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-brand-orange hover:border-brand-orange/40 transition">
                      <Icon name="create-outline" size={14} />
                    </button>
                    <button onClick={() => setHistoryItem(i)} title="Stock history" className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-brand-blue hover:border-brand-blue/40 transition">
                      <Icon name="time-outline" size={14} />
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
            {total ? `Showing ${Math.min((curPage - 1) * INV_PAGE + 1, total)}–${Math.min(curPage * INV_PAGE, total)} of ${total}` : 'Showing 0 of 0'}
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

      <ReceiveStockSlideover session={receiveSession} inv={inv} onClose={() => setReceiveSession(null)} onReceive={handleReceive} />
      <AdjustStockSlideover session={adjustSession} inv={inv} onClose={() => setAdjustSession(null)} onAdjust={handleAdjust} />
      <StockHistorySlideover item={historyItem} movements={movements} onClose={() => setHistoryItem(null)} onAddStock={historyAddStock} onAdjust={historyAdjust} />
    </div>
  )
}
