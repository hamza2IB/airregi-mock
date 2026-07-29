import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { BUSINESSES, PID, unitPrice } from './data/catalog'
import { INITIAL_ORDERS, decorateOrder } from './data/ordersData'
import { useToast } from './components/Toast'

export const DELIVERY_FEE = 199
export const FREE_DELIVERY_OVER = 5000

const TABS = ['home', 'cart', 'pay', 'orders', 'settings']
const FULLSCREEN = ['product-detail', 'order-track', 'checkout', 'order-success']

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const INITIAL_ADDRESSES = [
  { id: 'a1', label: 'Home', name: 'Ayesha Khan', phone: '+92 300 1234567', line: 'House 176-Y, Block L, Gulberg III', city: 'Lahore', def: true },
  { id: 'a2', label: 'Office', name: 'Ayesha Khan', phone: '+92 321 9876543', line: 'Arfa Software Tower, Ferozepur Rd', city: 'Lahore', def: false },
]
const INITIAL_PAYMENTS = [
  { id: 'p1', type: 'JazzCash', detail: 'Wallet · 0300•••4567', icon: 'phone-portrait-outline', color: '#eb445a' },
  { id: 'p2', type: 'EasyPaisa', detail: 'Wallet · 0321•••6543', icon: 'phone-portrait-outline', color: '#2dd36f' },
  { id: 'p3', type: 'Bank Transfer', detail: 'HBL ••••8842', icon: 'business-outline', color: '#3366cc' },
]
const INITIAL_TXNS = [
  { id: 'TXN-4471', bizId: 'alfatah', amount: 2340, method: 'JazzCash', date: 'Jul 26, 3:12 PM' },
  { id: 'TXN-4460', bizId: 'hyperstar', amount: 890, method: 'EasyPaisa', date: 'Jul 24, 6:48 PM' },
]

const INITIAL_ISSUES = [
  { id: 'REQ-2041', orderId: 'EC-1038', biz: 'Khaadi Flagship', color: '#7c4dff', type: 'report', reason: 'Item damaged', note: 'One piece arrived with a small snag near the hem.', date: 'Jul 27', status: 'in_progress' },
  { id: 'REQ-2024', orderId: 'EC-1024', biz: 'Jalal Sons', color: '#1a2d6b', type: 'report', reason: 'Item missing from order', note: '', date: 'Jul 12', status: 'resolved' },
]

export const USER = { name: 'Ayesha Khan', email: 'ayesha.k@gmail.com', phone: '+92 300 1234567', gender: 'Female', dob: '1996-04-12' }

export function AppProvider({ children }) {
  const showToast = useToast()

  const [stack, setStack] = useState([{ page: 'home' }])
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState(['alfatah-0', 'khaadi-1', 'hyperstar-1'])
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES)
  const [payments, setPayments] = useState(INITIAL_PAYMENTS)
  const [myissues, setMyissues] = useState(INITIAL_ISSUES)
  const [payTxns, setPayTxns] = useState(INITIAL_TXNS)
  const [user, setUser] = useState(USER)

  const route = stack[stack.length - 1]
  const activeTab = TABS.includes(route.page) ? route.page : stack.find((r) => TABS.includes(r.page))?.page || 'home'
  const isFullscreen = FULLSCREEN.includes(route.page)

  // ── navigation ──
  const go = useCallback((page, params = {}) => {
    setStack((s) => {
      if (TABS.includes(page)) return [{ page, ...params }]
      if (s[s.length - 1].page === page && JSON.stringify(s[s.length - 1]) === JSON.stringify({ page, ...params })) return s
      return [...s, { page, ...params }]
    })
    window.scrollTo(0, 0)
  }, [])
  const back = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), [])
  const openStore = useCallback((id) => go('store-detail', { storeId: id }), [go])
  const openProduct = useCallback((pid) => go('product-detail', { productId: pid }), [go])
  const openOrderTrack = useCallback((id) => go('order-track', { orderId: id }), [go])
  const openSettings = useCallback((key) => go('settings-detail', { settingsKey: key }), [go])

  // ── cart ──
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart])
  const cartSubtotal = useMemo(() => cart.reduce((s, i) => s + unitPrice(PID[i.pid].p) * i.qty, 0), [cart])

  const addToCart = useCallback((pid, qty = 1) => {
    setCart((c) => {
      const item = c.find((i) => i.pid === pid)
      if (item) return c.map((i) => (i.pid === pid ? { ...i, qty: i.qty + qty } : i))
      return [...c, { pid, qty }]
    })
    const { p } = PID[pid]
    showToast(`Added ${qty} × ${p.name} to cart`)
  }, [showToast])

  const cartStep = useCallback((pid, d) => {
    setCart((c) => c.map((i) => (i.pid === pid ? { ...i, qty: i.qty + d } : i)).filter((i) => i.qty > 0))
  }, [])
  const removeCartItem = useCallback((pid) => setCart((c) => c.filter((i) => i.pid !== pid)), [])

  // ── wishlist ──
  const isWished = useCallback((pid) => wishlist.includes(pid), [wishlist])
  const toggleWishlist = useCallback((pid) => {
    setWishlist((w) => {
      if (w.includes(pid)) { showToast('Removed from wishlist'); return w.filter((x) => x !== pid) }
      showToast('Added to wishlist'); return [...w, pid]
    })
  }, [showToast])

  // ── orders ──
  const nextOrderSeq = useCallback(() => {
    let max = 1000
    orders.forEach((o) => { const n = parseInt((o.id || '').replace(/\D/g, ''), 10); if (!isNaN(n) && n > max) max = n })
    return max + 1
  }, [orders])

  const placeOrder = useCallback(() => {
    const groups = {}
    cart.forEach((i) => { const { b } = PID[i.pid]; (groups[b.id] = groups[b.id] || { bizId: b.id, lines: [] }).lines.push({ pid: i.pid, qty: i.qty }) })
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    let seq = nextOrderSeq()
    const created = Object.values(groups).map((g) => decorateOrder({ id: 'EC-' + seq++, bizId: g.bizId, status: 'Confirmed', date, lines: g.lines }))
    setOrders((o) => [...created, ...o])
    setCart([])
    return created.map((o) => o.id)
  }, [cart, nextOrderSeq])

  const cancelOrder = useCallback((id, reason) => {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: 'Cancelled' } : o)))
    const o = orders.find((x) => x.id === id)
    addMyIssue('cancellation', reason, '', o)
    showToast('Order ' + id + ' cancelled')
  }, [orders, showToast]) // eslint-disable-line

  // ── customer requests (problems / returns / cancellations) ──
  const addMyIssue = useCallback((kind, reason, note, order) => {
    setMyissues((m) => [{
      id: 'REQ-' + (Math.floor(Math.random() * 9000) + 1000),
      orderId: order ? order.id : '', biz: order ? order.biz : '', color: order ? order.color : '#1a2d6b',
      type: kind, reason, note: note || '', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), status: 'open',
    }, ...m])
  }, [])

  // ── addresses ──
  const saveAddress = useCallback((data, id) => {
    if (id) {
      setAddresses((as) => as.map((a) => (a.id === id ? { ...a, ...data } : a)))
      return id
    }
    const newId = 'a' + Date.now()
    setAddresses((as) => [...as, { id: newId, def: as.length === 0, ...data }])
    return newId
  }, [])
  const deleteAddress = useCallback((id) => {
    setAddresses((as) => {
      const wasDef = as.find((a) => a.id === id)?.def
      const next = as.filter((a) => a.id !== id)
      if (wasDef && next[0]) next[0] = { ...next[0], def: true }
      return next
    })
    showToast('Address removed')
  }, [showToast])
  const setDefaultAddress = useCallback((id) => {
    setAddresses((as) => as.map((a) => ({ ...a, def: a.id === id })))
    showToast('Default address updated')
  }, [showToast])

  // ── payments ──
  const addPayment = useCallback((pm) => setPayments((ps) => [...ps, { id: 'p' + Date.now(), ...pm }]), [])
  const removePayment = useCallback((id) => { setPayments((ps) => ps.filter((p) => p.id !== id)); showToast('Payment method removed') }, [showToast])

  // ── in-store QR payments ──
  const addPayTxn = useCallback((txn) => setPayTxns((t) => [txn, ...t]), [])

  const value = {
    // nav
    route, activeTab, isFullscreen, go, back, openStore, openProduct, openOrderTrack, openSettings,
    // data
    cart, cartCount, cartSubtotal, wishlist, orders, addresses, payments, myissues, payTxns, user, setUser,
    // actions
    addToCart, cartStep, removeCartItem, isWished, toggleWishlist,
    placeOrder, cancelOrder, addMyIssue,
    saveAddress, deleteAddress, setDefaultAddress, addPayment, removePayment, addPayTxn,
    showToast,
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
