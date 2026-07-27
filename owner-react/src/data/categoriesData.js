// Categories — flat parentId model, ported from owner-responsive.html.
export const INITIAL_CATEGORIES = [
  { id: 1, parentId: null, name: 'Fashion', slug: 'fashion', status: 'active', sortOrder: 0 },
  { id: 2, parentId: 1, name: 'Men', slug: 'fashion-men', status: 'active', sortOrder: 0 },
  { id: 3, parentId: 2, name: 'Clothing', slug: 'men-clothing', status: 'active', sortOrder: 0 },
  { id: 4, parentId: 3, name: 'T-Shirts', slug: 'men-tshirts', status: 'active', sortOrder: 0 },
  { id: 5, parentId: 3, name: 'Jeans', slug: 'men-jeans', status: 'active', sortOrder: 1 },
  { id: 6, parentId: 2, name: 'Footwear', slug: 'men-footwear', status: 'active', sortOrder: 1 },
  { id: 7, parentId: 1, name: 'Women', slug: 'fashion-women', status: 'active', sortOrder: 1 },
  { id: 8, parentId: 7, name: 'Clothing', slug: 'women-clothing', status: 'active', sortOrder: 0 },
  { id: 9, parentId: 7, name: 'Footwear', slug: 'women-footwear', status: 'inactive', sortOrder: 1 },
  { id: 10, parentId: null, name: 'Groceries', slug: 'groceries', status: 'active', sortOrder: 1 },
  { id: 11, parentId: 10, name: 'Dairy', slug: 'groceries-dairy', status: 'active', sortOrder: 0 },
  { id: 12, parentId: 10, name: 'Beverages', slug: 'groceries-beverages', status: 'active', sortOrder: 1 },
  { id: 13, parentId: 10, name: 'Snacks', slug: 'groceries-snacks', status: 'active', sortOrder: 2 },
  { id: 14, parentId: null, name: 'Electronics', slug: 'electronics', status: 'active', sortOrder: 2 },
  { id: 15, parentId: 14, name: 'Phones', slug: 'electronics-phones', status: 'active', sortOrder: 0 },
  { id: 16, parentId: 14, name: 'Accessories', slug: 'electronics-accessories', status: 'inactive', sortOrder: 1 },
]

// Avatar background per depth level.
export const CAT_AVATAR_BG = ['#1a2d6b', '#7c4dff', '#2dd36f', '#ff9800', '#eb445a']
// Left accent bar color per depth level.
export const CAT_BAR_COLOR = ['#3366cc', '#7c4dff', '#2dd36f', '#ff9800', '#eb445a']

export const autoSlug = (name) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Helpers operating on a categories array.
export const catChildren = (cats, pid) =>
  cats.filter((c) => c.parentId === pid).sort((a, b) => a.sortOrder - b.sortOrder)

export const catById = (cats, id) => cats.find((c) => c.id === id)

export const catDepth = (cats, id) => {
  let d = 0
  let cur = catById(cats, id)
  while (cur && cur.parentId !== null) {
    d++
    cur = catById(cats, cur.parentId)
  }
  return d
}

export const catSlugPath = (cats, cat) => {
  const parts = []
  let cur = cat
  while (cur) {
    parts.unshift(cur.slug)
    cur = cur.parentId ? catById(cats, cur.parentId) : null
  }
  return '/' + parts.join('/')
}

export const catDescendantCount = (cats, id) => {
  const ch = catChildren(cats, id)
  return ch.length + ch.reduce((s, c) => s + catDescendantCount(cats, c.id), 0)
}

// True if `candidateId` is `ancestorId` itself or one of its descendants.
export const isSelfOrDescendant = (cats, candidateId, ancestorId) => {
  let cur = catById(cats, candidateId)
  while (cur) {
    if (cur.id === ancestorId) return true
    cur = cur.parentId ? catById(cats, cur.parentId) : null
  }
  return false
}
