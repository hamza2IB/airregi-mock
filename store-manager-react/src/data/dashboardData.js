// Store-manager dashboard + online orders data — ported from store-manager-responsive.html.

export const DASH_DATA = {
  today: {
    totalSales: 45200, totalOrders: 128, avgOrder: 353, customers: 94, itemsSold: 412,
    trend: '↑ 12% vs yesterday', trendUp: true,
    pos: { amount: 36750, orders: 105, pct: 82 },
    ec: { amount: 8450, orders: 23, pct: 18 },
    payments: { cash: { amount: 18400, orders: 52, pct: 41 }, card: { amount: 14800, orders: 38, pct: 33 }, qr: { amount: 9600, orders: 30, pct: 21 }, cod: { amount: 2400, orders: 8, pct: 5 } },
    comparison: { subtitle: 'Today vs Yesterday vs Last Week Same Day', col1: { label: 'Today', amount: 45200, orders: 128 }, col2: { label: 'Yesterday', amount: 40350, orders: 114 }, col3: { label: 'Last Thursday', amount: 38900, orders: 108 } },
    periodLabel: 'Jul 23, 2026 · Today',
  },
  week: {
    totalSales: 298500, totalOrders: 842, avgOrder: 355, customers: 614, itemsSold: 2780,
    trend: '↑ 8% vs last week', trendUp: true,
    pos: { amount: 241800, orders: 682, pct: 81 },
    ec: { amount: 56700, orders: 160, pct: 19 },
    payments: { cash: { amount: 119400, orders: 336, pct: 40 }, card: { amount: 101500, orders: 286, pct: 34 }, qr: { amount: 59700, orders: 168, pct: 20 }, cod: { amount: 17900, orders: 52, pct: 6 } },
    comparison: { subtitle: 'This Week vs Last Week vs 2 Weeks Ago', col1: { label: 'This Week', amount: 298500, orders: 842 }, col2: { label: 'Last Week', amount: 276400, orders: 780 }, col3: { label: '2 Weeks Ago', amount: 264200, orders: 746 } },
    periodLabel: 'Jul 17 – Jul 23, 2026 · This Week',
  },
  month: {
    totalSales: 1245000, totalOrders: 3520, avgOrder: 354, customers: 2480, itemsSold: 11600,
    trend: '↑ 15% vs last month', trendUp: true,
    pos: { amount: 1008400, orders: 2850, pct: 81 },
    ec: { amount: 236600, orders: 670, pct: 19 },
    payments: { cash: { amount: 498000, orders: 1408, pct: 40 }, card: { amount: 423300, orders: 1197, pct: 34 }, qr: { amount: 248800, orders: 704, pct: 20 }, cod: { amount: 74900, orders: 211, pct: 6 } },
    comparison: { subtitle: 'This Month vs Last Month vs 2 Months Ago', col1: { label: 'This Month', amount: 1245000, orders: 3520 }, col2: { label: 'Last Month', amount: 1082600, orders: 3060 }, col3: { label: '2 Months Ago', amount: 1018400, orders: 2880 } },
    periodLabel: 'July 2026 · This Month',
  },
  year: {
    totalSales: 14280000, totalOrders: 40320, avgOrder: 354, customers: 18600, itemsSold: 132800,
    trend: '↑ 22% vs last year', trendUp: true,
    pos: { amount: 11567000, orders: 32660, pct: 81 },
    ec: { amount: 2713000, orders: 7660, pct: 19 },
    payments: { cash: { amount: 5712000, orders: 16128, pct: 40 }, card: { amount: 4855000, orders: 13709, pct: 34 }, qr: { amount: 2856000, orders: 8064, pct: 20 }, cod: { amount: 857000, orders: 2419, pct: 6 } },
    comparison: { subtitle: 'This Year vs Last Year vs 2 Years Ago', col1: { label: 'This Year', amount: 14280000, orders: 40320 }, col2: { label: 'Last Year', amount: 11700000, orders: 33060 }, col3: { label: '2 Years Ago', amount: 9840000, orders: 27800 } },
    periodLabel: '2026 · This Year',
  },
}

export const DASH_PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
]

// Online orders assigned to this store (Main Branch fulfilment queue).
const RAW_ORDERS = [
  {
    id: 'ORD-2026-1041', customer: 'Ayesha Malik', phone: '0300-1234567',
    area: 'DHA Phase 5, Lahore', address: 'House 24, Street 5, DHA Phase 5, Lahore',
    date: 'Jul 23, 2026 09:14', payment: 'Cash on Delivery', payStatus: 'unpaid', paymentRef: null,
    delivery: 'Standard (1–2 days)', deliveryFee: 85, status: 'pending',
    timeline: [{ status: 'pending', time: 'Jul 23, 09:14' }],
    items_detail: [
      { name: 'Sunsilk Shampoo', variant: '400ml Blue', sku: 'SS-400-BLU', qty: 2, price: 250 },
      { name: 'Dettol Soap', variant: '75g', sku: 'DT-75-RED', qty: 1, price: 85 },
      { name: 'Head & Shoulders', variant: '200ml', sku: 'HS-200-BLU', qty: 1, price: 310 },
    ],
  },
  {
    id: 'ORD-2026-1039', customer: 'Sara Hussain', phone: '0333-5551234',
    area: 'Model Town, Lahore', address: '265-B, Model Town Extension, Lahore',
    date: 'Jul 23, 2026 08:30', payment: 'EasyPaisa', payStatus: 'paid', paymentRef: 'EP-2026-0723-8830',
    delivery: 'Standard (1–2 days)', deliveryFee: 80, status: 'pending',
    timeline: [{ status: 'pending', time: 'Jul 23, 08:30' }],
    items_detail: [
      { name: 'Milo', variant: '400g', sku: 'ML-400-GRN', qty: 2, price: 310 },
      { name: 'Nescafe Classic', variant: '200g Jar', sku: 'NC-200-RED', qty: 1, price: 1200 },
      { name: 'Lays Chips', variant: 'Magic Masala 28g', sku: 'LY-28-MGM', qty: 3, price: 30 },
    ],
  },
  {
    id: 'ORD-2026-1043', customer: 'Kamran Yousuf', phone: '0345-2223311',
    area: 'Gulshan-e-Iqbal, Karachi', address: 'House 9, Block 6, Gulshan-e-Iqbal, Karachi',
    date: 'Jul 23, 2026 11:20', payment: 'Bank Transfer', payStatus: 'paid', paymentRef: 'MCB-TXN-20260723-7789',
    delivery: 'Standard (1–2 days)', deliveryFee: 90, status: 'pending',
    timeline: [{ status: 'pending', time: 'Jul 23, 11:20' }],
    items_detail: [
      { name: 'Surf Excel', variant: '1kg', sku: 'SE-1KG-WHT', qty: 1, price: 380 },
      { name: 'Oral-B Toothbrush', variant: 'Soft Pack', sku: 'OB-SP-WHT', qty: 2, price: 120 },
      { name: 'Shan Masala', variant: 'Mixed 100g', sku: 'SM-MX-100', qty: 1, price: 70 },
    ],
  },
  {
    id: 'ORD-2026-1040', customer: 'Bilal Ahmed', phone: '0301-9876543',
    area: 'Gulberg III, Lahore', address: 'Flat 3B, Eden Gardens, Gulberg III, Lahore',
    date: 'Jul 23, 2026 08:55', payment: 'JazzCash', payStatus: 'paid', paymentRef: 'JZC-2026-0723-4412',
    delivery: 'Express (Same day)', deliveryFee: 50, status: 'confirmed',
    timeline: [{ status: 'pending', time: 'Jul 23, 08:55' }, { status: 'confirmed', time: 'Jul 23, 09:10' }],
    items_detail: [
      { name: 'Surf Excel', variant: '1kg', sku: 'SE-1KG-WHT', qty: 1, price: 380 },
      { name: 'Ariel Detergent', variant: '2kg', sku: 'AR-2KG-BLU', qty: 1, price: 680 },
    ],
  },
  {
    id: 'ORD-2026-1038', customer: 'Usman Farooq', phone: '0312-7778888',
    area: 'Johar Town, Lahore', address: 'Office 7, IT Tower, Johar Town, Lahore',
    date: 'Jul 22, 2026 17:45', payment: 'Bank Transfer', payStatus: 'paid', paymentRef: 'HBL-TXN-20260722-9921',
    delivery: 'Express (Same day)', deliveryFee: 50, status: 'packing',
    timeline: [{ status: 'pending', time: 'Jul 22, 17:45' }, { status: 'confirmed', time: 'Jul 22, 17:52' }, { status: 'packing', time: 'Jul 22, 18:10' }],
    items_detail: [
      { name: 'Samsung Galaxy', variant: 'A15 Blue', sku: 'SG-A15-BLU', qty: 1, price: 48000 },
    ],
  },
  {
    id: 'ORD-2026-1037', customer: 'Nadia Siddiqui', phone: '0321-4445566',
    area: 'Bahria Town, Karachi', address: 'Precinct 12, Bahria Town, Karachi',
    date: 'Jul 22, 2026 15:10', payment: 'Cash on Delivery', payStatus: 'unpaid', paymentRef: null,
    delivery: 'Standard (1–2 days)', deliveryFee: 100, status: 'shipped',
    timeline: [{ status: 'pending', time: 'Jul 22, 15:10' }, { status: 'confirmed', time: 'Jul 22, 15:22' }, { status: 'packing', time: 'Jul 22, 16:00' }, { status: 'shipped', time: 'Jul 22, 17:30' }],
    items_detail: [
      { name: 'Dettol Soap', variant: '75g', sku: 'DT-75-RED', qty: 2, price: 85 },
      { name: 'Sunsilk Shampoo', variant: '400ml Blue', sku: 'SS-400-BLU', qty: 2, price: 250 },
    ],
  },
]

// Normalise: compute subtotal, total, item count from line items.
export const SM_ORDERS = RAW_ORDERS.map((o) => {
  const subtotal = o.items_detail.reduce((s, l) => s + l.qty * l.price, 0)
  return { ...o, subtotal, total: subtotal + o.deliveryFee, items: o.items_detail.length }
})

export const SM_ORD_STATUS = {
  pending: 'text-brand-orange bg-brand-orange/10',
  confirmed: 'text-brand-blue bg-brand-blue/10',
  packing: 'text-brand-purple bg-brand-purple/10',
  shipped: 'text-brand-blue bg-brand-blue/15',
  delivered: 'text-brand-green bg-brand-green/10',
  cancelled: 'text-brand-red bg-brand-red/10',
}

// Next-step flow used by the detail footer + row advance buttons.
export const SM_ORD_FLOW = {
  confirmed: { label: 'Start Packing', next: 'packing', icon: 'cube-outline', btnCls: 'bg-brand-purple text-white hover:bg-brand-purple/85' },
  packing: { label: 'Mark Shipped', next: 'shipped', icon: 'car-outline', btnCls: 'bg-brand-blue text-white hover:bg-brand-blue/85' },
  shipped: { label: 'Mark Delivered', next: 'delivered', icon: 'checkmark-done-outline', btnCls: 'bg-brand-green text-white hover:bg-brand-green/85' },
}

export const SM_ORD_RANK = { pending: 0, confirmed: 1, packing: 2, shipped: 3, delivered: 4, cancelled: 5 }

// On-hand availability for the online catalog (keyed by order-line SKU) at this store.
// SE-1KG-WHT and OB-SP-WHT are out of stock so accepting an order that contains them
// triggers the partial-accept / refund flow (matches warehouse Main Branch stock).
export const SM_STOCK = {
  'SS-400-BLU': 12,
  'DT-75-RED': 60,
  'HS-200-BLU': 18,
  'ML-400-GRN': 48,
  'NC-200-RED': 5,
  'LY-28-MGM': 200,
  'SE-1KG-WHT': 0,
  'OB-SP-WHT': 0,
  'SM-MX-100': 24,
  'AR-2KG-BLU': 8,
  'SG-A15-BLU': 3,
}

// Check an online order's line items against store stock.
// Returns each line with { available, fulfillable, stockState:'full'|'partial'|'out' }.
export function checkOrderStock(o) {
  return o.items_detail.map((l) => {
    const available = SM_STOCK[l.sku] ?? 0
    const fulfillable = Math.min(l.qty, available)
    let stockState = 'full'
    if (fulfillable === 0) stockState = 'out'
    else if (fulfillable < l.qty) stockState = 'partial'
    return { ...l, available, fulfillable, stockState }
  })
}

export const ORDER_REJECT_REASONS = ['Item out of stock', 'Cannot fulfil delivery area', 'Order details unclear', 'Duplicate order', 'Other']

export const PAY_BADGE = {
  paid: { cls: 'text-brand-green bg-brand-green/10', label: 'Paid' },
  unpaid: { cls: 'text-brand-orange bg-brand-orange/10', label: 'Unpaid' },
  collected: { cls: 'text-brand-green bg-brand-green/10', label: 'Collected' },
  refunded: { cls: 'text-brand-red bg-brand-red/10', label: 'Refunded' },
}

// Compact currency: Rs.1.2M for millions, else grouped.
export const fmtRs = (n) => {
  if (n >= 1000000) return 'Rs.' + (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  return 'Rs.' + n.toLocaleString('en-US')
}

export const initialsOf = (name) => name.split(' ').map((w) => w[0]).join('').toUpperCase()

// Seed a few refunds onto online orders (mirrors the warehouse portal). Refunds hang off
// orders paid by a digital method that were partially accepted / rejected.
export function seedOrderRefunds(orders) {
  const seeds = {
    'ORD-2026-1039': [{ amount: 1200, status: 'pending', reason: 'Partial order — items out of stock', items: [{ name: 'Nescafe Classic — 200g Jar', removedQty: 1, amount: 1200 }], date: 'Jul 23, 2026', refId: null }],
    'ORD-2026-1043': [{ amount: 240, status: 'pending', reason: 'Partial order — items out of stock', items: [{ name: 'Oral-B Toothbrush — Soft Pack', removedQty: 2, amount: 240 }], date: 'Jul 23, 2026', refId: null }],
    'ORD-2026-1040': [{ amount: 680, status: 'processed', reason: 'Partial order — items out of stock', items: [{ name: 'Ariel Detergent — 2kg', removedQty: 1, amount: 680 }], date: 'Jul 22, 2026', refId: 'JZC-REF-20260722-118', processedDate: 'Jul 22, 2026' }],
  }
  return orders.map((o) => (seeds[o.id] ? { ...o, refunds: [...(o.refunds || []), ...seeds[o.id].map((r) => ({ ...r, items: r.items.map((i) => ({ ...i })) }))] } : o))
}
