import Icon from '../Icon'
import Slideover from '../Slideover'

const fmt = (n) => 'Rs.' + n.toLocaleString()

function Content({ s, onClose }) {
  const isBalanced = s.diff === 0
  const isShort = s.diff < 0
  const statusColor = isBalanced ? 'text-brand-green' : isShort ? 'text-brand-red' : 'text-brand-orange'
  const statusBg = isBalanced ? 'bg-brand-green/10' : isShort ? 'bg-brand-red/10' : 'bg-brand-orange/10'
  const statusLabel = isBalanced ? 'Balanced' : isShort ? 'Short' : 'Over'
  const statusIcon = isBalanced ? 'checkmark-circle' : isShort ? 'arrow-down-circle' : 'arrow-up-circle'
  const diffLabel = isBalanced ? 'Rs.0' : isShort ? `−Rs.${Math.abs(s.diff)}` : `+Rs.${s.diff}`
  const initials = s.cashier.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <>
      {/* Header */}
      <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="min-w-0">
          <h3 className="text-[16px] font-extrabold text-navy-dark truncate">{s.cashier} · {s.register}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5 truncate">Al Fatah {s.store} · {s.date} · {s.time}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition shrink-0">
          <Icon name="close-outline" style={{ fontSize: '18px', color: '#64748b' }} />
        </button>
      </div>

      <div className="p-6">
        {/* Cashier header */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-gray-50 mb-4">
          <div className="w-11 h-11 rounded-xl bg-navy/10 flex items-center justify-center shrink-0 text-[13px] font-extrabold text-navy">{initials}</div>
          <div className="min-w-0">
            <p className="text-[14px] font-extrabold text-navy-dark truncate">{s.cashier}</p>
            <p className="text-[11px] text-gray-400">{s.register} · Al Fatah {s.store}</p>
          </div>
          <span className={`ml-auto flex items-center gap-1 text-[11px] font-bold ${statusColor} ${statusBg} px-2.5 py-1 rounded-full whitespace-nowrap`}>
            <Icon name={statusIcon} style={{ fontSize: '13px' }} />
            {statusLabel}
          </span>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="px-4 py-3 rounded-xl border border-border">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Date</p>
            <p className="text-[13px] font-semibold text-navy-dark">{s.date}</p>
          </div>
          <div className="px-4 py-3 rounded-xl border border-border">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Closed At</p>
            <p className="text-[13px] font-semibold text-navy-dark">{s.time}</p>
          </div>
        </div>

        {/* Reconciliation */}
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Drawer Reconciliation</p>
        <div className="rounded-xl border border-border overflow-hidden mb-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-[12px] text-gray-500">Expected in drawer</span>
            <span className="text-[13px] font-semibold text-navy-dark">{fmt(s.expected)}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-[12px] text-gray-500">Counted (actual)</span>
            <span className="text-[13px] font-semibold text-navy-dark">{fmt(s.actual)}</span>
          </div>
          <div className={`flex items-center justify-between px-4 py-3 ${statusBg}`}>
            <span className={`text-[12px] font-semibold ${statusColor}`}>Variance</span>
            <span className={`text-[14px] font-extrabold ${statusColor}`}>{diffLabel}</span>
          </div>
        </div>

        {/* Note */}
        {!isBalanced ? (
          <div className={`flex items-start gap-2 px-4 py-3 rounded-xl ${statusBg}`}>
            <Icon name="information-circle-outline" className={statusColor} style={{ fontSize: '15px', flexShrink: 0, marginTop: '1px' }} />
            <p className="text-[11px] text-gray-600 leading-relaxed">
              {isShort
                ? 'The drawer is short of the expected amount. Review the transactions logged during this shift.'
                : 'The drawer has more cash than expected (overage). Verify no sales were missed or mis-keyed.'}
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-brand-green/10">
            <Icon name="checkmark-circle-outline" className="text-brand-green" style={{ fontSize: '15px', flexShrink: 0, marginTop: '1px' }} />
            <p className="text-[11px] text-gray-600 leading-relaxed">
              This shift balanced perfectly — the counted cash matches the expected amount.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default function ShiftDetailSlideover({ shift, onClose }) {
  return <Slideover item={shift} onClose={onClose} width={480} render={(s) => <Content s={s} onClose={onClose} />} />
}
