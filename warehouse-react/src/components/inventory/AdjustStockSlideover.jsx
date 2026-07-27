import { useEffect, useState } from 'react'
import Icon from '../Icon'
import Slideover from '../Slideover'
import { useToast } from '../Toast'
import { ADJ_REASONS } from '../../data/inventoryData'

function Body({ session, inv, onClose, onAdjust }) {
  const showToast = useToast()
  const [prod, setProd] = useState(null)
  const [query, setQuery] = useState('')
  const [dropOpen, setDropOpen] = useState(false)
  const [newQty, setNewQty] = useState('')
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')

  const selectProd = (p) => {
    setProd(p)
    setQuery(`${p.name} — ${p.variant}`)
    setNewQty(String(p.onHand))
    setReason('')
    setNote('')
    setDropOpen(false)
  }

  useEffect(() => {
    setProd(null)
    setQuery('')
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

  const results = inv
    .filter((p) => !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase()) || p.variant.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 20)

  const clearProd = () => {
    setProd(null)
    setQuery('')
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
        <div className="flex items-start gap-2.5 bg-brand-orange/5 border border-brand-orange/20 rounded-xl px-4 py-3">
          <Icon name="warning-outline" size={14} style={{ color: '#ff9800', flexShrink: 0, marginTop: 1 }} />
          <p className="text-[11px] text-gray-600">Adjustments are permanent and logged with your identity. Negative adjustments require confirmation.</p>
        </div>

        <div>
          <label className="pc-label">Product / Variant</label>
          <div className="relative mb-2">
            <div className="flex items-center gap-2 bg-white border-[1.5px] border-border rounded-lg px-3 py-2.5">
              <Icon name="search-outline" size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search product to adjust…"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setDropOpen(true) }}
                onFocus={() => setDropOpen(true)}
                className="flex-1 text-[12px] text-navy-dark placeholder-gray-400 border-none outline-none bg-transparent"
              />
            </div>
            {dropOpen && !prod && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-lg z-50 overflow-y-auto thin-scroll" style={{ maxHeight: 240 }}>
                {results.length === 0 ? (
                  <p className="text-[11px] text-gray-400 text-center py-4">{query ? 'No products match.' : 'Type to search products.'}</p>
                ) : (
                  results.map((p) => (
                    <button key={p.sku} type="button" onClick={() => selectProd(p)} className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition text-left border-b border-gray-100 last:border-0">
                      <div className="w-7 h-7 rounded-lg bg-navy/8 flex items-center justify-center shrink-0"><Icon name="cube-outline" className="text-navy" size={13} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-navy-dark truncate">{p.name} <span className="text-gray-400 font-normal">— {p.variant}</span></p>
                        <p className="text-[10px] text-gray-400 truncate">{p.sku} · {p.onHand} in stock</p>
                      </div>
                      <Icon name="arrow-forward-outline" className="text-gray-300 shrink-0" size={14} />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Current Stock</label>
            <div className="inp bg-gray-50 text-gray-400 cursor-not-allowed select-none" style={prod ? { color: '#0a1535' } : {}}>{prod ? prod.onHand : '—'}</div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Adjusted Quantity</label>
            <input type="number" placeholder="Enter new qty" className="inp" value={newQty} onChange={(e) => setNewQty(e.target.value)} />
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
