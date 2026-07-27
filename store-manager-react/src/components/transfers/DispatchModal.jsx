import { useState } from 'react'
import Modal from '../Modal'
import Icon from '../Icon'
import { storeMeta, storeInitial, trLines, trAvail } from '../../data/transferData'

function Content({ t, onClose, onConfirm, availOf }) {
  const avail = availOf || trAvail
  const m = storeMeta(t.store)
  const lines = trLines(t)
  const [qtys, setQtys] = useState(() => lines.map((l) => Math.min(l.qty, avail(l.sku))))
  const [showEmptyErr, setShowEmptyErr] = useState(false)

  const reqTotal = lines.reduce((s, l) => s + l.qty, 0)
  const total = qtys.reduce((s, v) => s + (v || 0), 0)
  const partial = total > 0 && total < reqTotal

  const setQty = (i, val, max) => {
    let v = parseInt(val, 10)
    if (isNaN(v) || v < 0) v = 0
    if (v > max) v = max
    setQtys((prev) => prev.map((x, idx) => (idx === i ? v : x)))
    setShowEmptyErr(false)
  }

  const confirm = () => {
    if (total < 1) { setShowEmptyErr(true); return }
    onConfirm(t, lines.map((l, i) => ({ ...l, dispatched: qtys[i] })), total, reqTotal)
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-green/10 flex items-center justify-center shrink-0">
            <Icon name="checkmark-circle-outline" style={{ fontSize: '18px', color: '#2dd36f' }} />
          </div>
          <div>
            <h3 className="text-[15px] font-extrabold text-navy-dark">Confirm Dispatch</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{t.id} · {t.store}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" style={{ fontSize: '17px', color: '#64748b' }} />
        </button>
      </div>

      <div className="px-6 py-5 space-y-4">
        {/* Destination */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-border">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[13px] font-extrabold text-white" style={{ background: m.color }}>{storeInitial(t.store)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-navy-dark truncate">{t.store}</p>
            <p className="text-[10px] text-gray-400">Requested by {t.requestedBy} · {m.code}</p>
          </div>
          <div className="text-right shrink-0"><p className="text-[16px] font-extrabold text-navy-dark leading-none">{t.units}</p><p className="text-[9px] text-gray-400">units</p></div>
        </div>

        {/* Lines */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold text-gray-500">Items to dispatch</p>
            <p className="text-[10px] text-gray-400">Send what you can — adjust each quantity</p>
          </div>
          <div className="grid text-[9px] font-bold text-gray-400 uppercase tracking-[0.05em] px-3 pb-1" style={{ gridTemplateColumns: '1.7fr 0.6fr 0.6fr 0.7fr' }}>
            <div>Product</div><div className="text-right">Req.</div><div className="text-right">Avail.</div><div className="text-right">Send</div>
          </div>
          <div className="space-y-1.5 max-h-52 overflow-y-auto thin-scroll">
            {lines.map((l, i) => {
              const availQty = avail(l.sku)
              const short = availQty < l.qty
              return (
                <div key={i} className="grid items-center gap-2 px-3 py-2 bg-gray-50 border border-border rounded-lg" style={{ gridTemplateColumns: '1.7fr 0.6fr 0.6fr 0.7fr' }}>
                  <div className="min-w-0"><p className="text-[11.5px] font-semibold text-navy-dark truncate">{l.product}</p><p className="text-[9px] text-gray-400 font-mono">{l.sku}</p></div>
                  <p className="text-[12px] font-bold text-navy-dark text-right">{l.qty}</p>
                  <p className={`text-[11px] text-right ${short ? 'text-brand-red font-bold' : 'text-gray-500'}`}>{availQty}</p>
                  <div className="flex justify-end">
                    <input type="number" min="0" max={l.qty} value={qtys[i]} onChange={(e) => setQty(i, e.target.value, l.qty)} className="inp text-[12px] text-right" style={{ padding: '5px 8px', width: '60px' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-border rounded-xl">
          <span className="text-[11px] font-semibold text-gray-500">Total dispatching</span>
          <span className="text-[14px] font-extrabold text-navy-dark">{total} {total === 1 ? 'unit' : 'units'}</span>
        </div>

        {partial && (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-brand-orange/5 border border-brand-orange/20 rounded-xl">
            <Icon name="git-branch-outline" style={{ fontSize: '14px', color: '#ff9800', flexShrink: 0, marginTop: '1px' }} />
            <p className="text-[11px] text-gray-600 leading-relaxed"><strong className="text-navy-dark">Partial fulfilment.</strong> You're sending fewer units than requested. The branch will be notified of the shortfall so they can source the rest elsewhere.</p>
          </div>
        )}

        {showEmptyErr && (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-brand-red/5 border border-brand-red/20 rounded-xl">
            <Icon name="alert-circle-outline" style={{ fontSize: '14px', color: '#eb445a', flexShrink: 0, marginTop: '1px' }} />
            <p className="text-[11px] text-brand-red leading-relaxed">Enter at least 1 unit to dispatch, or reject the request instead.</p>
          </div>
        )}

        <div className="flex items-start gap-2 px-3 py-2.5 bg-brand-orange/5 border border-brand-orange/20 rounded-xl">
          <Icon name="warning-outline" style={{ fontSize: '14px', color: '#ff9800', flexShrink: 0, marginTop: '1px' }} />
          <p className="text-[11px] text-gray-600 leading-relaxed">Dispatching will <strong className="text-navy-dark">deduct stock</strong> from your branch immediately and mark the transfer in transit. This cannot be undone.</p>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-gray-50/60 rounded-b-2xl">
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 bg-white hover:bg-gray-50 transition">← Back</button>
        <button onClick={confirm} className="flex-1 py-2.5 bg-brand-green text-white rounded-xl text-[13px] font-semibold hover:bg-brand-green/85 transition flex items-center justify-center gap-1.5">
          <Icon name="checkmark-circle-outline" style={{ fontSize: '15px' }} />Yes, Dispatch
        </button>
      </div>
    </>
  )
}

export default function DispatchModal({ transfer, onClose, onConfirm, availOf }) {
  return <Modal item={transfer} onClose={onClose} maxWidth="max-w-md" render={(t) => <Content t={t} onClose={onClose} onConfirm={onConfirm} availOf={availOf} />} />
}
