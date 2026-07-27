import Icon from '../Icon'

export default function PackageToggleModal({ pkg, onClose, onConfirm }) {
  if (!pkg) return null

  const willDisable = pkg.enabled
  const title = willDisable ? 'Disable Package' : 'Enable Package'

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
              willDisable ? 'bg-brand-orange/10' : 'bg-brand-green/10'
            }`}
          >
            <Icon
              name={willDisable ? 'eye-off-outline' : 'eye-outline'}
              style={{ fontSize: '20px', color: willDisable ? '#ff9800' : '#2dd36f' }}
            />
          </div>
          <div>
            <p className="text-[14px] font-bold text-navy-dark">{title}</p>
            <p className="text-[11px] text-gray-400">This will hide it from new registrations.</p>
          </div>
        </div>
        <div className="px-6 py-5">
          <p className="text-[12px] text-gray-600 leading-relaxed mb-3">
            {willDisable ? (
              <>
                <strong>{pkg.name}</strong> will be hidden from the business registration page. No new businesses will
                be able to select it.
              </>
            ) : (
              <>
                <strong>{pkg.name}</strong> will become visible again on the business registration page for new signups.
              </>
            )}
          </p>
          <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3">
            <Icon name="information-circle-outline" style={{ fontSize: '15px', color: '#3366cc', flexShrink: 0, marginTop: '1px' }} />
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Businesses already subscribed to this package are <strong className="text-navy-dark">not affected</strong>.
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
            onClick={() => onConfirm(pkg)}
            className={`flex-1 h-10 text-[12px] font-semibold text-white rounded-xl transition ${
              willDisable ? 'bg-brand-orange hover:bg-brand-orange/85' : 'bg-brand-green hover:bg-brand-green/85'
            }`}
          >
            {title}
          </button>
        </div>
      </div>
    </div>
  )
}
