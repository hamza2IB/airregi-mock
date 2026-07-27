import Modal from '../Modal'
import Icon from '../Icon'

const STATE_CFG = {
  full: { badge: 'text-brand-green bg-brand-green/10', label: 'In Stock', icon: 'checkmark-circle-outline', color: '#2dd36f' },
  partial: { badge: 'text-brand-orange bg-brand-orange/10', label: 'Partial', icon: 'alert-circle-outline', color: '#ff9800' },
  out: { badge: 'text-brand-red bg-brand-red/10', label: 'Out of Stock', icon: 'close-circle-outline', color: '#eb445a' },
}

function Content({ state, onClose, onAcceptPartial, onReject }) {
  const { order: o, checked } = state
  const isBankTransfer = o.payment !== 'Cash on Delivery' && o.paymentStatus === 'paid'
  const outCount = checked.filter((l) => l.stockState === 'out').length
  const partialCount = checked.filter((l) => l.stockState === 'partial').length
  const allOut = checked.every((l) => l.stockState === 'out')
  const removedTotal = checked.reduce((s, l) => s + (l.qty - l.fulfillable) * l.price, 0)

  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
            <Icon name="cube-outline" className="text-brand-blue" style={{ fontSize: '18px' }} />
          </div>
          <div>
            <h3 className="text-[15px] font-extrabold text-navy-dark">Stock Availability Check</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{o.id} · {o.customer}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" style={{ fontSize: '17px', color: '#64748b' }} />
        </button>
      </div>

      <div className="px-6 py-5 overflow-y-auto thin-scroll" style={{ maxHeight: '60vh' }}>
        <div className={`flex items-start gap-2.5 border rounded-xl px-4 py-3 mb-4 ${allOut ? 'bg-brand-red/5 border-brand-red/15' : 'bg-brand-orange/5 border-brand-orange/15'}`}>
          <Icon name={allOut ? 'close-circle-outline' : 'warning-outline'} style={{ fontSize: '15px', color: allOut ? '#eb445a' : '#ff9800', flexShrink: 0, marginTop: '1px' }} />
          <p className="text-[11px] text-gray-600 leading-relaxed">
            {allOut ? (
              <><strong className="text-brand-red">All items are out of stock.</strong> This order cannot be fulfilled and should be rejected.</>
            ) : (
              <><strong className="text-brand-orange">{outCount} item{outCount !== 1 ? 's' : ''} out of stock{partialCount ? `, ${partialCount} partially available` : ''}.</strong> Choose how to proceed below.</>
            )}
          </p>
        </div>

        <div className="space-y-2">
          {checked.map((l, i) => {
            const cfg = STATE_CFG[l.stockState]
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white border border-border rounded-xl">
                <Icon name={cfg.icon} style={{ fontSize: '18px', color: cfg.color, flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-navy-dark truncate">{l.name} <span className="text-gray-400 font-normal">— {l.variant}</span></p>
                  <p className="text-[10px] text-gray-400 font-mono">{l.sku}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[12px] font-bold text-navy-dark">{l.fulfillable} / {l.qty} <span className="text-[10px] text-gray-400 font-normal">requested</span></p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                </div>
              </div>
            )
          })}
        </div>

        {isBankTransfer && removedTotal > 0 && !allOut && (
          <div className="flex items-start gap-2.5 bg-brand-blue/5 border border-brand-blue/15 rounded-xl px-4 py-3 mt-4">
            <Icon name="information-circle-outline" style={{ fontSize: '14px', color: '#3366cc', flexShrink: 0, marginTop: '1px' }} />
            <p className="text-[11px] text-gray-600 leading-relaxed">Payment was made via <strong className="text-navy-dark">{o.payment}</strong> (Ref: {o.paymentRef}). If you proceed with a partial order, a refund of <strong className="text-navy-dark">Rs.{removedTotal.toLocaleString()}</strong> will be tracked for the unavailable items.</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-gray-50/60 rounded-b-2xl shrink-0">
        {allOut ? (
          <>
            <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 bg-white hover:bg-gray-50 transition">Cancel</button>
            <button onClick={() => onReject(o)} className="flex-1 py-2.5 bg-brand-red text-white rounded-xl text-[13px] font-semibold hover:bg-brand-red/85 transition flex items-center justify-center gap-1.5">
              <Icon name="close-circle-outline" style={{ fontSize: '15px' }} />Reject Order
            </button>
          </>
        ) : (
          <>
            <button onClick={() => onReject(o)} className="flex-1 py-2.5 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-xl text-[13px] font-semibold hover:bg-brand-red/15 transition">Reject Entire Order</button>
            <button onClick={() => onAcceptPartial(state)} className="flex-1 py-2.5 bg-brand-green text-white rounded-xl text-[13px] font-semibold hover:bg-brand-green/85 transition flex items-center justify-center gap-1.5">
              <Icon name="checkmark-circle-outline" style={{ fontSize: '15px' }} />Accept Available Items
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default function StockCheckModal({ state, onClose, onAcceptPartial, onReject }) {
  return (
    <Modal item={state} onClose={onClose} maxWidth="max-w-lg" render={(s) => <div className="flex flex-col" style={{ maxHeight: '88vh' }}><Content state={s} onClose={onClose} onAcceptPartial={onAcceptPartial} onReject={onReject} /></div>} />
  )
}
