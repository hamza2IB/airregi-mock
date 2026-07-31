// Inventory dataset ported from warehouse-react so the branch Stock Levels and
// Stock Movements screens behave and read exactly like the warehouse portal.
// onHand = physical stock · reserved = committed to orders · reorder = low-stock threshold.

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

// Rupee price per SKU (for valuing adjustment gain/loss on the history screen).
export const adjUnitPrice = (sku) => (INV_DATA.find((p) => p.sku === sku) || {}).price || 0

// ── Stock Adjustment history (audit log) ──
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

// ── Stock In history (goods receiving log) ──
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
