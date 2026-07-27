import { useEffect, useState } from 'react'
import Icon from '../Icon'

// Update Stock for a store's product. Lets the manager set the on-hand count per SKU
// (variant products list all their SKUs). `group` = a pmGroups entry with .rows.
export default function UpdateStockModal({ group, onClose, onSave }) {
  const [shown, setShown] = useState(group)
  const [counts, setCounts] = useState({})

  useEffect(() => {
    if (group) {
      setShown(group)
      // Seed inputs with each SKU's current on-hand.
      const seed = {}
      group.rows.forEach((r) => (seed[r.sku] = String(r.onHand ?? 0)))
      setCounts(seed)
    }
  }, [group])

  const open = !!group
  const rows = shown?.rows || []

  const setCount = (sku, v) => setCounts((c) => ({ ...c, [sku]: v.replace(/[^0-9]/g, '') }))

  const deltaOf = (r) => {
    const next = counts[r.sku] === '' || counts[r.sku] == null ? r.onHand : Number(counts[r.sku])
    return next - (r.onHand ?? 0)
  }
  const changed = rows.some((r) => deltaOf(r) !== 0)

  const save = () => {
    const updates = rows
      .map((r) => ({ sku: r.sku, onHand: counts[r.sku] === '' || counts[r.sku] == null ? r.onHand : Number(counts[r.sku]) }))
      .filter((u, i) => u.onHand !== (rows[i].onHand ?? 0))
    onSave(shown, updates)
  }

  return (
    <div className={`fixed inset-0 z-[500] flex items-center justify-center p-4 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-navy-dark/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 transition-transform duration-200 ${open ? 'scale-100' : 'scale-95'}`} style={{ boxShadow: '0 24px 64px rgba(10,21,53,0.22)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
              <Icon name="layers-outline" style={{ fontSize: '18px', color: '#3366cc' }} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-extrabold text-navy-dark truncate">Update Stock</h3>
              <p className="text-[11px] text-gray-400 mt-0.5 truncate">{shown?.name} · {rows.length} SKU{rows.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition shrink-0">
            <Icon name="close-outline" style={{ fontSize: '17px', color: '#64748b' }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3 mb-4">
            <Icon name="information-circle-outline" style={{ fontSize: '14px', color: '#3366cc', flexShrink: 0, marginTop: '1px' }} />
            <p className="text-[11px] text-gray-600 leading-relaxed">Set the on-hand quantity for each SKU at this store. The available count updates automatically after reserved units.</p>
          </div>

          <div className="grid text-[9px] font-bold text-gray-400 uppercase tracking-[0.06em] px-1 pb-1.5" style={{ gridTemplateColumns: '1.6fr 0.7fr 0.9fr' }}>
            <div>Variant / SKU</div>
            <div className="text-center">Current</div>
            <div className="text-right">New On-hand</div>
          </div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto thin-scroll">
            {rows.map((r) => {
              const delta = deltaOf(r)
              return (
                <div key={r.sku} className="grid items-center gap-2 px-1 py-1.5" style={{ gridTemplateColumns: '1.6fr 0.7fr 0.9fr' }}>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-navy-dark truncate">{r.variant || 'Default'}</p>
                    <p className="text-[10px] text-gray-400 font-mono truncate">{r.sku}</p>
                  </div>
                  <p className="text-[12px] text-gray-500 text-center">{r.onHand ?? 0}</p>
                  <div className="flex items-center justify-end gap-1.5">
                    <input
                      value={counts[r.sku] ?? ''}
                      onChange={(e) => setCount(r.sku, e.target.value)}
                      inputMode="numeric"
                      className="w-16 text-right bg-page border border-border rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-navy-dark outline-none focus:border-navy/40"
                    />
                    {delta !== 0 && (
                      <span className={`text-[10px] font-bold w-8 text-right ${delta > 0 ? 'text-brand-green' : 'text-brand-red'}`}>{delta > 0 ? '+' : ''}{delta}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-gray-50/60 rounded-b-2xl">
          <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 bg-white hover:bg-gray-50 transition">Cancel</button>
          <button onClick={save} disabled={!changed} className="flex-[2] py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5">
            <Icon name="checkmark-outline" style={{ fontSize: '15px' }} />Save Stock
          </button>
        </div>
      </div>
    </div>
  )
}
