import { useEffect, useRef, useState } from 'react'
import Icon from '../Icon'

export default function SuspendModal({ biz, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    setReason('')
    if (textareaRef.current) textareaRef.current.style.borderColor = ''
  }, [biz])

  if (!biz) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      if (textareaRef.current) textareaRef.current.style.borderColor = '#eb445a'
      return
    }
    onConfirm(biz, reason.trim())
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{ background: 'rgba(10,21,53,0.55)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center shrink-0">
            <Icon name="pause-circle-outline" className="text-brand-orange" style={{ fontSize: '20px' }} />
          </div>
          <div>
            <p className="text-[14px] font-bold text-navy-dark">Suspend Business</p>
            <p className="text-[11px] text-gray-400">This will revoke all portal access immediately.</p>
          </div>
        </div>
        <div className="px-6 py-5">
          <p className="text-[12px] text-gray-600 mb-4">
            You are suspending <strong className="text-navy-dark">{biz.name}</strong>. A reason is required and will be
            shown to the business owner.
          </p>
          <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">
            Suspension Reason <span className="text-brand-red">*</span>
          </label>
          <textarea
            ref={textareaRef}
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              e.target.style.borderColor = ''
            }}
            placeholder="e.g. Policy violation — counterfeit products reported."
            className="w-full text-[12px] text-navy-dark bg-page border border-border rounded-xl px-3 py-2.5 resize-none placeholder-gray-400 transition"
            style={{ outline: 'none' }}
          ></textarea>
        </div>
        <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-gray-50/60">
          <button
            onClick={onClose}
            className="flex-1 h-10 text-[12px] font-semibold text-gray-500 bg-white border border-border rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 h-10 text-[12px] font-semibold text-white bg-brand-red rounded-xl hover:bg-brand-red/85 transition flex items-center justify-center gap-2"
          >
            <Icon name="pause-circle-outline" style={{ fontSize: '15px' }} />
            Suspend Business
          </button>
        </div>
      </div>
    </div>
  )
}
