// Revenue Report mock data — ported from owner-responsive.html.
export const REV_PERIODS = {
  today: { rev: 624000, orders: 207, pos: 511680, online: 112320, trend: '↑ 12% vs yesterday', label: 'Jul 20, 2026 · Today' },
  yesterday: { rev: 557000, orders: 186, pos: 456740, online: 100260, trend: '↑ 5% vs 2 days ago', label: 'Jul 19, 2026 · Yesterday' },
  week: { rev: 3920000, orders: 1302, pos: 3214400, online: 705600, trend: '↑ 18% vs last week', label: 'Jul 14 – Jul 20, 2026 · This Week' },
  month: { rev: 9812000, orders: 3274, pos: 8046840, online: 1765160, trend: '↑ 18% vs last month', label: 'Jul 1 – Jul 20, 2026 · This Month' },
  year: { rev: 74200000, orders: 24733, pos: 60844000, online: 13356000, trend: '↑ 22% vs last year', label: 'Jan – Jul, 2026 · Year to Date' },
}

// Per-store revenue breakdown by period.
export const REV_STORES = {
  today: [{ id: 1, rev: 284000, orders: 94 }, { id: 2, rev: 198000, orders: 70 }, { id: 3, rev: 142000, orders: 43 }],
  yesterday: [{ id: 1, rev: 261000, orders: 86 }, { id: 2, rev: 178000, orders: 63 }, { id: 3, rev: 118000, orders: 37 }],
  week: [{ id: 1, rev: 1420000, orders: 462 }, { id: 2, rev: 980000, orders: 340 }, { id: 3, rev: 710000, orders: 250 }, { id: 4, rev: 520000, orders: 180 }, { id: 6, rev: 290000, orders: 70 }],
  month: [{ id: 1, rev: 3680000, orders: 1180 }, { id: 2, rev: 2540000, orders: 870 }, { id: 3, rev: 1820000, orders: 620 }, { id: 4, rev: 1092000, orders: 380 }, { id: 6, rev: 680000, orders: 224 }],
  year: [{ id: 1, rev: 24500000, orders: 8200 }, { id: 2, rev: 16800000, orders: 5600 }, { id: 3, rev: 12200000, orders: 4100 }, { id: 4, rev: 9800000, orders: 3300 }, { id: 6, rev: 6400000, orders: 2100 }, { id: 7, rev: 4500000, orders: 1433 }],
}

// Store filter dropdown options (value = store id).
export const REV_STORE_OPTIONS = [
  { id: 1, label: 'Main Branch' },
  { id: 2, label: 'DHA Branch' },
  { id: 3, label: 'Johar Town' },
  { id: 4, label: 'Model Town' },
  { id: 6, label: 'Faisalabad' },
  { id: 7, label: 'Islamabad' },
]

export const REV_PERIOD_TABS = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
]

export const fmtRs = (n) => 'Rs.' + n.toLocaleString()
