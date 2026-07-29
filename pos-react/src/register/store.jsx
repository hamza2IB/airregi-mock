import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { usePosChannel } from '../shared/posChannel.js'
import { CATALOG, QUICK_ADD, CUSTOMERS, LOYALTY_CONFIG } from '../shared/catalog.js'
import { calcTotals, calcDisplayTotals, getEffectivePrice } from '../shared/totals.js'
import { nextFbrInvoice } from '../shared/fbr.js'

const StoreContext = createContext(null)
export const useStore = () => useContext(StoreContext)

export function StoreProvider({ children }) {
  const [screen, setScreen] = useState('login') // login | main | orders | closeday | help
  const [staff, setStaff] = useState(null)
  const [shiftStartAt, setShiftStartAt] = useState(null)

  const [cart, setCart] = useState([])
  const [customer, setCustomer] = useState(null)
  const [heldSales, setHeldSales] = useState([])
  const [salesHistory, setSalesHistory] = useState([])

  const [gstIncluded, setGstIncluded] = useState(false)
  const [openingBalance, setOpeningBalance] = useState(0)

  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [redeemedPoints, setRedeemedPoints] = useState(0)

  const [modal, setModal] = useState(null) // { type, data }
  const [saleState, setSaleState] = useState('idle') // idle | scanning | qr | success

  const totals = useMemo(
    () => calcTotals(cart, appliedCoupon, redeemedPoints),
    [cart, appliedCoupon, redeemedPoints],
  )
  const display = useMemo(() => calcDisplayTotals(totals, gstIncluded), [totals, gstIncluded])

  const { send } = usePosChannel((type) => {
    if (type === 'v5-pay') completePayment('qr', null)
  })

  // ---- Broadcast to customer display ----
  useEffect(() => {
    send('cart-update', {
      cart, customer,
      count: totals.count, sub: totals.sub, tax: totals.tax, total: totals.total,
      displaySub: display.displaySub, displayTax: display.displayTax, displayTotal: display.displayTotal,
      coupon: appliedCoupon, redeemedPoints, gstIncluded,
    })
  }, [cart, customer, appliedCoupon, redeemedPoints, gstIncluded]) // eslint-disable-line

  useEffect(() => {
    send('customer-update', { customer })
  }, [customer]) // eslint-disable-line

  const notifyState = useCallback((state, extra) => {
    setSaleState(state)
    send('state-change', { state, ...extra })
  }, [send])

  // Idle vs scanning follows cart/customer unless mid-payment/success
  useEffect(() => {
    if (saleState === 'qr' || saleState === 'success') return
    notifyState(cart.length > 0 || customer ? 'scanning' : 'idle')
  }, [cart, customer]) // eslint-disable-line

  // ---- Auth ----
  const login = (s) => {
    setStaff(s)
    setShiftStartAt(new Date())
    setScreen('main')
    setModal({ type: 'opening' })
  }
  const endShift = () => {
    setCart([]); setHeldSales([]); setSalesHistory([]); setAppliedCoupon(null); setRedeemedPoints(0)
    setCustomer(null); setStaff(null); setShiftStartAt(null); setOpeningBalance(0)
    setModal(null); setScreen('login'); notifyState('idle')
  }

  // ---- Cart ----
  const addToCart = (product) => {
    setCart((prev) => {
      const match = product.sku ? (i) => i.sku === product.sku : (i) => !i.sku && i.name === product.name
      if (prev.find(match)) return prev.map((i) => (match(i) ? { ...i, qty: i.qty + 1 } : i))
      return [...prev, { ...product, qty: 1 }]
    })
  }
  const changeQty = (idx, delta) =>
    setCart((prev) => prev.map((it, i) => (i === idx ? { ...it, qty: it.qty + delta } : it)).filter((it) => it.qty > 0))
  const removeItem = (idx) => setCart((prev) => prev.filter((_, i) => i !== idx))

  // ---- Customer ----
  const linkCustomer = (c) => { setCustomer(c); setRedeemedPoints(0) }
  const unlinkCustomer = () => { setCustomer(null); setRedeemedPoints(0) }

  // ---- Hold / resume ----
  const holdSale = () => {
    if (cart.length === 0) return
    const at = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const id = 'H-' + String(heldSales.length + 1).padStart(3, '0')
    setHeldSales((prev) => [...prev, { id, cart: [...cart], customer, at }])
    setCart([]); setCustomer(null); setAppliedCoupon(null); setRedeemedPoints(0)
  }
  const resumeHeld = (idx) => {
    const h = heldSales[idx]; if (!h) return
    setHeldSales((prev) => {
      const next = [...prev]
      if (cart.length > 0) {
        const at = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        next.push({ id: 'H-' + String(prev.length + 1).padStart(3, '0'), cart: [...cart], customer, at })
      }
      return next.filter((_, i) => i !== idx)
    })
    setCart([...h.cart]); setCustomer(h.customer)
  }
  const discardHeld = (idx) => setHeldSales((prev) => prev.filter((_, i) => i !== idx))

  // ---- Sale / receipt ----
  const recordSale = (method) => {
    const eff = calcDisplayTotals(totals, gstIncluded)
    const now = new Date()
    const id = 'TX-' + now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') + '-' + String(Math.floor(Math.random() * 9000) + 1000)
    const tx = {
      id, at: now, total: eff.displayTotal, sub: eff.displaySub, tax: eff.displayTax, method,
      fbrInvoice: nextFbrInvoice(),
      items: cart.reduce((s, i) => s + i.qty, 0),
      products: cart.map((i) => ({ name: i.name, price: i.price, effectivePrice: getEffectivePrice(i), qty: i.qty, img: i.img, icon: i.icon, discount: i.discount || null })),
      customer: customer ? customer.name : null,
      customerUserId: customer ? customer.userId : null,
      customerPhone: customer ? customer.phone : null,
      gstRate: 0.16,
      totalDiscount: totals.totalDiscount,
      coupon: appliedCoupon ? { code: appliedCoupon.code, label: appliedCoupon.label, discount: totals.couponDiscount } : null,
      loyalty: redeemedPoints > 0 ? { pointsUsed: redeemedPoints, discount: totals.pointsDiscount } : null,
      staff: staff ? staff.name : 'Staff',
    }
    setSalesHistory((prev) => [tx, ...prev])
    if (customer && redeemedPoints > 0) customer.loyaltyPoints = Math.max(0, (customer.loyaltyPoints || 0) - redeemedPoints)
    if (customer) customer.loyaltyPoints = (customer.loyaltyPoints || 0) + Math.floor(eff.displayTotal / LOYALTY_CONFIG.earnPerRupees)
    return tx
  }

  const completePayment = (method, cashTendered) => {
    const tx = recordSale(method)
    setModal({ type: 'receipt', data: { tx, method, cashTendered, mode: 'success' } })
    notifyState('success', { txId: tx.id, customerName: customer ? customer.name.split(' ')[0] : null })
  }

  const newSaleAfterReceipt = () => {
    setModal(null)
    setCart([]); setAppliedCoupon(null); setRedeemedPoints(0); setCustomer(null)
    notifyState('idle')
  }

  // ---- Refund ----
  const processRefund = (idx, { selectedItems, reason, type }) => {
    setSalesHistory((prev) => {
      const next = [...prev]
      const tx = { ...next[idx] }
      const orderSubtotal = tx.products.reduce((s, p) => s + (p.effectivePrice || p.price) * p.qty, 0)
      let selectedSubtotal = 0
      const returnedItems = []
      selectedItems.forEach((i) => { const p = tx.products[i]; if (p) { selectedSubtotal += (p.effectivePrice || p.price) * p.qty; returnedItems.push({ ...p }) } })
      const full = selectedItems.length === tx.products.length
      const refundAmount = full ? tx.total : orderSubtotal > 0 ? Math.round((selectedSubtotal / orderSubtotal) * tx.total) : 0
      returnedItems.forEach((r) => { const itemSub = (r.effectivePrice || r.price) * r.qty; r.refundedAmount = orderSubtotal > 0 ? Math.round((itemSub / orderSubtotal) * tx.total) : 0 })
      tx.refunded = full; tx.partialRefund = !full
      tx.refundedAt = new Date(); tx.refundReason = reason; tx.refundType = type
      tx.refundAmount = refundAmount; tx.returnedItems = returnedItems
      next[idx] = tx
      return next
    })
  }

  const value = {
    // state
    screen, setScreen, staff, shiftStartAt,
    cart, customer, heldSales, salesHistory,
    gstIncluded, setGstIncluded, openingBalance, setOpeningBalance,
    appliedCoupon, setAppliedCoupon, redeemedPoints, setRedeemedPoints,
    modal, setModal, saleState, totals, display,
    catalog: CATALOG, quickAdd: QUICK_ADD, customers: CUSTOMERS,
    // actions
    login, endShift, addToCart, changeQty, removeItem,
    linkCustomer, unlinkCustomer, holdSale, resumeHeld, discardHeld,
    completePayment, newSaleAfterReceipt, processRefund, notifyState,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
