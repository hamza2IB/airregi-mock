import { useEffect, useRef, useState } from 'react'
import Icon from '../Icon'

function consequenceText(type) {
  if (type === 'renewal-banned') {
    return (
      <>
        The business will <strong>remain banned</strong>. The owner must submit a new valid payment to restore access.
      </>
    )
  }
  if (type === 'renewal') {
    return (
      <>
        The business will <strong>remain active</strong> but the subscription expiry clock continues. The owner must
        resubmit a correct payment.
      </>
    )
  }
  return (
    <>
      This registration will be <strong>permanently rejected</strong>. The applicant will be notified and must reapply
      from scratch.
    </>
  )
}

export default function RejectModal({ target, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    setReason('')
    if (textareaRef.current) textareaRef.current.style.borderColor = ''
  }, [target])

  if (!target) return null

  const { rejectType: type, name, payment } = target
  const isPayment = type === 'renewal' || type === 'renewal-banned'
  const title = isPayment ? 'Reject Renewal Payment' : 'Reject Registration'
  const confirmLabel = isPayment ? 'Reject Payment' : 'Reject Registration'

  const handleConfirm = () => {
    if (!reason.trim()) {
      if (textareaRef.current) textareaRef.current.style.borderColor = '#eb445a'
      return
    }
    onConfirm(target, reason.trim())
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
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isPayment ? 'bg-brand-orange/10' : 'bg-brand-red/10'
            }`}
          >
            <Icon
              name="close-circle-outline"
              style={{ fontSize: '20px', color: isPayment ? '#ff9800' : '#eb445a' }}
            />
          </div>
          <div>
            <p className="text-[14px] font-bold text-navy-dark">{title}</p>
            <p className="text-[11px] text-gray-400">This action will notify the business owner.</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Business + payment ref info */}
          <div className="bg-page rounded-xl border border-border divide-y divide-border">
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[11px] text-gray-400">Business</span>
              <span className="text-[11px] font-bold text-navy-dark">{name}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[11px] text-gray-400">Payment Ref</span>
              <span className="text-[11px] font-mono text-navy-dark">{payment?.ref || '—'}</span>
            </div>
          </div>

          {/* Consequence notice */}
          <div className="flex items-start gap-2.5 bg-brand-red/5 border border-brand-red/15 rounded-xl px-4 py-3">
            <Icon
              name="warning-outline"
              style={{ fontSize: '15px', color: '#eb445a', flexShrink: 0, marginTop: '1px' }}
            />
            <p className="text-[11px] text-gray-600 leading-relaxed">{consequenceText(type)}</p>
          </div>

          {/* Reason field */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">
              Rejection Reason <span className="text-brand-red">*</span>
              <span className="text-gray-400 font-normal ml-1">(shown to business owner)</span>
            </label>
            <textarea
              ref={textareaRef}
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                e.target.style.borderColor = ''
              }}
              placeholder="e.g. Payment reference not found in our bank records. Please resubmit with a valid transaction reference."
              className="w-full text-[12px] text-navy-dark bg-page border border-border rounded-xl px-3 py-2.5 resize-none placeholder-gray-300 transition"
              style={{ outline: 'none' }}
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-gray-50/60">
          <button
            onClick={onClose}
            className="flex-1 h-10 text-[12px] font-semibold text-gray-500 bg-white border border-border rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 h-10 text-[12px] font-semibold text-white bg-brand-red rounded-xl hover:bg-brand-red/85 transition flex items-center justify-center gap-1.5"
          >
            <Icon name="close-circle-outline" style={{ fontSize: '15px' }} />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
