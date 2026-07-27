// Store Sales — in-store POS transactions rung up at the Main Branch.
// Ported from store-manager-responsive.html (ssData). Cashiers at the branch:
// Imran, Fatima, Bilal. Products mirror the branch catalogue.

export const rs = (n) => 'Rs.' + (n || 0).toLocaleString('en-PK')

export const SS_PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
]

export const SS_PAYMENTS = ['Cash', 'Card', 'App QR']
export const SS_CASHIERS = ['Imran', 'Fatima', 'Bilal']

export const ssPayBadge = (p) =>
  p === 'App QR' ? 'bg-brand-green/10 text-brand-green' : p === 'Card' ? 'bg-brand-blue/10 text-brand-blue' : 'bg-gray-100 text-gray-600'

export const ssPayIcon = (p) => (p === 'App QR' ? 'qr-code-outline' : p === 'Card' ? 'card-outline' : 'cash-outline')

export const GST_RATE = 0.05

function hashStr(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

// Receipt breakdown derived from the transaction total (treated as the final,
// tax-inclusive amount the customer paid). Guarantees the figures tie out exactly:
//   subtotal − discount + tax = total
// A deterministic subset of transactions carry a discount so the line is meaningful.
export function receiptOf(o) {
  const total = o.total
  const taxable = Math.round(total / (1 + GST_RATE)) // net after discount, pre-tax
  const tax = total - taxable
  const h = hashStr(o.id + o.date)
  let discount = 0
  if (h % 5 < 2) { // ~40% of sales had a discount applied
    const pct = (h % 6) + 3 // 3–8%
    discount = Math.round((taxable * pct) / 100 / 10) * 10
  }
  const subtotal = taxable + discount
  const itemCount = o.items.reduce((a, i) => a + i.qty, 0)
  return { subtotal, discount, tax, total, itemCount }
}

export const SS_DATA = {
  today: [
    { id: 'TX-2043', cashier: 'Imran', total: 1240, payment: 'App QR', time: '14:28', date: 'Jul 23, 2026', items: [{ name: 'Olpers Milk — 1 L pack', qty: 2, price: 260, sku: 'DAI-MILK-1L' }, { name: 'Lipton Yellow Label Tea — 950 g', qty: 1, price: 720, sku: 'BEV-TEA-950' }] },
    { id: 'TX-2042', cashier: 'Fatima', total: 680, payment: 'Cash', time: '14:15', date: 'Jul 23, 2026', items: [{ name: 'Coca-Cola — 1.5 L bottle', qty: 3, price: 480, sku: 'BEV-COKE-1.5L' }, { name: 'Lays Potato Chips — Large', qty: 4, price: 200, sku: 'SNK-LAYS-LG' }] },
    { id: 'TX-2041', cashier: 'Bilal', total: 2150, payment: 'Card', time: '13:52', date: 'Jul 23, 2026', items: [{ name: 'Basmati Rice — 5 kg bag', qty: 1, price: 1450, sku: 'GRO-RICE-5KG' }, { name: 'Cooking Oil — 5 L bottle', qty: 1, price: 700, sku: 'GRO-OIL-5L' }] },
    { id: 'TX-2040', cashier: 'Imran', total: 360, payment: 'App QR', time: '13:10', date: 'Jul 23, 2026', items: [{ name: 'Nescafé Classic — 100 g jar', qty: 1, price: 360, sku: 'BEV-NESCAFE-100' }] },
    { id: 'TX-2039', cashier: 'Fatima', total: 520, payment: 'Cash', time: '12:40', date: 'Jul 23, 2026', items: [{ name: 'Colgate Toothpaste — 150 g', qty: 2, price: 320, sku: 'PC-COLGATE-150' }, { name: 'Surf Excel Detergent — 1 kg', qty: 1, price: 200, sku: 'HHD-SURF-1KG' }] },
    { id: 'TX-2038', cashier: 'Bilal', total: 920, payment: 'App QR', time: '11:05', date: 'Jul 23, 2026', items: [{ name: 'Refined Sugar — 1 kg pack', qty: 4, price: 520, sku: 'GRO-SUGAR-1KG' }, { name: 'Farm Eggs — Dozen', qty: 2, price: 400, sku: 'DAI-EGGS-12' }] },
  ],
  week: [
    { id: 'TX-2043', cashier: 'Imran', total: 1240, payment: 'App QR', time: '14:28', date: 'Jul 23', items: [{ name: 'Olpers Milk — 1 L pack', qty: 2, price: 260, sku: 'DAI-MILK-1L' }, { name: 'Lipton Tea — 950 g', qty: 1, price: 720, sku: 'BEV-TEA-950' }] },
    { id: 'TX-2041', cashier: 'Bilal', total: 2150, payment: 'Card', time: '13:52', date: 'Jul 23', items: [{ name: 'Basmati Rice — 5 kg', qty: 1, price: 1450, sku: 'GRO-RICE-5KG' }, { name: 'Cooking Oil — 5 L', qty: 1, price: 700, sku: 'GRO-OIL-5L' }] },
    { id: 'TX-2035', cashier: 'Imran', total: 1560, payment: 'Card', time: '18:30', date: 'Jul 22', items: [{ name: 'Wheat Flour (Atta) — 10 kg', qty: 1, price: 1360, sku: 'GRO-ATTA-10KG' }, { name: 'Shan Biryani Masala — 75 g', qty: 2, price: 200, sku: 'SPC-BIRYANI-75' }] },
    { id: 'TX-2030', cashier: 'Fatima', total: 890, payment: 'Cash', time: '15:20', date: 'Jul 22', items: [{ name: 'Max Dishwash Liquid — 1 L', qty: 3, price: 540, sku: 'HHD-DISH-1L' }, { name: 'Colgate Toothpaste — 150 g', qty: 2, price: 350, sku: 'PC-COLGATE-150' }] },
    { id: 'TX-2028', cashier: 'Bilal', total: 2340, payment: 'App QR', time: '12:10', date: 'Jul 21', items: [{ name: 'Nestlé Pure Life Water — 6 pack', qty: 3, price: 2340, sku: 'BEV-WATER-6PK' }] },
    { id: 'TX-2021', cashier: 'Imran', total: 440, payment: 'Cash', time: '20:45', date: 'Jul 20', items: [{ name: 'Coca-Cola — 1.5 L', qty: 2, price: 320, sku: 'BEV-COKE-1.5L' }, { name: 'Lays — Large', qty: 1, price: 120, sku: 'SNK-LAYS-LG' }] },
    { id: 'TX-2018', cashier: 'Fatima', total: 1280, payment: 'App QR', time: '16:00', date: 'Jul 20', items: [{ name: 'Refined Sugar — 1 kg', qty: 6, price: 780, sku: 'GRO-SUGAR-1KG' }, { name: 'Farm Eggs — Dozen', qty: 2, price: 500, sku: 'DAI-EGGS-12' }] },
  ],
  month: [
    { id: 'TX-2043', cashier: 'Imran', total: 1240, payment: 'App QR', time: '14:28', date: 'Jul 23', items: [{ name: 'Mixed items', qty: 3, price: 1240, sku: '—' }] },
    { id: 'TX-2041', cashier: 'Bilal', total: 2150, payment: 'Card', time: '13:52', date: 'Jul 23', items: [{ name: 'Mixed items', qty: 2, price: 2150, sku: '—' }] },
    { id: 'TX-2035', cashier: 'Imran', total: 1560, payment: 'Card', time: '18:30', date: 'Jul 22', items: [{ name: 'Mixed items', qty: 3, price: 1560, sku: '—' }] },
    { id: 'TX-2028', cashier: 'Bilal', total: 2340, payment: 'App QR', time: '12:10', date: 'Jul 21', items: [{ name: 'Mixed items', qty: 3, price: 2340, sku: '—' }] },
    { id: 'TX-1990', cashier: 'Fatima', total: 4500, payment: 'Cash', time: '10:00', date: 'Jul 12', items: [{ name: 'Bulk grocery order', qty: 22, price: 4500, sku: '—' }] },
    { id: 'TX-1965', cashier: 'Bilal', total: 6800, payment: 'Card', time: '15:30', date: 'Jul 8', items: [{ name: 'Household + grocery', qty: 15, price: 6800, sku: '—' }] },
    { id: 'TX-1940', cashier: 'Imran', total: 2100, payment: 'App QR', time: '11:00', date: 'Jul 4', items: [{ name: 'Mixed items', qty: 12, price: 2100, sku: '—' }] },
  ],
  year: [
    { id: 'TX-2043', cashier: 'Imran', total: 1240, payment: 'App QR', time: '14:28', date: 'Jul 23', items: [{ name: 'Mixed', qty: 3, price: 1240, sku: '—' }] },
    { id: 'TX-1990', cashier: 'Fatima', total: 4500, payment: 'Cash', time: '10:00', date: 'Jun 25', items: [{ name: 'Bulk', qty: 22, price: 4500, sku: '—' }] },
    { id: 'TX-1820', cashier: 'Bilal', total: 12400, payment: 'Card', time: '12:00', date: 'May 15', items: [{ name: 'Large grocery order', qty: 38, price: 12400, sku: '—' }] },
    { id: 'TX-1700', cashier: 'Imran', total: 8900, payment: 'App QR', time: '14:00', date: 'Apr 10', items: [{ name: 'Monthly restock sale', qty: 45, price: 8900, sku: '—' }] },
    { id: 'TX-1560', cashier: 'Fatima', total: 3200, payment: 'Cash', time: '16:30', date: 'Mar 5', items: [{ name: 'Mixed grocery', qty: 18, price: 3200, sku: '—' }] },
    { id: 'TX-1400', cashier: 'Bilal', total: 15600, payment: 'Card', time: '11:00', date: 'Feb 1', items: [{ name: 'Household bulk', qty: 52, price: 15600, sku: '—' }] },
  ],
}
