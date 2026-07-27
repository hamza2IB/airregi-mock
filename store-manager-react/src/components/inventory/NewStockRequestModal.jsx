import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../Icon'
import { SM_INV, smInvStatus } from '../../data/inventoryData'
import { SM_FULFILLERS, smSourceStock, smSourceCoverage } from '../../data/transferData'

// Centered modal (self-contained; retains content during fade-out via `shown`).
export default function NewStockRequestModal({ state, onClose, onSubmit }) {
  const [shown, setShown] = useState(state)
  useEffect(() => { if (state) setShown(state) }, [state])
  const open = !!state

  return (
    <div className={`fixed inset-0 z-[500] flex items-center justify-center p-4 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-navy-dark/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative bg-white rounded-2xl w-full max-w-lg z-10 transition-transform duration-200 ${open ? 'scale-100' : 'scale-95'}`} style={{ boxShadow: '0 24px 64px rgba(10,21,53,0.22)' }}>
        {shown && <Content preselectSku={shown.sku} onClose={onClose} onSubmit={onSubmit} />}
      </div>
    </div>
  )
}

function Content({ preselectSku, onClose, onSubmit }) {
  const [fulfiller, setFulfiller] = useState('Central Warehouse')
  const [priority, setPriority] = useState('Normal')
  const [lines, setLines] = useState([])
  const [pickSku, setPickSku] = useState('')      // currently selected product in the add-row
  const [searchText, setSearchText] = useState('')
  const [qty, setQty] = useState('')
  const [ddOpen, setDdOpen] = useState(false)
  const [lineErr, setLineErr] = useState(false)
  const [expanded, setExpanded] = useState('Central Warehouse')
  const qtyRef = useRef(null)

  // Pre-select the row's product when opened from a row's Request action.
  useEffect(() => {
    if (preselectSku && SM_INV.some((i) => i.sku === preselectSku)) pick(preselectSku)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chosen = useMemo(() => new Set(lines.map((l) => l.sku)), [lines])
  const matches = useMemo(() => {
    const q = searchText.trim().toLowerCase()
    return SM_INV.filter((i) => !q || i.name.toLowerCase().includes(q) || i.variant.toLowerCase().includes(q) || i.cat.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)).slice(0, 8)
  }, [searchText])

  const pickItem = pickSku ? SM_INV.find((i) => i.sku === pickSku) : null
  const units = lines.reduce((s, l) => s + l.qty, 0)

  function pick(sku) {
    const item = SM_INV.find((i) => i.sku === sku)
    if (!item) return
    setPickSku(sku)
    setSearchText(`${item.name} — ${item.variant}`)
    setDdOpen(false)
    setTimeout(() => qtyRef.current?.focus(), 0)
  }
  function clearPick() { setPickSku(''); setSearchText(''); setDdOpen(false) }

  function addLine() {
    const q = Number(qty)
    if (!pickItem || !qty || q < 1) { setLineErr(true); return }
    setLineErr(false)
    setLines((prev) => {
      const ex = prev.find((l) => l.sku === pickItem.sku)
      if (ex) return prev.map((l) => (l.sku === pickItem.sku ? { ...l, qty: l.qty + q } : l))
      return [...prev, { sku: pickItem.sku, product: `${pickItem.name} — ${pickItem.variant}`, qty: q }]
    })
    setQty('')
    clearPick()
  }
  const removeLine = (sku) => setLines((prev) => prev.filter((l) => l.sku !== sku))

  function submit() {
    let working = lines
    if (!working.length && pickItem && Number(qty) >= 1) {
      working = [{ sku: pickItem.sku, product: `${pickItem.name} — ${pickItem.variant}`, qty: Number(qty) }]
    }
    if (!working.length) { setLineErr(true); return }
    onSubmit({ lines: working, fulfiller, priority })
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
            <Icon name="paper-plane-outline" style={{ fontSize: '18px', color: '#1a2d6b' }} />
          </div>
          <div>
            <h3 className="text-[15px] font-extrabold text-navy-dark">New Stock Request</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Requests a stock transfer from the Central Warehouse</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" style={{ fontSize: '17px', color: '#64748b' }} />
        </button>
      </div>

      <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto thin-scroll">
        {/* Routing */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-border rounded-xl">
            <Icon name="storefront-outline" style={{ fontSize: '15px', color: '#7c4dff', flexShrink: 0 }} />
            <div className="min-w-0">
              <p className="text-[9px] text-gray-400 uppercase tracking-[0.06em] font-bold">From (Store)</p>
              <p className="text-[11px] font-semibold text-navy-dark truncate">Al Fatah Main Branch</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-border rounded-xl">
            <Icon name="business-outline" style={{ fontSize: '15px', color: '#3366cc', flexShrink: 0 }} />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] text-gray-400 uppercase tracking-[0.06em] font-bold mb-0.5">To (Fulfils)</p>
              <select value={fulfiller} onChange={(e) => { setFulfiller(e.target.value); setExpanded(e.target.value) }} className="w-full bg-transparent text-[11px] font-semibold text-navy-dark border-none outline-none cursor-pointer">
                {SM_FULFILLERS.map((f) => <option key={f} value={f}>{f}</option>)}
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
                <Icon name="search-outline" style={{ fontSize: '15px', color: '#94a3b8', flexShrink: 0 }} />
                <input value={searchText} onChange={(e) => { setSearchText(e.target.value); setPickSku(''); setDdOpen(true) }} onFocus={() => setDdOpen(true)} onBlur={() => setTimeout(() => setDdOpen(false), 150)} type="text" placeholder="Search product or SKU…" autoComplete="off" className="flex-1 min-w-0 text-[12px] text-navy-dark placeholder-gray-400 border-none outline-none bg-transparent" />
                {pickSku && <button onClick={clearPick} type="button" className="shrink-0 text-gray-300 hover:text-brand-red transition"><Icon name="close-circle" style={{ fontSize: '15px' }} /></button>}
              </div>
              {ddOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-lg z-50 overflow-y-auto thin-scroll" style={{ maxHeight: '240px' }}>
                  {matches.length === 0 ? (
                    <p className="text-[11px] text-gray-400 text-center py-4">{searchText ? 'No products match.' : 'Type to search products.'}</p>
                  ) : (
                    matches.map((i) => {
                      const st = smInvStatus(i)
                      const already = chosen.has(i.sku)
                      const avail = i.onHand - i.reserved
                      return (
                        <button key={i.sku} type="button" disabled={already} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(i.sku)} className={`w-full flex items-center gap-2.5 px-3 py-2 text-left border-b border-gray-100 last:border-0 transition ${already ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
                          <div className="w-7 h-7 rounded-lg bg-navy/[0.08] flex items-center justify-center shrink-0"><Icon name="cube-outline" className="text-navy" style={{ fontSize: '13px' }} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-navy-dark truncate">{i.name} <span className="text-gray-400 font-normal">· {i.variant}</span></p>
                            <p className="text-[10px] text-gray-400 truncate font-mono">{i.sku} · {i.cat}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${st.cls}`}>{already ? 'Added' : avail + ' avail'}</span>
                        </button>
                      )
                    })
                  )}
                </div>
              )}
            </div>
            <div className="w-24 shrink-0">
              <input ref={qtyRef} value={qty} onChange={(e) => { setQty(e.target.value); setLineErr(false) }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLine() } }} type="number" min="1" className="w-full border-[1.5px] border-border rounded-lg px-3 py-2.5 text-[12px] text-navy-dark bg-white focus:outline-none focus:border-navy" placeholder="Qty" />
            </div>
            <button onClick={addLine} className="shrink-0 h-[42px] px-3 rounded-lg bg-navy text-white text-[12px] font-semibold hover:bg-navy-light transition flex items-center gap-1">
              <Icon name="add-outline" style={{ fontSize: '16px' }} />Add
            </button>
          </div>
          {pickItem && <div className="mt-1.5 text-[10px] text-gray-400">Current available at branch: <span className="font-bold text-navy-dark">{pickItem.onHand - pickItem.reserved}</span></div>}
          {lineErr && <span className="text-[10px] text-brand-red mt-1 block">Choose a product and a quantity of 1 or more.</span>}
        </div>

        {/* Lines list */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="grid text-[9px] font-bold text-gray-400 uppercase tracking-[0.06em] px-3 py-2 bg-gray-50/60 border-b border-border" style={{ gridTemplateColumns: '2fr 0.6fr 0.4fr' }}>
            <div>Product</div><div className="text-right">Qty</div><div></div>
          </div>
          {lines.length === 0 ? (
            <div className="py-6 text-center">
              <Icon name="cube-outline" style={{ fontSize: '22px', color: '#cbd5e1' }} />
              <p className="text-[11px] text-gray-400 mt-1">No items added yet</p>
            </div>
          ) : (
            lines.map((l) => (
              <div key={l.sku} className="grid items-center px-3 py-2 border-b border-gray-100 last:border-0" style={{ gridTemplateColumns: '2fr 0.6fr 0.4fr' }}>
                <p className="text-[11.5px] font-semibold text-navy-dark truncate">{l.product}</p>
                <p className="text-[12px] font-bold text-navy-dark text-right">{l.qty}</p>
                <div className="flex justify-end">
                  <button onClick={() => removeLine(l.sku)} className="w-6 h-6 rounded-md border border-border flex items-center justify-center text-gray-400 hover:text-brand-red hover:border-brand-red/40 transition"><Icon name="close-outline" style={{ fontSize: '13px' }} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Source coverage */}
        {lines.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Icon name="location-outline" style={{ fontSize: '13px', color: '#94a3b8' }} />
              <p className="text-[11px] font-semibold text-gray-500">Who can fulfil this? <span className="font-normal text-gray-400">Pick the source with stock</span></p>
            </div>
            <div className="space-y-1.5">
              {SM_FULFILLERS.map((src) => {
                const c = smSourceCoverage(src, lines)
                const active = src === fulfiller
                const isExp = src === expanded
                const isWH = src === 'Central Warehouse'
                let badge, dotCls
                if (c.itemsFull === c.itemsTotal) { dotCls = 'bg-brand-green'; badge = <span className="text-[10px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full whitespace-nowrap">Fulfils all {c.itemsTotal}</span> }
                else if (c.unitsCovered > 0) { dotCls = 'bg-brand-orange'; badge = <span className="text-[10px] font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full whitespace-nowrap">Covers {c.itemsFull}/{c.itemsTotal} · {c.unitsCovered}/{c.unitsReq}u</span> }
                else { dotCls = 'bg-gray-300'; badge = <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">No stock</span> }
                return (
                  <div key={src} className={`rounded-xl border overflow-hidden ${active ? 'border-navy ring-1 ring-navy/20' : 'border-border'}`}>
                    <button type="button" onClick={() => setExpanded(isExp ? null : src)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition ${active ? 'bg-navy/5' : 'bg-white hover:bg-gray-50'}`}>
                      <div className={`w-2 h-2 rounded-full ${dotCls} shrink-0`}></div>
                      <Icon name={isWH ? 'business-outline' : 'storefront-outline'} style={{ fontSize: '14px', color: isWH ? '#3366cc' : '#7c4dff', flexShrink: 0 }} />
                      <p className="text-[12px] font-semibold text-navy-dark flex-1 min-w-0 truncate">{src}{active && <span className="text-[9px] font-bold text-navy bg-navy/10 px-1.5 py-0.5 rounded-full ml-1 align-middle">Selected</span>}</p>
                      {badge}
                      <Icon name="chevron-down-outline" style={{ fontSize: '14px', color: '#94a3b8', flexShrink: 0, transform: `rotate(${isExp ? 180 : 0}deg)`, transition: 'transform .15s' }} />
                    </button>
                    {isExp && (
                      <div className="border-t border-border bg-gray-50/50">
                        <div className="grid px-3 pt-2 pb-1 text-[9px] font-bold text-gray-400 uppercase tracking-[0.05em]" style={{ gridTemplateColumns: '1.7fr 0.55fr 0.75fr' }}>
                          <div>Product</div><div className="text-right">Req.</div><div className="text-right">In stock</div>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {lines.map((l) => {
                            const av = smSourceStock(src, l.sku)
                            const ok = av >= l.qty, some = av > 0 && av < l.qty
                            const cls = ok ? 'text-brand-green' : some ? 'text-brand-orange' : 'text-gray-300'
                            const icon = ok ? 'checkmark-circle' : some ? 'alert-circle' : 'close-circle-outline'
                            return (
                              <div key={l.sku} className="grid items-center px-3 py-1.5" style={{ gridTemplateColumns: '1.7fr 0.55fr 0.75fr' }}>
                                <p className="text-[11px] font-medium text-navy-dark truncate">{l.product}</p>
                                <p className="text-[11px] text-gray-400 text-right">{l.qty}</p>
                                <p className={`text-[11px] font-bold ${cls} text-right flex items-center justify-end gap-1`}><Icon name={icon} style={{ fontSize: '11px' }} />{av}</p>
                              </div>
                            )
                          })}
                        </div>
                        <div className="px-3 py-2.5 border-t border-border">
                          {active ? (
                            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-navy"><Icon name="checkmark-circle" style={{ fontSize: '14px' }} />Selected as source</div>
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
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border-[1.5px] border-border rounded-lg px-3 py-2 text-[12px] text-navy-dark bg-white focus:outline-none focus:border-navy cursor-pointer">
              <option>Normal</option>
              <option>Urgent</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-gray-50/60 rounded-b-2xl">
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 bg-white hover:bg-gray-50 transition">Cancel</button>
        <button onClick={submit} className="flex-1 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition flex items-center justify-center gap-1.5">
          <Icon name="paper-plane-outline" style={{ fontSize: '15px' }} />Send to Warehouse
        </button>
      </div>
    </>
  )
}
