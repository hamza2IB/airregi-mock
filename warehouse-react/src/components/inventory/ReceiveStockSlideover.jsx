import { useEffect, useRef, useState } from 'react'
import Icon from '../Icon'
import Slideover from '../Slideover'
import { useToast } from '../Toast'
import { pmGroups, PM_TYPE_BADGE, cap, pmBarcode, pmColorPair } from '../../data/productData'

function Body({ session, inv, onClose, onReceive }) {
  const showToast = useToast()
  const groups = pmGroups(inv)
  const inputRef = useRef(null)

  // Delivery-level details.
  const [supplier, setSupplier] = useState('')
  const [refNo, setRefNo] = useState('')
  const [note, setNote] = useState('')

  // Line items for this delivery (across multiple products).
  const [cart, setCart] = useState([])
  const [query, setQuery] = useState('')
  const [notFound, setNotFound] = useState('')

  const samples = groups.slice(0, 3)

  const lineFromRow = (r, g) => ({
    sku: r.sku,
    name: r.name,
    variant: r.variant || 'Unit',
    cat: r.cat || (g && g.cat) || '',
    type: r.type || (g && g.type) || 'simple',
    current: r.onHand || 0,
    batchTracked: !!r.batch,
    qty: 0,
    batch: '',
    expiry: '',
  })

  const addRows = (rowsToAdd, g) => {
    setCart((prev) => {
      const have = new Set(prev.map((l) => l.sku))
      const additions = rowsToAdd.filter((r) => !have.has(r.sku)).map((r) => lineFromRow(r, g))
      if (additions.length === 0) {
        showToast('That product is already in this delivery.', 'info')
        return prev
      }
      return [...prev, ...additions]
    })
  }

  const resolve = (raw) => {
    const v = (typeof raw === 'string' ? raw : query).trim()
    if (!v) return
    const lv = v.toLowerCase()
    const rowByCode = inv.find((r) => pmBarcode(r) === v) || inv.find((r) => (r.sku || '').toLowerCase() === lv)
    if (rowByCode) {
      const g = groups.find((x) => x.name === rowByCode.name)
      addRows([rowByCode], g)
    } else {
      const g = groups.find((x) => x.name.toLowerCase().includes(lv) || x.rows.some((r) => (r.sku || '').toLowerCase().includes(lv)))
      if (!g) { setNotFound(`Nothing in the catalog matches “${v}”.`); return }
      addRows(g.rows, g)
    }
    setQuery('')
    setNotFound('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  useEffect(() => {
    setSupplier('')
    setRefNo('')
    setNote('')
    setCart([])
    setQuery('')
    setNotFound('')
    if (session?.sku) {
      const item = inv.find((x) => x.sku === session.sku)
      if (item) {
        const g = groups.find((x) => x.name === item.name)
        addRows(g ? g.rows : [item], g)
      }
    }
    setTimeout(() => inputRef.current?.focus(), 150)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const setQty = (sku, val) => setCart((c) => c.map((l) => (l.sku === sku ? { ...l, qty: Math.max(0, parseInt(val, 10) || 0) } : l)))
  const setBatch = (sku, val) => setCart((c) => c.map((l) => (l.sku === sku ? { ...l, batch: val } : l)))
  const setExpiry = (sku, val) => setCart((c) => c.map((l) => (l.sku === sku ? { ...l, expiry: val } : l)))
  const removeLine = (sku) => setCart((c) => c.filter((l) => l.sku !== sku))
  const removeProduct = (name) => setCart((c) => c.filter((l) => l.name !== name))
  const clearCart = () => setCart([])

  // Group cart lines by product, preserving insertion order.
  const grouped = []
  const gIdx = {}
  cart.forEach((l) => {
    if (gIdx[l.name] == null) { gIdx[l.name] = grouped.length; grouped.push({ name: l.name, cat: l.cat, type: l.type, lines: [] }) }
    grouped[gIdx[l.name]].lines.push(l)
  })

  const units = cart.reduce((s, l) => s + (l.qty || 0), 0)
  const filledLines = cart.filter((l) => l.qty > 0).length
  const anyBatch = cart.some((l) => l.batchTracked)

  const submit = () => {
    const lines = cart.filter((l) => l.qty > 0)
    if (lines.length === 0) return showToast('Enter a quantity for at least one item.', 'warning')
    onReceive({
      supplier: supplier.trim(),
      ref: refNo.trim(),
      note: note.trim(),
      lines: lines.map((l) => ({ sku: l.sku, name: l.name, variant: l.variant, qty: l.qty, batch: l.batch.trim(), expiry: l.expiry })),
    })
  }

  const heroStats = [
    { v: grouped.length, l: 'Products' },
    { v: filledLines, l: 'Lines' },
    { v: units.toLocaleString(), l: 'Units' },
  ]

  return (
    <div className="flex flex-col h-full bg-page">
      {/* ── Hero header ── */}
      <div className="relative overflow-hidden shrink-0" style={{ background: 'linear-gradient(135deg,#0a1535 0%,#1a2d6b 55%,#3366cc 130%)' }}>
        <div className="absolute -top-12 -right-10 w-44 h-44 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-20 -left-12 w-52 h-52 rounded-full bg-white/5"></div>
        <div className="relative px-6 pt-5 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 ring-1 ring-white/25 flex items-center justify-center" style={{ backdropFilter: 'blur(4px)' }}>
              <Icon name="arrow-down-circle-outline" size={22} style={{ color: '#fff' }} />
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold text-white leading-tight">Receive Stock</h2>
              <p className="text-[11px] text-white/70 mt-0.5">Book in a delivery — add every product, then confirm once</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
            <Icon name="close-outline" size={18} style={{ color: '#fff' }} />
          </button>
        </div>
        <div className="relative px-6 pb-5 grid grid-cols-3 gap-2.5">
          {heroStats.map((s) => (
            <div key={s.l} className="rounded-xl bg-white/10 ring-1 ring-white/15 px-3 py-2 text-center">
              <p className="text-[18px] font-extrabold text-white leading-none">{s.v}</p>
              <p className="text-[9px] uppercase tracking-[0.12em] text-white/60 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-5 flex-1 space-y-4">
        {/* Step 1 — Delivery details */}
        <section className="bg-white rounded-2xl border border-border shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-md bg-navy/10 text-navy text-[10px] font-extrabold flex items-center justify-center">1</span>
            <p className="text-[12px] font-bold text-navy-dark">Delivery details</p>
            <span className="text-[10px] text-gray-400 font-medium">optional</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="pc-label">Supplier</label>
              <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 h-[38px] focus-within:border-navy transition">
                <Icon name="business-outline" size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
                <input type="text" className="flex-1 text-[12px] text-navy-dark placeholder-gray-400 outline-none bg-transparent" placeholder="e.g. Nestlé Distributor" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="pc-label">Reference No.</label>
              <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 h-[38px] focus-within:border-navy transition">
                <Icon name="document-text-outline" size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
                <input type="text" className="flex-1 text-[12px] text-navy-dark placeholder-gray-400 outline-none bg-transparent" placeholder="GRN-1042 / Invoice #" value={refNo} onChange={(e) => setRefNo(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <label className="pc-label">Notes</label>
            <textarea rows={2} className="inp resize-none" placeholder="e.g. Partial delivery · remainder to follow…" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </section>

        {/* Step 2 — Add products */}
        <section className="bg-white rounded-2xl border border-border shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-md bg-navy/10 text-navy text-[10px] font-extrabold flex items-center justify-center">2</span>
            <p className="text-[12px] font-bold text-navy-dark">Add products</p>
          </div>
          <div className="flex items-center gap-2 bg-white border-[1.5px] border-navy/25 rounded-xl px-3 h-12 focus-within:border-navy focus-within:ring-4 focus-within:ring-navy/10 transition">
            <Icon name="barcode-outline" size={20} style={{ color: '#1a2d6b', flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              autoComplete="off"
              placeholder="Scan barcode / QR or type SKU, then Enter…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setNotFound('') }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); resolve() } }}
              className="flex-1 text-[13px] text-navy-dark placeholder-gray-400 border-none outline-none bg-transparent"
            />
            <button type="button" onClick={() => resolve()} className="flex items-center gap-1 text-[12px] font-semibold text-white bg-navy hover:bg-navy-light px-3.5 h-9 rounded-lg transition shrink-0">
              <Icon name="add-outline" size={15} />Add
            </button>
          </div>
          <p className="text-[10.5px] text-gray-400 mt-2 flex items-center gap-1.5">
            <Icon name="scan-outline" size={12} style={{ color: '#94a3b8' }} />
            Scan each item as you unload — a USB/Bluetooth scanner types here automatically.
          </p>
          {notFound && (
            <div className="flex items-center gap-2 mt-2 text-[11px] text-brand-red bg-brand-red/5 border border-brand-red/20 rounded-lg px-3 py-2">
              <Icon name="alert-circle-outline" size={14} style={{ color: '#eb445a', flexShrink: 0 }} />
              {notFound}
            </div>
          )}
          {cart.length === 0 && (
            <div className="mt-3">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.06em] mb-1.5">Try a sample</p>
              <div className="flex flex-wrap gap-1.5">
                {samples.map((g) => (
                  <button key={g.name} type="button" onClick={() => resolve(pmBarcode(g.rows[0]))} className="pc-preset-chip flex items-center gap-1">
                    <Icon name="barcode-outline" size={12} />{g.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Step 3 — Items in this delivery */}
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-navy/10 text-navy text-[10px] font-extrabold flex items-center justify-center">3</span>
              <p className="text-[12px] font-bold text-navy-dark">Items in this delivery</p>
            </div>
            <div className="flex items-center gap-2.5">
              {units > 0 && <span className="text-[11px] font-extrabold text-brand-green bg-brand-green/10 px-2.5 py-1 rounded-full">+{units.toLocaleString()} units</span>}
              {cart.length > 0 && <button onClick={clearCart} className="text-[11px] font-semibold text-gray-400 hover:text-brand-red transition">Clear all</button>}
            </div>
          </div>

          {anyBatch && (
            <div className="flex items-start gap-2.5 bg-brand-purple/5 border border-brand-purple/20 rounded-xl px-4 py-2.5 mb-3">
              <Icon name="flask-outline" size={14} style={{ color: '#7c4dff', flexShrink: 0, marginTop: 1 }} />
              <p className="text-[11px] text-gray-600 leading-relaxed">
                <strong className="text-navy-dark">Some items are batch-tracked.</strong> Record the batch / lot number and expiry date to enable first-expiry-first-out picking and recall tracing.
              </p>
            </div>
          )}

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-2xl bg-white">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'linear-gradient(135deg,#eef2ff,#e6f9ee)' }}>
                <Icon name="cube-outline" size={30} style={{ color: '#94a3b8' }} />
              </div>
              <p className="text-[13px] font-bold text-navy-dark">No items added yet</p>
              <p className="text-[11px] text-gray-400 mt-1 max-w-[300px]">Scan or search products above to build this delivery. Add as many different products as you received.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {grouped.map((g) => {
                const [c0, c1] = pmColorPair(g.name)
                const gUnits = g.lines.reduce((s, l) => s + (l.qty || 0), 0)
                return (
                  <div key={g.name} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                    {/* Product header */}
                    <div className="flex items-center gap-3 px-3.5 py-2.5 border-b border-border bg-gradient-to-r from-gray-50 to-white">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-[13px] font-extrabold" style={{ background: `linear-gradient(135deg,${c0},${c1})` }}>
                        {(g.name.trim()[0] || '?').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-navy-dark truncate">{g.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{g.cat}{g.lines.length > 1 ? ` · ${g.lines.length} variants` : ''}</p>
                      </div>
                      {gUnits > 0 && <span className="text-[10px] font-extrabold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full shrink-0">+{gUnits}</span>}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${PM_TYPE_BADGE[g.type] || 'text-gray-500 bg-gray-100'}`}>{cap(g.type)}</span>
                      <button onClick={() => removeProduct(g.name)} title="Remove product" className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-brand-red hover:bg-brand-red/5 transition shrink-0">
                        <Icon name="close-outline" size={14} />
                      </button>
                    </div>

                    {/* Variant lines */}
                    <div className="divide-y divide-gray-100">
                      {g.lines.map((l) => {
                        const active = l.qty > 0
                        return (
                          <div key={l.sku} className={`relative px-3.5 py-3 transition-colors ${active ? 'bg-brand-green/[0.06]' : ''}`}>
                            {active && <span className="absolute left-0 top-0 bottom-0 w-1 bg-brand-green"></span>}
                            <div className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-[12.5px] font-semibold text-navy-dark truncate">{l.variant}</p>
                                <p className="text-[10px] text-gray-400 truncate"><span className="font-mono">{l.sku}</span> · {l.current} in stock</p>
                              </div>
                              {/* Qty received stepper */}
                              <div className="shrink-0 text-center">
                                <label className="block text-[9px] font-bold uppercase tracking-wide text-gray-400 mb-1">Qty received</label>
                                <div className={`flex items-center rounded-lg overflow-hidden bg-white border ${active ? 'border-navy/40' : 'border-border'}`}>
                                  <button type="button" onClick={() => setQty(l.sku, Math.max(0, (l.qty || 0) - 1))} className="w-7 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30" disabled={!l.qty}>
                                    <Icon name="remove-outline" size={14} />
                                  </button>
                                  <input
                                    type="number"
                                    min="0"
                                    value={l.qty || ''}
                                    placeholder="0"
                                    onChange={(e) => setQty(l.sku, e.target.value)}
                                    className={`w-12 h-8 text-center text-[13px] font-bold text-navy-dark border-x outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${active ? 'border-navy/30' : 'border-border'}`}
                                  />
                                  <button type="button" onClick={() => setQty(l.sku, (l.qty || 0) + 1)} className={`w-7 h-8 flex items-center justify-center transition ${active ? 'text-white bg-navy hover:bg-navy-light' : 'text-gray-500 hover:bg-gray-50'}`}>
                                    <Icon name="add-outline" size={14} />
                                  </button>
                                </div>
                              </div>
                              {/* New total */}
                              <div className="shrink-0 text-center w-16">
                                <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400 mb-1">New total</p>
                                <p className={`text-[15px] font-extrabold leading-none ${active ? 'text-brand-green' : 'text-gray-300'}`}>{l.current + (l.qty || 0)}</p>
                              </div>
                              <button onClick={() => removeLine(l.sku)} title="Remove this variant" className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-brand-red hover:border-brand-red/40 transition shrink-0">
                                <Icon name="close-outline" size={14} />
                              </button>
                            </div>
                            {l.batchTracked && (
                              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-dashed border-gray-200">
                                <div>
                                  <label className="block text-[9px] font-bold uppercase tracking-wide text-brand-purple/70 mb-1">Batch / Lot #</label>
                                  <input type="text" value={l.batch} placeholder="e.g. B2401" className="pc-mini-inp font-mono" onChange={(e) => setBatch(l.sku, e.target.value)} />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold uppercase tracking-wide text-brand-purple/70 mb-1">Expiry date</label>
                                  <input type="date" value={l.expiry} className="pc-mini-inp" onChange={(e) => setExpiry(l.sku, e.target.value)} />
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-white shrink-0" style={{ boxShadow: '0 -4px 16px rgba(10,21,53,0.06)' }}>
        <button onClick={onClose} className="px-4 h-11 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
        <div className="flex-1 min-w-0">
          {units > 0 && (
            <p className="text-[11px] text-gray-500 text-right pr-1">
              <span className="font-extrabold text-navy-dark">{units.toLocaleString()}</span> unit(s) · {filledLines} line(s) · {grouped.length} product(s)
            </p>
          )}
        </div>
        <button
          onClick={submit}
          disabled={units === 0}
          className="flex items-center gap-2 px-6 h-11 rounded-xl text-[13px] font-bold text-white bg-navy hover:bg-navy-light transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Icon name="checkmark-outline" size={17} />Receive {units > 0 ? `${units.toLocaleString()} Unit${units > 1 ? 's' : ''}` : 'Stock'}
        </button>
      </div>
    </div>
  )
}

export default function ReceiveStockSlideover({ session, inv, onClose, onReceive }) {
  return <Slideover item={session} onClose={onClose} width={720} render={() => <Body session={session} inv={inv} onClose={onClose} onReceive={onReceive} />} />
}
