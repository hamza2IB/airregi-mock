import { useEffect, useMemo, useState } from 'react'
import Icon from '../Icon'
import Slideover from '../Slideover'
import { useToast } from '../Toast'
import { ADJ_REASONS } from '../../data/inventoryData'
import { pmBarcode } from '../../data/productData'

function Body({ session, inv, onClose, onAdjust }) {
  const showToast = useToast()
  const [prod, setProd] = useState(null)
  const [query, setQuery] = useState('')
  const [dropOpen, setDropOpen] = useState(false)
  const [notFound, setNotFound] = useState('')
  const [newQty, setNewQty] = useState('')
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')

  // A few quick-pick products (scan-style samples).
  const samples = useMemo(() => inv.slice(0, 3), [inv])

  const selectProd = (p) => {
    setProd(p)
    setQuery(`${p.name} — ${p.variant}`)
    setNotFound('')
    setNewQty('') // leave "actual counted" empty for the user to fill
    setReason('')
    setNote('')
    setDropOpen(false)
  }

  // Resolve a scanned barcode / typed SKU / product name to a stock row.
  const resolve = (raw) => {
    const v = (typeof raw === 'string' ? raw : query).trim()
    if (!v) return
    const lv = v.toLowerCase()
    const row =
      inv.find((r) => pmBarcode(r) === v) ||
      inv.find((r) => (r.sku || '').toLowerCase() === lv) ||
      inv.find((r) => (r.name || '').toLowerCase().includes(lv) || (r.variant || '').toLowerCase().includes(lv))
    if (!row) {
      setNotFound(`Nothing in the catalog matches “${v}”.`)
      return
    }
    selectProd(row)
  }

  // Live difference between counted qty and system stock (never ask the user for "-3").
  const diff = prod && newQty !== '' ? Math.max(0, parseInt(newQty, 10) || 0) - prod.onHand : null
  const diffColor = diff == null ? '#94a3b8' : diff > 0 ? '#16a34a' : diff < 0 ? '#eb445a' : '#64748b'

  useEffect(() => {
    setProd(null)
    setQuery('')
    setNotFound('')
    setNewQty('')
    setReason('')
    setNote('')
    setDropOpen(false)
    if (session?.sku) {
      const p = inv.find((x) => x.sku === session.sku)
      if (p) selectProd(p)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const clearProd = () => {
    setProd(null)
    setQuery('')
    setNotFound('')
    setNewQty('')
    setReason('')
    setNote('')
  }

  const save = () => {
    if (!prod) return showToast('Select a product to adjust.', 'warning')
    if (newQty === '') return showToast('Enter the adjusted quantity.', 'warning')
    const qty = Math.max(0, parseInt(newQty, 10) || 0)
    if (!reason) return showToast('Select a reason for the adjustment.', 'warning')
    const delta = qty - prod.onHand
    if (delta === 0) return showToast('New quantity matches current stock — nothing to adjust.', 'info')
    onAdjust({ sku: prod.sku, label: `${prod.name} — ${prod.variant}`, newQty: qty, delta, reason, note: note.trim() })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border sticky top-0 bg-white z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#1a2d6b,#3366cc)' }}>
            <Icon name="create-outline" size={20} style={{ color: '#fff' }} />
          </div>
          <div>
            <h2 className="text-[16px] font-extrabold text-navy-dark leading-tight">Stock Adjustment</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Correct inventory count with reason</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" size={18} style={{ color: '#64748b' }} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5 flex-1">
        <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3">
          <Icon name="information-circle-outline" size={14} style={{ color: '#3366cc', flexShrink: 0, marginTop: 1 }} />
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Use this after a <strong className="text-navy-dark">physical count</strong>. Enter the quantity you actually counted on the shelf — the system works out the difference automatically and logs it against your name. Use <strong className="text-navy-dark">Receive Stock</strong> for supplier deliveries instead.
          </p>
        </div>

        <div>
          <label className="pc-label">Product / Variant</label>
          {!prod && (
            <>
              <div className="flex items-center gap-2 bg-white border-[1.5px] border-navy/30 rounded-lg px-3 py-2.5 focus-within:border-navy transition">
                <Icon name="barcode-outline" size={18} style={{ color: '#1a2d6b', flexShrink: 0 }} />
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Scan barcode / QR or type SKU, then Enter…"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setNotFound('') }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); resolve() } }}
                  className="flex-1 text-[12px] text-navy-dark placeholder-gray-400 border-none outline-none bg-transparent"
                />
                <button type="button" onClick={() => resolve()} className="text-[12px] font-semibold text-white bg-navy px-3 py-1.5 rounded-lg hover:bg-navy-light transition shrink-0">Check</button>
              </div>
              <p className="text-[10.5px] text-gray-400 mt-1.5">Point a USB/Bluetooth scanner here, or type a SKU / product name.</p>
              {notFound && (
                <div className="flex items-center gap-2 mt-2 text-[11px] text-brand-red bg-brand-red/5 border border-brand-red/20 rounded-lg px-3 py-2">
                  <Icon name="alert-circle-outline" size={14} style={{ color: '#eb445a', flexShrink: 0 }} />
                  {notFound}
                </div>
              )}
              <div className="mt-3">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.06em] mb-1.5">Try a sample</p>
                <div className="flex flex-wrap gap-1.5">
                  {samples.map((p) => (
                    <button key={p.sku} type="button" onClick={() => resolve(pmBarcode(p))} className="pc-preset-chip flex items-center gap-1">
                      <Icon name="barcode-outline" size={12} />{p.name} · {p.variant}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          {prod && (
            <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-white border border-border rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-navy/8 flex items-center justify-center shrink-0"><Icon name="cube-outline" className="text-navy" size={17} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-navy-dark truncate">{prod.name} — {prod.variant}</p>
                <p className="text-[10.5px] text-gray-400 font-mono">{prod.sku}</p>
              </div>
              <div className="text-right shrink-0 mr-1">
                <p className="text-[10px] text-gray-400">Physical stock</p>
                <p className="text-[13px] font-extrabold text-navy-dark">{prod.onHand}</p>
              </div>
              <button onClick={clearProd} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-brand-red hover:border-brand-red/40 transition shrink-0">
                <Icon name="close-outline" size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Current <span className="text-gray-400 font-normal">(system)</span></label>
            <div className="inp bg-gray-50 text-gray-400 cursor-not-allowed select-none text-right" style={prod ? { color: '#0a1535' } : {}}>{prod ? prod.onHand : '—'}</div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Actual counted</label>
            <input type="number" min="0" placeholder="0" className="inp text-right" value={newQty} onChange={(e) => setNewQty(e.target.value)} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Adjustment</label>
            <div className="inp bg-gray-50 font-extrabold select-none text-right" style={{ color: diffColor }}>{diff == null ? '—' : (diff > 0 ? '+' : '') + diff}</div>
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Reason</label>
          <select className="inp select-inp" value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">Select reason…</option>
            {ADJ_REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Notes</label>
          <textarea rows={3} placeholder="Describe the reason in detail…" className="inp resize-none" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-white">
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
        <button onClick={save} className="flex-1 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition">Save Adjustment</button>
      </div>
    </div>
  )
}

export default function AdjustStockSlideover({ session, inv, onClose, onAdjust }) {
  return <Slideover item={session} onClose={onClose} width={720} render={() => <Body session={session} inv={inv} onClose={onClose} onAdjust={onAdjust} />} />
}
