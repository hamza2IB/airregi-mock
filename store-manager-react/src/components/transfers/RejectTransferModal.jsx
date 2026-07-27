import { useState } from 'react'
import Modal from '../Modal'
import Icon from '../Icon'
import { TRANSFER_REJECT_REASONS } from '../../data/transferData'

const INP = 'w-full border-[1.5px] border-border rounded-lg px-3 py-2.5 text-[12px] text-navy-dark bg-white focus:outline-none focus:border-navy'

function Content({ t, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [err, setErr] = useState(false)

  const confirm = () => {
    if (!reason) { setErr(true); return }
    const label = TRANSFER_REJECT_REASONS.find((r) => r.value === reason)?.label || reason
    onConfirm(t, label, note.trim())
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-red/10 flex items-center justify-center shrink-0">
            <Icon name="close-circle-outline" style={{ fontSize: '18px', color: '#eb445a' }} />
          </div>
          <div>
            <h3 className="text-[15px] font-extrabold text-navy-dark">Reject Transfer</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{t.id} · {t.store}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" style={{ fontSize: '17px', color: '#64748b' }} />
        </button>
      </div>

      <div className="px-6 py-5 space-y-4">
        <div className="flex items-start gap-2.5 bg-brand-red/5 border border-brand-red/15 rounded-xl px-4 py-3">
          <Icon name="warning-outline" style={{ fontSize: '14px', color: '#eb445a', flexShrink: 0, marginTop: '1px' }} />
          <p className="text-[11px] text-gray-600 leading-relaxed">The branch will be notified of this rejection with the reason you provide so they can take alternative action.</p>
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Reason <span className="text-brand-red">*</span></label>
          <select value={reason} onChange={(e) => { setReason(e.target.value); setErr(false) }} className={`${INP} cursor-pointer ${err ? '!border-brand-red' : ''}`}>
            <option value="">Select a reason…</option>
            {TRANSFER_REJECT_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          {err && <span className="text-[10px] text-brand-red mt-1 block">Please select a reason before rejecting.</span>}
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Additional Note <span className="text-[11px] font-normal text-gray-400">(optional)</span></label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className={`${INP} resize-none`} placeholder="Explain to the branch what they should do instead…"></textarea>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-gray-50/60 rounded-b-2xl">
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 bg-white hover:bg-gray-50 transition">Cancel</button>
        <button onClick={confirm} className="flex-1 py-2.5 bg-brand-red text-white rounded-xl text-[13px] font-semibold hover:bg-brand-red/85 transition flex items-center justify-center gap-1.5">
          <Icon name="close-circle-outline" style={{ fontSize: '15px' }} />Confirm Reject
        </button>
      </div>
    </>
  )
}

export default function RejectTransferModal({ transfer, onClose, onConfirm }) {
  return <Modal item={transfer} onClose={onClose} maxWidth="max-w-md" render={(t) => <Content t={t} onClose={onClose} onConfirm={onConfirm} />} />
}
