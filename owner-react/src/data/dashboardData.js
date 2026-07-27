// Owner dashboard mock data — ported from owner-responsive.html.
export const DASH_DATA = {
  today: { rev: 'Rs.624,000', orders: 207, stores: 3, pos: 'Rs.511,680', online: 'Rs.112,320', posPct: 82, ecPct: 18, trend: '↑ 12% vs yesterday', label: 'Jul 20, 2026 · Today' },
  yesterday: { rev: 'Rs.557,000', orders: 186, stores: 3, pos: 'Rs.456,740', online: 'Rs.100,260', posPct: 82, ecPct: 18, trend: '↑ 5% vs 2 days ago', label: 'Jul 19, 2026 · Yesterday' },
  week: { rev: 'Rs.3,920,000', orders: 1302, stores: 3, pos: 'Rs.3,214,400', online: 'Rs.705,600', posPct: 82, ecPct: 18, trend: '↑ 18% vs last week', label: 'Jul 14 – Jul 20, 2026 · This Week' },
  month: { rev: 'Rs.9,812,000', orders: 3274, stores: 3, pos: 'Rs.8,046,840', online: 'Rs.1,765,160', posPct: 82, ecPct: 18, trend: '↑ 18% vs last month', label: 'Jul 1 – Jul 20, 2026 · This Month' },
  year: { rev: 'Rs.74,200,000', orders: 24733, stores: 3, pos: 'Rs.60,844,000', online: 'Rs.13,356,000', posPct: 82, ecPct: 18, trend: '↑ 22% vs last year', label: 'Jan – Jul, 2026 · Year to Date' },
}

export const DASH_PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
]

export const STORE_PERF = [
  { name: 'Al Fatah Main Branch', code: 'RS-001', city: 'Lahore, Gulberg', rev: 'Rs.284,000', orders: 94, pct: 45, barColor: 'bg-navy', iconBg: 'bg-navy/10', iconColor: 'text-navy', storeId: 1 },
  { name: 'Al Fatah DHA Branch', code: 'RS-002', city: 'Lahore, DHA', rev: 'Rs.198,000', orders: 70, pct: 32, barColor: 'bg-brand-blue', iconBg: 'bg-brand-blue/10', iconColor: 'text-brand-blue', storeId: 2 },
  { name: 'Al Fatah Johar Town', code: 'RS-003', city: 'Lahore, Johar', rev: 'Rs.142,000', orders: 43, pct: 23, barColor: 'bg-brand-purple', iconBg: 'bg-brand-purple/10', iconColor: 'text-brand-purple', storeId: 3 },
]

export const PAYMENT_METHODS = [
  { name: 'Cash', icon: 'cash-outline', color: 'text-brand-green', bg: 'bg-brand-green/10', bar: 'bg-brand-green', pct: 40, rev: 'Rs.249,600' },
  { name: 'Card', icon: 'card-outline', color: 'text-brand-blue', bg: 'bg-brand-blue/10', bar: 'bg-brand-blue', pct: 30, rev: 'Rs.187,200' },
  { name: 'QR / Wallet', icon: 'qr-code-outline', color: 'text-brand-purple', bg: 'bg-brand-purple/10', bar: 'bg-brand-purple', pct: 20, rev: 'Rs.124,800' },
  { name: 'COD (Online)', icon: 'bicycle-outline', color: 'text-brand-orange', bg: 'bg-brand-orange/10', bar: 'bg-brand-orange', pct: 10, rev: 'Rs.62,400' },
]

export const SHIFTS_DATA = [
  { cashier: 'Sara Hussain', store: 'Main Branch', register: 'R-01', expected: 42500, actual: 42500, diff: 0, date: 'Jul 20, 2026', time: '02:30 PM' },
  { cashier: 'Ali Raza', store: 'Main Branch', register: 'R-02', expected: 38200, actual: 38000, diff: -200, date: 'Jul 20, 2026', time: '02:28 PM' },
  { cashier: 'Ayesha Malik', store: 'DHA Branch', register: 'R-01', expected: 51000, actual: 51000, diff: 0, date: 'Jul 20, 2026', time: '02:25 PM' },
  { cashier: 'Usman Khan', store: 'Johar Town', register: 'R-01', expected: 29800, actual: 30050, diff: 250, date: 'Jul 20, 2026', time: '10:15 AM' },
]

export const TXN_DATA = [
  {
    id: 'POS-0024', store: 'Main Branch', storeShort: 'Main', storeColor: '#1a2d6b', channel: 'POS', cashier: 'Sara Hussain', amount: 'Rs.1,240', pay: 'Cash', payIcon: 'cash-outline', date: 'Jul 20, 2026', time: '2:41 PM', items: 4, customer: 'Walk-in', register: 'R-01',
    lines: [{ name: 'Nestle Pure Life 1.5L', qty: 2, price: 80, total: 160 }, { name: "Lay's Classic 100g", qty: 1, price: 60, total: 60 }, { name: 'Milkpak 1L', qty: 2, price: 220, total: 440 }, { name: 'Brooke Bond 900g', qty: 1, price: 580, total: 580 }],
  },
  {
    id: 'EC-0812', store: 'DHA Branch', storeShort: 'DHA', storeColor: '#3366cc', channel: 'EC', cashier: 'Online Order', amount: 'Rs.3,500', pay: 'COD', payIcon: 'bicycle-outline', date: 'Jul 20, 2026', time: '2:38 PM', items: 7, customer: 'Amna Siddiqui', register: 'Online',
    lines: [{ name: 'Surf Excel 2kg', qty: 2, price: 480, total: 960 }, { name: 'Head & Shoulders 400ml', qty: 1, price: 680, total: 680 }, { name: 'Milkpak 1L', qty: 3, price: 220, total: 660 }, { name: 'Nestle Pure Life 1.5L', qty: 5, price: 80, total: 400 }, { name: 'Colgate Total 150g', qty: 3, price: 270, total: 810 }],
  },
  {
    id: 'POS-0023', store: 'Johar Town', storeShort: 'JT', storeColor: '#7c4dff', channel: 'POS', cashier: 'Omar Farooq', amount: 'Rs.680', pay: 'Card', payIcon: 'card-outline', date: 'Jul 20, 2026', time: '2:35 PM', items: 2, customer: 'Walk-in', register: 'R-01',
    lines: [{ name: "Lay's Classic 100g", qty: 2, price: 60, total: 120 }, { name: 'Nestle Pure Life 1.5L', qty: 5, price: 80, total: 400 }, { name: 'Brooke Bond 900g', qty: 1, price: 160, total: 160 }],
  },
  {
    id: 'POS-0022', store: 'Main Branch', storeShort: 'Main', storeColor: '#1a2d6b', channel: 'POS', cashier: 'Ali Raza', amount: 'Rs.2,150', pay: 'QR', payIcon: 'qr-code-outline', date: 'Jul 20, 2026', time: '2:30 PM', items: 5, customer: 'Walk-in', register: 'R-02',
    lines: [{ name: 'Surf Excel 2kg', qty: 1, price: 480, total: 480 }, { name: 'Milkpak 1L', qty: 2, price: 220, total: 440 }, { name: 'Nestle Pure Life 1.5L', qty: 6, price: 80, total: 480 }, { name: 'Head & Shoulders 400ml', qty: 1, price: 680, total: 680 }, { name: "Lay's Classic 100g", qty: 1, price: 60, total: 60 }],
  },
  {
    id: 'EC-0811', store: 'Main Branch', storeShort: 'Main', storeColor: '#1a2d6b', channel: 'EC', cashier: 'Online Order', amount: 'Rs.4,800', pay: 'COD', payIcon: 'bicycle-outline', date: 'Jul 20, 2026', time: '2:28 PM', items: 11, customer: 'Hassan Rauf', register: 'Online',
    lines: [{ name: 'Surf Excel 2kg', qty: 3, price: 480, total: 1440 }, { name: 'Milkpak 1L', qty: 4, price: 220, total: 880 }, { name: 'Nestle Pure Life 1.5L', qty: 10, price: 80, total: 800 }, { name: 'Brooke Bond 900g', qty: 1, price: 1150, total: 1150 }, { name: "Lay's Classic 100g", qty: 5, price: 60, total: 300 }],
  },
  {
    id: 'POS-0021', store: 'DHA Branch', storeShort: 'DHA', storeColor: '#3366cc', channel: 'POS', cashier: 'Bilal Ahmed', amount: 'Rs.920', pay: 'Cash', payIcon: 'cash-outline', date: 'Jul 20, 2026', time: '2:22 PM', items: 3, customer: 'Walk-in', register: 'R-01',
    lines: [{ name: 'Head & Shoulders 400ml', qty: 1, price: 680, total: 680 }, { name: "Lay's Classic 100g", qty: 2, price: 60, total: 120 }, { name: 'Nestle Pure Life 1.5L', qty: 1, price: 80, total: 80 }, { name: 'Colgate Total 150g', qty: 0, price: 270, total: 0 }],
  },
  {
    id: 'POS-0020', store: 'Johar Town', storeShort: 'JT', storeColor: '#7c4dff', channel: 'POS', cashier: 'Nadia Khan', amount: 'Rs.1,560', pay: 'Card', payIcon: 'card-outline', date: 'Jul 20, 2026', time: '2:18 PM', items: 4, customer: 'Walk-in', register: 'R-02',
    lines: [{ name: 'Brooke Bond 900g', qty: 1, price: 1150, total: 1150 }, { name: 'Nestle Pure Life 1.5L', qty: 2, price: 80, total: 160 }, { name: "Lay's Classic 100g", qty: 2, price: 60, total: 120 }, { name: 'Milkpak 1L', qty: 0, price: 220, total: 0 }],
  },
  {
    id: 'EC-0810', store: 'DHA Branch', storeShort: 'DHA', storeColor: '#3366cc', channel: 'EC', cashier: 'Online Order', amount: 'Rs.6,200', pay: 'COD', payIcon: 'bicycle-outline', date: 'Jul 20, 2026', time: '2:10 PM', items: 15, customer: 'Sara Malik', register: 'Online',
    lines: [{ name: 'Surf Excel 2kg', qty: 4, price: 480, total: 1920 }, { name: 'Head & Shoulders 400ml', qty: 2, price: 680, total: 1360 }, { name: 'Milkpak 1L', qty: 5, price: 220, total: 1100 }, { name: 'Nestle Pure Life 1.5L', qty: 10, price: 80, total: 800 }, { name: 'Brooke Bond 900g', qty: 1, price: 1020, total: 1020 }],
  },
  {
    id: 'POS-0019', store: 'Main Branch', storeShort: 'Main', storeColor: '#1a2d6b', channel: 'POS', cashier: 'Sara Hussain', amount: 'Rs.430', pay: 'Cash', payIcon: 'cash-outline', date: 'Jul 19, 2026', time: '2:05 PM', items: 1, customer: 'Walk-in', register: 'R-01',
    lines: [{ name: 'Surf Excel 2kg', qty: 1, price: 480, total: 480 }],
  },
  {
    id: 'POS-0018', store: 'Johar Town', storeShort: 'JT', storeColor: '#7c4dff', channel: 'POS', cashier: 'Omar Farooq', amount: 'Rs.3,100', pay: 'QR', payIcon: 'qr-code-outline', date: 'Jul 19, 2026', time: '1:58 PM', items: 8, customer: 'Walk-in', register: 'R-01',
    lines: [{ name: 'Brooke Bond 900g', qty: 2, price: 1150, total: 2300 }, { name: 'Milkpak 1L', qty: 2, price: 220, total: 440 }, { name: 'Nestle Pure Life 1.5L', qty: 2, price: 80, total: 160 }, { name: "Lay's Classic 100g", qty: 2, price: 60, total: 120 }],
  },
]

export const PAY_COLORS = {
  Cash: 'text-brand-green bg-brand-green/10',
  Card: 'text-brand-blue bg-brand-blue/10',
  QR: 'text-brand-purple bg-brand-purple/10',
  COD: 'text-brand-orange bg-brand-orange/10',
}
