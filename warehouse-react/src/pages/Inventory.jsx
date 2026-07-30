import { useEffect, useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import ReceiveStockSlideover from '../components/inventory/ReceiveStockSlideover'
import AdjustStockSlideover from '../components/inventory/AdjustStockSlideover'
import StockHistorySlideover from '../components/inventory/StockHistorySlideover'
import { INV_DATA } from '../data/warehouseData'
import { invGroupStatus } from '../data/inventoryData'
import { pmGroups, pmColorPair, pmTypeIcon } from '../data/productData'

const INV_PAGE = 10
const COLS = '52px 2fr 1fr 1fr 0.7fr 0.9fr 0.8fr 0.8fr 0.9fr 1.1fr'

// Product thumbnail (matches Product Master).
function Thumb({ name, type }) {
  const [c0, c1] = pmColorPair(name)
  const initial = (name.trim()[0] || '?').toUpperCase()
  return (
    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 relative" style={{ background: `linear-gradient(135deg,${c0},${c1})` }}>
      <span className="text-white font-extrabold text-[15px]">{initial}</span>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-md bg-white flex items-center justify-center shadow-sm">
        <Icon name={pmTypeIcon(type)} size={9} style={{ color: c0 }} />
      </div>
    </div>
  )
}

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

export default function Inventory({ onNavigate, initialAction, onConsumeAction }) {
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

  // Open the matching slideover when arriving from a product detail's stock action bar.
  useEffect(() => {
    if (!initialAction) return
    const { action, sku } = initialAction
    if (action === 'in') setReceiveSession({ sku })
    else if (action === 'adjust') setAdjustSession({ sku })
    else if (action === 'history') { const it = INV_DATA.find((x) => x.sku === sku); if (it) setHistoryItem(it) }
    onConsumeAction?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAction])

  const categories = useMemo(() => [...new Set(inv.map((i) => i.cat))].sort(), [inv])

  const kpis = {
    total: inv.length,
    units: inv.reduce((s, i) => s + (i.onHand || 0), 0),
    low: inv.filter((i) => i.onHand > 0 && i.onHand <= i.reorder).length,
    out: inv.filter((i) => i.onHand === 0).length,
  }

  // Group into products (same shape as Product Master) and roll up stock figures.
  const groups = useMemo(
    () =>
      pmGroups(inv).map((g) => {
        const reserved = g.rows.reduce((s, r) => s + (r.reserved || 0), 0)
        return { ...g, reserved, available: g.stock - reserved }
      }),
    [inv],
  )

  const data = useMemo(() => {
    const q = search.toLowerCase()
    return groups.filter((g) => {
      const matchS = !q || g.name.toLowerCase().includes(q) || g.rows.some((r) => r.sku.toLowerCase().includes(q) || (r.variant || '').toLowerCase().includes(q))
      const matchC = !cat || g.cat === cat
      let matchF = true
      if (filter === 'low') matchF = g.stock > 0 && g.stock <= g.reorder
      else if (filter === 'out') matchF = g.stock === 0
      else if (filter === 'ok') matchF = g.stock > g.reorder
      return matchS && matchC && matchF
    })
  }, [groups, search, cat, filter])

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
  const handleReceive = ({ name, rows, ref, supplier, note }) => {
    let totalUnits = 0
    const moves = []
    setInv((prev) =>
      prev.map((it) => {
        const r = rows.find((x) => x.sku === it.sku)
        if (!r) return it
        const nextOnHand = (it.onHand || 0) + r.qty
        totalUnits += r.qty
        const parts = []
        if (supplier) parts.push(supplier)
        if (ref) parts.push('Ref ' + ref)
        if (r.batch) parts.push('Batch ' + r.batch)
        if (r.expiry) parts.push('Exp ' + r.expiry)
        if (note) parts.push(note)
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
          <div></div>
          <div>Product</div>
          <div>SKU</div>
          <div>Category</div>
          <div className="text-center">Variants</div>
          <div className="text-right whitespace-nowrap">Stock On Hand</div>
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
            items.map((g) => {
              const st = invGroupStatus(g.stock, g.reorder)
              const avail = g.available
              const repRow = g.rows[0] || {}
              const lowStock = g.stock === 0 || (g.reorder > 0 && g.stock <= g.reorder)
              return (
                <div key={g.name} className="grid items-center px-5 py-3 hover:bg-gray-50/50 transition max-md:grid-cols-[52px_1fr_auto] max-md:gap-2" style={{ gridTemplateColumns: COLS }}>
                  <Thumb name={g.name} type={g.type} />
                  <div className="min-w-0 pr-2">
                    <p className="text-[12.5px] font-semibold text-navy-dark truncate">{g.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{g.type === 'variant' ? `${g.rows.length} variants` : ''}</p>
                  </div>
                  <div className="min-w-0 pr-2 max-md:hidden">
                    {g.type === 'variant' ? (
                      <span className="text-[10px] font-semibold text-gray-400">{g.rows.length} SKUs</span>
                    ) : (
                      <span className="text-[11px] text-gray-500 font-mono truncate">{repRow.sku || '—'}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 truncate pr-2 max-md:hidden">{g.cat}</p>
                  <div className="text-center max-md:hidden">
                    {g.type === 'variant' ? (
                      <span className="text-[11px] font-bold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full">{g.rows.length}</span>
                    ) : (
                      <span className="text-[11px] text-gray-300">—</span>
                    )}
                  </div>
                  <p className={`text-[13px] font-bold text-right max-md:hidden ${lowStock ? 'text-brand-orange' : 'text-navy-dark'}`}>{g.stock.toLocaleString()}</p>
                  <p className="text-[12px] text-gray-500 text-right max-md:hidden">{g.reserved}</p>
                  <p className={`text-[13px] font-semibold text-right max-md:hidden ${avail <= 0 ? 'text-brand-red' : 'text-navy-dark'}`}>{avail}</p>
                  <div className="text-center max-md:hidden"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span></div>
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => setReceiveSession({ sku: repRow.sku })} title="Add stock" className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-brand-green hover:border-brand-green/40 transition">
                      <Icon name="add-outline" size={15} />
                    </button>
                    <button onClick={() => setAdjustSession({ sku: repRow.sku })} title="Adjust stock" className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-brand-orange hover:border-brand-orange/40 transition">
                      <Icon name="create-outline" size={14} />
                    </button>
                    <button onClick={() => setHistoryItem(repRow)} title="Stock history" className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-brand-blue hover:border-brand-blue/40 transition">
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
