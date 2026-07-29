import { useEffect, useRef, useState } from 'react'
import Icon from '../Icon.jsx'
import { usePosChannel } from '../shared/posChannel.js'
import { getEffectivePrice, rs } from '../shared/totals.js'
import { LOYALTY_CONFIG } from '../shared/catalog.js'

// Mirrors the cashier screen. State is driven entirely by broadcast messages:
//   cart-update      → refresh items + totals
//   customer-update  → show/hide loyalty panel
//   state-change     → idle / scanning / success
export default function Display() {
  const [state, setState] = useState('idle') // idle | scanning | success
  const [cartData, setCartData] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [success, setSuccess] = useState(null)
  const successTimer = useRef(null)

  usePosChannel((type, payload) => {
    switch (type) {
      case 'cart-update':
        setCartData(payload)
        break
      case 'customer-update':
        setCustomer(payload.customer)
        break
      case 'state-change':
        if (successTimer.current) { clearTimeout(successTimer.current); successTimer.current = null }
        setState(payload.state)
        if (payload.state === 'success') {
          setSuccess({ txId: payload.txId, name: payload.customerName })
          successTimer.current = setTimeout(() => setState('idle'), 10000)
        }
        break
      default:
        break
    }
  })

  useEffect(() => () => successTimer.current && clearTimeout(successTimer.current), [])

  if (state === 'success') return <SuccessView success={success} amount={cartData?.displayTotal} />
  if (state === 'scanning') return <ScanningView cartData={cartData} customer={customer} />
  return <IdleView />
}

/* ============ IDLE ============ */
function IdleView() {
  return (
    <div className="w-screen h-screen relative overflow-hidden text-white flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg,#0a1535 0%,#1a2d6b 45%,#2a4494 100%)' }}>
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
      <div className="absolute -bottom-40 -left-24 w-[500px] h-[500px] rounded-full bg-white/5" />
      <div className="relative flex flex-col items-center">
        <div className="w-32 h-32 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl mb-8">
          <Icon name="storefront" className="text-navy" size={80} />
        </div>
        <h1 className="text-6xl font-bold tracking-tight">Air Register</h1>
        <p className="text-white/60 text-base mt-4 tracking-[0.3em] uppercase">Shop · Scan · Pay</p>
        <div className="mt-14 flex items-center gap-2 text-white/40" style={{ fontSize: 14 }}>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
          <span>Register ready · Clifton Mart</span>
        </div>
      </div>
    </div>
  )
}

/* ============ SCANNING ============ */
function ScanningView({ cartData, customer }) {
  const cart = cartData?.cart || []
  const sub = cartData?.displaySub ?? 0
  const tax = cartData?.displayTax ?? 0
  const total = cartData?.displayTotal ?? 0
  const count = cartData?.count ?? 0
  const gstMode = cartData?.gstIncluded ? 'incl' : 'excl'
  const totalDiscount = cart.reduce((s, i) => s + (i.price - getEffectivePrice(i)) * i.qty, 0)

  return (
    <div className="w-screen h-screen bg-white flex flex-col">
      <div className="bg-navy text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-brand-green" />
          <p className="font-semibold" style={{ fontSize: 16 }}>Your receipt · live</p>
        </div>
        <p style={{ fontSize: 12 }} className="text-white/60">Clifton Mart · Reg 1</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Receipt-style cart */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-[12px] uppercase tracking-wider text-gray-500 font-semibold">Items</p>
            <p className="text-[12px] text-gray-500">{count} items</p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-3">
            {cart.map((it, i) => {
              const ep = getEffectivePrice(it)
              const hasDiscount = it.discount && ep < it.price
              return (
                <div key={i} className="flex items-center justify-between py-3 border-b border-dashed border-gray-200 last:border-0 cart-item-enter">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={it.img} alt={it.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200 bg-gray-50 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[15px] text-black truncate font-medium">{it.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {hasDiscount ? (
                          <>
                            <span className="text-[12px] text-gray-400 line-through">{rs(it.price)}</span>
                            <span className="text-[12px] text-brand-green font-semibold">{rs(ep)}</span>
                            <span className="text-[12px] text-gray-500">× {it.qty}</span>
                          </>
                        ) : (
                          <span className="text-[12px] text-gray-500">{rs(ep)} × {it.qty}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-[16px] font-bold text-navy whitespace-nowrap ml-3">{rs(ep * it.qty)}</p>
                </div>
              )
            })}
          </div>
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 space-y-1.5 text-[13px]">
            <Line label="Subtotal" value={rs(sub)} />
            {totalDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-brand-green font-medium">Savings</span>
                <span className="font-medium text-brand-green">-{rs(totalDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">
                Tax (16%) <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 font-semibold text-gray-600 ml-1">{gstMode}</span>
              </span>
              <span className="font-medium text-black">{rs(tax)}</span>
            </div>
            <div className="flex justify-between items-baseline border-t-2 border-dashed border-gray-300 pt-3 mt-2">
              <span className="text-[14px] font-bold text-black tracking-wide">TOTAL</span>
              <span className="text-4xl font-bold text-navy">{rs(total)}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-gray-200 flex flex-col shrink-0">
          {customer ? <KnownSidebar customer={customer} /> : <GuestSidebar />}
        </div>
      </div>
    </div>
  )
}

function Line({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-black">{value}</span>
    </div>
  )
}

function GuestSidebar() {
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[11px] text-gray-400 uppercase tracking-[0.2em] font-semibold mb-3">Scan to pay instantly</p>
        <div className="p-4 bg-white border-2 border-navy rounded-2xl shadow-lg mb-4">
          <FakeQr size={160} />
        </div>
        <p className="text-[14px] font-semibold text-black">Open Air Register app</p>
        <p className="text-[12px] text-gray-500 mt-1.5 leading-relaxed">Scan this QR while items are<br />being added — pay instantly!</p>
        <div className="mt-4 flex items-center gap-2 bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span className="text-[11px] font-semibold">Ready to accept payment</span>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <p className="text-[11px] text-gray-400 uppercase tracking-widest text-center mb-2">Also accepted</p>
        <div className="flex items-center justify-center gap-4 text-[12px] text-gray-500">
          <span className="flex items-center gap-1.5"><Icon name="cash-outline" size={18} className="text-brand-green" />Cash</span>
          <span className="flex items-center gap-1.5"><Icon name="card-outline" size={18} className="text-brand-blue" />Card</span>
        </div>
      </div>
    </div>
  )
}

function KnownSidebar({ customer }) {
  const pts = customer.loyaltyPoints || 0
  const ptsValue = Math.round(pts / LOYALTY_CONFIG.redemptionRate)
  const tier = customer.loyaltyTier || 'Member'
  const nextTierPts = LOYALTY_CONFIG.tierThresholds[tier] || 5000
  const pctBar = Math.min(100, Math.round((pts / nextTierPts) * 100))
  const nextName = tier === 'Member' ? 'Silver' : tier === 'Silver' ? 'Gold' : tier === 'Gold' ? 'Platinum' : 'Max'

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-emerald-50 via-white to-white">
      <div className="px-4 pt-5 pb-4 text-center shrink-0 border-b border-gray-100">
        <div className="w-14 h-14 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-2xl shadow-md mx-auto mb-2">
          {customer.initial}
        </div>
        <p className="text-[11px] text-brand-green font-semibold tracking-wide">Assalam-u-Alaikum</p>
        <p className="text-[17px] text-black font-bold mt-1">{customer.name}</p>
        <p className="text-[12px] text-gray-400 mt-0.5">{customer.area || 'Karachi'}</p>
      </div>
      <div className="flex-1 flex flex-col px-4 py-4 gap-3 overflow-hidden">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200/80 rounded-xl px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <Icon name="star" className="text-amber-500 text-lg relative top-[2px]" />
              <span className="text-[22px] font-extrabold text-black">{pts.toLocaleString()}</span>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500 text-white font-bold uppercase tracking-wide">{tier}</span>
          </div>
          <div className="mt-2 h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: pctBar + '%' }} />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[11px] text-gray-500">= <strong className="text-black">{rs(ptsValue)}</strong> value</span>
            <span className="text-[10px] text-amber-600 font-medium">
              {nextName === 'Max' ? '🎉 Max tier!' : `${(nextTierPts - pts).toLocaleString()} to ${nextName}`}
            </span>
          </div>
        </div>
        <div className="bg-brand-green/[.08] border border-brand-green/20 rounded-lg px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-green/15 flex items-center justify-center shrink-0">
            <Icon name="gift-outline" className="text-brand-green text-base" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-black">Redeem points today!</p>
            <p className="text-[10px] text-gray-500">Ask cashier to apply discount</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-2.5 border-t border-gray-100 text-center shrink-0">
        <p className="text-[10px] text-gray-300 tracking-widest">─── Thank you · Clifton Mart ───</p>
      </div>
    </div>
  )
}

/* ============ SUCCESS ============ */
function SuccessView({ success, amount }) {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-brand-green to-emerald-600 flex flex-col items-center justify-center text-white text-center px-8">
      <div className="w-28 h-28 bg-white/15 rounded-full flex items-center justify-center mb-6 pulse-ring">
        <Icon name="checkmark-circle" className="text-8xl" />
      </div>
      <h1 className="text-4xl font-bold">{success?.name ? `Thanks, ${success.name}!` : 'Thank you!'}</h1>
      <p className="text-white/80 mt-3 text-base">Your payment was received</p>
      <div className="mt-7 bg-white/10 rounded-xl px-7 py-4">
        <p className="text-[12px] text-white/60 uppercase tracking-widest">Receipt</p>
        <p className="text-lg font-mono mt-1">#{success?.txId || ''}</p>
      </div>
      {amount != null && (
        <div className="mt-4 bg-white/10 rounded-xl px-7 py-3">
          <p className="text-[12px] text-white/60 uppercase tracking-widest">Amount Paid</p>
          <p className="text-2xl font-bold mt-1">{rs(amount)}</p>
        </div>
      )}
      <p className="text-white/70 text-[12px] mt-6">See you again at Clifton Mart</p>
    </div>
  )
}

/* A decorative fixed QR-looking block (matches the mock's placeholder QR). */
function FakeQr({ size = 160 }) {
  return (
    <svg viewBox="0 0 21 21" style={{ width: size, height: size }} shapeRendering="crispEdges">
      <rect width="21" height="21" fill="#fff" />
      <g fill="#0a1535">
        <rect x="0" y="0" width="7" height="7" /><rect x="1" y="1" width="5" height="5" fill="#fff" /><rect x="2" y="2" width="3" height="3" />
        <rect x="14" y="0" width="7" height="7" /><rect x="15" y="1" width="5" height="5" fill="#fff" /><rect x="16" y="2" width="3" height="3" />
        <rect x="0" y="14" width="7" height="7" /><rect x="1" y="15" width="5" height="5" fill="#fff" /><rect x="2" y="16" width="3" height="3" />
        <rect x="8" y="0" width="1" height="1" /><rect x="10" y="0" width="1" height="1" /><rect x="12" y="0" width="1" height="1" />
        <rect x="9" y="2" width="1" height="1" /><rect x="11" y="2" width="1" height="1" /><rect x="13" y="2" width="1" height="1" />
        <rect x="8" y="4" width="1" height="1" /><rect x="10" y="4" width="1" height="1" /><rect x="12" y="4" width="1" height="1" />
        <rect x="8" y="8" width="1" height="1" /><rect x="10" y="8" width="1" height="1" /><rect x="12" y="8" width="1" height="1" /><rect x="14" y="8" width="1" height="1" /><rect x="16" y="8" width="1" height="1" />
        <rect x="9" y="10" width="1" height="1" /><rect x="11" y="10" width="1" height="1" /><rect x="13" y="10" width="1" height="1" /><rect x="15" y="10" width="1" height="1" />
        <rect x="8" y="12" width="1" height="1" /><rect x="10" y="12" width="1" height="1" /><rect x="12" y="12" width="1" height="1" /><rect x="14" y="12" width="1" height="1" />
      </g>
    </svg>
  )
}
