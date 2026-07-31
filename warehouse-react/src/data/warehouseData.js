// Warehouse Manager mock data — ported from warehouse-manager-responsive.html.

export const STORE_META = {
  'Al Fatah Main Branch': { code: 'RS-001', color: '#1a2d6b' },
  'Al Fatah DHA Branch': { code: 'RS-002', color: '#3366cc' },
  'Al Fatah Johar Town': { code: 'RS-003', color: '#7c4dff' },
  'Al Fatah Model Town': { code: 'RS-004', color: '#2dd36f' },
  'Central Warehouse': { code: 'WH-001', color: '#0891b2' },
}

export const storeMeta = (name) => STORE_META[name] || { code: 'RS-???', color: '#94a3b8' }
export const storeInitial = (name) => name.charAt(0).toUpperCase()
export const initialsOf = (name) => name.split(' ').map((w) => w[0]).join('').toUpperCase()

export const TRANSFER_STATUS = {
  pending: 'text-brand-purple bg-brand-purple/10',
  dispatched: 'text-brand-orange bg-brand-orange/10',
  received: 'text-brand-green bg-brand-green/10',
  rejected: 'text-brand-red bg-brand-red/10',
}

export const TRANSFER_DATA = [
  { id: 'TR-2026-053', dir: 'in', store: 'Al Fatah DHA Branch', date: 'Jul 20, 2026', items: 4, units: 88, status: 'pending', urgent: true, requestedBy: 'Sara Ahmed', approvedBy: null, rejectedBy: null, rejectReason: null },
  { id: 'TR-2026-052', dir: 'in', store: 'Al Fatah Johar Town', date: 'Jul 20, 2026', items: 2, units: 40, status: 'pending', urgent: false, requestedBy: 'Usman Ali', approvedBy: null, rejectedBy: null, rejectReason: null },
  { id: 'TR-2026-051', dir: 'in', store: 'Al Fatah Main Branch', date: 'Jul 19, 2026', items: 6, units: 144, status: 'pending', urgent: true, requestedBy: 'Nadia Hasan', approvedBy: null, rejectedBy: null, rejectReason: null },
  { id: 'TR-2026-050', dir: 'in', store: 'Al Fatah Model Town', date: 'Jul 18, 2026', items: 3, units: 60, status: 'pending', urgent: false, requestedBy: 'Bilal Siddiqui', approvedBy: null, rejectedBy: null, rejectReason: null },
  { id: 'TR-2026-049', dir: 'in', store: 'Al Fatah DHA Branch', date: 'Jul 17, 2026', items: 5, units: 100, status: 'pending', urgent: false, requestedBy: 'Sara Ahmed', approvedBy: null, rejectedBy: null, rejectReason: null },
  { id: 'TR-2026-048', dir: 'in', store: 'Al Fatah Main Branch', date: 'Jul 16, 2026', items: 8, units: 210, status: 'dispatched', urgent: false, requestedBy: 'Nadia Hasan', approvedBy: 'Zain Khan', rejectedBy: null, rejectReason: null },
  { id: 'TR-2026-047', dir: 'in', store: 'Al Fatah Johar Town', date: 'Jul 14, 2026', items: 3, units: 72, status: 'dispatched', urgent: false, requestedBy: 'Usman Ali', approvedBy: 'Zain Khan', rejectedBy: null, rejectReason: null },
  { id: 'TR-2026-046', dir: 'in', store: 'Al Fatah Model Town', date: 'Jul 12, 2026', items: 2, units: 44, status: 'dispatched', urgent: false, requestedBy: 'Bilal Siddiqui', approvedBy: 'Zain Khan', rejectedBy: null, rejectReason: null },
  { id: 'TR-2026-045', dir: 'in', store: 'Al Fatah DHA Branch', date: 'Jul 10, 2026', items: 7, units: 180, status: 'received', urgent: false, requestedBy: 'Sara Ahmed', approvedBy: 'Zain Khan', rejectedBy: null, rejectReason: null },
  { id: 'TR-2026-044', dir: 'in', store: 'Al Fatah Main Branch', date: 'Jul 8, 2026', items: 4, units: 96, status: 'received', urgent: false, requestedBy: 'Nadia Hasan', approvedBy: 'Zain Khan', rejectedBy: null, rejectReason: null },
  { id: 'TR-2026-043', dir: 'in', store: 'Al Fatah Johar Town', date: 'Jul 6, 2026', items: 9, units: 240, status: 'rejected', urgent: false, requestedBy: 'Usman Ali', approvedBy: null, rejectedBy: 'Zain Khan', rejectReason: 'Insufficient stock available' },
  { id: 'TR-2026-042', dir: 'out', store: 'Central Warehouse', fulfilledBy: 'Al Fatah DHA Branch', date: 'Jul 20, 2026', items: 3, units: 72, status: 'dispatched', urgent: false, requestedBy: 'Zain Khan', approvedBy: 'Sara Ahmed', rejectedBy: null, rejectReason: null, dispatchedOn: 'Jul 20, 2026' },
  { id: 'TR-2026-041', dir: 'out', store: 'Central Warehouse', fulfilledBy: 'Al Fatah Model Town', date: 'Jul 18, 2026', items: 2, units: 50, status: 'pending', urgent: true, requestedBy: 'Zain Khan', approvedBy: null, rejectedBy: null, rejectReason: null },
  { id: 'TR-2026-039', dir: 'out', store: 'Central Warehouse', fulfilledBy: 'Al Fatah Johar Town', date: 'Jul 11, 2026', items: 4, units: 110, status: 'received', urgent: false, requestedBy: 'Zain Khan', approvedBy: 'Usman Ali', rejectedBy: null, rejectReason: null, dispatchedOn: 'Jul 11, 2026', receivedOn: 'Jul 13, 2026' },
  { id: 'TR-2026-037', dir: 'out', store: 'Central Warehouse', fulfilledBy: 'Al Fatah Main Branch', date: 'Jul 7, 2026', items: 5, units: 130, status: 'received', urgent: false, requestedBy: 'Zain Khan', approvedBy: 'Nadia Hasan', rejectedBy: null, rejectReason: null, dispatchedOn: 'Jul 7, 2026', receivedOn: 'Jul 9, 2026' },
]

export const ORD_STATUS_COLORS = {
  pending: { cls: 'text-brand-orange bg-brand-orange/10', icon: 'hourglass-outline' },
  confirmed: { cls: 'text-brand-blue bg-brand-blue/10', icon: 'checkmark-circle-outline' },
  packing: { cls: 'text-brand-purple bg-brand-purple/10', icon: 'cube-outline' },
  shipped: { cls: 'text-brand-blue bg-brand-blue/15', icon: 'car-outline' },
  delivered: { cls: 'text-brand-green bg-brand-green/10', icon: 'checkmark-done-outline' },
  cancelled: { cls: 'text-brand-red bg-brand-red/10', icon: 'close-circle-outline' },
}

// What action comes next per order status.
export const ORD_NEXT = {
  confirmed: { label: 'Start Packing', next: 'packing', icon: 'cube-outline' },
  packing: { label: 'Mark Shipped', next: 'shipped', icon: 'car-outline' },
  shipped: { label: 'Mark Delivered', next: 'delivered', icon: 'checkmark-done-outline' },
}

export const PAY_STATUS = {
  paid: { cls: 'text-brand-green bg-brand-green/10', label: 'Paid' },
  unpaid: { cls: 'text-brand-orange bg-brand-orange/10', label: 'Unpaid' },
  collected: { cls: 'text-brand-green bg-brand-green/10', label: 'Collected' },
  refunded: { cls: 'text-brand-red bg-brand-red/10', label: 'Refunded' },
}

export const ORDER_DATA = [
  { id: 'ORD-2026-1043', customer: 'Imran Qureshi', phone: '0302-3344556', address: 'House 88, Street 12, Bahria Town Phase 4, Rawalpindi', area: 'Bahria Town, Rawalpindi', date: 'Jul 21, 2026 10:30', payment: 'JazzCash', paymentStatus: 'paid', paymentRef: 'JZC-2026-0721-5501', delivery: 'Standard (1–2 days)', subtotal: 1010, deliveryFee: 50, total: 1060, status: 'pending', timeline: [{ status: 'pending', time: 'Jul 21, 10:30' }], items_detail: [{ name: 'Surf Excel', variant: '1kg', sku: 'SE-1KG-WHT', qty: 2, price: 380 }, { name: 'Sunsilk Shampoo', variant: '400ml Blue', sku: 'SS-400-BLU', qty: 1, price: 250 }] },
  { id: 'ORD-2026-1042', customer: 'Mehwish Iqbal', phone: '0345-1122334', address: 'Flat 5, Askari 11, Lahore', area: 'Askari, Lahore', date: 'Jul 21, 2026 09:50', payment: 'EasyPaisa', paymentStatus: 'paid', paymentRef: 'EP-2026-0721-9012', delivery: 'Express (Same day)', subtotal: 980, deliveryFee: 50, total: 1030, status: 'pending', timeline: [{ status: 'pending', time: 'Jul 21, 09:50' }], items_detail: [{ name: 'Oral-B Toothbrush', variant: 'Soft Pack', sku: 'OB-SP-WHT', qty: 3, price: 120 }, { name: 'Milo', variant: '400g', sku: 'ML-400-GRN', qty: 2, price: 310 }] },
  { id: 'ORD-2026-1041', customer: 'Ayesha Malik', phone: '0300-1234567', address: 'House 24, Street 5, DHA Phase 5, Lahore', area: 'DHA Phase 5, Lahore', date: 'Jul 21, 2026 09:14', payment: 'Cash on Delivery', paymentStatus: 'unpaid', paymentRef: null, delivery: 'Standard (1–2 days)', subtotal: 1335, deliveryFee: 85, total: 1420, status: 'pending', timeline: [{ status: 'pending', time: 'Jul 21, 09:14' }], items_detail: [{ name: 'Sunsilk Shampoo', variant: '400ml Blue', sku: 'SS-400-BLU', qty: 2, price: 250 }, { name: 'Dettol Soap', variant: '75g', sku: 'DT-75-RED', qty: 1, price: 85 }, { name: 'Head & Shoulders', variant: '200ml', sku: 'HS-200-BLU', qty: 1, price: 310 }] },
  { id: 'ORD-2026-1040', customer: 'Bilal Ahmed', phone: '0301-9876543', address: 'Flat 3B, Eden Gardens, Gulberg III, Lahore', area: 'Gulberg III, Lahore', date: 'Jul 21, 2026 08:55', payment: 'JazzCash', paymentStatus: 'paid', paymentRef: 'JZC-2026-0721-4412', delivery: 'Express (Same day)', subtotal: 570, deliveryFee: 50, total: 620, status: 'confirmed', timeline: [{ status: 'pending', time: 'Jul 21, 08:55' }, { status: 'confirmed', time: 'Jul 21, 09:10' }], items_detail: [{ name: 'Surf Excel', variant: '1kg', sku: 'SE-1KG-WHT', qty: 1, price: 380 }, { name: 'Ariel Detergent', variant: '2kg', sku: 'AR-2KG-BLU', qty: 1, price: 680 }] },
  { id: 'ORD-2026-1039', customer: 'Sara Hussain', phone: '0333-5551234', address: '265-B, Model Town Extension, Lahore', area: 'Model Town, Lahore', date: 'Jul 21, 2026 08:30', payment: 'EasyPaisa', paymentStatus: 'paid', paymentRef: 'EP-2026-0721-8830', delivery: 'Standard (1–2 days)', subtotal: 2100, deliveryFee: 80, total: 2180, status: 'packing', timeline: [{ status: 'pending', time: 'Jul 21, 08:30' }, { status: 'confirmed', time: 'Jul 21, 08:45' }, { status: 'packing', time: 'Jul 21, 09:00' }], items_detail: [{ name: 'Milo', variant: '400g', sku: 'ML-400-GRN', qty: 2, price: 310 }, { name: 'Nescafe Classic', variant: '200g Jar', sku: 'NC-200-RED', qty: 1, price: 1200 }, { name: 'Lays Chips', variant: 'Magic Masala 28g', sku: 'LY-28-MGM', qty: 3, price: 30 }] },
  { id: 'ORD-2026-1038', customer: 'Usman Farooq', phone: '0312-7778888', address: 'Office 7, IT Tower, Johar Town, Lahore', area: 'Johar Town, Lahore', date: 'Jul 20, 2026 17:45', payment: 'Bank Transfer', paymentStatus: 'paid', paymentRef: 'HBL-TXN-20260720-9921', delivery: 'Express (Same day)', subtotal: 47950, deliveryFee: 50, total: 48000, status: 'packing', timeline: [{ status: 'pending', time: 'Jul 20, 17:45' }, { status: 'confirmed', time: 'Jul 20, 17:52' }, { status: 'packing', time: 'Jul 20, 18:10' }], items_detail: [{ name: 'Samsung Galaxy', variant: 'A15 Blue', sku: 'SG-A15-BLU', qty: 1, price: 48000 }] },
  { id: 'ORD-2026-1037', customer: 'Nadia Siddiqui', phone: '0321-4445566', address: 'Precinct 12, Bahria Town, Karachi', area: 'Bahria Town, Karachi', date: 'Jul 20, 2026 15:10', payment: 'Cash on Delivery', paymentStatus: 'unpaid', paymentRef: null, delivery: 'Standard (1–2 days)', subtotal: 760, deliveryFee: 100, total: 860, status: 'shipped', timeline: [{ status: 'pending', time: 'Jul 20, 15:10' }, { status: 'confirmed', time: 'Jul 20, 15:22' }, { status: 'packing', time: 'Jul 20, 16:00' }, { status: 'shipped', time: 'Jul 20, 17:30' }], items_detail: [{ name: 'Dettol Soap', variant: '75g', sku: 'DT-75-RED', qty: 2, price: 85 }, { name: 'Sunsilk Shampoo', variant: '400ml Blue', sku: 'SS-400-BLU', qty: 2, price: 250 }] },
  { id: 'ORD-2026-1036', customer: 'Hamza Khan', phone: '0345-6667777', address: 'Flat 8, Sea View Apartments, Clifton Block 9, Karachi', area: 'Clifton, Karachi', date: 'Jul 20, 2026 13:22', payment: 'JazzCash', paymentStatus: 'paid', paymentRef: 'JZC-2026-0720-3305', delivery: 'Standard (1–2 days)', subtotal: 1410, deliveryFee: 100, total: 1510, status: 'shipped', timeline: [{ status: 'pending', time: 'Jul 20, 13:22' }, { status: 'confirmed', time: 'Jul 20, 13:35' }, { status: 'packing', time: 'Jul 20, 14:15' }, { status: 'shipped', time: 'Jul 20, 15:45' }], items_detail: [{ name: 'Nestle Milkpak', variant: '1L Tetra', sku: 'MK-1L-WHT', qty: 4, price: 180 }, { name: 'Milo', variant: '400g', sku: 'ML-400-GRN', qty: 3, price: 310 }] },
  { id: 'ORD-2026-1035', customer: 'Fatima Zafar', phone: '0311-2223344', address: 'House 14, Street 30, F-7/1, Islamabad', area: 'F-7, Islamabad', date: 'Jul 20, 2026 11:05', payment: 'EasyPaisa', paymentStatus: 'paid', paymentRef: 'EP-2026-0720-7741', delivery: 'Standard (1–2 days)', subtotal: 640, deliveryFee: 60, total: 700, status: 'delivered', timeline: [{ status: 'pending', time: 'Jul 20, 11:05' }, { status: 'confirmed', time: 'Jul 20, 11:18' }, { status: 'packing', time: 'Jul 20, 12:00' }, { status: 'shipped', time: 'Jul 20, 14:00' }, { status: 'delivered', time: 'Jul 21, 10:30' }], items_detail: [{ name: 'Shan Masala', variant: 'Mixed 100g', sku: 'SM-MX-100', qty: 5, price: 70 }, { name: 'Oral-B Toothbrush', variant: 'Soft Pack', sku: 'OB-SP-WHT', qty: 3, price: 120 }] },
  { id: 'ORD-2026-1034', customer: 'Tariq Mehmood', phone: '0300-8889990', address: '56-C, Cavalry Ground, Lahore Cantt', area: 'Lahore Cantt', date: 'Jul 19, 2026 16:40', payment: 'Cash on Delivery', paymentStatus: 'collected', paymentRef: null, delivery: 'Standard (1–2 days)', subtotal: 330, deliveryFee: 50, total: 380, status: 'delivered', timeline: [{ status: 'pending', time: 'Jul 19, 16:40' }, { status: 'confirmed', time: 'Jul 19, 16:55' }, { status: 'packing', time: 'Jul 19, 17:30' }, { status: 'shipped', time: 'Jul 20, 09:00' }, { status: 'delivered', time: 'Jul 20, 15:20' }], items_detail: [{ name: 'Surf Excel', variant: '1kg', sku: 'SE-1KG-WHT', qty: 1, price: 380 }] },
]

export const WH_NAME = 'Central Warehouse'
export const WH_MANAGER = 'Zain Khan'

// Transfer status → detail badge styling + label ("In Transit" for dispatched).
export const TR_STATUS = {
  pending: { cls: 'text-brand-purple bg-brand-purple/10', icon: 'hourglass-outline', label: 'Pending' },
  dispatched: { cls: 'text-brand-orange bg-brand-orange/10', icon: 'cube-outline', label: 'In Transit' },
  received: { cls: 'text-brand-green bg-brand-green/10', icon: 'checkmark-done-outline', label: 'Received' },
  rejected: { cls: 'text-brand-red bg-brand-red/10', icon: 'close-circle-outline', label: 'Rejected' },
  cancelled: { cls: 'text-gray-500 bg-gray-100', icon: 'close-outline', label: 'Cancelled' },
}

export const INV_DATA = [
  { name: 'Sunsilk Shampoo', variant: '400ml Blue', sku: 'SS-400-BLU', cat: 'Hair Care', price: 250, onHand: 248, reserved: 40, reorder: 100, batch: true },
  { name: 'Surf Excel', variant: '1kg', sku: 'SE-1KG-WHT', cat: 'Cleaning', price: 380, onHand: 0, reserved: 0, reorder: 200, batch: false },
  { name: 'Milo', variant: '400g', sku: 'ML-400-GRN', cat: 'Beverages', price: 310, onHand: 72, reserved: 20, reorder: 150, batch: true },
  { name: 'Nestle Milkpak', variant: '1L Tetra', sku: 'MK-1L-WHT', cat: 'Dairy', price: 180, onHand: 520, reserved: 80, reorder: 200, batch: true },
  { name: 'Lays Chips', variant: 'Magic Masala 28g', sku: 'LY-28-MGM', cat: 'Snacks', price: 30, onHand: 840, reserved: 0, reorder: 500, batch: false },
  { name: 'Ariel Detergent', variant: '2kg', sku: 'AR-2KG-BLU', cat: 'Cleaning', price: 680, onHand: 18, reserved: 6, reorder: 80, batch: false },
  { name: 'Samsung Galaxy', variant: 'A15 Blue', sku: 'SG-A15-BLU', cat: 'Electronics', price: 48000, onHand: 12, reserved: 2, reorder: 5, batch: false },
  { name: 'Oral-B Toothbrush', variant: 'Soft Pack', sku: 'OB-SP-WHT', cat: 'Hair Care', price: 120, onHand: 0, reserved: 0, reorder: 60, batch: false },
  { name: 'Dettol Soap', variant: '75g', sku: 'DT-75-RED', cat: 'Cleaning', price: 85, onHand: 360, reserved: 24, reorder: 100, batch: false },
  { name: 'Nescafe Classic', variant: '200g Jar', sku: 'NC-200-RED', cat: 'Beverages', price: 1200, onHand: 48, reserved: 8, reorder: 40, batch: true },
  { name: 'Shan Masala', variant: 'Mixed 100g', sku: 'SM-MX-100', cat: 'Snacks', price: 70, onHand: 0, reserved: 0, reorder: 200, batch: false },
  { name: 'Head & Shoulders', variant: '200ml', sku: 'HS-200-BLU', cat: 'Hair Care', price: 310, onHand: 130, reserved: 10, reorder: 80, batch: false },
  // ── Variant product: one product, several sizes — each its own SKU/stock ──
  { name: 'Pepsi', variant: '350ml Can', sku: 'PEP-350-CAN', cat: 'Beverages', price: 70, onHand: 320, reserved: 30, reorder: 150, batch: false, type: 'variant', status: 'active' },
  { name: 'Pepsi', variant: '1L Bottle', sku: 'PEP-1L-BTL', cat: 'Beverages', price: 130, onHand: 90, reserved: 12, reorder: 100, batch: false, type: 'variant', status: 'active' },
  { name: 'Pepsi', variant: '1.5L Bottle', sku: 'PEP-15L-BTL', cat: 'Beverages', price: 180, onHand: 0, reserved: 0, reorder: 80, batch: false, type: 'variant', status: 'active' },
  { name: 'Pepsi', variant: '2.25L Bottle', sku: 'PEP-225-BTL', cat: 'Beverages', price: 250, onHand: 60, reserved: 8, reorder: 60, batch: false, type: 'variant', status: 'active' },
  // ── Bundle product: sold as one SKU, made up of existing products ──
  {
    name: 'Breakfast Combo Pack', variant: 'Bundle · 3 items', sku: 'BND-BFAST-01', cat: 'Beverages',
    price: 850, onHand: 45, reserved: 6, reorder: 15, batch: false, type: 'bundle', status: 'active',
    bundleRule: 'bundle',
    bundleItems: [
      { sku: 'ML-400-GRN', name: 'Milo', variant: '400g', price: 310, qty: 1 },
      { sku: 'MK-1L-WHT', name: 'Nestle Milkpak', variant: '1L Tetra', price: 180, qty: 2 },
      { sku: 'LY-28-MGM', name: 'Lays Chips', variant: 'Magic Masala 28g', price: 30, qty: 3 },
    ],
  },
]

// Synthesize deterministic line items for a transfer that has no explicit `lines`.
export function trLines(t) {
  if (t.lines) return t.lines
  const n = Math.max(1, Math.min(t.items || 1, INV_DATA.length))
  const base = Math.floor((t.units || 0) / n)
  const rem = (t.units || 0) - base * n
  const out = []
  for (let i = 0; i < n; i++) {
    const p = INV_DATA[i % INV_DATA.length]
    const qty = Math.max(1, base + (i < rem ? 1 : 0))
    out.push({ sku: p.sku, product: `${p.name} — ${p.variant}`, qty })
  }
  return out
}

// Available units at the warehouse for a SKU (onHand - reserved).
export function trAvail(sku) {
  const p = INV_DATA.find((x) => x.sku === sku)
  return p ? Math.max(0, p.onHand - p.reserved) : 0
}

// Check an order's line items against warehouse stock.
export function checkOrderStock(o) {
  return o.items_detail.map((l) => {
    const prod = INV_DATA.find((p) => p.sku === l.sku)
    const available = prod ? Math.max(0, prod.onHand - prod.reserved) : 0
    const fulfillable = Math.min(l.qty, available)
    let stockState = 'full'
    if (fulfillable === 0) stockState = 'out'
    else if (fulfillable < l.qty) stockState = 'partial'
    return { ...l, available, fulfillable, stockState }
  })
}

// Branches the warehouse can pull stock from + their per-SKU on-hand (for New Stock Request).
export const WH_FULFILLERS = ['Al Fatah Main Branch', 'Al Fatah DHA Branch', 'Al Fatah Johar Town', 'Al Fatah Model Town']

export const STORE_INVENTORY = {
  'Al Fatah Main Branch': { 'SS-400-BLU': 12, 'SE-1KG-WHT': 0, 'ML-400-GRN': 48, 'MK-1L-WHT': 80, 'LY-28-MGM': 200, 'AR-2KG-BLU': 8, 'SG-A15-BLU': 3, 'OB-SP-WHT': 0, 'DT-75-RED': 60, 'NC-200-RED': 5, 'SM-MX-100': 0, 'HS-200-BLU': 18, 'PEP-350-CAN': 120, 'PEP-1L-BTL': 30, 'PEP-15L-BTL': 0, 'PEP-225-BTL': 18, 'BND-BFAST-01': 10 },
  'Al Fatah DHA Branch': { 'SS-400-BLU': 0, 'SE-1KG-WHT': 24, 'ML-400-GRN': 5, 'MK-1L-WHT': 12, 'LY-28-MGM': 80, 'AR-2KG-BLU': 0, 'SG-A15-BLU': 0, 'OB-SP-WHT': 10, 'DT-75-RED': 20, 'NC-200-RED': 10, 'SM-MX-100': 24, 'HS-200-BLU': 0, 'PEP-350-CAN': 60, 'PEP-1L-BTL': 8, 'PEP-15L-BTL': 12, 'PEP-225-BTL': 0, 'BND-BFAST-01': 4 },
  'Al Fatah Johar Town': { 'SS-400-BLU': 30, 'SE-1KG-WHT': 10, 'ML-400-GRN': 0, 'MK-1L-WHT': 40, 'LY-28-MGM': 150, 'AR-2KG-BLU': 5, 'SG-A15-BLU': 2, 'OB-SP-WHT': 0, 'DT-75-RED': 0, 'NC-200-RED': 8, 'SM-MX-100': 15, 'HS-200-BLU': 22, 'PEP-350-CAN': 90, 'PEP-1L-BTL': 0, 'PEP-15L-BTL': 20, 'PEP-225-BTL': 14, 'BND-BFAST-01': 0 },
  'Al Fatah Model Town': { 'SS-400-BLU': 8, 'SE-1KG-WHT': 0, 'ML-400-GRN': 15, 'MK-1L-WHT': 6, 'LY-28-MGM': 40, 'AR-2KG-BLU': 12, 'SG-A15-BLU': 1, 'OB-SP-WHT': 5, 'DT-75-RED': 35, 'NC-200-RED': 0, 'SM-MX-100': 8, 'HS-200-BLU': 10, 'PEP-350-CAN': 40, 'PEP-1L-BTL': 12, 'PEP-15L-BTL': 6, 'PEP-225-BTL': 8, 'BND-BFAST-01': 6 },
}

export const wmSourceStock = (source, sku) => (STORE_INVENTORY[source] || {})[sku] || 0

export const TRANSFER_REJECT_REASONS = [
  { value: 'insufficient_stock', label: 'Insufficient stock available' },
  { value: 'wrong_items', label: 'Wrong items requested' },
  { value: 'duplicate_request', label: 'Duplicate request' },
  { value: 'out_of_season', label: 'Items out of season / discontinued' },
  { value: 'other', label: 'Other' },
]

export const ORDER_REJECT_REASONS = ['Item out of stock', 'Cannot fulfil delivery area', 'Order details unclear', 'Duplicate order', 'Other']

// ── Stock Adjustment history (audit log) ──
// Every manual correction to warehouse stock: physical counts, damage, theft,
// expiry write-offs and found stock. `after = before + delta`. Newest first.
export const STOCK_ADJUSTMENTS = [
  { id: 'ADJ-2026-0088', date: 'Jul 21, 2026', time: '09:12', sku: 'SS-400-BLU', name: 'Sunsilk Shampoo', variant: '400ml Blue', cat: 'Hair Care', reason: 'Physical Count Correction', before: 250, after: 248, by: 'Zain Khan', note: 'Cycle count variance against system.', ref: 'CC-2026-07-21' },
  { id: 'ADJ-2026-0087', date: 'Jul 20, 2026', time: '16:40', sku: 'AR-2KG-BLU', name: 'Ariel Detergent', variant: '2kg', cat: 'Cleaning', reason: 'Damage', before: 22, after: 18, by: 'Sara Ahmed', note: 'Torn packaging, detergent leaked in aisle.', ref: '' },
  { id: 'ADJ-2026-0086', date: 'Jul 20, 2026', time: '14:05', sku: 'ML-400-GRN', name: 'Milo', variant: '400g', cat: 'Beverages', reason: 'Expiry Write-off', before: 84, after: 72, by: 'Usman Ali', note: 'Past best-before date, removed from shelf.', ref: '' },
  { id: 'ADJ-2026-0085', date: 'Jul 19, 2026', time: '11:30', sku: 'LY-28-MGM', name: 'Lays Chips', variant: 'Magic Masala 28g', cat: 'Snacks', reason: 'Found / Extra Stock', before: 812, after: 840, by: 'Nadia Hasan', note: 'Extra carton found in aisle 4.', ref: 'CC-2026-07-19' },
  { id: 'ADJ-2026-0084', date: 'Jul 19, 2026', time: '10:15', sku: 'NC-200-RED', name: 'Nescafe Classic', variant: '200g Jar', cat: 'Beverages', reason: 'Theft / Loss', before: 52, after: 48, by: 'Zain Khan', note: 'Missing after night shift, reported to security.', ref: '' },
  { id: 'ADJ-2026-0083', date: 'Jul 18, 2026', time: '17:22', sku: 'DT-75-RED', name: 'Dettol Soap', variant: '75g', cat: 'Cleaning', reason: 'Physical Count Correction', before: 356, after: 360, by: 'Bilal Siddiqui', note: 'Recount matched supplier invoice.', ref: 'CC-2026-07-18' },
  { id: 'ADJ-2026-0082', date: 'Jul 18, 2026', time: '09:48', sku: 'MK-1L-WHT', name: 'Nestle Milkpak', variant: '1L Tetra', cat: 'Dairy', reason: 'Damage', before: 528, after: 520, by: 'Sara Ahmed', note: 'Crushed tetra packs during unloading.', ref: '' },
  { id: 'ADJ-2026-0081', date: 'Jul 17, 2026', time: '15:10', sku: 'HS-200-BLU', name: 'Head & Shoulders', variant: '200ml', cat: 'Hair Care', reason: 'Physical Count Correction', before: 128, after: 130, by: 'Usman Ali', note: 'Recount after restock.', ref: 'CC-2026-07-17' },
  { id: 'ADJ-2026-0080', date: 'Jul 17, 2026', time: '12:33', sku: 'PEP-350-CAN', name: 'Pepsi', variant: '350ml Can', cat: 'Beverages', reason: 'Damage', before: 330, after: 320, by: 'Nadia Hasan', note: 'Dented cans, unsellable.', ref: '' },
  { id: 'ADJ-2026-0079', date: 'Jul 16, 2026', time: '10:05', sku: 'SG-A15-BLU', name: 'Samsung Galaxy', variant: 'A15 Blue', cat: 'Electronics', reason: 'Theft / Loss', before: 13, after: 12, by: 'Zain Khan', note: 'Unit missing from secure cage, CCTV review pending.', ref: '' },
  { id: 'ADJ-2026-0078', date: 'Jul 15, 2026', time: '16:50', sku: 'PEP-1L-BTL', name: 'Pepsi', variant: '1L Bottle', cat: 'Beverages', reason: 'Found / Extra Stock', before: 84, after: 90, by: 'Bilal Siddiqui', note: 'Found in back storage.', ref: 'CC-2026-07-15' },
  { id: 'ADJ-2026-0077', date: 'Jul 15, 2026', time: '11:15', sku: 'SM-MX-100', name: 'Shan Masala', variant: 'Mixed 100g', cat: 'Snacks', reason: 'Expiry Write-off', before: 12, after: 0, by: 'Sara Ahmed', note: 'Expired stock discarded — now out of stock.', ref: '' },
  { id: 'ADJ-2026-0076', date: 'Jul 14, 2026', time: '14:40', sku: 'MK-1L-WHT', name: 'Nestle Milkpak', variant: '1L Tetra', cat: 'Dairy', reason: 'Physical Count Correction', before: 532, after: 528, by: 'Usman Ali', note: 'Cycle count variance.', ref: 'CC-2026-07-14' },
  { id: 'ADJ-2026-0075', date: 'Jul 13, 2026', time: '10:28', sku: 'OB-SP-WHT', name: 'Oral-B Toothbrush', variant: 'Soft Pack', cat: 'Hair Care', reason: 'Damage', before: 6, after: 0, by: 'Nadia Hasan', note: 'Water-damaged blister packs.', ref: '' },
  { id: 'ADJ-2026-0074', date: 'Jul 12, 2026', time: '15:55', sku: 'DT-75-RED', name: 'Dettol Soap', variant: '75g', cat: 'Cleaning', reason: 'Found / Extra Stock', before: 348, after: 356, by: 'Zain Khan', note: 'Miscount on previous cycle.', ref: 'CC-2026-07-12' },
  { id: 'ADJ-2026-0073', date: 'Jul 11, 2026', time: '09:35', sku: 'SS-400-BLU', name: 'Sunsilk Shampoo', variant: '400ml Blue', cat: 'Hair Care', reason: 'Damage', before: 256, after: 250, by: 'Bilal Siddiqui', note: 'Leaking bottles.', ref: '' },
  { id: 'ADJ-2026-0072', date: 'Jul 10, 2026', time: '13:20', sku: 'LY-28-MGM', name: 'Lays Chips', variant: 'Magic Masala 28g', cat: 'Snacks', reason: 'Theft / Loss', before: 820, after: 812, by: 'Sara Ahmed', note: 'Shrinkage at packing station.', ref: '' },
  { id: 'ADJ-2026-0071', date: 'Jul 9, 2026', time: '11:00', sku: 'PEP-225-BTL', name: 'Pepsi', variant: '2.25L Bottle', cat: 'Beverages', reason: 'Physical Count Correction', before: 58, after: 60, by: 'Usman Ali', note: 'Recount after audit.', ref: 'CC-2026-07-09' },
  { id: 'ADJ-2026-0070', date: 'Jul 8, 2026', time: '16:10', sku: 'NC-200-RED', name: 'Nescafe Classic', variant: '200g Jar', cat: 'Beverages', reason: 'Found / Extra Stock', before: 44, after: 52, by: 'Nadia Hasan', note: 'Returned display units restocked.', ref: '' },
  { id: 'ADJ-2026-0069', date: 'Jul 7, 2026', time: '10:45', sku: 'AR-2KG-BLU', name: 'Ariel Detergent', variant: '2kg', cat: 'Cleaning', reason: 'Other', before: 24, after: 22, by: 'Zain Khan', note: 'Sample units taken for QA testing.', ref: '' },
  { id: 'ADJ-2026-0068', date: 'Jul 6, 2026', time: '14:15', sku: 'ML-400-GRN', name: 'Milo', variant: '400g', cat: 'Beverages', reason: 'Physical Count Correction', before: 88, after: 84, by: 'Bilal Siddiqui', note: 'Cycle count variance.', ref: 'CC-2026-07-06' },
  { id: 'ADJ-2026-0067', date: 'Jul 5, 2026', time: '09:50', sku: 'HS-200-BLU', name: 'Head & Shoulders', variant: '200ml', cat: 'Hair Care', reason: 'Damage', before: 132, after: 128, by: 'Sara Ahmed', note: 'Cracked caps.', ref: '' },
  { id: 'ADJ-2026-0066', date: 'Jul 4, 2026', time: '15:30', sku: 'MK-1L-WHT', name: 'Nestle Milkpak', variant: '1L Tetra', cat: 'Dairy', reason: 'Found / Extra Stock', before: 520, after: 532, by: 'Usman Ali', note: 'Extra pallet located in cold store.', ref: 'CC-2026-07-04' },
  { id: 'ADJ-2026-0065', date: 'Jul 3, 2026', time: '11:25', sku: 'SG-A15-BLU', name: 'Samsung Galaxy', variant: 'A15 Blue', cat: 'Electronics', reason: 'Physical Count Correction', before: 12, after: 13, by: 'Zain Khan', note: 'Recount after quarterly audit.', ref: '' },
]

// Rupee price per SKU (for valuing adjustment gain/loss on the history screen).
export const adjUnitPrice = (sku) => (INV_DATA.find((p) => p.sku === sku) || {}).price || 0

// ── Stock In history (goods receiving log) ──
// Each entry is a goods-receipt note (GRN) for an incoming supplier delivery.
// `lines` hold the received variants; batch/expiry are recorded for
// batch-tracked products. Newest first.
export const STOCK_RECEIPTS = [
  { id: 'GRN-2026-0132', date: 'Jul 21, 2026', time: '08:40', supplier: 'Unilever Distributors', ref: 'INV-UL-88231', by: 'Zain Khan', note: 'Weekly FMCG delivery.', lines: [
    { sku: 'SS-400-BLU', name: 'Sunsilk Shampoo', variant: '400ml Blue', qty: 120, batch: 'B2407', expiry: '2027-01-31' },
    { sku: 'HS-200-BLU', name: 'Head & Shoulders', variant: '200ml', qty: 60, batch: '', expiry: '' },
  ] },
  { id: 'GRN-2026-0131', date: 'Jul 20, 2026', time: '15:10', supplier: 'Nestlé Pakistan', ref: 'INV-NES-5521', by: 'Sara Ahmed', note: 'Beverages + dairy.', lines: [
    { sku: 'ML-400-GRN', name: 'Milo', variant: '400g', qty: 96, batch: 'M2406', expiry: '2026-12-15' },
    { sku: 'MK-1L-WHT', name: 'Nestle Milkpak', variant: '1L Tetra', qty: 240, batch: 'K2407', expiry: '2026-10-30' },
    { sku: 'NC-200-RED', name: 'Nescafe Classic', variant: '200g Jar', qty: 48, batch: 'N2405', expiry: '2027-06-30' },
  ] },
  { id: 'GRN-2026-0130', date: 'Jul 20, 2026', time: '10:25', supplier: 'PepsiCo Distributor', ref: 'INV-PEP-3390', by: 'Usman Ali', note: 'Chilled drinks.', lines: [
    { sku: 'PEP-350-CAN', name: 'Pepsi', variant: '350ml Can', qty: 240, batch: '', expiry: '' },
    { sku: 'PEP-1L-BTL', name: 'Pepsi', variant: '1L Bottle', qty: 120, batch: '', expiry: '' },
    { sku: 'PEP-225-BTL', name: 'Pepsi', variant: '2.25L Bottle', qty: 60, batch: '', expiry: '' },
  ] },
  { id: 'GRN-2026-0129', date: 'Jul 19, 2026', time: '14:00', supplier: 'P&G Wholesale', ref: 'INV-PG-7742', by: 'Nadia Hasan', note: 'Detergents & personal care.', lines: [
    { sku: 'AR-2KG-BLU', name: 'Ariel Detergent', variant: '2kg', qty: 80, batch: '', expiry: '' },
    { sku: 'OB-SP-WHT', name: 'Oral-B Toothbrush', variant: 'Soft Pack', qty: 60, batch: '', expiry: '' },
  ] },
  { id: 'GRN-2026-0128', date: 'Jul 18, 2026', time: '09:30', supplier: 'Reckitt Benckiser', ref: 'INV-RB-1180', by: 'Bilal Siddiqui', note: 'Hygiene restock.', lines: [
    { sku: 'DT-75-RED', name: 'Dettol Soap', variant: '75g', qty: 200, batch: '', expiry: '' },
  ] },
  { id: 'GRN-2026-0127', date: 'Jul 17, 2026', time: '16:20', supplier: 'Unilever Distributors', ref: 'INV-UL-88012', by: 'Zain Khan', note: '', lines: [
    { sku: 'SS-400-BLU', name: 'Sunsilk Shampoo', variant: '400ml Blue', qty: 96, batch: 'B2406', expiry: '2026-12-31' },
  ] },
  { id: 'GRN-2026-0126', date: 'Jul 16, 2026', time: '11:05', supplier: 'PepsiCo Distributor', ref: 'INV-PEP-3301', by: 'Usman Ali', note: 'Snacks delivery.', lines: [
    { sku: 'LY-28-MGM', name: 'Lays Chips', variant: 'Magic Masala 28g', qty: 500, batch: '', expiry: '' },
  ] },
  { id: 'GRN-2026-0125', date: 'Jul 15, 2026', time: '13:45', supplier: 'Samsung Pakistan', ref: 'INV-SAM-9004', by: 'Zain Khan', note: 'Electronics — stored in secure cage.', lines: [
    { sku: 'SG-A15-BLU', name: 'Samsung Galaxy', variant: 'A15 Blue', qty: 10, batch: '', expiry: '' },
  ] },
  { id: 'GRN-2026-0124', date: 'Jul 14, 2026', time: '10:00', supplier: 'Nestlé Pakistan', ref: 'INV-NES-5480', by: 'Sara Ahmed', note: '', lines: [
    { sku: 'MK-1L-WHT', name: 'Nestle Milkpak', variant: '1L Tetra', qty: 180, batch: 'K2406', expiry: '2026-10-10' },
    { sku: 'ML-400-GRN', name: 'Milo', variant: '400g', qty: 48, batch: 'M2405', expiry: '2026-11-30' },
  ] },
  { id: 'GRN-2026-0123', date: 'Jul 12, 2026', time: '09:15', supplier: 'Shan Foods', ref: 'INV-SHAN-220', by: 'Nadia Hasan', note: 'Masala restock.', lines: [
    { sku: 'SM-MX-100', name: 'Shan Masala', variant: 'Mixed 100g', qty: 200, batch: '', expiry: '' },
  ] },
  { id: 'GRN-2026-0122', date: 'Jul 11, 2026', time: '15:30', supplier: 'P&G Wholesale', ref: 'INV-PG-7701', by: 'Bilal Siddiqui', note: '', lines: [
    { sku: 'AR-2KG-BLU', name: 'Ariel Detergent', variant: '2kg', qty: 40, batch: '', expiry: '' },
    { sku: 'HS-200-BLU', name: 'Head & Shoulders', variant: '200ml', qty: 40, batch: '', expiry: '' },
  ] },
  { id: 'GRN-2026-0121', date: 'Jul 9, 2026', time: '12:00', supplier: 'PepsiCo Distributor', ref: 'INV-PEP-3255', by: 'Usman Ali', note: 'Partial delivery — remainder to follow.', lines: [
    { sku: 'PEP-15L-BTL', name: 'Pepsi', variant: '1.5L Bottle', qty: 80, batch: '', expiry: '' },
    { sku: 'PEP-350-CAN', name: 'Pepsi', variant: '350ml Can', qty: 120, batch: '', expiry: '' },
  ] },
  { id: 'GRN-2026-0120', date: 'Jul 8, 2026', time: '10:40', supplier: 'Nestlé Pakistan', ref: 'INV-NES-5432', by: 'Sara Ahmed', note: 'Coffee restock.', lines: [
    { sku: 'NC-200-RED', name: 'Nescafe Classic', variant: '200g Jar', qty: 24, batch: 'N2404', expiry: '2027-05-31' },
  ] },
  { id: 'GRN-2026-0119', date: 'Jul 5, 2026', time: '14:20', supplier: 'Unilever Distributors', ref: 'INV-UL-87788', by: 'Zain Khan', note: '', lines: [
    { sku: 'SS-400-BLU', name: 'Sunsilk Shampoo', variant: '400ml Blue', qty: 60, batch: 'B2405', expiry: '2026-11-30' },
    { sku: 'DT-75-RED', name: 'Dettol Soap', variant: '75g', qty: 120, batch: '', expiry: '' },
  ] },
]

// Receipt roll-ups: total units and line count for a GRN.
export const rcptUnits = (r) => r.lines.reduce((s, l) => s + (l.qty || 0), 0)
export const rcptLines = (r) => r.lines.length
