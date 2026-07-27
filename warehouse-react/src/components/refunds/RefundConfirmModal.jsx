import { useEffect, useState } from 'react'
import Modal from '../Modal'
import Icon from '../Icon'

// `state` = { order, refund, idx } or null.
function Content({ order: o, refund, onClose, onConfirm }) {
  const [ref, setRef] = useState('')
  const [err, setErr] = useState(false)

  const confirm = () => {
    if (!ref.trim()) { setErr(true); return }
    onConfirm(ref.trim())
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-orange/10 flex items-center justify-center shrink-0">
            <Icon name="arrow-undo-outline" className="text-brand-orange" size={18} />
          </div>
          <div>
            <h3 className="text-[15px] font-extrabold text-navy-dark">Process Refund</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{o.id} · {o.customer}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" size={17} style={{ color: '#64748b' }} />
        </button>
      </div>

      <div className="px-6 py-5 space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-border">
          <div>
            <p className="text-[10px] text-gray-400 font-medium">Refund Amount</p>
            <p className="text-[20px] font-extrabold text-brand-orange">Rs.{refund.amount.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-medium">Original Payment</p>
            <p className="text-[12px] font-semibold text-navy-dark">{o.payment}</p>
            <p className="text-[10px] text-gray-400 font-mono">{o.paymentRef || '—'}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          {refund.items.map((l, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 bg-white border border-border rounded-lg">
              <p className="text-[11px] text-gray-600">{l.name} × {l.removedQty}</p>
              <p className="text-[11px] font-semibold text-navy-dark">Rs.{l.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Refund Reference # <span className="text-brand-red">*</span></label>
          <input
            type="text"
            placeholder="e.g. HBL-REF-20260721-001"
            value={ref}
            onChange={(e) => { setRef(e.target.value); setErr(false) }}
            className={`inp text-[12px] ${err ? '!border-brand-red' : ''}`}
          />
          {err && <span className="text-[10px] text-brand-red mt-1 block">Please enter a refund reference number.</span>}
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-gray-50/60 rounded-b-2xl">
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 bg-white hover:bg-gray-50 transition">Cancel</button>
        <button onClick={confirm} className="flex-1 py-2.5 bg-brand-orange text-white rounded-xl text-[13px] font-semibold hover:bg-brand-orange/85 transition flex items-center justify-center gap-1.5">
          <Icon name="checkmark-circle-outline" size={15} />Mark Refund Processed
        </button>
      </div>
    </>
  )
}

export default function RefundConfirmModal({ state, onClose, onConfirm }) {
  const [shown, setShown] = useState(state)
  useEffect(() => { if (state) setShown(state) }, [state])
  return (
    <Modal
      item={state}
      onClose={onClose}
      render={() => (shown ? <Content order={shown.order} refund={shown.refund} onClose={onClose} onConfirm={onConfirm} /> : null)}
    />
  )
}
