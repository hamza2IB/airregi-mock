import Slideover from '../Slideover'
import Icon from '../Icon'
import { initialsOf } from '../../data/warehouseData'

const LINE_COLS = '2fr 0.7fr 0.8fr 0.8fr'

function Content({ entry, onClose, onProcess }) {
  const { order: o, refund: r } = entry
  const isPending = r.status === 'pending'
  // Full rejection vs partial fulfilment.
  const isFull = o.status === 'cancelled' || /reject|cancel/i.test(r.reason || '')
  // The order total is reduced to the retained value on a partial accept, so the
  // customer's original payment = retained total + refunded amount.
  const amountPaid = isFull ? r.amount : o.total + r.amount
  const stillFulfilled = isFull ? 0 : o.total
  const isBank = /bank/i.test(o.payment)
  const payIcon = isBank ? 'card-outline' : 'phone-portrait-outline'
  const units = (r.items || []).reduce((s, l) => s + (l.removedQty || 0), 0)

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center shrink-0">
            <Icon name="arrow-undo-outline" className="text-brand-orange" size={20} />
          </div>
          <div>
            <h2 className="text-[16px] font-extrabold text-navy-dark leading-tight">Refund · {o.id}</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">{o.customer} · {(r.items || []).length} item{(r.items || []).length !== 1 ? 's' : ''} affected</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" size={18} style={{ color: '#64748b' }} />
        </button>
      </div>

      <div className="p-6">
        {/* Status row */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${isPending ? 'text-brand-orange bg-brand-orange/10' : 'text-brand-green bg-brand-green/10'}`}>
            <Icon name={isPending ? 'time-outline' : 'checkmark-circle-outline'} size={13} />{isPending ? 'Refund Pending' : 'Refund Processed'}
          </span>
          <p className="text-[11px] text-gray-400">Raised {r.date || '—'}</p>
        </div>

        {/* Scenario banner */}
        <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3 mb-4 border ${isFull ? 'bg-brand-red/5 border-brand-red/15' : 'bg-brand-orange/5 border-brand-orange/15'}`}>
          <Icon name={isFull ? 'close-circle-outline' : 'alert-circle-outline'} size={15} style={{ color: isFull ? '#eb445a' : '#ff9800', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className={`text-[12px] font-bold ${isFull ? 'text-brand-red' : 'text-brand-orange'}`}>{isFull ? 'Order fully rejected' : 'Partially fulfilled order'}</p>
            <p className="text-[11px] text-gray-600 leading-relaxed mt-0.5">{r.reason}{isFull ? ' — the entire payment is refundable.' : ' — out-of-stock items are refunded; the rest of the order is still being fulfilled.'}</p>
          </div>
        </div>

        {/* Refund amount hero */}
        <div className="rounded-2xl overflow-hidden border border-border mb-4">
          <div className="px-5 py-4 bg-brand-red/5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.08em]">Refund Due to Customer</p>
            <p className="text-[28px] font-extrabold text-brand-red leading-none mt-1">Rs.{r.amount.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
            <div className="px-5 py-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.07em]">Amount Paid</p>
              <p className="text-[15px] font-extrabold text-navy-dark mt-0.5">Rs.{amountPaid.toLocaleString()}</p>
            </div>
            <div className="px-5 py-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.07em]">{isFull ? 'Order Status' : 'Still Fulfilled'}</p>
              <p className={`text-[15px] font-extrabold mt-0.5 ${isFull ? 'text-brand-red' : 'text-brand-green'}`}>{isFull ? 'Cancelled' : `Rs.${stillFulfilled.toLocaleString()}`}</p>
            </div>
          </div>
        </div>

        {/* Customer + refund destination */}
        <div className="grid grid-cols-2 gap-3 mb-4 max-md:grid-cols-1">
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.07em] mb-3">Customer</p>
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-full bg-brand-blue/15 flex items-center justify-center text-[11px] font-extrabold text-brand-blue shrink-0">{initialsOf(o.customer)}</div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-navy-dark">{o.customer}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="call-outline" style={{ fontSize: '11px', color: '#94a3b8', flexShrink: 0 }} />
                  <p className="text-[11px] text-gray-500">{o.phone}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.07em] mb-3">Refund To</p>
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center shrink-0">
                <Icon name={payIcon} style={{ fontSize: '15px', color: '#3366cc' }} />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-navy-dark">{o.payment}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">{o.paymentRef || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Refunded items */}
        <div className="bg-white rounded-xl border border-border overflow-hidden mb-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-[12px] font-bold text-navy-dark">Refunded Items</p>
            <span className="text-[10px] font-semibold text-gray-400">{units} unit{units !== 1 ? 's' : ''}</span>
          </div>
          <div className="grid text-[9px] font-bold text-gray-400 uppercase tracking-[0.07em] px-4 py-2 bg-gray-50/60 border-b border-gray-100" style={{ gridTemplateColumns: LINE_COLS }}>
            <div>Product</div><div className="text-center">Qty</div><div className="text-right">Unit Price</div><div className="text-right">Refund</div>
          </div>
          {(r.items || []).map((l, i) => (
            <div key={i} className="grid items-center px-4 py-3 border-b border-gray-100 last:border-0" style={{ gridTemplateColumns: LINE_COLS }}>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-navy-dark truncate">{l.name}</p>
                <p className="text-[10px] text-gray-400">{l.variant} · <span className="font-mono">{l.sku}</span></p>
              </div>
              <p className="text-[11px] text-gray-500 text-center">× {l.removedQty}</p>
              <p className="text-[11px] text-gray-500 text-right">Rs.{(l.unitPrice || 0).toLocaleString()}</p>
              <p className="text-[12px] font-bold text-brand-red text-right">Rs.{(l.amount || 0).toLocaleString()}</p>
            </div>
          ))}
          <div className="px-4 py-3 bg-gray-50/50 border-t border-border flex items-center justify-between">
            <p className="text-[13px] font-bold text-navy-dark">Total Refund</p>
            <p className="text-[15px] font-extrabold text-brand-red">Rs.{r.amount.toLocaleString()}</p>
          </div>
        </div>

        {/* Processed confirmation */}
        {!isPending && (
          <div className="flex items-center gap-2.5 px-4 py-3 bg-brand-green/5 border border-brand-green/15 rounded-xl">
            <Icon name="shield-checkmark-outline" size={15} style={{ color: '#2dd36f', flexShrink: 0 }} />
            <div>
              <p className="text-[11px] font-bold text-brand-green">Refund processed{r.processedDate ? ` · ${r.processedDate}` : ''}</p>
              {r.refId && <p className="text-[10px] text-gray-500 font-mono">Ref: {r.refId}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Footer — refund actions only, no order workflow */}
      <div className="flex items-center gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-white">
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Close</button>
        {isPending && (
          <button onClick={() => onProcess(entry)} className="flex-[2] py-2.5 bg-brand-orange text-white rounded-xl text-[13px] font-semibold hover:bg-brand-orange/85 transition flex items-center justify-center gap-1.5">
            <Icon name="checkmark-circle-outline" size={15} />Process Refund
          </button>
        )}
      </div>
    </>
  )
}

export default function RefundDetailSlideover({ entry, onClose, onProcess }) {
  return <Slideover item={entry} onClose={onClose} width={520} render={(e) => <Content entry={e} onClose={onClose} onProcess={onProcess} />} />
}
