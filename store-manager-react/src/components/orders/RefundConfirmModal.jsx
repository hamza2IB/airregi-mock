import { useState } from 'react'
import Modal from '../Modal'
import Icon from '../Icon'

const rs = (n) => 'Rs.' + n.toLocaleString('en-PK')

function Content({ state, onClose, onConfirm }) {
  const { order: o, refund: r } = state
  const [ref, setRef] = useState('')
  const [err, setErr] = useState(false)

  const confirm = () => {
    if (!ref.trim()) { setErr(true); return }
    onConfirm(state, ref.trim())
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-orange/10 flex items-center justify-center shrink-0">
            <Icon name="cash-outline" style={{ fontSize: '18px', color: '#ff9800' }} />
          </div>
          <div>
            <h3 className="text-[15px] font-extrabold text-navy-dark">Process Refund</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{o.id} · {o.customer}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" style={{ fontSize: '17px', color: '#64748b' }} />
        </button>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-border mb-3">
          <div>
            <p className="text-[10px] text-gray-400 font-medium">Refund Amount</p>
            <p className="text-[20px] font-extrabold text-brand-orange">{rs(r.amount)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-medium">Original Payment</p>
            <p className="text-[12px] font-semibold text-navy-dark">{o.payment}</p>
            <p className="text-[10px] text-gray-400 font-mono">{o.paymentRef || '—'}</p>
          </div>
        </div>

        <div className="space-y-1.5 mb-3">
          {r.items.map((l, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 bg-white border border-border rounded-lg">
              <p className="text-[11px] text-gray-600">{l.name} × {l.removedQty}</p>
              <p className="text-[11px] font-semibold text-navy-dark">{rs(l.amount)}</p>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Refund Reference # <span className="text-brand-red">*</span></label>
          <input value={ref} onChange={(e) => { setRef(e.target.value); setErr(false) }} type="text" placeholder="e.g. EP-REF-20260723-001" className={`w-full border-[1.5px] rounded-lg px-3 py-2.5 text-[12px] text-navy-dark bg-white focus:outline-none focus:border-navy ${err ? 'border-brand-red' : 'border-border'}`} />
          {err && <span className="text-[10px] text-brand-red mt-1 block">Please enter a refund reference number.</span>}
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-gray-50/60 rounded-b-2xl">
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 bg-white hover:bg-gray-50 transition">Cancel</button>
        <button onClick={confirm} className="flex-1 py-2.5 bg-brand-green text-white rounded-xl text-[13px] font-semibold hover:bg-brand-green/85 transition flex items-center justify-center gap-1.5">
          <Icon name="checkmark-circle-outline" style={{ fontSize: '15px' }} />Mark as Refunded
        </button>
      </div>
    </>
  )
}

export default function RefundConfirmModal({ state, onClose, onConfirm }) {
  return <Modal item={state} onClose={onClose} maxWidth="max-w-md" render={(s) => <Content state={s} onClose={onClose} onConfirm={onConfirm} />} />
}
