// Payment Verification queue — unverified/pending subscription payments.
// Ported from PV_DATA in the original admin.html.
export const PV_DATA = [
  {
    id: 1, type: 'renewal', bizStatus: 'active', name: 'Al Fatah Mall', pkg: 'Enterprise',
    amountLabel: 'Rs.120,000/mo', amount: 120000, bank: 'HBL', ref: 'TXN-20260708-4421',
    date: 'Jul 8, 2026', dateSort: '2026-07-08', receipt: 'receipt_alfatah_jul8.pdf',
    expiresIn: '2d', expiresColor: 'red',
  },
  {
    id: 2, type: 'renewal', bizStatus: 'banned', name: 'Metro Karachi', pkg: 'Pro',
    amountLabel: 'Rs.60,000/mo', amount: 60000, bank: 'Meezan', ref: 'IBT-20260709-8830',
    date: 'Jul 9, 2026', dateSort: '2026-07-09', receipt: null, expiredOn: 'Jul 8, 2026',
  },
  {
    id: 3, type: 'new-reg', bizStatus: 'pending', name: 'Al Fatah Superstore', pkg: 'Enterprise',
    amountLabel: 'Rs.120,000/mo', amount: 120000, bank: 'HBL', ref: 'TXN-20260710-1001',
    date: 'Jul 10, 2026', dateSort: '2026-07-10', receipt: 'receipt_alfatah_jul10.pdf',
    owner: 'Ahmed Raza', submitted: 'Jul 10, 2026',
  },
  {
    id: 4, type: 'new-reg', bizStatus: 'pending', name: 'FreshGrocers Karachi', pkg: 'Starter',
    amountLabel: 'Rs.16,900/mo', amount: 16900, bank: 'Meezan', ref: 'TXN-20260710-1002',
    date: 'Jul 10, 2026', dateSort: '2026-07-10', receipt: null,
    owner: 'Bilal Mehmood', submitted: 'Jul 10, 2026',
  },
  {
    id: 5, type: 'new-reg', bizStatus: 'pending', name: 'Urban Threads', pkg: 'Pro',
    amountLabel: 'Rs.60,000/mo', amount: 60000, bank: 'UBL', ref: 'TXN-20260709-1003',
    date: 'Jul 9, 2026', dateSort: '2026-07-09', receipt: 'receipt_urbanthreads.jpg',
    owner: 'Sara Khan', submitted: 'Jul 9, 2026',
  },
  {
    id: 6, type: 'new-reg', bizStatus: 'pending', name: 'Carrefour Gulberg', pkg: 'Pro',
    amountLabel: 'Rs.60,000/mo', amount: 60000, bank: 'Standard Chartered', ref: 'TXN-20260709-1004',
    date: 'Jul 9, 2026', dateSort: '2026-07-09', receipt: null,
    owner: 'Hamza Siddiqui', submitted: 'Jul 9, 2026',
  },
]
