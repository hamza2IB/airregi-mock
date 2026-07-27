// Subscription mock data — ported from owner-responsive.html.

export const SUBSCRIPTION = {
  planName: 'Pro Plan',
  price: 'Rs.60,000 / month',
  started: 'Jul 10, 2026',
  expires: 'Aug 10, 2026',
  daysRemaining: 21,
  daysPct: 68,
}

export const PLAN_USAGE = [
  { icon: 'storefront-outline', label: 'Stores', used: 4, limit: 10, pct: 40, bar: 'bg-brand-blue' },
  { icon: 'business-outline', label: 'Warehouses', used: 1, limit: 3, pct: 33, bar: 'bg-brand-purple' },
  { icon: 'people-outline', label: 'Users', used: 8, limit: 50, pct: 16, bar: 'bg-brand-green' },
  { icon: 'cube-outline', label: 'Products', used: 312, limit: 5000, pct: 6.2, bar: 'bg-brand-orange' },
]

export const FEATURES_INCLUDED = ['Ecommerce Storefront', 'POS / Cashier Module', 'Loyalty Program']

export const CP_PLANS = [
  { id: 'starter', name: 'Starter', icon: 'leaf-outline', color: 'brand-green', prices: { monthly: 16900, yearly: 182400 }, storeLimit: 1, productLimit: 500, userLimit: 10, features: ['Ecommerce Storefront', 'POS / Cashier Module'] },
  { id: 'pro', name: 'Pro', icon: 'rocket-outline', color: 'brand-blue', prices: { monthly: 60000, yearly: 648000 }, storeLimit: 10, productLimit: 5000, userLimit: 50, features: ['Ecommerce Storefront', 'POS / Cashier Module', 'Loyalty Program'] },
  { id: 'enterprise', name: 'Enterprise', icon: 'business-outline', color: 'navy', prices: { monthly: 120000, yearly: 1296000 }, storeLimit: 'Unlimited', productLimit: 'Unlimited', userLimit: 'Unlimited', features: ['Ecommerce Storefront', 'POS / Cashier Module', 'Loyalty Program'] },
]

export const CP_USAGE = { stores: 4, products: 312 }
export const CP_CURRENT_ID = 'pro'

export const BANKS = ['HBL', 'UBL', 'Meezan', 'Standard Chartered', 'MCB', 'Allied Bank', 'Habib Metro', 'Bank Alfalah']

export const PAYMENTS_DATA = [
  { date: 'Jul 10, 2026', time: '11:42 AM', amount: 'Rs.60,000', plan: 'Pro', bank: 'HBL', ref: 'TXN-20260710-1001', status: 'verified' },
  { date: 'Jun 10, 2026', time: '10:15 AM', amount: 'Rs.60,000', plan: 'Pro', bank: 'HBL', ref: 'TXN-20260610-8821', status: 'verified' },
  { date: 'May 10, 2026', time: '02:30 PM', amount: 'Rs.60,000', plan: 'Pro', bank: 'Meezan', ref: 'IBT-20260510-3304', status: 'verified' },
  { date: 'Apr 10, 2026', time: '09:55 AM', amount: 'Rs.60,000', plan: 'Pro', bank: 'UBL', ref: 'TXN-20260410-7712', status: 'verified' },
  { date: 'Mar 10, 2026', time: '03:18 PM', amount: 'Rs.60,000', plan: 'Pro', bank: 'HBL', ref: 'TXN-20260310-2241', status: 'rejected', note: 'Amount mismatch' },
]

// Config for the payment-detail verification block, keyed by status.
export const PAYMENT_STATUS_CFG = {
  verified: {
    iconBg: 'bg-brand-green/10', iconColor: 'text-brand-green', ion: 'checkmark-circle-outline',
    blockBg: 'bg-brand-green/5 border-brand-green/20', blockIcon: 'checkmark-circle', blockIconColor: 'text-brand-green',
    title: 'Verified', desc: 'This payment has been verified by admin and your subscription was activated.',
  },
  pending: {
    iconBg: 'bg-brand-orange/10', iconColor: 'text-brand-orange', ion: 'time-outline',
    blockBg: 'bg-brand-orange/5 border-brand-orange/20', blockIcon: 'time', blockIconColor: 'text-brand-orange',
    title: 'Pending Verification', desc: 'Your payment is awaiting admin review. This usually takes up to 24 hours.',
  },
  rejected: {
    iconBg: 'bg-brand-red/10', iconColor: 'text-brand-red', ion: 'close-circle-outline',
    blockBg: 'bg-brand-red/5 border-brand-red/20', blockIcon: 'close-circle', blockIconColor: 'text-brand-red',
    title: 'Rejected', desc: 'This payment was rejected by admin. Please submit a new payment or contact support.',
  },
}

export const PAYMENT_BADGE = {
  verified: 'bg-brand-green/10 text-brand-green',
  pending: 'bg-brand-orange/10 text-brand-orange',
  rejected: 'bg-brand-red/10 text-brand-red',
}
