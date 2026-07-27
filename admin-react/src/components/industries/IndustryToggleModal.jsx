import Icon from '../Icon'

export default function IndustryToggleModal({ ind, count = 0, onClose, onConfirm }) {
  if (!ind) return null

  const willDeactivate = ind.status === 'active'
  const showChildWarning = willDeactivate && count > 0

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
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              willDeactivate ? 'bg-brand-orange/10' : 'bg-brand-green/10'
            }`}
          >
            <Icon
              name={willDeactivate ? 'eye-off-outline' : 'eye-outline'}
              style={{ fontSize: '20px', color: willDeactivate ? '#ff9800' : '#2dd36f' }}
            />
          </div>
          <div>
            <p className="text-[14px] font-bold text-navy-dark">
              {willDeactivate ? 'Deactivate Industry' : 'Activate Industry'}
            </p>
            <p className="text-[11px] text-gray-400">
              {willDeactivate ? 'This will hide it from registration.' : 'This will make it available again.'}
            </p>
          </div>
        </div>
        <div className="px-6 py-5">
          <p className="text-[12px] text-gray-600 leading-relaxed mb-3">
            {willDeactivate ? (
              <>
                <strong>{ind.name}</strong> will be hidden from the industry list during business registration.
                Businesses already classified under it are unaffected.
              </>
            ) : (
              <>
                <strong>{ind.name}</strong> will become available again for businesses to select during registration.
              </>
            )}
          </p>
          {showChildWarning && (
            <div className="flex items-start gap-2.5 bg-brand-orange/5 border border-brand-orange/15 rounded-xl px-4 py-3 mb-3">
              <Icon name="warning-outline" style={{ fontSize: '15px', color: '#ff9800', flexShrink: 0, marginTop: '1px' }} />
              <p className="text-[11px] text-gray-600 leading-relaxed">
                <strong className="text-navy-dark">{count}</strong> business(es) are currently classified under this
                industry. They will remain classified — this only hides the option for new registrations.
              </p>
            </div>
          )}
          <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3">
            <Icon name="information-circle-outline" style={{ fontSize: '15px', color: '#3366cc', flexShrink: 0, marginTop: '1px' }} />
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Deactivating keeps existing classifications intact and only hides the option for new signups. Use Delete
              instead if you want to remove it entirely.
            </p>
          </div>
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
            className={`flex-1 h-10 text-[12px] font-semibold text-white rounded-xl transition ${
              willDeactivate ? 'bg-brand-orange hover:bg-brand-orange/85' : 'bg-brand-green hover:bg-brand-green/85'
            }`}
          >
            {willDeactivate ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  )
}
