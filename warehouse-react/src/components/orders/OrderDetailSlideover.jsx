import Slideover from '../Slideover'
import Icon from '../Icon'
import { ORD_STATUS_COLORS, ORD_NEXT, initialsOf } from '../../data/warehouseData'

const STEPS = ['pending', 'confirmed', 'packing', 'shipped', 'delivered']
const STEP_LABELS = { pending: 'Order Placed', confirmed: 'Accepted', packing: 'Packing', shipped: 'Shipped', delivered: 'Delivered' }
const STEP_ICONS = { pending: 'hourglass-outline', confirmed: 'checkmark-circle-outline', packing: 'cube-outline', shipped: 'car-outline', delivered: 'checkmark-done-outline' }
const LINE_COLS = '2fr 0.7fr 0.8fr 0.8fr'

function OrdBadge({ status }) {
  const c = ORD_STATUS_COLORS[status] || { cls: 'text-gray-500 bg-gray-100' }
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${c.cls}`}>{status}</span>
}

function Timeline({ o }) {
  const currentIdx = STEPS.indexOf(o.status)
  const timeMap = {}
  ;(o.timeline || []).forEach((t) => { timeMap[t.status] = t.time })
  return (
    <div className="flex items-start gap-0">
      {STEPS.map((s, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
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
            {timeMap[s] && <p className="text-[8px] text-gray-400 mt-0.5">{timeMap[s]}</p>}
          </div>
        )
      })}
    </div>
  )
}

function Content({ o, onClose, onAccept, onReject, onAdvance }) {
  const isPaid = o.paymentStatus === 'paid'
  const isCOD = o.payment === 'Cash on Delivery'
  const isRefunded = o.paymentStatus === 'refunded'
  const payBadgeCls = isRefunded ? 'text-brand-red bg-brand-red/10' : isPaid ? 'text-brand-green bg-brand-green/10' : isCOD ? 'text-brand-orange bg-brand-orange/10' : 'text-gray-500 bg-gray-100'
  const units = o.items_detail.reduce((s, l) => s + l.qty, 0)
  const nextFlow = ORD_NEXT[o.status]

  const accept = () => onAccept(o)
  const reject = () => onReject(o)
  const advance = () => onAdvance(o)

  let footer
  if (o.status === 'pending') {
    footer = (
      <>
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Close</button>
        <button onClick={reject} className="flex-1 py-2.5 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-xl text-[13px] font-semibold hover:bg-brand-red/15 transition">Reject</button>
        <button onClick={accept} className="flex-1 py-2.5 bg-brand-green text-white rounded-xl text-[13px] font-semibold hover:bg-brand-green/85 transition flex items-center justify-center gap-1.5">
          <Icon name="checkmark-circle-outline" style={{ fontSize: '15px' }} />Accept Order
        </button>
      </>
    )
  } else if (nextFlow) {
    footer = (
      <>
        <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Close</button>
        <button onClick={advance} className="flex-[2] py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition flex items-center justify-center gap-1.5">
          <Icon name={nextFlow.icon} style={{ fontSize: '15px' }} />{nextFlow.label}
        </button>
      </>
    )
  } else {
    footer = <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition">Close</button>
  }

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

        {o.status !== 'cancelled' ? (
          <div className="bg-white rounded-xl border border-border p-4 mb-4">
            <p className="text-[11px] font-bold text-navy-dark mb-4">Order Progress</p>
            <Timeline o={o} />
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-3 bg-brand-red/5 border border-brand-red/15 rounded-xl mb-4">
            <Icon name="close-circle-outline" style={{ fontSize: '15px', color: '#eb445a', flexShrink: 0 }} />
            <div><p className="text-[12px] font-bold text-brand-red">Order Cancelled</p></div>
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
                  <Icon name="call-outline" style={{ fontSize: '11px', color: '#94a3b8', flexShrink: 0 }} />
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
              {isRefunded ? 'Refunded' : isPaid ? 'Paid' : isCOD && o.paymentStatus === 'collected' ? 'Collected' : isCOD ? 'Pay on Delivery' : 'Pending'}
            </span>
          </div>
          {o.paymentRef && !isCOD ? (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 px-3 py-2 bg-brand-green/5 border border-brand-green/15 rounded-xl">
              <Icon name="shield-checkmark-outline" style={{ fontSize: '13px', color: '#2dd36f', flexShrink: 0 }} />
              <div><p className="text-[10px] font-bold text-brand-green">Payment Verified</p><p className="text-[10px] text-gray-500 font-mono">{o.paymentRef}</p></div>
            </div>
          ) : isCOD && o.paymentStatus === 'collected' ? (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 px-3 py-2 bg-brand-green/5 border border-brand-green/15 rounded-xl">
              <Icon name="checkmark-circle-outline" style={{ fontSize: '13px', color: '#2dd36f', flexShrink: 0 }} />
              <p className="text-[10px] font-bold text-brand-green">Cash collected on delivery</p>
            </div>
          ) : isCOD ? (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 px-3 py-2 bg-brand-orange/5 border border-brand-orange/15 rounded-xl">
              <Icon name="information-circle-outline" style={{ fontSize: '13px', color: '#ff9800', flexShrink: 0 }} />
              <p className="text-[10px] text-brand-orange">Cash to be collected upon delivery. Amount: <strong>Rs.{o.total.toLocaleString()}</strong></p>
            </div>
          ) : null}
        </div>

        {/* Line items */}
        <div className="bg-white rounded-xl border border-border overflow-hidden mb-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-[12px] font-bold text-navy-dark">Order Items</p>
            <span className="text-[10px] font-semibold text-gray-400">{units} units</span>
          </div>
          <div className="grid text-[9px] font-bold text-gray-400 uppercase tracking-[0.07em] px-4 py-2 bg-gray-50/60 border-b border-gray-100" style={{ gridTemplateColumns: LINE_COLS }}>
            <div>Product</div><div className="text-center">Qty</div><div className="text-right">Unit Price</div><div className="text-right">Total</div>
          </div>
          {o.items_detail.map((l, i) => (
            <div key={i} className="grid items-center px-4 py-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-0" style={{ gridTemplateColumns: LINE_COLS }}>
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

      <div className="flex items-center gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-white">{footer}</div>
    </>
  )
}

export default function OrderDetailSlideover({ order, onClose, onAccept, onReject, onAdvance }) {
  return <Slideover item={order} onClose={onClose} width={520} render={(o) => <Content o={o} onClose={onClose} onAccept={onAccept} onReject={onReject} onAdvance={onAdvance} />} />
}
