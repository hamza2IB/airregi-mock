// Pricing math shared by both views. Ported verbatim from dummy/pos-shared.js
// so the cashier and customer screens always compute identical totals.
import { LOYALTY_CONFIG } from './catalog.js'

export function getEffectivePrice(item) {
  if (!item.discount) return item.price
  if (item.discount.type === 'percent') return Math.round(item.price * (1 - item.discount.value / 100))
  if (item.discount.type === 'flat') return Math.max(0, item.price - item.discount.value)
  return item.price
}

export function calcCouponDiscount(coupon, subtotal) {
  if (!coupon) return 0
  if (subtotal < coupon.minOrder) return 0
  if (coupon.type === 'flat') return coupon.value
  if (coupon.type === 'percent') {
    const discount = Math.round(subtotal * (coupon.value / 100))
    return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount
  }
  return 0
}

export function calcTotals(cart, appliedCoupon, redeemedPoints) {
  const count = cart.reduce((s, i) => s + i.qty, 0)
  const sub = cart.reduce((s, i) => s + getEffectivePrice(i) * i.qty, 0)
  const totalDiscount = cart.reduce((s, i) => s + (i.price - getEffectivePrice(i)) * i.qty, 0)
  const couponDiscount = calcCouponDiscount(appliedCoupon, sub)
  const taxableSub = sub - couponDiscount
  const tax = Math.round(taxableSub * 0.16)
  const totalBeforePoints = taxableSub + tax
  const pointsDiscount = redeemedPoints ? Math.round(redeemedPoints / LOYALTY_CONFIG.redemptionRate) : 0
  const total = Math.max(0, totalBeforePoints - pointsDiscount)
  return { count, sub, tax, total, totalDiscount, couponDiscount, pointsDiscount, totalBeforePoints }
}

/**
 * Display values for the current GST mode. In GST-included mode prices already
 * contain 16% GST, so tax is backed out of the coupon-adjusted subtotal.
 */
export function calcDisplayTotals(totals, gstIncluded) {
  const { sub, tax, total, couponDiscount, pointsDiscount } = totals
  if (!gstIncluded) return { displaySub: sub, displayTax: tax, displayTotal: total }
  const afterCoupon = sub - couponDiscount
  const displayTotal = Math.max(0, afterCoupon - pointsDiscount)
  const displayTax = Math.round(afterCoupon - afterCoupon / 1.16)
  return { displaySub: afterCoupon - displayTax, displayTax, displayTotal }
}

export const rs = (n) => `Rs.${(n || 0).toLocaleString()}`
