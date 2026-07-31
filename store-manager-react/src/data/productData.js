// Product Master data + helpers — ported from warehouse-react so the branch
// Stock Levels screen groups variant SKUs under their parent product identically.

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
  { id: 14, parentId: null, name: 'Electronics', status: 'active' },
  { id: 15, parentId: 14, name: 'Phones', status: 'active' },
  { id: 16, parentId: 14, name: 'Accessories', status: 'inactive' },
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
      map.set(i.name, { name: i.name, cat: i.cat, type: pmType(i), status: pmStatus(i), rows: [], stock: 0, reorder: 0 })
    const g = map.get(i.name)
    g.rows.push(i)
    g.stock += i.onHand || 0
    g.reorder += i.reorder || 0
    const t = pmType(i)
    if (t === 'variant') g.type = 'variant'
    else if (t === 'bundle' && g.type !== 'variant') g.type = 'bundle'
  })
  return [...map.values()]
}

export const money = (v) => (v ? 'Rs. ' + (+v).toLocaleString() : '—')

// Stable EAN-13-style barcode for display (mock). Prefers a stored barcode;
// otherwise derives a consistent number from the SKU so the UI looks complete.
export function pmBarcode(row) {
  if (row && row.barcode) return row.barcode
  const sku = (row && row.sku) || ''
  if (!sku) return ''
  let h = 0
  for (let i = 0; i < sku.length; i++) h = (h * 31 + sku.charCodeAt(i)) >>> 0
  return '890' + String(1000000000 + (h % 9000000000)) // 13 digits, PK prefix
}
