import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { INV_DATA, STORE_INVENTORY, WH_FULFILLERS, storeMeta, storeInitial } from '../data/warehouseData'

// Branches the warehouse oversees (Central Warehouse itself is excluded here).
const SS_STORES = WH_FULFILLERS

// Per-store status vs that store's own (lighter) reorder point.
function ssStatus(qty, reorder) {
  if (qty === 0) return { key: 'out', label: 'Out', cls: 'text-brand-red bg-brand-red/10' }
  if (qty <= reorder) return { key: 'low', label: 'Low', cls: 'text-brand-orange bg-brand-orange/10' }
  return { key: 'ok', label: 'In Stock', cls: 'text-brand-green bg-brand-green/10' }
}
function ssQtyColor(qty, reorder) {
  if (qty === 0) return '#eb445a'
  if (qty <= reorder) return '#ff9800'
  return '#0a1535'
}

// Build one row per product with its on-hand at each branch (from real STORE_INVENTORY).
const STORE_STOCK = INV_DATA.map((p) => {
  const reorder = Math.max(4, Math.round((p.reorder || 60) / 3))
  const byStore = {}
  let total = 0
  SS_STORES.forEach((st) => {
    const q = (STORE_INVENTORY[st] || {})[p.sku] || 0
    byStore[st] = q
    total += q
  })
  return { sku: p.sku, name: p.name, variant: p.variant, cat: p.cat, reorder, byStore, total }
})

const ROLLUP_COLS = 'minmax(0,1.7fr) minmax(0,1fr) minmax(0,0.9fr) minmax(0,1.9fr) minmax(0,0.7fr) 34px'
const SINGLE_COLS = '1.8fr 1fr 1fr 0.8fr 0.8fr 0.9fr'

const TABS = [
  { k: 'all', label: 'All' },
  { k: 'low', label: 'Low' },
  { k: 'out', label: 'Out' },
]

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

// Labeled availability pills — "N in stock / N low / N out" so counts are self-explanatory.
function AvailabilityPills({ ok, low, out }) {
  const Chip = ({ n, color, bg, label }) =>
    n ? (
      <span
        className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
        style={{ color, background: bg }}
      >
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color }} />
        {n} {label}
      </span>
    ) : null
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <Chip n={ok} color="#16a34a" bg="rgba(45,211,111,0.12)" label="in stock" />
      <Chip n={low} color="#c2410c" bg="rgba(255,152,0,0.12)" label="low" />
      <Chip n={out} color="#b91c1c" bg="rgba(235,68,90,0.12)" label="out" />
    </div>
  )
}

export default function StoreStock() {
  const [search, setSearch] = useState('')
  const [storeSel, setStoreSel] = useState('')
  const [cat, setCat] = useState('')
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(() => new Set())

  const categories = useMemo(() => [...new Set(STORE_STOCK.map((r) => r.cat))].sort(), [])

  // KPIs always reflect every branch.
  const kpis = useMemo(() => {
    let units = 0, low = 0, out = 0
    STORE_STOCK.forEach((r) =>
      SS_STORES.forEach((st) => {
        const q = r.byStore[st]
        units += q
        const k = ssStatus(q, r.reorder).key
        if (k === 'low') low++
        else if (k === 'out') out++
      }),
    )
    return { stores: SS_STORES.length, units, low, out }
  }, [])

  // Text + category filter first.
  const searched = useMemo(() => {
    const q = search.trim().toLowerCase()
    return STORE_STOCK.filter(
      (r) =>
        (!q || r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q) || (r.variant || '').toLowerCase().includes(q)) &&
        (!cat || r.cat === cat),
    )
  }, [search, cat])

  // Then status filter — in matrix mode keep a product if ANY branch matches;
  // in single-branch mode match against that branch's qty.
  const rows = useMemo(() => {
    if (filter === 'all') return searched
    return searched.filter((r) => {
      if (storeSel) return ssStatus(r.byStore[storeSel], r.reorder).key === filter
      return SS_STORES.some((st) => ssStatus(r.byStore[st], r.reorder).key === filter)
    })
  }, [searched, filter, storeSel])

  const toggleRow = (sku) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(sku) ? next.delete(sku) : next.add(sku)
      return next
    })

  return (
    <div className="p-8 max-md:p-3.5">
      {/* Purpose banner */}
      <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3 mb-6">
        <Icon name="information-circle-outline" size={15} style={{ color: '#3366cc', flexShrink: 0, marginTop: 1 }} />
        <p className="text-[11px] text-gray-600 leading-relaxed">
          <strong className="text-navy-dark">Live stock across every branch.</strong> The warehouse sees what each store holds — use the summary to spot where a product is running low, compare branches, and decide who needs a replenishment transfer. Switch to a single branch for a full stock breakdown. This is a read-only view; corrections happen at the store.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3 mb-6 max-md:grid-cols-2">
        <KpiCard icon="storefront-outline" iconBg="bg-navy/10" iconColor="text-navy" value={kpis.stores} valueCls="text-navy-dark" label="Branches" />
        <KpiCard icon="layers-outline" iconBg="bg-brand-blue/10" iconColor="text-brand-blue" value={kpis.units.toLocaleString()} valueCls="text-brand-blue" label="Units In Stores" />
        <KpiCard icon="alert-circle-outline" iconBg="bg-brand-orange/10" iconColor="text-brand-orange" value={kpis.low} valueCls="text-brand-orange" label="Low Store-SKUs" />
        <KpiCard icon="close-circle-outline" iconBg="bg-brand-red/10" iconColor="text-brand-red" value={kpis.out} valueCls="text-brand-red" label="Out-of-Stock Store-SKUs" />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 border border-border flex-1 min-w-[200px] max-w-xs">
            <Icon name="search-outline" size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search product, SKU…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[12px] text-navy-dark placeholder-gray-400 flex-1 border-none outline-none"
            />
          </div>
          <select
            value={storeSel}
            onChange={(e) => setStoreSel(e.target.value)}
            className="text-[11px] font-medium text-gray-600 bg-page border border-border rounded-lg px-3 py-2 cursor-pointer"
          >
            <option value="">All Branches (summary)</option>
            {SS_STORES.map((st) => (
              <option key={st} value={st}>{`${st} (${storeMeta(st).code})`}</option>
            ))}
          </select>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="text-[11px] font-medium text-gray-600 bg-page border border-border rounded-lg px-3 py-2 cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <div className="flex bg-page border border-border rounded-lg overflow-hidden">
            {TABS.map((t) => (
              <button
                key={t.k}
                onClick={() => setFilter(t.k)}
                className={`px-3 py-1.5 text-[11px] transition ${filter === t.k ? 'font-semibold bg-navy text-white' : 'font-medium text-gray-500 hover:bg-white/60'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {storeSel ? (
          <SingleBranchView rows={rows} store={storeSel} />
        ) : (
          <RollupView rows={rows} expanded={expanded} toggleRow={toggleRow} />
        )}

        {/* Footer / legend */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-gray-50/40 max-md:flex-col max-md:items-start max-md:gap-2">
          <p className="text-[11px] text-gray-400">{`Showing ${rows.length} of ${STORE_STOCK.length}`}</p>
          <div className="flex items-center gap-3 text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-brand-green inline-block" />In stock</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-brand-orange inline-block" />Low</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-brand-red inline-block" />Out</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── All-branches summary view (expandable rows — scales to any store count) ──
function RollupView({ rows, expanded, toggleRow }) {
  return (
    <>
      <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60 max-md:hidden" style={{ gridTemplateColumns: ROLLUP_COLS }}>
        <div>Product</div>
        <div>SKU</div>
        <div>Category</div>
        <div title={`How many of the ${SS_STORES.length} branches have this product in stock, low, or out`}>{`Branches (of ${SS_STORES.length}) — stock status`}</div>
        <div className="text-right">Total in stores</div>
        <div></div>
      </div>

      <div>
        {rows.length === 0 ? (
          <div className="py-16 text-center">
            <Icon name="cube-outline" size={30} style={{ color: '#cbd5e1' }} />
            <p className="text-[13px] text-gray-400 mt-2">No stock rows match your filters.</p>
          </div>
        ) : (
          rows.map((r) => {
            let ok = 0, low = 0, out = 0
            SS_STORES.forEach((st) => {
              const k = ssStatus(r.byStore[st], r.reorder).key
              if (k === 'ok') ok++
              else if (k === 'low') low++
              else out++
            })
            const isOpen = expanded.has(r.sku)
            return (
              <div key={r.sku} className="border-b border-border last:border-0">
                <div
                  className={`grid items-center px-5 py-3 cursor-pointer hover:bg-gray-50/60 transition max-md:grid-cols-[1fr_auto] max-md:gap-2 ${isOpen ? 'bg-gray-50/60' : ''}`}
                  style={{ gridTemplateColumns: ROLLUP_COLS }}
                  onClick={() => toggleRow(r.sku)}
                >
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-navy-dark truncate">{r.name}</p>
                    <p className="text-[10.5px] text-gray-400 truncate">{r.variant || '—'}</p>
                    {/* Mobile-only condensed summary */}
                    <div className="hidden max-md:flex items-center gap-2 mt-1.5">
                      <AvailabilityPills ok={ok} low={low} out={out} />
                      <span className="text-[10px] text-gray-400">· {r.total} total</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-gray-500 truncate max-md:hidden">{r.sku}</div>
                  <div className="text-[11.5px] text-gray-600 truncate max-md:hidden">{r.cat}</div>
                  <div className="max-md:hidden">
                    <AvailabilityPills ok={ok} low={low} out={out} />
                  </div>
                  <div className="text-right text-[13px] font-extrabold text-navy-dark max-md:hidden">{r.total}</div>
                  <div className="flex justify-end text-gray-300">
                    <Icon name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'} size={15} />
                  </div>
                </div>

                {isOpen && (
                  <div className="px-5 py-4 bg-gray-50/70 border-t border-border">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-2.5">Per-branch breakdown</p>
                    <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))' }}>
                      {SS_STORES.map((st) => {
                        const q = r.byStore[st]
                        const s = ssStatus(q, r.reorder)
                        const m = storeMeta(st)
                        return (
                          <div key={st} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white border border-border">
                            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-white shrink-0" style={{ background: m.color }}>
                              {storeInitial(st)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-semibold text-navy-dark truncate leading-tight">{st}</p>
                              <p className="text-[10px] text-gray-400 font-mono">{m.code}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[10px] text-gray-400 leading-none">On hand</p>
                              <p className="text-[14px] font-extrabold leading-tight" style={{ color: ssQtyColor(q, r.reorder) }}>{q}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${s.cls}`}>{s.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </>
  )
}

// ── Single-branch detailed view ──
function SingleBranchView({ rows, store }) {
  const m = storeMeta(store)
  return (
    <>
      <div className="px-5 py-3 border-b border-border bg-gray-50/30 flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-extrabold text-white shrink-0" style={{ background: m.color }}>
          {storeInitial(store)}
        </span>
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold text-navy-dark truncate leading-tight">{store}</p>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{m.code}</p>
        </div>
      </div>

      <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-5 py-2.5 border-b border-border bg-gray-50/60 max-md:hidden" style={{ gridTemplateColumns: SINGLE_COLS }}>
        <div>Product</div>
        <div>SKU</div>
        <div>Category</div>
        <div className="text-right">On Hand</div>
        <div className="text-right">Reorder</div>
        <div className="text-center">Status</div>
      </div>

      <div>
        {rows.length === 0 ? (
          <div className="py-16 text-center">
            <Icon name="cube-outline" size={30} style={{ color: '#cbd5e1' }} />
            <p className="text-[13px] text-gray-400 mt-2">No stock rows match your filters.</p>
          </div>
        ) : (
          rows.map((r) => {
            const q = r.byStore[store]
            const s = ssStatus(q, r.reorder)
            return (
              <div key={r.sku} className="grid items-center px-5 py-3 border-b border-border last:border-0 hover:bg-gray-50/60 transition max-md:grid-cols-[1fr_auto] max-md:gap-2" style={{ gridTemplateColumns: SINGLE_COLS }}>
                <div className="min-w-0">
                  <p className="text-[12.5px] font-semibold text-navy-dark truncate">{r.name}</p>
                  <p className="text-[10.5px] text-gray-400 truncate">{r.variant || '—'}</p>
                  <p className="hidden max-md:block text-[11px] mt-1 font-bold" style={{ color: ssQtyColor(q, r.reorder) }}>{q} on hand</p>
                </div>
                <div className="text-[11px] font-mono text-gray-500 truncate max-md:hidden">{r.sku}</div>
                <div className="text-[11.5px] text-gray-600 truncate max-md:hidden">{r.cat}</div>
                <div className="text-right text-[13px] font-extrabold max-md:hidden" style={{ color: ssQtyColor(q, r.reorder) }}>{q}</div>
                <div className="text-right text-[11.5px] text-gray-400 max-md:hidden">{r.reorder}</div>
                <div className="text-center max-md:flex max-md:items-center"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span></div>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
