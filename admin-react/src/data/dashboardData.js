// ── Subscription-expiry alert strip (top of dashboard) ──
export const expiryStripItems = [
  { name: 'Al Fatah Mall', days: '2d', level: 'red' },
  { name: 'Metro Karachi', days: '5d', level: 'orange' },
  { name: 'Jalal Sons', days: '6d', level: 'orange' },
]

// ── Payment verification queue (dashboard right/left column) ──
// type: 'new-reg' | 'renewal'; variant refines the banner styling.
export const queueItems = [
  {
    id: 'q1',
    type: 'renewal',
    variant: 'renewal',
    name: 'Al Fatah Mall',
    subtitle: 'Enterprise · Rs.120,000/mo · renewing Jul 15',
    expiresLabel: '2d',
    badges: [
      { text: 'Active · Expiring', cls: 'text-brand-red bg-brand-red/10' },
      { text: 'Unverified', cls: 'text-brand-orange bg-brand-orange/10' },
    ],
    payment: { bank: 'HBL', amount: 'Rs.120,000', ref: 'TXN-20260708-4421', date: 'Jul 8, 2026' },
    receipt: 'receipt_alfatah_jul8.pdf',
    verifyLabel: 'Verify & Renew',
    verifyToast: 'Al Fatah Mall renewal verified. Subscription extended.',
    rejectType: 'renewal',
  },
  {
    id: 'q2',
    type: 'renewal',
    variant: 'renewal-banned',
    name: 'Metro Karachi',
    subtitle: 'Pro · Rs.60,000/mo · expired Jul 8, 2026',
    expiredOn: 'Jul 8, 2026',
    badges: [
      { text: 'Banned', cls: 'text-brand-red bg-brand-red/10' },
      { text: 'Unverified', cls: 'text-brand-orange bg-brand-orange/10' },
    ],
    payment: { bank: 'Meezan', amount: 'Rs.60,000', ref: 'IBT-20260709-8830', date: 'Jul 9, 2026' },
    receipt: null,
    verifyLabel: 'Verify & Renew',
    verifyToast: 'Metro Karachi renewal verified. Business restored & all logins reactivated.',
    rejectType: 'renewal-banned',
    rejectLabel: 'Reject Payment',
  },
  {
    id: 'q3',
    type: 'new-reg',
    variant: 'new-reg',
    name: 'Al Fatah Superstore',
    subtitle: 'Enterprise · Rs.120,000/mo · Owner: Ahmed Raza',
    submitted: 'Jul 10, 2026',
    badges: [{ text: 'New Reg', cls: 'text-brand-purple bg-brand-purple/10' }],
    payment: { bank: 'HBL', amount: 'Rs.120,000', ref: 'TXN-20260710-1001', date: 'Jul 10, 2026' },
    receipt: 'receipt_alfatah_jul10.pdf',
    verifyLabel: 'Verify & Activate',
    verifyToast: 'Al Fatah Superstore verified & activated. Credentials sent.',
    rejectType: 'new-reg',
  },
  {
    id: 'q4',
    type: 'new-reg',
    variant: 'new-reg',
    name: 'FreshGrocers Karachi',
    subtitle: 'Starter · Rs.16,900/mo · Owner: Bilal Mehmood',
    submitted: 'Jul 10, 2026',
    badges: [{ text: 'New Reg', cls: 'text-brand-purple bg-brand-purple/10' }],
    payment: { bank: 'Meezan', amount: 'Rs.16,900', ref: 'TXN-20260710-1002', date: 'Jul 10, 2026' },
    receipt: null,
    verifyLabel: 'Verify & Activate',
    verifyToast: 'FreshGrocers verified & activated. Credentials sent.',
    rejectType: 'new-reg',
  },
  {
    id: 'q5',
    type: 'new-reg',
    variant: 'new-reg',
    name: 'Urban Threads',
    subtitle: 'Pro · Rs.60,000/mo · Owner: Sara Khan',
    submitted: 'Jul 9, 2026',
    badges: [{ text: 'New Reg', cls: 'text-brand-purple bg-brand-purple/10' }],
    payment: { bank: 'UBL', amount: 'Rs.60,000', ref: 'TXN-20260709-1003', date: 'Jul 9, 2026' },
    receipt: 'receipt_urbanthreads.jpg',
    verifyLabel: 'Verify & Activate',
    verifyToast: 'Urban Threads verified & activated. Credentials sent.',
    rejectType: 'new-reg',
  },
  {
    id: 'q6',
    type: 'new-reg',
    variant: 'new-reg',
    name: 'Carrefour Gulberg',
    subtitle: 'Pro · Rs.60,000/mo · Owner: Hamza Siddiqui',
    submitted: 'Jul 9, 2026',
    badges: [{ text: 'New Reg', cls: 'text-brand-purple bg-brand-purple/10' }],
    payment: { bank: 'Standard Chartered', amount: 'Rs.60,000', ref: 'TXN-20260709-1004', date: 'Jul 9, 2026' },
    receipt: null,
    verifyLabel: 'Verify & Activate',
    verifyToast: 'Carrefour Gulberg verified & activated. Credentials sent.',
    rejectType: 'new-reg',
  },
]

// ── Expiring-soon list (subscription overview) ──
export const expiringSoon = [
  { name: 'DHA Grocers', plan: 'Pro · Rs.60,000 due', days: '1d', level: 'red', tag: 'Critical' },
  { name: 'Al Fatah Mall', plan: 'Enterprise · Rs.120,000 due', days: '2d', level: 'red', tag: 'Critical' },
  { name: 'Hyperstar Clifton', plan: 'Enterprise · Rs.120,000 due', days: '3d', level: 'orange', tag: 'Urgent' },
  { name: 'Packages Mall Stores', plan: 'Pro · Rs.60,000 due', days: '4d', level: 'orange', tag: 'Urgent' },
  { name: 'Metro Karachi', plan: 'Pro · Rs.60,000 due', days: '5d', level: 'orange' },
  { name: 'Jalal Sons', plan: 'Starter · Rs.16,900 due', days: '6d', level: 'orange' },
  { name: 'Naheed Supermarket', plan: 'Starter · Rs.16,900 due', days: '6d', level: 'orange' },
  { name: 'Khaadi Flagship', plan: 'Pro · Rs.60,000 due', days: '7d', level: 'gray' },
]

// ── Plan distribution (subscription overview) ──
export const planDistribution = [
  { name: 'Enterprise', biz: 8, pct: '16.7%', barCls: 'bg-navy', dotCls: 'bg-navy' },
  { name: 'Pro', biz: 18, pct: '37.5%', barCls: 'bg-brand-blue', dotCls: 'bg-brand-blue' },
  { name: 'Starter', biz: 22, pct: '45.8%', barCls: 'bg-brand-blue/35', dotCls: 'bg-brand-blue/35' },
]
