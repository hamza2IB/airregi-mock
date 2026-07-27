import Icon from '../Icon'

// Banner shown above each queue item, varies by variant.
function Banner({ item }) {
  if (item.variant === 'renewal') {
    return (
      <div className="flex items-center gap-1.5 mb-2.5 px-2.5 py-1.5 rounded-lg bg-brand-orange/[.08] border border-brand-orange/20">
        <Icon name="refresh-circle-outline" style={{ fontSize: '13px', color: '#ff9800', flexShrink: 0 }} />
        <span className="text-[10.5px] font-semibold text-brand-orange">Renewal Payment</span>
        <span className="text-[10px] text-gray-500 ml-auto">
          Sub expires in <strong className="text-brand-red">{item.expiresLabel}</strong>
        </span>
      </div>
    )
  }
  if (item.variant === 'renewal-banned') {
    return (
      <>
        <div
          className="flex items-center gap-1.5 mb-2.5 px-2.5 py-1.5 rounded-lg border"
          style={{ background: 'rgba(235,68,90,0.06)', borderColor: 'rgba(235,68,90,0.2)' }}
        >
          <Icon name="ban-outline" style={{ fontSize: '13px', color: '#eb445a', flexShrink: 0 }} />
          <span className="text-[10.5px] font-semibold text-brand-red">Renewal Payment — Business Banned</span>
          <span className="text-[10px] text-gray-500 ml-auto">
            Expired <strong className="text-brand-red">{item.expiredOn}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 mb-2.5 px-2.5 py-1.5 rounded-lg bg-brand-blue/5 border border-brand-blue/15">
          <Icon name="information-circle-outline" style={{ fontSize: '12px', color: '#3366cc', flexShrink: 0 }} />
          <span className="text-[10px] text-brand-blue">
            Verifying this payment will automatically restore the business and reactivate all logins.
          </span>
        </div>
      </>
    )
  }
  // new-reg
  return (
    <div
      className="flex items-center gap-1.5 mb-2.5 px-2.5 py-1.5 rounded-lg border"
      style={{ background: 'rgba(124,77,255,0.05)', borderColor: 'rgba(124,77,255,0.2)' }}
    >
      <Icon name="business-outline" style={{ fontSize: '13px', color: '#7c4dff', flexShrink: 0 }} />
      <span className="text-[10.5px] font-semibold text-brand-purple">New Registration</span>
      <span className="text-[10px] text-gray-500 ml-auto">Submitted {item.submitted}</span>
    </div>
  )
}

export default function QueueItem({ item, resolved, onVerify, onReject, onViewReceipt }) {
  return (
    <div
      className="px-5 py-4 hover:bg-gray-50/50 transition"
      style={resolved ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
    >
      <Banner item={item} />

      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[13px] font-semibold text-black">{item.name}</p>
          <p className="text-[11px] text-gray-500">{item.subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {item.badges.map((b) => (
            <span key={b.text} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${b.cls}`}>
              {b.text}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100">
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-gray-500">Bank:</span> <span className="font-medium text-black">{item.payment.bank}</span>
          </div>
          <div>
            <span className="text-gray-500">Amount:</span>{' '}
            <span className="font-semibold text-black">{item.payment.amount}</span>
          </div>
          <div>
            <span className="text-gray-500">Ref #:</span>{' '}
            <span className="font-mono text-black">{item.payment.ref}</span>
          </div>
          <div>
            <span className="text-gray-500">Date:</span> <span className="font-medium text-black">{item.payment.date}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-gray-200">
          {item.receipt ? (
            <>
              <Icon name="attach-outline" style={{ fontSize: '13px', color: '#64748b', flexShrink: 0 }} />
              <span className="text-[10.5px] text-gray-500 font-medium flex-1">{item.receipt}</span>
              <button
                onClick={() => onViewReceipt(item.name)}
                className="flex items-center gap-1 text-[10.5px] font-bold text-brand-blue hover:text-navy transition"
              >
                <Icon name="eye-outline" size={12} />
                View Receipt
              </button>
            </>
          ) : (
            <>
              <Icon name="document-outline" style={{ fontSize: '13px', color: '#cbd5e1', flexShrink: 0 }} />
              <span className="text-[10.5px] text-gray-400 italic">No receipt uploaded</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onVerify(item)}
          className="flex-1 h-[32px] text-[11px] font-semibold text-white bg-brand-green rounded-lg flex items-center justify-center gap-1.5 hover:bg-brand-green/85 transition"
        >
          <Icon name="checkmark-outline" size={14} />
          {item.verifyLabel}
        </button>
        <button
          onClick={() => onReject(item)}
          className="flex-1 h-[32px] text-[11px] font-semibold text-brand-red bg-brand-red/[.08] rounded-lg flex items-center justify-center gap-1.5 hover:bg-brand-red/15 transition"
        >
          <Icon name="close-outline" size={14} />
          {item.rejectLabel || 'Reject'}
        </button>
      </div>
    </div>
  )
}
