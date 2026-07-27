// Subscription packages — ported from PKG_DATA in the original admin.html.
export const PKG_FEATURE_LIST = [
  { key: 'ecommerce', label: 'Ecommerce Storefront' },
  { key: 'pos', label: 'POS / Cashier Module' },
  { key: 'loyalty', label: 'Loyalty Program' },
]

export const PKG_DATA = [
  {
    id: 1, name: 'Enterprise', description: 'For large multi-branch retail chains and malls.',
    monthly: 120000, yearly: 1296000, enabled: true,
    maxStores: null, maxWarehouses: null, maxUsers: null, maxProducts: null,
    features: ['ecommerce', 'pos', 'loyalty'],
    activeSubs: 8, colorClass: 'bg-navy text-white', accent: '#1a2d6b',
  },
  {
    id: 2, name: 'Pro', description: 'For growing multi-location businesses.',
    monthly: 60000, yearly: 648000, enabled: true,
    maxStores: 10, maxWarehouses: 3, maxUsers: 50, maxProducts: 5000,
    features: ['ecommerce', 'pos', 'loyalty'],
    activeSubs: 18, colorClass: 'bg-brand-blue text-white', accent: '#3366cc',
  },
  {
    id: 3, name: 'Starter', description: 'For single-store businesses just getting started.',
    monthly: 16900, yearly: 182400, enabled: true,
    maxStores: 1, maxWarehouses: 1, maxUsers: 10, maxProducts: 500,
    features: ['ecommerce', 'pos'],
    activeSubs: 22, colorClass: 'bg-gray-200 text-gray-600', accent: '#94a3b8',
  },
]

// Colour presets cycled through when a new package is created.
export const PKG_NEW_COLORS = [
  { colorClass: 'bg-navy text-white', accent: '#1a2d6b' },
  { colorClass: 'bg-brand-blue text-white', accent: '#3366cc' },
  { colorClass: 'bg-brand-purple text-white', accent: '#7c4dff' },
  { colorClass: 'bg-brand-green text-white', accent: '#2dd36f' },
]

export function pkgFmtLimit(v) {
  return v === null || v === undefined || v === '' ? 'Unlimited' : v.toLocaleString()
}

export function pkgFmtPrice(v) {
  return 'Rs.' + Number(v).toLocaleString()
}

export function pkgSavings(monthly, yearly) {
  if (!monthly || !yearly) return 0
  return Math.round((1 - yearly / (monthly * 12)) * 100)
}
