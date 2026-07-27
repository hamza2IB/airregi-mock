// Product Master data + helpers — mirrors warehouse-react Product Master.
// Products are the catalog-level view: variant SKUs are grouped under their parent
// product (one row per product). Category tree matches the owner-managed catalog.

export const OWNER_CATEGORIES = [
  { id: 1, parentId: null, name: 'Fashion', status: 'active' },
  { id: 2, parentId: 1, name: 'Men', status: 'active' },
  { id: 3, parentId: 2, name: 'Clothing', status: 'active' },
  { id: 4, parentId: 3, name: 'T-Shirts', status: 'active' },
  { id: 5, parentId: 3, name: 'Jeans', status: 'active' },
  { id: 6, parentId: 2, name: 'Footwear', status: 'active' },
  { id: 7, parentId: 1, name: 'Women', status: 'active' },
  { id: 8, parentId: 7, name: 'Clothing', status: 'active' },
  { id: 9, parentId: 7, name: 'Footwear', status: 'inactive' },
  { id: 10, parentId: null, name: 'Groceries', status: 'active' },
  { id: 11, parentId: 10, name: 'Dairy', status: 'active' },
  { id: 12, parentId: 10, name: 'Beverages', status: 'active' },
  { id: 13, parentId: 10, name: 'Snacks', status: 'active' },
  { id: 14, parentId: null, name: 'Personal Care', status: 'active' },
  { id: 15, parentId: 14, name: 'Hair Care', status: 'active' },
  { id: 16, parentId: 14, name: 'Oral Care', status: 'active' },
  { id: 17, parentId: null, name: 'Cleaning', status: 'active' },
]

export const catById = (id) => OWNER_CATEGORIES.find((c) => c.id === id)

export const catPath = (cat) => {
  const p = []
  let cur = cat
  while (cur) {
    p.unshift(cur.name)
    cur = cur.parentId ? catById(cur.parentId) : null
  }
  return p.join(' › ')
}

// Active categories as { id, path } for the wizard select, sorted by path.
export const activeCategoryOptions = () =>
  OWNER_CATEGORIES.filter((c) => c.status === 'active')
    .map((c) => ({ id: c.id, path: catPath(c) }))
    .sort((a, b) => a.path.localeCompare(b.path))

// ── Type / status derivation ──
export const pmType = (i) => i.type || (i.variant && /\/|,/.test(i.variant) ? 'variant' : 'simple')
export const pmStatus = (i) => i.status || 'active'

export const PM_TYPE_BADGE = {
  simple: 'text-brand-blue bg-brand-blue/10',
  variant: 'text-brand-purple bg-brand-purple/10',
  bundle: 'text-brand-orange bg-brand-orange/10',
}

export const PM_STATUS_BADGE = {
  active: 'text-brand-green bg-brand-green/10',
  draft: 'text-brand-orange bg-brand-orange/10',
  inactive: 'text-gray-500 bg-gray-100',
}

export const PM_STATUS_DOT = { active: '#2dd36f', draft: '#ff9800', inactive: '#94a3b8' }

export const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

// Deterministic gradient palette per product name.
export const PM_THUMBS = [
  ['#1a2d6b', '#3366cc'],
  ['#7c4dff', '#3366cc'],
  ['#2dd36f', '#1a9e52'],
  ['#ff9800', '#eb445a'],
  ['#3366cc', '#7c4dff'],
  ['#0a1535', '#2a4494'],
  ['#eb445a', '#ff9800'],
]

export const pmColorPair = (name) => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return PM_THUMBS[h % PM_THUMBS.length]
}

export const pmTypeIcon = (type) =>
  type === 'bundle' ? 'albums-outline' : type === 'variant' ? 'grid-outline' : 'cube-outline'

// Group SKU rows into products (keyed by name).
export function pmGroups(products) {
  const map = new Map()
  products.forEach((i) => {
    if (!map.has(i.name))
      map.set(i.name, { name: i.name, cat: i.cat, type: pmType(i), status: pmStatus(i), rows: [], stock: 0 })
    const g = map.get(i.name)
    g.rows.push(i)
    g.stock += i.onHand || 0
    const t = pmType(i)
    if (t === 'variant') g.type = 'variant'
    else if (t === 'bundle' && g.type !== 'variant') g.type = 'bundle'
  })
  return [...map.values()]
}

export const money = (v) => (v ? 'Rs. ' + (+v).toLocaleString() : '—')

// Owner catalog — SKU-level rows (variants grouped by name into products).
export const INV_DATA = [
  { name: 'Nestle Pure Life 1.5L', variant: 'Bottle', sku: 'NES-PL-15', cat: 'Beverages', price: 80, onHand: 240, reserved: 20, reorder: 100, barcode: '8964000112501', batch: false },
  { name: 'Surf Excel 2kg', variant: 'Pack', sku: 'SXL-2KG', cat: 'Cleaning', price: 480, onHand: 12, reserved: 4, reorder: 50, barcode: '8964000112518', batch: false },
  { name: 'Brooke Bond 900g', variant: 'Box', sku: 'BBS-900', cat: 'Beverages', price: 1150, onHand: 0, reserved: 0, reorder: 40, barcode: '8964000112525', batch: false },
  { name: "Lay's Classic 100g", variant: 'Pack', sku: 'LYS-CL-100', cat: 'Snacks', price: 60, onHand: 180, reserved: 0, reorder: 200, barcode: '8964000112532', batch: false },
  { name: 'Milkpak 1L', variant: 'Tetra', sku: 'MPK-1L', cat: 'Dairy', price: 220, onHand: 95, reserved: 10, reorder: 120, barcode: '8964000112549', batch: true },
  { name: 'Head & Shoulders 400ml', variant: 'Bottle', sku: 'HNS-400', cat: 'Hair Care', price: 680, onHand: 7, reserved: 2, reorder: 60, barcode: '8964000112556', batch: false },
  { name: 'Colgate Total 150g', variant: 'Tube', sku: 'COL-T-150', cat: 'Oral Care', price: 270, onHand: 0, reserved: 0, reorder: 80, status: 'draft', batch: false },
  // Variant product — grouped into one row with 4 SKUs.
  { name: 'Classic Polo Shirt', variant: 'Black / S', sku: 'POLO-BLK-S', cat: 'T-Shirts', price: 1200, onHand: 30, reserved: 3, reorder: 20, batch: false },
  { name: 'Classic Polo Shirt', variant: 'Black / M', sku: 'POLO-BLK-M', cat: 'T-Shirts', price: 1200, onHand: 25, reserved: 2, reorder: 20, batch: false },
  { name: 'Classic Polo Shirt', variant: 'White / S', sku: 'POLO-WHT-S', cat: 'T-Shirts', price: 1200, onHand: 18, reserved: 0, reorder: 20, batch: false },
  { name: 'Classic Polo Shirt', variant: 'White / M', sku: 'POLO-WHT-M', cat: 'T-Shirts', price: 1250, onHand: 12, reserved: 1, reorder: 20, batch: false },
  // Bundle product.
  {
    name: 'Ramzan Essentials Pack', variant: 'Bundle · 3 items', sku: 'BND-RAMZAN', cat: 'Groceries', price: 1500,
    onHand: 40, reserved: 0, reorder: 20, type: 'bundle', bundleRule: 'bundle', batch: false,
    bundleItems: [
      { name: 'Milkpak 1L', variant: 'Tetra', sku: 'MPK-1L', qty: 2 },
      { name: "Lay's Classic 100g", variant: 'Pack', sku: 'LYS-CL-100', qty: 3 },
      { name: 'Brooke Bond 900g', variant: 'Box', sku: 'BBS-900', qty: 1 },
    ],
  },
]
