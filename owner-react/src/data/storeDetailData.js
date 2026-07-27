// Store-detail mock data — ported from owner-responsive.html.

// Per-store sales, keyed by period (same demo values for every store).
export const SD_SALES = {
  today: { rev: 284000, orders: 94, pos: 233000, ec: 51000, trend: '↑ 12% vs yesterday' },
  yesterday: { rev: 261000, orders: 86, pos: 213000, ec: 48000, trend: '↑ 3% vs 2 days ago' },
  week: { rev: 1420000, orders: 462, pos: 1164000, ec: 256000, trend: '↑ 8% vs last week' },
  month: { rev: 5680000, orders: 1840, pos: 4657600, ec: 1022400, trend: '↑ 18% vs last month' },
  year: { rev: 42000000, orders: 13400, pos: 34440000, ec: 7560000, trend: '↑ 22% vs last year' },
}

export const BANNER_PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
]

export const BANNER_DATE_LABELS = {
  today: 'Jul 20, 2026 · Today',
  yesterday: 'Jul 19, 2026 · Yesterday',
  week: 'Jul 14 – Jul 20, 2026 · This Week',
  month: 'Jul 1 – Jul 20, 2026 · This Month',
  year: 'Jan – Jul, 2026 · Year to Date',
}

export const BANNER_REV_LABELS = {
  today: "Today's Revenue",
  yesterday: "Yesterday's Revenue",
  week: 'This Week Revenue',
  month: 'This Month Revenue',
  year: 'Year to Date Revenue',
}

export const SALES_PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'all', label: 'All' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
]

export const PRODUCTS_DATA = [
  { id: 1, name: 'Nestle Pure Life 1.5L', sku: 'NES-PL-15', category: 'Beverages', price: 'Rs.80', cost: 'Rs.58', stock: 240, pos: true, ec: true, status: 'active' },
  { id: 2, name: 'Surf Excel 2kg', sku: 'SXL-2KG', category: 'Cleaning', price: 'Rs.480', cost: 'Rs.340', stock: 12, pos: true, ec: false, status: 'active' },
  { id: 3, name: 'Brooke Bond 900g', sku: 'BBS-900', category: 'Beverages', price: 'Rs.1,150', cost: 'Rs.820', stock: 0, pos: true, ec: true, status: 'active' },
  { id: 4, name: "Lay's Classic 100g", sku: 'LYS-CL-100', category: 'Snacks', price: 'Rs.60', cost: 'Rs.42', stock: 180, pos: true, ec: true, status: 'active' },
  { id: 5, name: 'Milkpak 1L', sku: 'MPK-1L', category: 'Dairy', price: 'Rs.220', cost: 'Rs.168', stock: 95, pos: true, ec: true, status: 'active' },
  { id: 6, name: 'Head & Shoulders 400ml', sku: 'HNS-400', category: 'Hair Care', price: 'Rs.680', cost: 'Rs.470', stock: 7, pos: true, ec: false, status: 'active' },
  { id: 7, name: 'Colgate Total 150g', sku: 'COL-T-150', category: 'Cleaning', price: 'Rs.270', cost: 'Rs.180', stock: 0, pos: true, ec: true, status: 'draft' },
]

export const INV_CATEGORIES = ['Beverages', 'Cleaning', 'Snacks', 'Dairy', 'Hair Care']

export const USERS_DATA = [
  { id: 1, name: 'Hassan Ali', phone: '0300-1234567', role: 'store_manager', store: 'Al Fatah Main Branch', status: 'active', lastLogin: '2 hours ago' },
  { id: 2, name: 'Amna Siddiqui', phone: '0321-9876543', role: 'store_manager', store: 'Al Fatah DHA Branch', status: 'active', lastLogin: '4 hours ago' },
  { id: 3, name: 'Omar Farooq', phone: '0311-4561234', role: 'store_manager', store: 'Al Fatah Johar Town', status: 'active', lastLogin: '1 day ago' },
  { id: 4, name: 'Sara Hussain', phone: '0312-3333444', role: 'cashier', store: 'Al Fatah Main Branch', status: 'active', lastLogin: '3 hours ago' },
  { id: 5, name: 'Bilal Ahmed', phone: '0333-5556677', role: 'cashier', store: 'Al Fatah DHA Branch', status: 'active', lastLogin: '6 hours ago' },
  { id: 6, name: 'Zain Malik', phone: '0345-7778899', role: 'store_staff', store: 'Al Fatah Main Branch', status: 'invited', lastLogin: '—' },
  { id: 7, name: 'Tariq Mehmood', phone: '0300-9990001', role: 'warehouse_manager', store: 'Central Warehouse', status: 'active', lastLogin: '1 day ago' },
  { id: 8, name: 'Nadia Khan', phone: '0322-1112223', role: 'cashier', store: 'Al Fatah Johar Town', status: 'inactive', lastLogin: '5 days ago' },
  { id: 9, name: 'Sana Butt', phone: '0301-7654321', role: 'store_manager', store: 'Al Fatah Model Town', status: 'active', lastLogin: '5 hours ago' },
  { id: 10, name: 'Rizwan Chaudhry', phone: '0307-1122334', role: 'store_manager', store: 'Al Fatah Faisalabad', status: 'active', lastLogin: '3 hours ago' },
  { id: 11, name: 'Ayesha Naveed', phone: '0316-9988776', role: 'store_manager', store: 'Al Fatah Islamabad', status: 'active', lastLogin: '2 hours ago' },
  { id: 12, name: 'Kamran Sheikh', phone: '0314-5544332', role: 'cashier', store: 'Al Fatah Model Town', status: 'active', lastLogin: '4 hours ago' },
  { id: 13, name: 'Rabia Noor', phone: '0303-6677889', role: 'cashier', store: 'Al Fatah Faisalabad', status: 'active', lastLogin: '7 hours ago' },
  { id: 14, name: 'Usman Ghani', phone: '0309-2233445', role: 'cashier', store: 'Al Fatah Islamabad', status: 'invited', lastLogin: '—' },
]

export const ROLE_COLORS = {
  store_manager: 'bg-brand-purple/10 text-brand-purple',
  cashier: 'bg-brand-blue/10 text-brand-blue',
  store_staff: 'bg-gray-100 text-gray-600',
  warehouse_manager: 'bg-brand-orange/10 text-brand-orange',
}

export const STAFF_ROLES = ['store_manager', 'cashier', 'store_staff', 'warehouse_manager']

export const SHIFT_PERIODS = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
]

export const SHIFT_PERIOD_DATES = {
  all: null,
  today: 'Jul 20',
  yesterday: 'Jul 19',
  week: ['Jul 14', 'Jul 15', 'Jul 16', 'Jul 17', 'Jul 18', 'Jul 19', 'Jul 20'],
  month: 'Jul',
}

export const fmtRs = (n) => 'Rs.' + n.toLocaleString()

export function initials(name) {
  return name.split(' ').map((n) => n[0]).join('')
}
