// Inventory (Stock Levels) helpers — ported from warehouse-manager-responsive.html.

// Status derived from on-hand vs reorder point.
export function invStatus(item) {
  if (item.onHand === 0) return { label: 'Out of Stock', cls: 'text-brand-red bg-brand-red/10' }
  if (item.onHand <= item.reorder) return { label: 'Low Stock', cls: 'text-brand-orange bg-brand-orange/10' }
  return { label: 'In Stock', cls: 'text-brand-green bg-brand-green/10' }
}

// Movement type styling for the stock-history log.
export const SH_META = {
  received: { cls: 'text-brand-green bg-brand-green/10', icon: 'arrow-down-circle-outline', label: 'Received' },
  adjustment: { cls: 'text-brand-orange bg-brand-orange/10', icon: 'create-outline', label: 'Adjustment' },
  transfer: { cls: 'text-brand-purple bg-brand-purple/10', icon: 'swap-horizontal-outline', label: 'Transfer Out' },
  sale: { cls: 'text-brand-blue bg-brand-blue/10', icon: 'cart-outline', label: 'Sale' },
}

// Deterministic baseline history so every SKU has something to show.
export function shSeed(item) {
  return [
    { type: 'adjustment', qty: -2, note: 'Count correction after cycle count', by: 'Zain Khan', date: 'Jul 18, 2026' },
    { type: 'sale', qty: -12, note: 'Online orders fulfilled', by: 'System', date: 'Jul 15, 2026' },
    { type: 'transfer', qty: -40, note: 'Dispatched to store (TR-2026-045)', by: 'Zain Khan', date: 'Jul 10, 2026' },
    { type: 'received', qty: (item.onHand || 0) + 54, note: 'Supplier delivery received', by: 'Zain Khan', date: 'Jul 2, 2026' },
  ]
}

export const ADJ_REASONS = ['Physical Count Correction', 'Damage', 'Theft / Loss', 'Expiry Write-off', 'Found / Extra Stock', 'Other']

// Group-level stock status (mirrors invStatus but for a rolled-up product).
export function invGroupStatus(onHand, reorder) {
  if (onHand === 0) return { label: 'Out of Stock', cls: 'text-brand-red bg-brand-red/10' }
  if (reorder > 0 && onHand <= reorder) return { label: 'Low Stock', cls: 'text-brand-orange bg-brand-orange/10' }
  return { label: 'In Stock', cls: 'text-brand-green bg-brand-green/10' }
}
