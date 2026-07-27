import { useEffect, useState } from 'react'

// Centered confirm dialog. `state` = { title, msg, confirmLabel, tone, onConfirm } or null.
// Keeps last content mounted during the fade-out.
export default function ConfirmModal({ state, onClose }) {
  const [shown, setShown] = useState(state)

  useEffect(() => {
    if (state) setShown(state)
  }, [state])

  const open = !!state
  const tone = shown?.tone || 'danger'
  const okCls =
    tone === 'success'
      ? 'bg-brand-green'
      : tone === 'info'
        ? 'bg-navy'
        : 'bg-brand-red'

  return (
    <div className={`fixed inset-0 z-[500] flex items-center justify-center p-4 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className={`relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transition-transform duration-200 ${open ? 'scale-100' : 'scale-95'}`}>
        <p className="text-[16px] font-extrabold text-navy-dark mb-2">{shown?.title || 'Confirm'}</p>
        <p className="text-[13px] text-gray-600 mb-6">{shown?.msg || 'Are you sure?'}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => {
              shown?.onConfirm?.()
              onClose()
            }}
            className={`flex-1 py-2.5 ${okCls} text-white rounded-xl text-[13px] font-semibold hover:opacity-90 transition`}
          >
            {shown?.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
