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
  'Al Fatah Main Branch': { 'SS-400-BLU': 12, 'SE-1KG-WHT': 0, 'ML-400-GRN': 48, 'MK-1L-WHT': 80, 'LY-28-MGM': 200, 'AR-2KG-BLU': 8, 'SG-A15-BLU': 3, 'OB-SP-WHT': 0, 'DT-75-RED': 60, 'NC-200-RED': 5, 'SM-MX-100': 0, 'HS-200-BLU': 18 },
  'Al Fatah DHA Branch': { 'SS-400-BLU': 0, 'SE-1KG-WHT': 24, 'ML-400-GRN': 5, 'MK-1L-WHT': 12, 'LY-28-MGM': 80, 'AR-2KG-BLU': 0, 'SG-A15-BLU': 0, 'OB-SP-WHT': 10, 'DT-75-RED': 20, 'NC-200-RED': 10, 'SM-MX-100': 24, 'HS-200-BLU': 0 },
  'Al Fatah Johar Town': { 'SS-400-BLU': 30, 'SE-1KG-WHT': 10, 'ML-400-GRN': 0, 'MK-1L-WHT': 40, 'LY-28-MGM': 150, 'AR-2KG-BLU': 5, 'SG-A15-BLU': 2, 'OB-SP-WHT': 0, 'DT-75-RED': 0, 'NC-200-RED': 8, 'SM-MX-100': 15, 'HS-200-BLU': 22 },
  'Al Fatah Model Town': { 'SS-400-BLU': 8, 'SE-1KG-WHT': 0, 'ML-400-GRN': 15, 'MK-1L-WHT': 6, 'LY-28-MGM': 40, 'AR-2KG-BLU': 12, 'SG-A15-BLU': 1, 'OB-SP-WHT': 5, 'DT-75-RED': 35, 'NC-200-RED': 0, 'SM-MX-100': 8, 'HS-200-BLU': 10 },
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
