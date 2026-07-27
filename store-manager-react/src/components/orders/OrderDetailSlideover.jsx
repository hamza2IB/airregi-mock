import Slideover from '../Slideover'
import Icon from '../Icon'
import { SM_ORD_STATUS, SM_ORD_FLOW, initialsOf } from '../../data/dashboardData'

const STEPS = ['pending', 'confirmed', 'packing', 'shipped', 'delivered']
const STEP_LABELS = { pending: 'Placed', confirmed: 'Accepted', packing: 'Packing', shipped: 'Shipped', delivered: 'Delivered' }
const STEP_ICONS = { pending: 'hourglass-outline', confirmed: 'checkmark-circle-outline', packing: 'cube-outline', shipped: 'car-outline', delivered: 'checkmark-done-outline' }
const LINE_COLS = '2fr 0.7fr 0.8fr 0.8fr'

function OrdBadge({ status }) {
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${SM_ORD_STATUS[status] || 'text-gray-500 bg-gray-100'}`}>{status}</span>
}

function Timeline({ o }) {
  const cancelled = o.status === 'cancelled'
  const curIdx = STEPS.indexOf(o.status)
  const tlMap = {}
  ;(o.timeline || []).forEach((t) => (tlMap[t.status] = t.time))
  return (
    <div className="flex items-start gap-0">
      {STEPS.map((s, i) => {
        const done = !cancelled && i < curIdx
        const active = !cancelled && i === curIdx
        const dotBg = done ? 'bg-brand-green' : active ? 'bg-navy' : 'bg-gray-200'
        const dotText = done || active ? 'text-white' : 'text-gray-400'
        const labelCls = active ? 'text-navy-dark font-bold' : done ? 'text-brand-green font-semibold' : 'text-gray-400'
        return (
          <div key={s} className="relative flex-1 flex flex-col items-center text-center">
            {i < STEPS.length - 1 && <div className={`absolute top-3.5 left-[calc(50%+14px)] right-[calc(-50%+14px)] h-0.5 ${done ? 'bg-brand-green' : 'bg-gray-200'}`}></div>}
            <div className={`w-7 h-7 rounded-full ${dotBg} ${dotText} flex items-center justify-center shrink-0 z-10 relative`}>
              <Icon name={done ? 'checkmark-outline' : STEP_ICONS[s]} style={{ fontSize: '12px' }} />
            </div>
            <p className={`text-[9px] ${labelCls} mt-1.5 leading-tight`}>{STEP_LABELS[s]}</p>
            {tlMap[s] && <p className="text-[8px] text-gray-400 mt-0.5">{tlMap[s]}</p>}
          </div>
        )
      })}
    </div>
  )
}

function Body({ o, onClose, onAccept, onReject, onAdvance, onProcessRefund, readOnly }) {
  const isCOD = o.payment === 'Cash on Delivery'
  const isPaid = o.payStatus === 'paid'
  const isRefunded = o.payStatus === 'refunded'
  const payBadgeCls = isPaid ? 'text-brand-green bg-brand-green/10' : isCOD ? 'text-brand-orange bg-brand-orange/10' : 'text-gray-500 bg-gray-100'
  const cancelled = o.status === 'cancelled'
  const units = o.items_detail.reduce((s, l) => s + l.qty, 0)
  const flow = SM_ORD_FLOW[o.status]
  const removed = o.removedItems || []
  const refunds = o.refunds || []
  const cancelledTime = (o.timeline || []).find((t) => t.status === 'cancelled')?.time

  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-white z-10">
        <div>
          <h2 className="text-[16px] font-extrabold text-navy-dark">{o.id}</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">{o.customer} · {o.items_detail.length} items</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 transition">
          <Icon name="close-outline" style={{ fontSize: '18px', color: '#64748b' }} />
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <OrdBadge status={o.status} />
          <p className="text-[11px] text-gray-400">Placed {o.date}</p>
        </div>

        {!cancelled ? (
          <div className="bg-white rounded-xl border border-border p-4 mb-4">
            <p className="text-[11px] font-bold text-navy-dark mb-4">Order Progress</p>
            <Timeline o={o} />
          </div>
        ) : (
          <div className="flex items-start gap-2 px-4 py-3 bg-brand-red/5 border border-brand-red/15 rounded-xl mb-4">
            <Icon name="close-circle-outline" style={{ fontSize: '15px', color: '#eb445a', flexShrink: 0, marginTop: '1px' }} />
            <div>
              <p className="text-[12px] font-bold text-brand-red">Order Cancelled</p>
              {cancelledTime && <p className="text-[11px] text-gray-600 mt-0.5">Cancelled on {cancelledTime}</p>}
            </div>
          </div>
        )}

        {/* Customer + Address */}
        <div className="grid grid-cols-2 gap-3 mb-4 max-md:grid-cols-1">
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.07em] mb-3">Customer</p>
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-full bg-brand-blue/15 flex items-center justify-center text-[11px] font-extrabold text-brand-blue shrink-0">{initialsOf(o.customer)}</div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-navy-dark">{o.customer}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="call-outline" style={{ fontSize: '11px', color: '#94a3b8' }} />
                  <p className="text-[11px] text-gray-500">{o.phone}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.07em] mb-3">Delivery Address</p>
            <div className="flex items-start gap-2">
              <Icon name="location-outline" style={{ fontSize: '14px', color: '#3366cc', flexShrink: 0, marginTop: '1px' }} />
              <div>
                <p className="text-[11px] font-semibold text-navy-dark leading-relaxed">{o.address}</p>
                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Icon name="car-outline" style={{ fontSize: '11px' }} />{o.delivery}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl border border-border p-4 mb-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.07em] mb-3">Payment</p>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isCOD ? 'bg-brand-orange/10' : 'bg-brand-blue/10'}`}>
                <Icon name={isCOD ? 'cash-outline' : 'phone-portrait-outline'} style={{ fontSize: '15px', color: isCOD ? '#ff9800' : '#3366cc' }} />
              </div>
              <div>
                <p className="text-[12px] font-bold text-navy-dark">{o.payment}</p>
                {o.paymentRef ? <p className="text-[10px] text-gray-400 font-mono mt-0.5">Ref: {o.paymentRef}</p> : <p className="text-[10px] text-gray-400 mt-0.5">No reference required</p>}
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${payBadgeCls}`}>
              {isRefunded ? 'Refunded' : isPaid ? 'Paid' : isCOD ? 'Pay on Delivery' : 'Pending'}
            </span>
          </div>
          {o.paymentRef && !isCOD && isPaid ? (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 px-3 py-2 bg-brand-green/5 border border-brand-green/15 rounded-xl">
              <Icon name="shield-checkmark-outline" style={{ fontSize: '13px', color: '#2dd36f', flexShrink: 0 }} />
              <div><p className="text-[10px] font-bold text-brand-green">Payment Verified</p><p className="text-[10px] text-gray-500 font-mono">{o.paymentRef}</p></div>
            </div>
          ) : isCOD ? (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 px-3 py-2 bg-brand-orange/5 border border-brand-orange/15 rounded-xl">
              <Icon name="information-circle-outline" style={{ fontSize: '13px', color: '#ff9800', flexShrink: 0 }} />
              <p className="text-[10px] text-brand-orange">Cash to be collected upon delivery. Amount: <strong>Rs.{o.total.toLocaleString()}</strong></p>
            </div>
          ) : null}
        </div>

        {/* Partial fulfilment notice */}
        {o.partialFulfillment && (
          <div className="flex items-start gap-2.5 bg-brand-orange/5 border border-brand-orange/20 rounded-xl px-4 py-3 mb-4">
            <Icon name="alert-circle-outline" style={{ fontSize: '15px', color: '#ff9800', flexShrink: 0, marginTop: '1px' }} />
            <div>
              <p className="text-[12px] font-bold text-brand-orange">Partially Fulfilled Order</p>
              <p className="text-[11px] text-gray-600 mt-0.5">The following item{removed.length !== 1 ? 's were' : ' was'} removed due to stock unavailability:</p>
              <ul className="mt-1.5 space-y-0.5">
                {removed.map((l, i) => (
                  <li key={i} className="text-[11px] text-gray-500">• {l.name} — {l.removedQty} unit{l.removedQty !== 1 ? 's' : ''} unavailable (Rs.{l.amount.toLocaleString()})</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Refunds & Adjustments */}
        {refunds.length > 0 && (
          <div className="bg-white rounded-xl border border-border overflow-hidden mb-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-[12px] font-bold text-navy-dark">Refunds &amp; Adjustments</p>
            </div>
            {refunds.map((r, idx) => {
              const isPending = r.status === 'pending'
              return (
                <div key={idx} className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isPending ? 'bg-brand-orange/10' : 'bg-brand-green/10'}`}>
                      <Icon name={isPending ? 'time-outline' : 'checkmark-circle-outline'} style={{ fontSize: '15px', color: isPending ? '#ff9800' : '#2dd36f' }} />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-navy-dark">Rs.{r.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400">{r.reason}</p>
                      {r.refId && <p className="text-[10px] text-gray-400 font-mono mt-0.5">Ref: {r.refId}</p>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isPending ? 'text-brand-orange bg-brand-orange/10' : 'text-brand-green bg-brand-green/10'}`}>{isPending ? 'Pending' : 'Processed'}</span>
                    {isPending && onProcessRefund && (
                      <button onClick={() => onProcessRefund(o, r, idx)} className="block mt-1.5 text-[10px] font-semibold text-brand-blue hover:underline">Process Refund →</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Line items */}
        <div className="bg-white rounded-xl border border-border overflow-hidden mb-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-[12px] font-bold text-navy-dark">Order Items {o.partialFulfillment && <span className="text-[10px] font-normal text-gray-400">(after adjustment)</span>}</p>
            <span className="text-[10px] font-semibold text-gray-400">{units} units</span>
          </div>
          <div className="grid text-[9px] font-bold text-gray-400 uppercase tracking-[0.07em] px-4 py-2 bg-gray-50/60 border-b border-gray-100" style={{ gridTemplateColumns: LINE_COLS }}>
            <div>Product</div><div className="text-center">Qty</div><div className="text-right">Unit Price</div><div className="text-right">Total</div>
          </div>
          {o.items_detail.map((l, i) => (
            <div key={i} className="grid items-center px-4 py-3 border-b border-gray-100 last:border-0" style={{ gridTemplateColumns: LINE_COLS }}>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-navy-dark truncate">{l.name}</p>
                <p className="text-[10px] text-gray-400">{l.variant} · <span className="font-mono">{l.sku}</span></p>
              </div>
              <p className="text-[11px] text-gray-500 text-center">× {l.qty}</p>
              <p className="text-[11px] text-gray-500 text-right">Rs.{l.price.toLocaleString()}</p>
              <p className="text-[12px] font-bold text-navy-dark text-right">Rs.{(l.price * l.qty).toLocaleString()}</p>
            </div>
          ))}
          <div className="px-4 pt-3 pb-3 bg-gray-50/50 border-t border-border space-y-1.5">
            <div className="flex items-center justify-between"><p className="text-[11px] text-gray-500">Subtotal</p><p className="text-[11px] font-semibold text-navy-dark">Rs.{o.subtotal.toLocaleString()}</p></div>
            <div className="flex items-center justify-between"><p className="text-[11px] text-gray-500">Delivery Fee</p><p className="text-[11px] font-semibold text-navy-dark">Rs.{o.deliveryFee.toLocaleString()}</p></div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-1"><p className="text-[13px] font-bold text-navy-dark">Total</p><p className="text-[15px] font-extrabold text-navy-dark">Rs.{o.total.toLocaleString()}</p></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-white">
        {readOnly ? (
          (() => {
            const pendingIdx = refunds.findIndex((r) => r.status === 'pending')
            return (
              <>
                <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Close</button>
                {pendingIdx !== -1 && onProcessRefund && (
                  <button onClick={() => onProcessRefund(o, refunds[pendingIdx], pendingIdx)} className="flex-[2] py-2.5 bg-brand-orange text-white rounded-xl text-[13px] font-semibold hover:bg-brand-orange/85 transition flex items-center justify-center gap-1.5">
                    <Icon name="cash-outline" style={{ fontSize: '15px' }} />Process Refund
                  </button>
                )}
              </>
            )
          })()
        ) : o.status === 'pending' ? (
          <>
            <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Close</button>
            <button onClick={() => onReject(o)} className="flex-1 py-2.5 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-xl text-[13px] font-semibold hover:bg-brand-red/15 transition">Reject</button>
            <button onClick={() => onAccept(o)} className="flex-1 py-2.5 bg-brand-green text-white rounded-xl text-[13px] font-semibold hover:bg-brand-green/85 transition flex items-center justify-center gap-1.5">
              <Icon name="checkmark-circle-outline" style={{ fontSize: '15px' }} />Accept
            </button>
          </>
        ) : flow ? (
          <>
            <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Close</button>
            <button onClick={() => onAdvance(o)} className={`flex-[2] py-2.5 ${flow.btnCls} rounded-xl text-[13px] font-semibold transition flex items-center justify-center gap-1.5`}>
              <Icon name={flow.icon} style={{ fontSize: '15px' }} />{flow.label}
            </button>
          </>
        ) : (
          <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Close</button>
        )}
      </div>
    </>
  )
}

export default function OrderDetailSlideover({ order, onClose, onAccept, onReject, onAdvance, onProcessRefund, readOnly }) {
  return <Slideover item={order} onClose={onClose} width={560} render={(o) => <Body o={o} onClose={onClose} onAccept={onAccept} onReject={onReject} onAdvance={onAdvance} onProcessRefund={onProcessRefund} readOnly={readOnly} />} />
}
