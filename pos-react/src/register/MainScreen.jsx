import { useMemo, useRef, useState } from 'react'
import { useStore } from './store.jsx'
import { getEffectivePrice } from '../shared/totals.js'
import { LOYALTY_CONFIG } from '../shared/catalog.js'

const rs = (n) => `Rs.${(n || 0).toLocaleString()}`

export default function MainScreen() {
  const s = useStore()
  const {
    staff, shiftStartAt, cart, customer, heldSales, openingBalance,
    gstIncluded, setGstIncluded, appliedCoupon, redeemedPoints,
    totals, display, catalog, quickAdd, setModal, setScreen,
    addToCart, changeQty, removeItem, unlinkCustomer, holdSale, setAppliedCoupon, setRedeemedPoints,
  } = s

  const [query, setQuery] = useState('')
  const [showHeld, setShowHeld] = useState(false)
  const [flash, setFlash] = useState('')
  const scanRef = useRef(null)

  const shiftTime = shiftStartAt
    ? shiftStartAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return [...catalog, ...quickAdd].filter((p) => p.name.toLowerCase().includes(q) || (p.sku && p.sku.includes(q)))
  }, [query, catalog, quickAdd])

  const flashScan = (ok) => { setFlash(ok ? 'ring-2 ring-brand-green' : 'ring-2 ring-brand-red'); setTimeout(() => setFlash(''), 400) }
  const handleScanEnter = () => {
    const q = query.trim(); if (!q) return
    const hit = catalog.find((p) => p.sku === q) || [...catalog, ...quickAdd].find((p) => p.name.toLowerCase().includes(q.toLowerCase()))
    if (hit) { addToCart(hit); flashScan(true) } else flashScan(false)
    setQuery('')
  }
  const addFromSearch = (p) => { addToCart(p); setQuery(''); flashScan(true) }

  const hasItems = cart.length > 0

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-navy text-white px-5 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-[44px] w-[44px] flex items-center justify-center bg-white/10 rounded-md">
            <ion-icon name="storefront" class="text-white" style={{ fontSize: '26px' }}></ion-icon>
          </div>
          <div className="leading-tight">
            <p className="text-[18px] font-semibold">Clifton Mart · Register 1</p>
            <p className="text-[14px] text-white/60 font-normal">Staff: {staff?.name} · Shift started {shiftTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setModal({ type: 'opening' })} className="tap-btn px-4 py-2.5 bg-white/10 rounded-lg text-[15px] hover:bg-white/20 flex items-center gap-2 min-h-[48px]" title="Set Opening Balance">
            <ion-icon name="wallet-outline" style={{ fontSize: '20px' }}></ion-icon> <span>Float: {rs(openingBalance)}</span>
          </button>
          <button onClick={() => setScreen('orders')} className="tap-btn px-4 py-2.5 bg-white/10 rounded-lg text-[15px] hover:bg-white/20 flex items-center gap-2 min-h-[48px]" title="Orders">
            <ion-icon name="receipt-outline" style={{ fontSize: '20px' }}></ion-icon> Orders
          </button>
          <button onClick={() => setScreen('closeday')} className="tap-btn px-4 py-2.5 bg-white/10 rounded-lg text-[15px] hover:bg-white/20 flex items-center gap-2 min-h-[48px]" title="Close Day">
            <ion-icon name="lock-closed-outline" style={{ fontSize: '20px' }}></ion-icon> Close
          </button>
          <button onClick={() => setScreen('help')} className="tap-btn px-4 py-2.5 bg-white/10 rounded-lg text-[15px] hover:bg-white/20 flex items-center gap-2 min-h-[48px]" title="Help & Support">
            <ion-icon name="help-circle-outline" style={{ fontSize: '20px' }}></ion-icon> Help
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT */}
        <div className="flex-1 flex flex-col bg-white border-r border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80">
            <div className="relative">
              <ion-icon name="search-outline" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl"></ion-icon>
              <input ref={scanRef} value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { handleScanEnter(); e.preventDefault() } if (e.key === 'Escape') setQuery('') }}
                placeholder="Scan barcode or search product..." autoComplete="off"
                className={`w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 h-[52px] text-[16px] focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 ${flash}`} />
              {results.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-[60] max-h-[350px] overflow-y-auto">
                  {results.map((p, i) => (
                    <button key={(p.sku || p.name) + i} onClick={() => addFromSearch(p)}
                      className="tap-btn w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 text-left border-b border-gray-50 last:border-0 min-h-[60px]">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg shrink-0 overflow-hidden">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-medium text-black truncate">{p.name}</p>
                        <p className="text-[14px] text-gray-500">{p.sku || 'No barcode'}</p>
                      </div>
                      <span className="text-[16px] font-bold text-navy shrink-0">{rs(p.price)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {showHeld ? (
            <div className="flex-1 overflow-y-auto p-4 pb-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[15px] uppercase text-gray-500 tracking-wider font-semibold">Held Orders</p>
                <button onClick={() => setShowHeld(false)} className="tap-btn text-[15px] text-gray-500 hover:text-black px-3 py-1">Back</button>
              </div>
              <HeldList onClose={() => setShowHeld(false)} />
            </div>
          ) : hasItems ? (
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {cart.map((it, idx) => {
                const ep = getEffectivePrice(it)
                const hasDiscount = it.discount && ep < it.price
                return (
                  <div key={idx} className="bg-gray-50 rounded-xl p-3.5 flex items-center gap-3 border border-gray-100">
                    <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center border border-gray-200 shrink-0 overflow-hidden">
                      <img src={it.img} alt={it.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[16px] font-medium text-black truncate">{it.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {hasDiscount ? (
                          <>
                            <span className="text-[14px] text-gray-400 line-through">{rs(it.price)}</span>
                            <span className="text-[14px] text-brand-green font-semibold">{rs(ep)}</span>
                            <span className="text-[12px] bg-green-100 text-brand-green px-1.5 py-0.5 rounded-full font-medium">{it.discount.label}</span>
                          </>
                        ) : (
                          <span className="text-[14px] text-gray-500">{it.sku || 'NO-BARCODE'} · {rs(it.price)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => changeQty(idx, -1)} className="tap-btn w-11 h-11 text-[20px] text-gray-600 hover:bg-gray-50 flex items-center justify-center font-bold">−</button>
                      <span className="text-[17px] font-semibold w-9 text-center border-x border-gray-200">{it.qty}</span>
                      <button onClick={() => changeQty(idx, +1)} className="tap-btn w-11 h-11 text-[20px] text-gray-600 hover:bg-gray-50 flex items-center justify-center font-bold">+</button>
                    </div>
                    <p className="text-[16px] font-bold text-navy w-24 text-right">{rs(ep * it.qty)}</p>
                    <button onClick={() => removeItem(idx)} className="tap-btn w-11 h-11 rounded-lg bg-red-50 text-brand-red flex items-center justify-center">
                      <ion-icon name="trash-outline" class="text-xl"></ion-icon>
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
              <ion-icon name="cart-outline" class="text-7xl"></ion-icon>
              <p className="text-[16px] mt-3 text-gray-400 font-medium">Scan or tap to add items</p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="w-[370px] bg-gray-50 flex flex-col overflow-hidden shrink-0">
          {/* Customer */}
          <div className="border-b border-gray-100 shrink-0">
            {customer ? (
              <div className="px-4 py-2.5 bg-gradient-to-b from-emerald-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-[16px] shrink-0 shadow-sm">
                    {customer.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-black truncate">{customer.name}</p>
                    <p className="text-[13px] text-gray-500 truncate">{customer.area}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[12px] text-gray-500">
                      <span><strong className="text-black">{customer.visits}</strong> visits</span>
                      <span>·</span>
                      <span>Last <strong className="text-black">{customer.last}</strong></span>
                    </div>
                  </div>
                  <button onClick={unlinkCustomer} className="tap-btn w-9 h-9 rounded-full bg-red-50 text-brand-red flex items-center justify-center" title="Remove">
                    <ion-icon name="close-outline" class="text-lg"></ion-icon>
                  </button>
                </div>
                {(customer.loyaltyPoints || 0) > 0 && (
                  <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ion-icon name="star" class="text-amber-500 text-xl"></ion-icon>
                      <div>
                        <p className="text-[13px] text-gray-600 leading-tight"><strong className="text-black">{(customer.loyaltyPoints || 0).toLocaleString()}</strong> pts · <span className="font-medium text-amber-600">{customer.loyaltyTier || 'Member'}</span></p>
                        <p className="text-[12px] text-gray-400">Rs.{Math.round((customer.loyaltyPoints || 0) / LOYALTY_CONFIG.redemptionRate).toLocaleString()} value</p>
                      </div>
                    </div>
                    <button onClick={() => setModal({ type: 'redeem' })} disabled={(customer.loyaltyPoints || 0) < LOYALTY_CONFIG.minRedeemPoints}
                      className="tap-btn px-3 py-2 bg-amber-500 text-white text-[13px] font-semibold rounded-lg hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400">
                      Redeem
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-4 py-3 bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
                    <ion-icon name="person-outline" class="text-gray-400 text-2xl"></ion-icon>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] text-black font-semibold">Walk-in Customer</p>
                    <p className="text-[13px] text-gray-500">No loyalty account linked</p>
                  </div>
                </div>
                <button onClick={() => setModal({ type: 'customer' })} className="tap-btn w-full h-[50px] text-[15px] text-navy bg-white border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 font-medium flex items-center justify-center gap-2">
                  <ion-icon name="person-add-outline" style={{ fontSize: '22px' }}></ion-icon>
                  Link Customer
                </button>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="px-4 py-3 bg-white border-b border-gray-100 flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-2 text-[15px]">
              <div className="flex justify-between"><span className="text-gray-500">Items</span><span className="font-medium text-black">{totals.count}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium text-black">{rs(display.displaySub)}</span></div>
              {totals.totalDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-brand-green font-medium">Discount</span>
                  <span className="font-medium text-brand-green">-{rs(totals.totalDiscount)}</span>
                </div>
              )}
              {appliedCoupon && totals.couponDiscount > 0 ? (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <ion-icon name="pricetag-outline" class="text-brand-purple text-[16px]"></ion-icon>
                    <span className="text-brand-purple font-medium text-[15px]">{appliedCoupon.code} ({appliedCoupon.label})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-brand-purple">-{rs(totals.couponDiscount)}</span>
                    <button onClick={() => setAppliedCoupon(null)} className="tap-btn w-7 h-7 rounded-full bg-red-50 text-brand-red flex items-center justify-center" title="Remove coupon">
                      <ion-icon name="close-outline" style={{ fontSize: '16px' }}></ion-icon>
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setModal({ type: 'coupon' })} className="tap-btn w-full flex items-center justify-center gap-1.5 py-2.5 text-[15px] text-brand-purple border border-dashed border-purple-300 rounded-lg hover:bg-purple-50 font-medium mt-1">
                  <ion-icon name="pricetag-outline" style={{ fontSize: '18px' }}></ion-icon> Apply Coupon
                </button>
              )}
              {redeemedPoints > 0 && totals.pointsDiscount > 0 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <ion-icon name="star" class="text-amber-500 text-[16px]"></ion-icon>
                    <span className="text-amber-600 font-medium text-[15px]">{redeemedPoints.toLocaleString()} pts redeemed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-amber-600">-{rs(totals.pointsDiscount)}</span>
                    <button onClick={() => setRedeemedPoints(0)} className="tap-btn w-7 h-7 rounded-full bg-red-50 text-brand-red flex items-center justify-center" title="Remove points">
                      <ion-icon name="close-outline" style={{ fontSize: '16px' }}></ion-icon>
                    </button>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center">
                <button onClick={() => setGstIncluded((v) => !v)} className="tap-btn flex items-center gap-1.5 text-gray-500 hover:text-black py-1">
                  <span className="text-[15px]">Tax (16%)</span>
                  <span className="text-[12px] px-2 py-0.5 rounded-full bg-gray-100 font-semibold text-gray-600">{gstIncluded ? 'incl' : 'excl'}</span>
                </button>
                <span className="font-medium text-black">{rs(display.displayTax)}</span>
              </div>
            </div>
          </div>

          {/* Total + actions */}
          <div className="shrink-0 bg-white border-t border-gray-200">
            <div className="px-4 py-3 flex justify-between items-baseline">
              <span className="text-[15px] text-gray-500 font-medium uppercase tracking-wide">Total</span>
              <span className="text-[30px] font-bold text-navy">{rs(display.displayTotal)}</span>
            </div>
            <div className="px-4 pb-4 pt-1 flex flex-col gap-2.5">
              <button disabled={!hasItems} onClick={() => setModal({ type: 'payment' })}
                className="tap-btn w-full h-[56px] bg-navy text-white text-[17px] font-bold rounded-xl flex items-center justify-center gap-2 disabled:bg-navy/30 disabled:text-white/50 shadow-lg shadow-navy/20">
                <ion-icon name="checkmark-circle-outline" style={{ fontSize: '22px' }}></ion-icon>
                <span>Charge {rs(display.displayTotal)}</span>
              </button>
              <button onClick={() => (hasItems ? holdSale() : heldSales.length > 0 && setShowHeld(true))}
                className={`tap-btn w-full h-[48px] text-[15px] rounded-xl flex items-center justify-center gap-2 relative ${heldSales.length > 0
                  ? 'font-semibold text-brand-orange bg-orange-50 border-2 border-brand-orange active:bg-orange-100'
                  : 'font-medium text-gray-600 bg-white border-2 border-gray-200 hover:bg-gray-50 active:bg-gray-100'}`}>
                <ion-icon name="pause-circle-outline" style={{ fontSize: '20px' }}></ion-icon>
                <span>{heldSales.length > 0 ? `Held (${heldSales.length})` : 'Hold Order'}</span>
                {heldSales.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[12px] font-bold w-7 h-7 rounded-full flex items-center justify-center shadow">{heldSales.length}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeldList({ onClose }) {
  const { heldSales, resumeHeld, discardHeld } = useStore()
  if (heldSales.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <ion-icon name="pause-circle-outline" class="text-5xl"></ion-icon>
        <p className="text-[15px] mt-3">No held orders</p>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {heldSales.slice().reverse().map((h, revIdx) => {
        const idx = heldSales.length - 1 - revIdx
        const sub = h.cart.reduce((acc, i) => acc + i.price * i.qty, 0)
        return (
          <div key={h.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-navy text-white text-[13px] font-bold flex items-center justify-center">{idx + 1}</span>
                <span className="text-[15px] font-semibold text-black">{h.customer ? h.customer.name : 'Guest'}</span>
                <span className="text-[14px] text-gray-400">{h.at}</span>
              </div>
              <span className="text-[15px] font-bold text-navy">{rs(sub)}</span>
            </div>
            <div className="px-4 divide-y divide-gray-100">
              {h.cart.map((it, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 overflow-hidden"><img src={it.img} alt={it.name} className="w-full h-full object-cover" /></div>
                  <span className="flex-1 text-[15px] text-gray-700 truncate">{it.name}</span>
                  <span className="text-[14px] text-gray-500">×{it.qty}</span>
                  <span className="text-[15px] font-semibold text-black w-20 text-right">{rs(it.price * it.qty)}</span>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button onClick={() => { discardHeld(idx); if (heldSales.length <= 1) onClose() }} className="tap-btn px-4 py-2.5 text-[14px] text-gray-500 hover:text-brand-red rounded-lg hover:bg-red-50 flex items-center gap-1.5 min-h-[44px]">
                <ion-icon name="trash-outline" style={{ fontSize: '16px' }}></ion-icon> Discard
              </button>
              <button onClick={() => { resumeHeld(idx); onClose() }} className="tap-btn px-4 py-2.5 text-[14px] font-semibold text-white bg-navy rounded-lg flex items-center gap-1.5 min-h-[44px]">
                <ion-icon name="play-outline" style={{ fontSize: '16px' }}></ion-icon> Resume
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
