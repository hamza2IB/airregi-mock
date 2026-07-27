import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import AdjustStockModal from '../components/inventory/AdjustStockModal'
import StockHistorySlideover from '../components/inventory/StockHistorySlideover'
import NewStockRequestModal from '../components/inventory/NewStockRequestModal'
import { smInvStatus, SM_INV_CATS } from '../data/inventoryData'

const COLS = '1.8fr 0.9fr 0.9fr 1fr 0.75fr 0.8fr 0.9fr 1.1fr'
const PAGE_SIZE = 10

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'low', label: 'Low' },
  { key: 'out', label: 'Out' },
  { key: 'ok', label: 'In Stock' },
]

function Kpi({ icon, iconBg, iconColor, value, valueCls, label, onClick }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-xl border border-border px-4 py-3.5 flex items-center gap-3 ${onClick ? 'cursor-pointer hover:shadow-sm transition' : ''}`}>
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

export default function StockLevels({ inv, movements, setStockOnHand, addMovements, submitStockRequest }) {
  const showToast = useToast()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('')
  const [page, setPage] = useState(1)
  const [adjustFor, setAdjustFor] = useState(null)
  const [historyFor, setHistoryFor] = useState(null)
  const [requestFor, setRequestFor] = useState(null) // { sku? } drives the New Stock Request modal

  const kpiTotal = inv.length
  const kpiUnits = inv.reduce((s, i) => s + (i.onHand || 0), 0)
  const kpiLow = inv.filter((i) => i.onHand > 0 && i.onHand <= i.reorder).length
  const kpiOut = inv.filter((i) => i.onHand === 0).length

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
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

  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const curPage = Math.min(page, pages)
  const pageItems = filtered.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE)

  const setFilterReset = (f) => { setFilter(f); setPage(1) }

  const saveAdjustment = (item, newQty, reason, note) => {
    const delta = newQty - item.onHand
    setStockOnHand(item.sku, newQty)
    addMovements([{ sku: item.sku, type: 'adjustment', qty: delta, note: `${reason}${note ? ' — ' + note : ''}`, by: 'Nadia Hasan', date: 'Now' }])
    setAdjustFor(null)
    showToast(`${item.name} adjusted to ${newQty} units.`, 'success')
  }

  const submitRequest = (payload) => { submitStockRequest(payload); setRequestFor(null) }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Purpose banner */}
      <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3 mb-6">
        <Icon name="information-circle-outline" style={{ fontSize: '15px', color: '#3366cc', flexShrink: 0, marginTop: '1px' }} />
        <p className="text-[11px] text-gray-600 leading-relaxed">
          <strong className="text-navy-dark">This is the stock held at your branch.</strong> Track what's on the shelf, reserved for online orders, and available to sell. Running low? Raise a{' '}
          <button onClick={() => setRequestFor({})} className="text-brand-blue font-semibold hover:underline">Stock Request</button> to replenish from the warehouse.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Kpi icon="cube-outline" iconBg="bg-navy/10" iconColor="text-navy" value={kpiTotal} valueCls="text-navy-dark" label="Stocked SKUs" />
        <Kpi icon="layers-outline" iconBg="bg-brand-blue/10" iconColor="text-brand-blue" value={kpiUnits.toLocaleString()} valueCls="text-brand-blue" label="Total Physical Stock" />
        <Kpi icon="alert-circle-outline" iconBg="bg-brand-orange/10" iconColor="text-brand-orange" value={kpiLow} valueCls="text-brand-orange" label="Low Stock" onClick={() => setFilterReset('low')} />
        <Kpi icon="close-circle-outline" iconBg="bg-brand-red/10" iconColor="text-brand-red" value={kpiOut} valueCls="text-brand-red" label="Out of Stock" onClick={() => setFilterReset('out')} />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[200px] max-w-xs">
            <Icon name="search-outline" style={{ fontSize: '15px', color: '#94a3b8', flexShrink: 0 }} />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} type="text" placeholder="Search product, SKU, variant…" className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none" />
          </div>
          <div className="flex bg-page border border-border rounded-lg overflow-hidden">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setFilterReset(t.key)} className={`px-3 py-1.5 text-[11px] transition ${filter === t.key ? 'font-semibold bg-navy text-white' : 'font-medium text-gray-500 hover:bg-white/60'}`}>{t.label}</button>
            ))}
          </div>
          <select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1) }} className="text-[11px] font-medium text-gray-600 bg-page border border-border rounded-lg px-3 py-2 cursor-pointer">
            <option value="">All Categories</option>
            {SM_INV_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <button onClick={() => setRequestFor({})} className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-navy px-4 py-2.5 rounded-xl hover:bg-navy-light transition">
              <Icon name="paper-plane-outline" style={{ fontSize: '16px' }} /> New Stock Request
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto thin-scroll">
          <div className="min-w-[820px]">
            <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60" style={{ gridTemplateColumns: COLS }}>
              <div>Product</div><div>SKU</div><div>Category</div>
              <div className="text-right whitespace-nowrap">Physical Stock</div>
              <div className="text-right">Reserved</div><div className="text-right">Available</div>
              <div className="text-center">Status</div><div className="text-center">Actions</div>
            </div>
            <div className="divide-y divide-gray-100">
              {pageItems.length === 0 ? (
                <div className="py-16 text-center">
                  <Icon name="cube-outline" size={30} style={{ color: '#cbd5e1' }} />
                  <p className="text-[13px] text-gray-400 mt-2">No stock items found</p>
                </div>
              ) : (
                pageItems.map((i) => {
                  const st = smInvStatus(i)
                  const avail = i.onHand - i.reserved
                  return (
                    <div key={i.sku} className="grid items-center px-5 py-3 hover:bg-gray-50/50 transition" style={{ gridTemplateColumns: COLS }}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-navy/[0.08] flex items-center justify-center shrink-0"><Icon name="cube-outline" className="text-navy" style={{ fontSize: '16px' }} /></div>
                        <div className="min-w-0"><p className="text-[12.5px] font-semibold text-navy-dark truncate">{i.name}</p><p className="text-[10px] text-gray-400 truncate">{i.variant}</p></div>
                      </div>
                      <p className="text-[11px] text-gray-500 font-mono truncate pr-2">{i.sku}</p>
                      <p className="text-[11px] text-gray-500 truncate pr-2">{i.cat}</p>
                      <p className="text-[13px] font-bold text-navy-dark text-right">{i.onHand}</p>
                      <p className="text-[12px] text-gray-500 text-right">{i.reserved}</p>
                      <p className={`text-[13px] font-semibold text-right ${avail <= 0 ? 'text-brand-red' : 'text-navy-dark'}`}>{avail}</p>
                      <div className="text-center"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span></div>
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setRequestFor({ sku: i.sku })} title="Request stock" className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/40 transition"><Icon name="paper-plane-outline" style={{ fontSize: '14px' }} /></button>
                        <button onClick={() => setAdjustFor(i)} title="Adjust stock" className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-brand-orange hover:border-brand-orange/40 transition"><Icon name="create-outline" style={{ fontSize: '14px' }} /></button>
                        <button onClick={() => setHistoryFor({ item: i, movements: movements.filter((m) => m.sku === i.sku) })} title="Stock history" className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-brand-blue hover:border-brand-blue/40 transition"><Icon name="time-outline" style={{ fontSize: '14px' }} /></button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
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

      <AdjustStockModal item={adjustFor} onClose={() => setAdjustFor(null)} onSave={saveAdjustment} />
      <StockHistorySlideover state={historyFor} onClose={() => setHistoryFor(null)} />
      <NewStockRequestModal state={requestFor} onClose={() => setRequestFor(null)} onSubmit={submitRequest} />
    </div>
  )
}
