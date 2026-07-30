import { useEffect, useState } from 'react'
import Icon from '../Icon'
import Slideover from '../Slideover'
import { useToast } from '../Toast'
import { pmGroups, PM_TYPE_BADGE, cap } from '../../data/productData'

function Body({ session, inv, onClose, onReceive }) {
  const showToast = useToast()
  const groups = pmGroups(inv)
  const [group, setGroup] = useState(null)
  const [rows, setRows] = useState([])
  const [query, setQuery] = useState('')
  const [dropOpen, setDropOpen] = useState(false)
  const [refNo, setRefNo] = useState('')
  const [supplier, setSupplier] = useState('')
  const [note, setNote] = useState('')

  const batchTracked = !!(group && group.rows.some((r) => r.batch))
  const rcCols = batchTracked ? '1.5fr 0.7fr 0.8fr 1fr 1fr' : '1.9fr 0.7fr 0.8fr 0.8fr'

  const selectProduct = (g) => {
    setGroup(g)
    setRows(
      g.rows.map((r) => ({
        sku: r.sku,
        label: g.type === 'variant' ? r.variant || '—' : r.variant || 'Unit',
        qty: 0,
        batch: '',
        expiry: '',
        current: r.onHand || 0,
      })),
    )
    setQuery(g.name)
    setDropOpen(false)
  }

  // Pre-select when opened for a specific SKU.
  useEffect(() => {
    setGroup(null)
    setRows([])
    setQuery('')
    setDropOpen(false)
    setRefNo('')
    setSupplier('')
    setNote('')
    if (session?.sku) {
      const item = inv.find((x) => x.sku === session.sku)
      if (item) {
        const g = groups.find((x) => x.name === item.name)
        if (g) selectProduct(g)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const results = groups
    .filter((g) => !query || g.name.toLowerCase().includes(query.toLowerCase()) || g.rows.some((r) => r.sku.toLowerCase().includes(query.toLowerCase())))
    .slice(0, 8)

  const setQty = (i, val) => setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, qty: Math.max(0, parseInt(val, 10) || 0) } : r)))
  const setBatch = (i, val) => setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, batch: val } : r)))
  const setExpiry = (i, val) => setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, expiry: val } : r)))
  const clearAll = () => setRows((rs) => rs.map((r) => ({ ...r, qty: 0, batch: '', expiry: '' })))
  const clearSelection = () => {
    setGroup(null)
    setRows([])
    setQuery('')
  }

  const units = rows.reduce((s, r) => s + (r.qty || 0), 0)
  const lines = rows.filter((r) => r.qty > 0).length

  const submit = () => {
    if (units === 0) return showToast('Enter a quantity for at least one variant.', 'warning')
    onReceive({ name: group?.name || 'Product', rows: rows.filter((r) => r.qty > 0), ref: refNo.trim(), supplier: supplier.trim(), note: note.trim() })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border sticky top-0 bg-white z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#1a2d6b,#3366cc)' }}>
            <Icon name="arrow-down-circle-outline" size={20} style={{ color: '#fff' }} />
          </div>
          <div>
            <h2 className="text-[16px] font-extrabold text-navy-dark leading-tight">Receive Stock</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Record an incoming delivery — quantities are added to inventory instantly</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" size={18} style={{ color: '#64748b' }} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 flex-1">
        <label className="pc-label">Select Product</label>
        <div className="relative mb-2">
          <div className="flex items-center gap-2 bg-white border-[1.5px] border-border rounded-lg px-3 py-2.5">
            <Icon name="search-outline" size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search product to receive…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setDropOpen(true) }}
              onFocus={() => setDropOpen(true)}
              className="flex-1 text-[12px] text-navy-dark placeholder-gray-400 border-none outline-none bg-transparent"
            />
          </div>
          {dropOpen && !group && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-lg z-50 overflow-y-auto thin-scroll" style={{ maxHeight: 240 }}>
              {results.length === 0 ? (
                <p className="text-[11px] text-gray-400 text-center py-4">{query ? 'No products match.' : 'Type to search products.'}</p>
              ) : (
                results.map((g) => {
                  const typeTag = g.type === 'variant' ? `${g.rows.length} variants` : cap(g.type)
                  return (
                    <button key={g.name} onClick={() => selectProduct(g)} className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition text-left border-b border-gray-100 last:border-0">
                      <div className="w-7 h-7 rounded-lg bg-navy/8 flex items-center justify-center shrink-0"><Icon name="cube-outline" className="text-navy" size={13} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-navy-dark truncate">{g.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{g.cat} · {typeTag}</p>
                      </div>
                      <Icon name="arrow-forward-outline" className="text-gray-300 shrink-0" size={14} />
                    </button>
                  )
                })
              )}
            </div>
          )}
        </div>

        {group && (
          <div className="flex items-center gap-3 px-4 py-3 bg-white border border-border rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-navy/8 flex items-center justify-center shrink-0"><Icon name="cube-outline" className="text-navy" size={17} /></div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-navy-dark truncate">{group.name}</p>
              <p className="text-[10.5px] text-gray-400">{group.cat}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PM_TYPE_BADGE[group.type] || 'text-gray-500 bg-gray-100'}`}>{cap(group.type)}</span>
            <button onClick={clearSelection} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-brand-red hover:border-brand-red/40 transition shrink-0">
              <Icon name="close-outline" size={14} />
            </button>
          </div>
        )}

        {group ? (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">Quantity received</p>
              <button onClick={clearAll} className="text-[11px] font-semibold text-brand-blue hover:underline">Clear all</button>
            </div>

            {/* Batch/expiry explainer — shown only for batch-tracked products */}
            {batchTracked && (
              <div className="flex items-start gap-2.5 bg-brand-purple/5 border border-brand-purple/20 rounded-xl px-4 py-3 mb-3">
                <Icon name="flask-outline" size={14} style={{ color: '#7c4dff', flexShrink: 0, marginTop: 1 }} />
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  <strong className="text-navy-dark">This product is batch-tracked.</strong> Record the <strong>batch / lot number</strong> and <strong>expiry date</strong> for each incoming lot. This drives first-expiry-first-out picking, expiry alerts and recall tracing. Leave blank if the supplier didn't provide them.
                </p>
              </div>
            )}

            <div className="border border-border rounded-xl overflow-hidden">
              <div className="grid text-[10px] font-semibold text-gray-400 uppercase tracking-[0.06em] px-3 py-2 bg-gray-50/60 border-b border-border" style={{ gridTemplateColumns: rcCols }}>
                <div>Variant</div>
                <div className="text-right">In stock</div>
                <div className="text-center">Receiving</div>
                {batchTracked ? (
                  <>
                    <div>Batch / Lot #</div>
                    <div>Expiry date</div>
                  </>
                ) : (
                  <div className="text-right">New total</div>
                )}
              </div>
              <div className="divide-y divide-gray-100">
                {rows.map((r, i) => (
                  <div key={r.sku} className={`grid items-center gap-2 px-3 py-2.5 ${r.qty > 0 ? 'bg-brand-green/5' : ''}`} style={{ gridTemplateColumns: rcCols }}>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-navy-dark truncate">{r.label}</p>
                      <p className="text-[10px] text-gray-400 font-mono truncate">{r.sku}</p>
                    </div>
                    <p className="text-[12px] text-gray-500 text-right self-center">{r.current || 0}</p>
                    <input type="number" min="0" value={r.qty || ''} placeholder="0" className="pc-mini-inp text-center" onChange={(e) => setQty(i, e.target.value)} />
                    {batchTracked ? (
                      <>
                        <input type="text" value={r.batch} placeholder="e.g. B2401" className="pc-mini-inp font-mono" onChange={(e) => setBatch(i, e.target.value)} />
                        <input type="date" value={r.expiry} className="pc-mini-inp" onChange={(e) => setExpiry(i, e.target.value)} />
                      </>
                    ) : (
                      <p className={`text-[12px] font-bold text-right self-center ${r.qty > 0 ? 'text-brand-green' : 'text-navy-dark'}`}>{(r.current || 0) + (r.qty || 0)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 px-4 py-3 rounded-xl bg-brand-green/5 border border-brand-green/20">
              <div className="flex items-center gap-2">
                <Icon name="cube-outline" className="text-brand-green" size={16} />
                <span className="text-[12px] font-semibold text-navy-dark">Total to receive</span>
              </div>
              <div className="text-right">
                <span className="text-[15px] font-extrabold text-navy-dark">{units.toLocaleString()}</span>
                <span className="text-[11px] text-gray-400 ml-1">units · {lines} line(s)</span>
              </div>
            </div>

            {/* Optional supplier reference details */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="pc-label">Reference No. <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" className="inp" placeholder="e.g. GRN-1042 / Invoice #" value={refNo} onChange={(e) => setRefNo(e.target.value)} />
              </div>
              <div>
                <label className="pc-label">Supplier <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" className="inp" placeholder="e.g. Nestlé Distributor" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
              </div>
            </div>
            <div className="mt-3">
              <label className="pc-label">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea rows={2} className="inp resize-none" placeholder="e.g. New shipment · partial delivery…" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-page flex items-center justify-center mb-3">
              <Icon name="cube-outline" size={28} style={{ color: '#cbd5e1' }} />
            </div>
            <p className="text-[13px] font-semibold text-gray-500">No product selected</p>
            <p className="text-[11px] text-gray-400 mt-0.5 max-w-[280px]">Search and select a product above. Variant products will show all variants so you can enter received quantities.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-white" style={{ boxShadow: '0 -4px 16px rgba(10,21,53,0.04)' }}>
        <button onClick={onClose} className="px-4 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
        <div className="flex-1"></div>
        <button onClick={submit} disabled={units === 0} className="flex items-center gap-1.5 px-6 py-2.5 bg-brand-green text-white rounded-xl text-[13px] font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed">
          <Icon name="checkmark-outline" size={16} />Receive Stock
        </button>
      </div>
    </div>
  )
}

export default function ReceiveStockSlideover({ session, inv, onClose, onReceive }) {
  return <Slideover item={session} onClose={onClose} width={720} render={() => <Body session={session} inv={inv} onClose={onClose} onReceive={onReceive} />} />
}
