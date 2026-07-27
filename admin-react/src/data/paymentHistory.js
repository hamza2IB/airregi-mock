// Subscription payment ledger (verified + rejected) — the permanent record
// behind the Revenue report. Ported from PH_DATA in the original admin.html.
export const PH_DATA = [
  { id: 1, bizName: 'Metro Karachi', pkg: 'Pro', type: 'renewal', amount: 60000, bank: 'HBL', ref: 'TXN-20260601-3301', date: 'Jun 1, 2026', dateSort: '2026-06-01', status: 'verified' },
  { id: 2, bizName: 'Al Fatah Mall', pkg: 'Enterprise', type: 'renewal', amount: 120000, bank: 'HBL', ref: 'TXN-20260601-3302', date: 'Jun 1, 2026', dateSort: '2026-06-01', status: 'verified' },
  { id: 3, bizName: 'Jalal Sons', pkg: 'Starter', type: 'renewal', amount: 16900, bank: 'Meezan', ref: 'TXN-20260602-3310', date: 'Jun 2, 2026', dateSort: '2026-06-02', status: 'verified' },
  { id: 4, bizName: 'DHA Grocers', pkg: 'Pro', type: 'renewal', amount: 60000, bank: 'UBL', ref: 'TXN-20260603-3315', date: 'Jun 3, 2026', dateSort: '2026-06-03', status: 'verified' },
  { id: 5, bizName: 'Servis Shoes', pkg: 'Pro', type: 'new-reg', amount: 60000, bank: 'HBL', ref: 'TXN-20260605-3320', date: 'Jun 5, 2026', dateSort: '2026-06-05', status: 'verified' },
  { id: 6, bizName: 'Hyperstar Clifton', pkg: 'Enterprise', type: 'renewal', amount: 120000, bank: 'Standard Chartered', ref: 'TXN-20260608-3330', date: 'Jun 8, 2026', dateSort: '2026-06-08', status: 'verified' },
  { id: 7, bizName: 'Bonanza Satrangi', pkg: 'Pro', type: 'renewal', amount: 60000, bank: 'Meezan', ref: 'TXN-20260610-3340', date: 'Jun 10, 2026', dateSort: '2026-06-10', status: 'rejected' },
  { id: 8, bizName: 'Naheed Supermarket', pkg: 'Starter', type: 'renewal', amount: 16900, bank: 'UBL', ref: 'TXN-20260612-3350', date: 'Jun 12, 2026', dateSort: '2026-06-12', status: 'verified' },
  { id: 9, bizName: 'Crossroads Mall', pkg: 'Enterprise', type: 'new-reg', amount: 120000, bank: 'HBL', ref: 'TXN-20260615-3360', date: 'Jun 15, 2026', dateSort: '2026-06-15', status: 'verified' },
  { id: 10, bizName: 'Miniso Pakistan', pkg: 'Pro', type: 'renewal', amount: 60000, bank: 'Meezan', ref: 'TXN-20260618-3370', date: 'Jun 18, 2026', dateSort: '2026-06-18', status: 'verified' },
  { id: 11, bizName: 'Park Lane Pharmacy', pkg: 'Starter', type: 'renewal', amount: 16900, bank: 'HBL', ref: 'TXN-20260620-3380', date: 'Jun 20, 2026', dateSort: '2026-06-20', status: 'rejected' },
  { id: 12, bizName: 'Sapphire Retail', pkg: 'Pro', type: 'renewal', amount: 60000, bank: 'UBL', ref: 'TXN-20260622-3390', date: 'Jun 22, 2026', dateSort: '2026-06-22', status: 'verified' },
  { id: 13, bizName: 'Gul Ahmed Fabrics', pkg: 'Enterprise', type: 'renewal', amount: 120000, bank: 'HBL', ref: 'TXN-20260625-3400', date: 'Jun 25, 2026', dateSort: '2026-06-25', status: 'verified' },
  { id: 14, bizName: 'Agha Supermarket', pkg: 'Starter', type: 'renewal', amount: 16900, bank: 'Meezan', ref: 'TXN-20260628-3410', date: 'Jun 28, 2026', dateSort: '2026-06-28', status: 'verified' },
  { id: 15, bizName: 'Outfitters Karachi', pkg: 'Pro', type: 'renewal', amount: 60000, bank: 'Standard Chartered', ref: 'TXN-20260630-3420', date: 'Jun 30, 2026', dateSort: '2026-06-30', status: 'verified' },
  { id: 16, bizName: 'EBM Bakers', pkg: 'Starter', type: 'renewal', amount: 16900, bank: 'HBL', ref: 'TXN-20260702-3430', date: 'Jul 2, 2026', dateSort: '2026-07-02', status: 'verified' },
  { id: 17, bizName: 'Chen One', pkg: 'Enterprise', type: 'renewal', amount: 120000, bank: 'UBL', ref: 'TXN-20260703-3440', date: 'Jul 3, 2026', dateSort: '2026-07-03', status: 'verified' },
  { id: 18, bizName: 'Khaadi Flagship', pkg: 'Pro', type: 'renewal', amount: 60000, bank: 'Meezan', ref: 'TXN-20260705-3450', date: 'Jul 5, 2026', dateSort: '2026-07-05', status: 'verified' },
  { id: 19, bizName: 'Shan Foods Outlets', pkg: 'Starter', type: 'renewal', amount: 16900, bank: 'HBL', ref: 'TXN-20260706-3460', date: 'Jul 6, 2026', dateSort: '2026-07-06', status: 'rejected' },
  { id: 20, bizName: 'Ideas by Gul Ahmed', pkg: 'Pro', type: 'renewal', amount: 60000, bank: 'UBL', ref: 'TXN-20260707-3470', date: 'Jul 7, 2026', dateSort: '2026-07-07', status: 'verified' },
]

export const PH_QUICK_RANGES = [
  { key: 'all', label: 'All Time' },
  { key: '30d', label: 'Last 30 Days' },
  { key: 'this_month', label: 'This Month' },
  { key: 'last_month', label: 'Last Month' },
  { key: 'quarter', label: 'This Quarter' },
]

export const PH_QUICK_RANGE_LABEL = {
  '30d': 'Last 30 Days',
  this_month: 'This Month',
  last_month: 'Last Month',
  quarter: 'This Quarter',
}

// Relative-range bounds (YYYY-MM-DD strings) computed from today.
export function phQuickRangeBounds(range) {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const toStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  if (range === '30d') {
    const from = new Date(now)
    from.setDate(from.getDate() - 30)
    return { from: toStr(from), to: toStr(now) }
  }
  if (range === 'this_month') {
    return { from: toStr(new Date(now.getFullYear(), now.getMonth(), 1)), to: toStr(now) }
  }
  if (range === 'last_month') {
    return {
      from: toStr(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
      to: toStr(new Date(now.getFullYear(), now.getMonth(), 0)),
    }
  }
  if (range === 'quarter') {
    const qStartMonth = Math.floor(now.getMonth() / 3) * 3
    return { from: toStr(new Date(now.getFullYear(), qStartMonth, 1)), to: toStr(now) }
  }
  return null
}

export const PH_YEARS = [...new Set(PH_DATA.map((p) => p.dateSort.slice(0, 4)))].sort().reverse()
export const PH_BIZ_NAMES = [...new Set(PH_DATA.map((p) => p.bizName))].sort()

// Month options (YYYY-MM + label) for a given year, newest first.
export function phMonthsForYear(year) {
  const months = [...new Set(PH_DATA.filter((p) => p.dateSort.slice(0, 4) === year).map((p) => p.dateSort.slice(0, 7)))]
    .sort()
    .reverse()
  return months.map((ym) => {
    const [y, m] = ym.split('-')
    return { value: ym, label: new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-US', { month: 'long' }) }
  })
}
