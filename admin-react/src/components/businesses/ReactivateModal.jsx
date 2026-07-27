import Icon from '../Icon'

export default function ReactivateModal({ biz, onClose, onConfirm }) {
  if (!biz) return null

  const isBanned = biz.status === 'banned'
  const title = isBanned ? 'Restore Business' : 'Reactivate Business'
  const confirmLabel = isBanned ? 'Yes, Restore' : 'Yes, Reactivate'
  const note = isBanned
    ? 'Ensure a valid renewal payment has been verified before restoring.'
    : 'The suspension reason will be cleared.'

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
          <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center shrink-0">
            <Icon
              name={isBanned ? 'refresh-circle-outline' : 'play-circle-outline'}
              style={{ fontSize: '20px', color: '#2dd36f' }}
            />
          </div>
          <div>
            <p className="text-[14px] font-bold text-navy-dark">{title}</p>
            <p className="text-[11px] text-gray-400">This will restore full portal access.</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-[12px] text-gray-600 leading-relaxed mb-3">
            {isBanned ? (
              <>
                <strong>{biz.name}</strong> was auto-banned due to subscription expiry. Restoring will reinstate full
                portal access for the business and all its staff.
              </>
            ) : (
              <>
                <strong>{biz.name}</strong> is currently suspended. Reactivating will restore full portal access
                immediately.
              </>
            )}
          </p>
          <div className="flex items-start gap-2.5 bg-brand-green/5 border border-brand-green/20 rounded-xl px-4 py-3">
            <Icon
              name="information-circle-outline"
              style={{ fontSize: '15px', color: '#2dd36f', flexShrink: 0, marginTop: '1px' }}
            />
            <p className="text-[11px] text-gray-600 leading-relaxed">{note}</p>
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
            onClick={() => onConfirm(biz)}
            className="flex-1 h-10 text-[12px] font-semibold text-white bg-brand-green rounded-xl hover:bg-brand-green/85 transition flex items-center justify-center gap-1.5"
          >
            <Icon name={isBanned ? 'refresh-circle-outline' : 'play-circle-outline'} style={{ fontSize: '15px' }} />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
