// Inventory (Stock Levels) — stock physically held at Al Fatah Main Branch.
// onHand = units on shelf/backroom · reserved = committed to online orders · reorder = low-stock threshold

export const SM_INV = [
  { name: 'Basmati Rice', variant: '5 kg bag', sku: 'GRO-RICE-5KG', cat: 'Grocery', onHand: 8, reserved: 2, reorder: 10 },
  { name: 'Cooking Oil', variant: '5 L bottle', sku: 'GRO-OIL-5L', cat: 'Grocery', onHand: 0, reserved: 0, reorder: 6 },
  { name: 'Refined Sugar', variant: '1 kg pack', sku: 'GRO-SUGAR-1KG', cat: 'Grocery', onHand: 120, reserved: 8, reorder: 30 },
  { name: 'Lipton Yellow Label Tea', variant: '950 g', sku: 'BEV-TEA-950', cat: 'Beverages', onHand: 15, reserved: 3, reorder: 20 },
  { name: 'Wheat Flour (Atta)', variant: '10 kg bag', sku: 'GRO-ATTA-10KG', cat: 'Grocery', onHand: 45, reserved: 5, reorder: 15 },
  { name: 'Olpers Milk', variant: '1 L pack', sku: 'DAI-MILK-1L', cat: 'Dairy', onHand: 60, reserved: 12, reorder: 40 },
  { name: 'Nestlé Pure Life Water', variant: '1.5 L × 6 pack', sku: 'BEV-WATER-6PK', cat: 'Beverages', onHand: 0, reserved: 0, reorder: 10 },
  { name: 'Shan Biryani Masala', variant: '75 g box', sku: 'SPC-BIRYANI-75', cat: 'Spices', onHand: 90, reserved: 4, reorder: 25 },
  { name: 'Max Dishwash Liquid', variant: '1 L bottle', sku: 'HHD-DISH-1L', cat: 'Household', onHand: 12, reserved: 1, reorder: 15 },
  { name: 'Surf Excel Detergent', variant: '1 kg pack', sku: 'HHD-SURF-1KG', cat: 'Household', onHand: 34, reserved: 2, reorder: 12 },
  { name: 'Colgate Toothpaste', variant: '150 g', sku: 'PC-COLGATE-150', cat: 'Personal Care', onHand: 22, reserved: 0, reorder: 20 },
  { name: 'Lays Potato Chips', variant: 'Large (Masala)', sku: 'SNK-LAYS-LG', cat: 'Snacks', onHand: 5, reserved: 1, reorder: 12 },
  { name: 'Coca-Cola', variant: '1.5 L bottle', sku: 'BEV-COKE-1.5L', cat: 'Beverages', onHand: 78, reserved: 10, reorder: 30 },
  { name: 'Farm Eggs', variant: 'Dozen', sku: 'DAI-EGGS-12', cat: 'Dairy', onHand: 0, reserved: 0, reorder: 20 },
  { name: 'Nescafé Classic', variant: '100 g jar', sku: 'BEV-NESCAFE-100', cat: 'Beverages', onHand: 40, reserved: 3, reorder: 15 },
]

// Stock status for an item based on on-hand vs reorder threshold.
export function smInvStatus(i) {
  if (i.onHand === 0) return { key: 'out', cls: 'text-brand-red bg-brand-red/10', label: 'Out of Stock' }
  if (i.onHand <= i.reorder) return { key: 'low', cls: 'text-brand-orange bg-brand-orange/10', label: 'Low Stock' }
  return { key: 'ok', cls: 'text-brand-green bg-brand-green/10', label: 'In Stock' }
}

// Distinct categories (sorted) for the category filter.
export const SM_INV_CATS = [...new Set(SM_INV.map((i) => i.cat))].sort()

export const SM_ADJ_REASONS = [
  'Cycle count correction',
  'Damaged / expired stock',
  'Theft / shrinkage',
  'Received off-system',
  'Other',
]

// Movement-type styling for the Stock History slideover.
export const SM_SH_META = {
  received: { cls: 'text-brand-green bg-brand-green/10', icon: 'arrow-down-circle-outline', label: 'Received (Transfer)' },
  adjustment: { cls: 'text-brand-orange bg-brand-orange/10', icon: 'create-outline', label: 'Adjustment' },
  sale: { cls: 'text-brand-blue bg-brand-blue/10', icon: 'cart-outline', label: 'Sale' },
  request: { cls: 'text-navy bg-navy/10', icon: 'paper-plane-outline', label: 'Stock Requested' },
  transfer: { cls: 'text-brand-purple bg-brand-purple/10', icon: 'swap-horizontal-outline', label: 'Transfer Out' },
}

// Deterministic seeded movement history for a SKU (shown beneath any live movements).
export const smShSeed = (item) => [
  { type: 'sale', qty: -18, note: 'POS + online sales', by: 'System', date: 'Jul 22, 2026' },
  { type: 'adjustment', qty: -1, note: 'Damaged unit removed', by: 'Nadia Hasan', date: 'Jul 20, 2026' },
  { type: 'received', qty: (item.onHand || 0) + 24, note: 'Transfer from warehouse (TR-2026-061)', by: 'Nadia Hasan', date: 'Jul 15, 2026' },
]
