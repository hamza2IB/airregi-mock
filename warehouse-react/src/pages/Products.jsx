import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'
import ProductDetailSlideover from '../components/products/ProductDetailSlideover'
import ProductWizard from '../components/products/ProductWizard'
import { INV_DATA } from '../data/warehouseData'
import {
  pmGroups,
  pmColorPair,
  pmTypeIcon,
  PM_TYPE_BADGE,
  PM_STATUS_BADGE,
  PM_STATUS_DOT,
  cap,
} from '../data/productData'

const PM_PAGE = 8
const COLS = '52px 1.9fr 1fr 1fr 0.9fr 0.7fr 0.9fr 0.9fr 0.9fr 200px'

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

function TypeBadge({ type }) {
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PM_TYPE_BADGE[type] || 'text-gray-500 bg-gray-100'}`}>{cap(type)}</span>
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${PM_STATUS_BADGE[status] || 'text-gray-500 bg-gray-100'}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: PM_STATUS_DOT[status] || '#94a3b8' }}></span>
      {cap(status)}
    </span>
  )
}

const TABS = ['all', 'active', 'draft', 'inactive']

export default function Products({ onStockAction }) {
  const showToast = useToast()
  const [products, setProducts] = useState(INV_DATA)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [cat, setCat] = useState('')
  const [page, setPage] = useState(1)

  const [detail, setDetail] = useState(null)
  const [wizard, setWizard] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const groups = useMemo(() => pmGroups(products), [products])
  const categories = useMemo(() => [...new Set(products.map((i) => i.cat))].sort(), [products])

  const kpis = {
    total: groups.length,
    active: groups.filter((g) => g.status === 'active').length,
    draft: groups.filter((g) => g.status === 'draft').length,
    variants: groups.filter((g) => g.type === 'variant').length,
  }

  const data = useMemo(() => {
    const q = search.toLowerCase()
    return groups.filter((g) => {
      const matchS = !q || g.name.toLowerCase().includes(q) || g.rows.some((r) => r.sku.toLowerCase().includes(q))
      const matchC = !cat || g.cat === cat
      const matchF = filter === 'all' || g.status === filter
      return matchS && matchC && matchF
    })
  }, [groups, search, cat, filter])

  const total = data.length
  const pages = Math.ceil(total / PM_PAGE) || 1
  const curPage = Math.min(page, pages)
  const items = data.slice((curPage - 1) * PM_PAGE, curPage * PM_PAGE)

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

  // ── Row actions ──
  const openView = (g) => setDetail(g)
  const openEdit = (name) => {
    const g = groups.find((x) => x.name === name)
    if (!g) return
    setDetail(null)
    setWizard({ editing: g, products })
  }
  const openAdd = () => setWizard({ editing: null, products })

  const doDelete = (g) => {
    setConfirm({
      title: 'Delete Product',
      msg: `Delete "${g.name}"? This removes ${g.rows.length} SKU${g.rows.length > 1 ? 's' : ''} from the catalog.`,
      confirmLabel: 'Delete',
      tone: 'danger',
      onConfirm: () => {
        const removed = g.rows.length
        setProducts((prev) => prev.filter((p) => p.name !== g.name))
        showToast(`"${g.name}" deleted — ${removed} SKU${removed > 1 ? 's' : ''} removed.`, 'success')
      },
    })
  }

  const handleSave = ({ rows, editing, mode, added, name }) => {
    setProducts((prev) => {
      const kept = editing ? prev.filter((p) => p.name !== editing) : prev
      return editing ? [...kept, ...rows] : [...rows, ...kept]
    })
    setWizard(null)
    if (editing) showToast(`"${name}" updated — ${added} saved.`, 'success')
    else showToast(`"${name}" ${mode === 'publish' ? 'published' : 'saved as draft'} — ${added} added to the catalog.`, 'success')
  }

  return (
    <div className="p-8 max-md:p-3.5">
      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3 mb-6 max-md:grid-cols-2">
        <KpiCard icon="pricetags-outline" iconBg="bg-navy/10" iconColor="text-navy" value={kpis.total} valueCls="text-navy-dark" label="Total Products" />
        <KpiCard icon="checkmark-circle-outline" iconBg="bg-brand-green/10" iconColor="text-brand-green" value={kpis.active} valueCls="text-brand-green" label="Active" />
        <KpiCard icon="document-text-outline" iconBg="bg-brand-orange/10" iconColor="text-brand-orange" value={kpis.draft} valueCls="text-brand-orange" label="Drafts" />
        <KpiCard icon="grid-outline" iconBg="bg-brand-purple/10" iconColor="text-brand-purple" value={kpis.variants} valueCls="text-navy-dark" label="Variant Products" />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[200px] max-w-xs">
            <Icon name="search-outline" size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search product, SKU…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage() }}
              className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none"
            />
          </div>
          <div className="flex bg-page border border-border rounded-lg overflow-hidden">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => { setFilter(t); resetPage() }}
                className={`px-3 py-1.5 text-[11px] transition ${filter === t ? 'font-semibold bg-navy text-white' : 'font-medium text-gray-500 hover:bg-white/60'}`}
              >
                {cap(t)}
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
            <button onClick={openAdd} className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-navy px-4 py-2.5 rounded-xl hover:bg-navy-light transition">
              <Icon name="add-outline" size={16} /> Add Product
            </button>
          </div>
        </div>

        {/* Table header */}
        <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60 max-md:hidden" style={{ gridTemplateColumns: COLS }}>
          <div></div>
          <div>Product</div>
          <div>SKU</div>
          <div>Category</div>
          <div>Type</div>
          <div className="text-center">Variants</div>
          <div className="text-right">Physical Stock</div>
          <div className="text-right">Reorder at</div>
          <div className="text-center">Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <Icon name="cube-outline" size={30} style={{ color: '#cbd5e1' }} />
              <p className="text-[13px] text-gray-400 mt-2">No products found</p>
            </div>
          ) : (
            items.map((g) => {
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
                      <span className="text-[11px] text-gray-500 font-mono truncate">{g.rows[0]?.sku || '—'}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 truncate pr-2 max-md:hidden">{g.cat}</p>
                  <div className="max-md:hidden"><TypeBadge type={g.type} /></div>
                  <div className="text-center max-md:hidden">
                    {g.type === 'variant' ? (
                      <span className="text-[11px] font-bold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full">{g.rows.length}</span>
                    ) : (
                      <span className="text-[11px] text-gray-300">—</span>
                    )}
                  </div>
                  <p className={`text-[13px] font-bold text-right max-md:hidden ${lowStock ? 'text-brand-orange' : 'text-navy-dark'}`}>{g.stock.toLocaleString()}</p>
                  <p className="text-[12px] font-semibold text-gray-400 text-right max-md:hidden">{g.reorder ? g.reorder.toLocaleString() : '—'}</p>
                  <div className="text-center max-md:hidden"><StatusBadge status={g.status} /></div>
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => openView(g)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-border bg-white text-gray-500 hover:text-navy hover:border-navy/30 hover:bg-gray-50 transition shrink-0 whitespace-nowrap">
                      <Icon name="eye-outline" size={12} />View
                    </button>
                    <button onClick={() => openEdit(g.name)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-navy/30 bg-navy/10 text-navy hover:bg-navy/20 transition shrink-0 whitespace-nowrap">
                      <Icon name="create-outline" size={12} />Edit
                    </button>
                    <button onClick={() => doDelete(g)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border border-brand-red/30 bg-brand-red/10 text-brand-red hover:bg-brand-red/20 transition shrink-0 whitespace-nowrap">
                      <Icon name="trash-outline" size={12} />Delete
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
            {total ? `Showing ${Math.min((curPage - 1) * PM_PAGE + 1, total)}–${Math.min(curPage * PM_PAGE, total)} of ${total} products` : 'Showing 0 of 0'}
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

      <ProductDetailSlideover item={detail} onClose={() => setDetail(null)} onEdit={openEdit} onStockAction={(action, sku) => { setDetail(null); onStockAction?.(action, sku) }} />
      <ProductWizard session={wizard} onClose={() => setWizard(null)} onSave={handleSave} />
      <ConfirmModal state={confirm} onClose={() => setConfirm(null)} />
    </div>
  )
}
