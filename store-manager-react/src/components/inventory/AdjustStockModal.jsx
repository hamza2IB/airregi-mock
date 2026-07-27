import { useState } from 'react'
import Modal from '../Modal'
import Icon from '../Icon'
import { SM_ADJ_REASONS } from '../../data/inventoryData'

const INP = 'w-full border-[1.5px] border-border rounded-lg px-3 py-2.5 text-[12px] text-navy-dark bg-white focus:outline-none focus:border-navy'

function Content({ item, onClose, onSave }) {
  const [count, setCount] = useState('')
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [countErr, setCountErr] = useState(false)
  const [reasonErr, setReasonErr] = useState(false)

  const hasCount = count !== '' && Number(count) >= 0
  const newQty = hasCount ? Number(count) : null
  const delta = hasCount ? newQty - item.onHand : null

  const deltaCfg =
    delta == null ? null
      : delta === 0 ? { box: 'bg-gray-100', icon: 'remove-outline', color: '#64748b', text: 'No change — count matches the system record', preview: '#0a1535', pbox: 'border-border bg-white' }
      : delta > 0 ? { box: 'bg-brand-green/10', icon: 'trending-up-outline', color: '#2dd36f', text: `Stock increases by +${delta} (${item.onHand} → ${newQty})`, preview: '#2dd36f', pbox: 'border-brand-green/40 bg-brand-green/5' }
      : { box: 'bg-brand-red/10', icon: 'trending-down-outline', color: '#eb445a', text: `Stock decreases by ${delta} (${item.onHand} → ${newQty})`, preview: '#eb445a', pbox: 'border-brand-red/40 bg-brand-red/5' }

  const save = () => {
    let bad = false
    if (!hasCount) { setCountErr(true); bad = true }
    if (!reason) { setReasonErr(true); bad = true }
    if (bad) return
    onSave(item, newQty, reason, note.trim())
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-orange/10 flex items-center justify-center shrink-0">
            <Icon name="create-outline" style={{ fontSize: '18px', color: '#ff9800' }} />
          </div>
          <div>
            <h3 className="text-[15px] font-extrabold text-navy-dark">Adjust Stock</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{item.name} — {item.variant} · {item.sku}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" style={{ fontSize: '17px', color: '#64748b' }} />
        </button>
      </div>

      <div className="px-6 py-5 space-y-4">
        {/* Current → New preview */}
        <div className="flex items-center justify-center gap-3">
          <div className="px-4 py-3 bg-gray-50 border border-border rounded-xl text-center flex-1">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.06em] font-bold mb-1">System record</p>
            <p className="text-[20px] font-extrabold text-navy-dark leading-none">{item.onHand}</p>
          </div>
          <Icon name="arrow-forward-outline" style={{ fontSize: '16px', color: '#cbd5e1' }} />
          <div className={`px-4 py-3 border rounded-xl text-center flex-1 ${deltaCfg ? deltaCfg.pbox : 'border-border bg-white'}`}>
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.06em] font-bold mb-1">New count</p>
            <p className="text-[20px] font-extrabold leading-none" style={{ color: deltaCfg ? deltaCfg.preview : '#cbd5e1' }}>{hasCount ? newQty : '—'}</p>
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Actual counted quantity <span className="text-brand-red">*</span></label>
          <input type="number" min="0" value={count} onChange={(e) => { setCount(e.target.value); setCountErr(false) }} className={`${INP} ${countErr ? '!border-brand-red' : ''}`} placeholder="How many units are actually on hand?" />
          <p className="text-[10px] text-gray-400 mt-1">Enter the real number you counted — not the amount to add or remove.</p>
          {countErr && <span className="text-[10px] text-brand-red mt-1 block">Enter a valid count (0 or more).</span>}
        </div>

        {deltaCfg && (
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${deltaCfg.box}`}>
            <Icon name={deltaCfg.icon} style={{ fontSize: '14px', color: deltaCfg.color, flexShrink: 0 }} />
            <p className="text-[11px] font-semibold" style={{ color: deltaCfg.color }}>{deltaCfg.text}</p>
          </div>
        )}

        <div>
          <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Reason <span className="text-brand-red">*</span></label>
          <select value={reason} onChange={(e) => { setReason(e.target.value); setReasonErr(false) }} className={`${INP} cursor-pointer ${reasonErr ? '!border-brand-red' : ''}`}>
            <option value="">Select a reason…</option>
            {SM_ADJ_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          {reasonErr && <span className="text-[10px] text-brand-red mt-1 block">Please select a reason.</span>}
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Note <span className="text-[11px] font-normal text-gray-400">(optional)</span></label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className={`${INP} resize-none`} placeholder="Additional detail…"></textarea>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-gray-50/60 rounded-b-2xl">
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 bg-white hover:bg-gray-50 transition">Cancel</button>
        <button onClick={save} className="flex-1 py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition flex items-center justify-center gap-1.5">
          <Icon name="checkmark-outline" style={{ fontSize: '15px' }} />Save Adjustment
        </button>
      </div>
    </>
  )
}

export default function AdjustStockModal({ item, onClose, onSave }) {
  return <Modal item={item} onClose={onClose} maxWidth="max-w-md" render={(it) => <Content item={it} onClose={onClose} onSave={onSave} />} />
}
