import { useState } from 'react'
import Modal from '../Modal'
import Icon from '../Icon'
import { useToast } from '../Toast'
import { INV_DATA, WH_FULFILLERS, wmSourceStock } from '../../data/warehouseData'
import { invStatus } from '../../data/inventoryData'

function coverage(lines, source) {
  let itemsFull = 0, unitsCovered = 0, unitsReq = 0
  lines.forEach((l) => {
    const av = wmSourceStock(source, l.sku)
    unitsReq += l.qty
    unitsCovered += Math.min(l.qty, av)
    if (av >= l.qty) itemsFull++
  })
  return { itemsFull, itemsTotal: lines.length, unitsCovered, unitsReq }
}

function Content({ onClose, onSubmit }) {
  const showToast = useToast()
  const [fulfiller, setFulfiller] = useState(WH_FULFILLERS[0])
  const [lines, setLines] = useState([])
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState(null) // INV item
  const [qty, setQty] = useState('')
  const [priority, setPriority] = useState('Normal')
  const [dropOpen, setDropOpen] = useState(false)
  const [lineErr, setLineErr] = useState(false)
  const [expanded, setExpanded] = useState(WH_FULFILLERS[0])

  const chosen = new Set(lines.map((l) => l.sku))
  const matches = INV_DATA.filter(
    (i) => !query || i.name.toLowerCase().includes(query.toLowerCase()) || i.variant.toLowerCase().includes(query.toLowerCase()) || i.cat.toLowerCase().includes(query.toLowerCase()) || i.sku.toLowerCase().includes(query.toLowerCase()),
  ).slice(0, 8)

  const pick = (item) => {
    setPicked(item)
    setQuery(`${item.name} — ${item.variant}`)
    setDropOpen(false)
  }
  const clearPick = () => { setPicked(null); setQuery('') }

  const addLine = () => {
    const q = +qty
    if (!picked || !qty || q < 1) { setLineErr(true); return }
    setLineErr(false)
    setLines((prev) => {
      const existing = prev.find((l) => l.sku === picked.sku)
      if (existing) return prev.map((l) => (l.sku === picked.sku ? { ...l, qty: l.qty + q } : l))
      return [...prev, { sku: picked.sku, product: `${picked.name} — ${picked.variant}`, qty: q }]
    })
    setQty('')
    clearPick()
  }
  const removeLine = (i) => setLines((prev) => prev.filter((_, idx) => idx !== i))

  const units = lines.reduce((s, l) => s + l.qty, 0)

  const submit = () => {
    let ls = lines
    if (!ls.length && picked && +qty >= 1) {
      ls = [{ sku: picked.sku, product: `${picked.name} — ${picked.variant}`, qty: +qty }]
    }
    if (!ls.length) { setLineErr(true); return }
    onSubmit({ fulfilledBy: fulfiller, lines: ls, urgent: priority === 'Urgent', units: ls.reduce((s, l) => s + l.qty, 0), items: ls.length })
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
            <Icon name="paper-plane-outline" size={18} style={{ color: '#1a2d6b' }} />
          </div>
          <div>
            <h3 className="text-[15px] font-extrabold text-navy-dark">New Stock Request</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Request a stock transfer into the Central Warehouse</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" size={17} style={{ color: '#64748b' }} />
        </button>
      </div>

      <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto thin-scroll">
        {/* Routing */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-border rounded-xl">
            <Icon name="business-outline" size={15} style={{ color: '#3366cc', flexShrink: 0 }} />
            <div className="min-w-0">
              <p className="text-[9px] text-gray-400 uppercase tracking-[0.06em] font-bold">From (Warehouse)</p>
              <p className="text-[11px] font-semibold text-navy-dark truncate">Central Warehouse</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-border rounded-xl">
            <Icon name="storefront-outline" size={15} style={{ color: '#7c4dff', flexShrink: 0 }} />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] text-gray-400 uppercase tracking-[0.06em] font-bold mb-0.5">To (Fulfils)</p>
              <select value={fulfiller} onChange={(e) => { setFulfiller(e.target.value); setExpanded(e.target.value) }} className="w-full bg-transparent text-[11px] font-semibold text-navy-dark border-none outline-none cursor-pointer">
                {WH_FULFILLERS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Add line */}
        <div>
          <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Add items <span className="text-brand-red">*</span></label>
          <div className="flex items-end gap-2">
            <div className="flex-1 min-w-0 relative">
              <div className="flex items-center gap-2 bg-white border-[1.5px] border-border rounded-lg px-3 py-2.5">
                <Icon name="search-outline" size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search product or SKU…"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPicked(null); setDropOpen(true) }}
                  onFocus={() => setDropOpen(true)}
                  className="flex-1 min-w-0 text-[12px] text-navy-dark placeholder-gray-400 border-none outline-none bg-transparent"
                />
                {picked && (
                  <button onClick={clearPick} type="button" className="shrink-0 text-gray-300 hover:text-brand-red transition">
                    <Icon name="close-circle" size={15} />
                  </button>
                )}
              </div>
              {dropOpen && !picked && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-lg z-50 overflow-y-auto thin-scroll" style={{ maxHeight: 240 }}>
                  {matches.length === 0 ? (
                    <p className="text-[11px] text-gray-400 text-center py-4">{query ? 'No products match.' : 'Type to search products.'}</p>
                  ) : (
                    matches.map((i) => {
                      const st = invStatus(i)
                      const already = chosen.has(i.sku)
                      const avail = i.onHand - i.reserved
                      return (
                        <button key={i.sku} type="button" disabled={already} onClick={() => !already && pick(i)} className={`w-full flex items-center gap-2.5 px-3 py-2 text-left border-b border-gray-100 last:border-0 transition ${already ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
                          <div className="w-7 h-7 rounded-lg bg-navy/8 flex items-center justify-center shrink-0"><Icon name="cube-outline" className="text-navy" size={13} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-navy-dark truncate">{i.name} <span className="text-gray-400 font-normal">· {i.variant}</span></p>
                            <p className="text-[10px] text-gray-400 truncate font-mono">{i.sku} · {i.cat}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${st.cls} shrink-0`}>{already ? 'Added' : avail + ' avail'}</span>
                        </button>
                      )
                    })
                  )}
                </div>
              )}
            </div>
            <div className="w-24 shrink-0">
              <input type="number" min="1" className="inp text-[12px]" placeholder="Qty" value={qty} onChange={(e) => setQty(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLine() } }} />
            </div>
            <button onClick={addLine} className="shrink-0 h-[38px] px-3 rounded-lg bg-navy text-white text-[12px] font-semibold hover:bg-navy-light transition flex items-center gap-1">
              <Icon name="add-outline" size={16} />Add
            </button>
          </div>
          {picked && (
            <div className="mt-1.5 text-[10px] text-gray-400">Current available at warehouse: <span className="font-bold text-navy-dark">{picked.onHand - picked.reserved}</span></div>
          )}
          {lineErr && <span className="text-[10px] text-brand-red mt-1 block">Choose a product and a quantity of 1 or more.</span>}
        </div>

        {/* Lines list */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="grid text-[9px] font-bold text-gray-400 uppercase tracking-[0.06em] px-3 py-2 bg-gray-50/60 border-b border-border" style={{ gridTemplateColumns: '2fr 0.6fr 0.4fr' }}>
            <div>Product</div><div className="text-right">Qty</div><div></div>
          </div>
          {lines.length === 0 ? (
            <div className="py-6 text-center">
              <Icon name="cube-outline" size={22} style={{ color: '#cbd5e1' }} />
              <p className="text-[11px] text-gray-400 mt-1">No items added yet</p>
            </div>
          ) : (
            lines.map((l, i) => (
              <div key={l.sku} className="grid items-center px-3 py-2 border-b border-gray-100 last:border-0" style={{ gridTemplateColumns: '2fr 0.6fr 0.4fr' }}>
                <p className="text-[11.5px] font-semibold text-navy-dark truncate">{l.product}</p>
                <p className="text-[12px] font-bold text-navy-dark text-right">{l.qty}</p>
                <div className="flex justify-end">
                  <button onClick={() => removeLine(i)} className="w-6 h-6 rounded-md border border-border flex items-center justify-center text-gray-400 hover:text-brand-red hover:border-brand-red/40 transition"><Icon name="close-outline" size={13} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Source availability */}
        {lines.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Icon name="location-outline" size={13} style={{ color: '#94a3b8' }} />
              <p className="text-[11px] font-semibold text-gray-500">Who can fulfil this? <span className="font-normal text-gray-400">Pick the source with stock</span></p>
            </div>
            <div className="space-y-1.5">
              {WH_FULFILLERS.map((src) => {
                const c = coverage(lines, src)
                const active = src === fulfiller
                const isOpen = src === expanded
                let badge, dotCls
                if (c.itemsFull === c.itemsTotal) {
                  dotCls = 'bg-brand-green'
                  badge = <span className="text-[10px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full whitespace-nowrap">Fulfils all {c.itemsTotal}</span>
                } else if (c.unitsCovered > 0) {
                  dotCls = 'bg-brand-orange'
                  badge = <span className="text-[10px] font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full whitespace-nowrap">Covers {c.itemsFull}/{c.itemsTotal} · {c.unitsCovered}/{c.unitsReq}u</span>
                } else {
                  dotCls = 'bg-gray-300'
                  badge = <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">No stock</span>
                }
                return (
                  <div key={src} className={`rounded-xl border overflow-hidden ${active ? 'border-navy ring-1 ring-navy/20' : 'border-border'}`}>
                    <button type="button" onClick={() => setExpanded(isOpen ? null : src)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition ${active ? 'bg-navy/5' : 'bg-white hover:bg-gray-50'}`}>
                      <div className={`w-2 h-2 rounded-full ${dotCls} shrink-0`}></div>
                      <Icon name="storefront-outline" size={14} style={{ color: '#7c4dff', flexShrink: 0 }} />
                      <p className="text-[12px] font-semibold text-navy-dark flex-1 min-w-0 truncate">
                        {src}
                        {active && <span className="text-[9px] font-bold text-navy bg-navy/10 px-1.5 py-0.5 rounded-full align-middle ml-1">Selected</span>}
                      </p>
                      {badge}
                      <Icon name="chevron-down-outline" size={14} style={{ color: '#94a3b8', flexShrink: 0, transition: 'transform .15s', transform: `rotate(${isOpen ? 180 : 0}deg)` }} />
                    </button>
                    {isOpen && (
                      <div className="border-t border-border bg-gray-50/50">
                        <div className="grid px-3 pt-2 pb-1 text-[9px] font-bold text-gray-400 uppercase tracking-[0.05em]" style={{ gridTemplateColumns: '1.7fr 0.55fr 0.75fr' }}>
                          <div>Product</div><div className="text-right">Req.</div><div className="text-right">In stock</div>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {lines.map((l) => {
                            const av = wmSourceStock(src, l.sku)
                            const ok = av >= l.qty, some = av > 0 && av < l.qty
                            const cls = ok ? 'text-brand-green' : some ? 'text-brand-orange' : 'text-gray-300'
                            const icon = ok ? 'checkmark-circle' : some ? 'alert-circle' : 'close-circle-outline'
                            return (
                              <div key={l.sku} className="grid items-center px-3 py-1.5" style={{ gridTemplateColumns: '1.7fr 0.55fr 0.75fr' }}>
                                <p className="text-[11px] font-medium text-navy-dark truncate">{l.product}</p>
                                <p className="text-[11px] text-gray-400 text-right">{l.qty}</p>
                                <p className={`text-[11px] font-bold ${cls} text-right flex items-center justify-end gap-1`}><Icon name={icon} size={11} />{av}</p>
                              </div>
                            )
                          })}
                        </div>
                        <div className="px-3 py-2.5 border-t border-border">
                          {active ? (
                            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-navy"><Icon name="checkmark-circle" size={14} />Selected as source</div>
                          ) : (
                            <button type="button" onClick={() => { setFulfiller(src); setExpanded(src) }} className="w-full py-2 rounded-lg bg-navy text-white text-[11px] font-semibold hover:bg-navy-light transition">Use this source</button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Summary + priority */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div><span className="text-[16px] font-extrabold text-navy-dark">{lines.length}</span> <span className="text-[10px] text-gray-400">items</span></div>
            <div><span className="text-[16px] font-extrabold text-navy-dark">{units}</span> <span className="text-[10px] text-gray-400">units</span></div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-gray-600">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="inp text-[12px]" style={{ width: 'auto', paddingRight: 32 }}>
              <option>Normal</option>
              <option>Urgent</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-gray-50/60 rounded-b-2xl">
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 bg-white hover:bg-gray-50 transition">Cancel</button>
        <button onClick={submit} className="flex-1 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition flex items-center justify-center gap-1.5">
          <Icon name="paper-plane-outline" size={15} />Send Request
        </button>
      </div>
    </>
  )
}

export default function NewStockRequestModal({ open, onClose, onSubmit }) {
  return <Modal item={open ? {} : null} onClose={onClose} maxWidth="max-w-lg" render={() => <Content onClose={onClose} onSubmit={onSubmit} />} />
}
