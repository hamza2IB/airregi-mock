import { useMemo, useState } from 'react'
import Icon from '../Icon'
import Pager from './Pager'
import { PRODUCTS_DATA, INV_CATEGORIES } from '../../data/storeDetailData'

const PAGE_SIZE = 5
const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'low', label: 'Low Stock' },
  { key: 'out', label: 'Out of Stock' },
  { key: 'ok', label: 'In Stock' },
]
const TAB_ACTIVE = 'px-3 py-1.5 text-[11px] font-semibold bg-navy text-white'
const TAB_IDLE = 'px-3 py-1.5 text-[11px] font-medium text-gray-500 hover:bg-white/60 transition'

const invStatusOf = (stock) => (stock === 0 ? 'out' : stock < 15 ? 'low' : 'ok')

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

function StatusBadge({ status }) {
  if (status === 'low') return <span className="text-[9px] font-bold bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full">Low Stock</span>
  if (status === 'out') return <span className="text-[9px] font-bold bg-brand-red/10 text-brand-red px-2 py-0.5 rounded-full">Out of Stock</span>
  return <span className="text-[9px] font-bold bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">In Stock</span>
}

export default function InventoryTab() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('')
  const [page, setPage] = useState(1)

  const items = useMemo(() => PRODUCTS_DATA.map((p) => ({ ...p, invStatus: invStatusOf(p.stock) })), [])
  const kpis = useMemo(() => ({
    skus: items.length,
    units: items.reduce((s, p) => s + p.stock, 0),
    low: items.filter((p) => p.invStatus === 'low').length,
    out: items.filter((p) => p.invStatus === 'out').length,
  }), [items])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter((p) =>
      (filter === 'all' || p.invStatus === filter) &&
      (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
      (!cat || p.category === cat)
    )
  }, [items, filter, search, cat])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const curPage = Math.min(page, totalPages)
  const start = (curPage - 1) * PAGE_SIZE
  const paged = filtered.slice(start, start + PAGE_SIZE)

  return (
    <div className="p-5">
      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3 mb-5 max-md:grid-cols-2">
        <KpiCard icon="cube-outline" wrap="bg-navy/10 text-navy" value={kpis.skus} valueCls="text-navy-dark" label="Total SKUs" />
        <KpiCard icon="layers-outline" wrap="bg-brand-blue/10 text-brand-blue" value={kpis.units.toLocaleString()} valueCls="text-navy-dark" label="Total Units" />
        <KpiCard icon="alert-circle-outline" wrap="bg-brand-orange/10 text-brand-orange" value={kpis.low} valueCls="text-brand-orange" label="Low Stock" />
        <KpiCard icon="close-circle-outline" wrap="bg-brand-red/10 text-brand-red" value={kpis.out} valueCls="text-brand-red" label="Out of Stock" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[180px] max-w-sm">
          <Icon name="search-outline" style={{ fontSize: '14px', color: '#94a3b8', flexShrink: 0 }} />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} type="text" placeholder="Search products, SKU…" className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none" />
        </div>
        <div className="flex bg-page border border-border rounded-lg overflow-hidden">
          {STATUS_TABS.map((t) => (
            <button key={t.key} onClick={() => { setFilter(t.key); setPage(1) }} className={filter === t.key ? TAB_ACTIVE : TAB_IDLE}>{t.label}</button>
          ))}
        </div>
        <select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1) }} className="text-[11px] font-medium text-gray-600 bg-page border border-border rounded-lg px-3 py-2 cursor-pointer">
          <option value="">All Categories</option>
          {INV_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60 max-md:hidden" style={{ gridTemplateColumns: '1.6fr 0.8fr 0.8fr 0.6fr 0.6fr 0.7fr 0.6fr' }}>
          <div>Product</div><div>SKU</div><div>Category</div>
          <div className="text-right">Price</div><div className="text-right">Stock</div>
          <div className="text-center">Channels</div><div className="text-center">Status</div>
        </div>
        <div className="divide-y divide-gray-100">
          {paged.length === 0 && <div className="py-10 text-center text-[12px] text-gray-400">No products match your filters.</div>}
          {paged.map((p) => (
            <div key={p.id} className={`grid items-center px-5 py-3 hover:bg-gray-50/60 transition max-md:grid-cols-2 max-md:gap-2 ${p.invStatus === 'out' ? 'bg-brand-red/[0.015]' : p.invStatus === 'low' ? 'bg-brand-orange/[0.015]' : ''}`} style={{ gridTemplateColumns: '1.6fr 0.8fr 0.8fr 0.6fr 0.6fr 0.7fr 0.6fr' }}>
              <div className="min-w-0"><p className="text-[12px] font-semibold text-navy-dark truncate leading-tight">{p.name}</p></div>
              <p className="text-[11px] font-mono text-gray-400">{p.sku}</p>
              <p className="text-[11px] text-gray-500">{p.category}</p>
              <p className="text-right text-[12px] font-medium text-navy-dark">{p.price}</p>
              <p className={`text-right text-[12px] font-semibold ${p.stock === 0 ? 'text-brand-red' : p.stock < 15 ? 'text-brand-orange' : 'text-navy-dark'}`}>{p.stock}</p>
              <div className="flex items-center justify-center gap-1.5">
                {p.pos && <span className="text-[8px] font-bold bg-navy/10 text-navy px-1.5 py-0.5 rounded">POS</span>}
                {p.ec && <span className="text-[8px] font-bold bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded">EC</span>}
              </div>
              <div className="text-center"><StatusBadge status={p.invStatus} /></div>
            </div>
          ))}
        </div>
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
