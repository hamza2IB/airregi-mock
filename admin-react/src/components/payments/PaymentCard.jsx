import Icon from '../Icon'

// Context banner varies by payment kind (mirrors pvCardHtml).
function Banner({ p, isRenewal, isBannedRenewal }) {
  if (isBannedRenewal) {
    return (
      <>
        <div
          className="flex items-center gap-1.5 mb-2.5 px-2.5 py-1.5 rounded-lg border"
          style={{ background: 'rgba(235,68,90,0.06)', borderColor: 'rgba(235,68,90,0.2)' }}
        >
          <Icon name="ban-outline" style={{ fontSize: '13px', color: '#eb445a', flexShrink: 0 }} />
          <span className="text-[10.5px] font-semibold text-brand-red">Renewal Payment — Business Banned</span>
          <span className="text-[10px] text-gray-500 ml-auto">
            Expired <strong className="text-brand-red">{p.expiredOn}</strong>
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
  if (isRenewal) {
    const col = p.expiresColor === 'red' ? 'text-brand-red' : 'text-brand-orange'
    return (
      <div className="flex items-center gap-1.5 mb-2.5 px-2.5 py-1.5 rounded-lg bg-brand-orange/[.08] border border-brand-orange/20">
        <Icon name="refresh-circle-outline" style={{ fontSize: '13px', color: '#ff9800', flexShrink: 0 }} />
        <span className="text-[10.5px] font-semibold text-brand-orange">Renewal Payment</span>
        <span className="text-[10px] text-gray-500 ml-auto">
          Sub expires in <strong className={col}>{p.expiresIn}</strong>
        </span>
      </div>
    )
  }
  return (
    <div
      className="flex items-center gap-1.5 mb-2.5 px-2.5 py-1.5 rounded-lg border"
      style={{ background: 'rgba(124,77,255,0.05)', borderColor: 'rgba(124,77,255,0.2)' }}
    >
      <Icon name="business-outline" style={{ fontSize: '13px', color: '#7c4dff', flexShrink: 0 }} />
      <span className="text-[10.5px] font-semibold text-brand-purple">New Registration</span>
      <span className="text-[10px] text-gray-500 ml-auto">Submitted {p.submitted}</span>
    </div>
  )
}

function Badges({ isRenewal, isBannedRenewal }) {
  if (isBannedRenewal) {
    return (
      <>
        <span className="text-[10px] font-bold text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-full">Banned</span>
        <span className="text-[10px] font-medium text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full">
          Unverified
        </span>
      </>
    )
  }
  if (isRenewal) {
    return (
      <span className="text-[10px] font-medium text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full">
        Unverified
      </span>
    )
  }
  return (
    <span className="text-[10px] font-medium text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full">
      New Reg
    </span>
  )
}

export default function PaymentCard({ p, onVerify, onReject, onViewReceipt }) {
  const isRenewal = p.type === 'renewal'
  const isBannedRenewal = isRenewal && p.bizStatus === 'banned'

  const subLine = isRenewal
    ? isBannedRenewal
      ? `${p.pkg} · ${p.amountLabel} · expired ${p.expiredOn}`
      : `${p.pkg} · ${p.amountLabel} · renewing`
    : `${p.pkg} · ${p.amountLabel} · Owner: ${p.owner}`

  const verifyLabel = isRenewal ? 'Verify & Renew' : 'Verify & Activate'
  const verifyMsg = isBannedRenewal
    ? `${p.name} renewal verified. Business restored & all logins reactivated.`
    : isRenewal
      ? `${p.name} renewal verified. Subscription extended.`
      : `${p.name} verified & activated. Credentials sent.`
  const rejectLabel = isRenewal ? 'Reject Payment' : 'Reject'
  const rejectType = isBannedRenewal ? 'renewal-banned' : isRenewal ? 'renewal' : 'new-reg'

  return (
    <div className="px-5 py-4 hover:bg-gray-50/50 transition">
      <Banner p={p} isRenewal={isRenewal} isBannedRenewal={isBannedRenewal} />

      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[13px] font-semibold text-black">{p.name}</p>
          <p className="text-[11px] text-gray-500">{subLine}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <Badges isRenewal={isRenewal} isBannedRenewal={isBannedRenewal} />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100">
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-gray-500">Bank:</span> <span className="font-medium text-black">{p.bank}</span>
          </div>
          <div>
            <span className="text-gray-500">Amount:</span>{' '}
            <span className="font-semibold text-black">Rs.{p.amount.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-500">Ref #:</span> <span className="font-mono text-black">{p.ref}</span>
          </div>
          <div>
            <span className="text-gray-500">Date:</span> <span className="font-medium text-black">{p.date}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-gray-200">
          {p.receipt ? (
            <>
              <Icon name="attach-outline" style={{ fontSize: '13px', color: '#64748b', flexShrink: 0 }} />
              <span className="text-[10.5px] text-gray-500 font-medium flex-1">{p.receipt}</span>
              <button
                onClick={() => onViewReceipt(p.name)}
                className="flex items-center gap-1 text-[10.5px] font-bold text-brand-blue hover:text-navy transition"
              >
                <Icon name="eye-outline" style={{ fontSize: '12px' }} />
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
          onClick={() => onVerify(p, verifyMsg)}
          className="flex-1 h-[32px] text-[11px] font-semibold text-white bg-brand-green rounded-lg flex items-center justify-center gap-1.5 hover:bg-brand-green/85 transition"
        >
          <Icon name="checkmark-outline" style={{ fontSize: '14px' }} />
          {verifyLabel}
        </button>
        <button
          onClick={() => onReject({ rejectType, name: p.name, payment: { ref: p.ref } })}
          className="flex-1 h-[32px] text-[11px] font-semibold text-brand-red bg-brand-red/[.08] rounded-lg flex items-center justify-center gap-1.5 hover:bg-brand-red/15 transition"
        >
          <Icon name="close-outline" style={{ fontSize: '14px' }} />
          {rejectLabel}
        </button>
      </div>
    </div>
  )
}
