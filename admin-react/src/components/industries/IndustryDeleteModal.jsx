import Icon from '../Icon'

export default function IndustryDeleteModal({ ind, count = 0, onClose, onConfirm }) {
  if (!ind) return null

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
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <Icon name="trash-outline" style={{ fontSize: '20px', color: '#eb445a' }} />
          </div>
          <div>
            <p className="text-[14px] font-bold text-navy-dark">Delete Industry</p>
            <p className="text-[11px] text-gray-400">This cannot be undone.</p>
          </div>
        </div>
        <div className="px-6 py-5">
          <p className="text-[12px] text-gray-600 leading-relaxed">
            {count > 0 ? (
              <>
                Delete <strong className="text-navy-dark">{ind.name}</strong>? <strong>{count}</strong> business(es) are
                currently classified under it — they will be unassigned (no industry) and can be reclassified anytime.
                This cannot be undone.
              </>
            ) : (
              <>
                Delete <strong className="text-navy-dark">{ind.name}</strong>? No businesses are currently classified
                under it. This cannot be undone.
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-gray-50/60">
          <button
            onClick={onClose}
            className="flex-1 h-10 text-[12px] font-semibold text-gray-500 bg-white border border-border rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(ind)}
            className="flex-1 h-10 text-[12px] font-semibold text-white bg-brand-red rounded-xl hover:bg-brand-red/85 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
