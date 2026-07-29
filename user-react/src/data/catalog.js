// ── Category → ionicon name ──
export const CAT_ICON = {
  'Grocery & Supermarket': 'basket-outline',
  'Fashion & Apparel': 'shirt-outline',
  Electronics: 'hardware-chip-outline',
  'Mobile & Accessories': 'phone-portrait-outline',
  'Pharmacy & Health': 'medkit-outline',
  'Home & Living': 'bed-outline',
  'Beauty & Personal Care': 'sparkles-outline',
  'Bakery & Sweets': 'cafe-outline',
  Beverages: 'wine-outline',
  Snacks: 'fast-food-outline',
  Dairy: 'nutrition-outline',
  Cleaning: 'sparkles-outline',
  'Hair Care': 'cut-outline',
  'Fruits & Veg': 'leaf-outline',
  Menswear: 'man-outline',
  Womenswear: 'woman-outline',
  Footwear: 'footsteps-outline',
  Accessories: 'watch-outline',
  Laptops: 'laptop-outline',
  Audio: 'headset-outline',
  Smartphones: 'phone-portrait-outline',
  Wellness: 'fitness-outline',
  'Baby Care': 'happy-outline',
  Kitchen: 'restaurant-outline',
  Decor: 'color-palette-outline',
  Skincare: 'water-outline',
  Makeup: 'brush-outline',
  Cakes: 'gift-outline',
  Breads: 'cafe-outline',
  'Dairy & Eggs': 'nutrition-outline',
  Pantry: 'basket-outline',
  Bakery: 'cafe-outline',
  Computers: 'laptop-outline',
  Mobiles: 'phone-portrait-outline',
  Appliances: 'tv-outline',
  Medicine: 'medkit-outline',
  Bedding: 'bed-outline',
  Storage: 'file-tray-stacked-outline',
}

// P(name, category, sub-category, price, unit, imgKeyword)
const P = (name, cat, sub, price, unit, img) => ({ name, cat, sub, price, unit: unit || 'each', img: img || '' })

export const BUSINESSES = [
  {
    id: 'alfatah', name: 'Al Fatah', initials: 'AF', color: '#3366cc',
    industry: 'Grocery & Supermarket', rating: 4.8, followers: 24800, distanceKm: 1.2,
    tagline: 'Pakistan’s favourite superstore', stores: 6,
    cats: [
      { name: 'Fruits & Veg', subs: ['Fresh Fruit', 'Vegetables'] },
      { name: 'Dairy & Eggs', subs: ['Milk', 'Eggs', 'Butter & Cheese'] },
      { name: 'Beverages', subs: ['Soft Drinks', 'Tea & Coffee'] },
      { name: 'Snacks', subs: ['Chips', 'Biscuits'] },
      { name: 'Pantry', subs: ['Rice & Grains'] },
      { name: 'Cleaning', subs: ['Laundry'] },
    ],
    products: [
      P('Fresh Bananas', 'Fruits & Veg', 'Fresh Fruit', 220, 'dozen', 'bananas'),
      P('Red Apples', 'Fruits & Veg', 'Fresh Fruit', 420, 'kg', 'apples'),
      P('Nestlé Milk Pak 1L', 'Dairy & Eggs', 'Milk', 320, 'each', 'milk,carton'),
      P('Farm Eggs (Tray of 30)', 'Dairy & Eggs', 'Eggs', 480, 'tray', 'eggs'),
      P('Coca-Cola 1.5L', 'Beverages', 'Soft Drinks', 180, 'each', 'cola,bottle'),
      P('Nescafé Classic 100g', 'Beverages', 'Tea & Coffee', 1180, 'each', 'coffee,jar'),
      P('Lays Masala 80g', 'Snacks', 'Chips', 120, 'each', 'potato,chips'),
      P('Basmati Rice 5kg', 'Pantry', 'Rice & Grains', 2450, 'bag', 'rice,bag'),
      P('Surf Excel 1kg', 'Cleaning', 'Laundry', 640, 'each', 'detergent'),
    ],
  },
  {
    id: 'metro', name: 'Metro Karachi', initials: 'MK', color: '#2dd36f',
    industry: 'Grocery & Supermarket', rating: 4.6, followers: 18200, distanceKm: 3.4,
    tagline: 'Wholesale & retail, all under one roof', stores: 4,
    cats: [
      { name: 'Pantry', subs: ['Sugar & Flour', 'Cooking Oil'] },
      { name: 'Beverages', subs: ['Soft Drinks', 'Tea & Coffee'] },
      { name: 'Cleaning', subs: ['Dishwashing'] },
      { name: 'Snacks', subs: ['Biscuits'] },
    ],
    products: [
      P('Sugar 10kg', 'Pantry', 'Sugar & Flour', 1650, 'bag', 'sugar'),
      P('Cooking Oil 5L', 'Pantry', 'Cooking Oil', 2890, 'can', 'cooking,oil'),
      P('Sprite 2.25L', 'Beverages', 'Soft Drinks', 260, 'each', 'soda,bottle'),
      P('Tea Whitener 1kg', 'Beverages', 'Tea & Coffee', 980, 'each', 'tea,powder'),
      P('Dish Wash Liquid 1L', 'Cleaning', 'Dishwashing', 420, 'each', 'dish,soap'),
      P('Prince Biscuits (Pack of 12)', 'Snacks', 'Biscuits', 300, 'pack', 'biscuits'),
    ],
  },
  {
    id: 'khaadi', name: 'Khaadi Flagship', initials: 'KH', color: '#7c4dff',
    industry: 'Fashion & Apparel', rating: 4.9, followers: 41500, distanceKm: 2.1,
    tagline: 'Handcrafted premium fabrics', stores: 3,
    cats: [
      { name: 'Womenswear', subs: ['Unstitched', 'Stitched', 'Dupattas'] },
      { name: 'Menswear', subs: ['Kurta', 'Shalwar Kameez'] },
      { name: 'Footwear', subs: ['Khussa'] },
      { name: 'Accessories', subs: ['Bags'] },
    ],
    products: [
      P('Printed Lawn 3-Piece', 'Womenswear', 'Unstitched', 6490, 'suit', 'fabric,textile'),
      P('Embroidered Kurta', 'Womenswear', 'Stitched', 3990, 'each', 'kurta,dress'),
      P('Silk Dupatta', 'Womenswear', 'Dupattas', 1890, 'each', 'scarf,silk'),
      P('Men’s Shalwar Kameez', 'Menswear', 'Shalwar Kameez', 5490, 'each', 'mens,clothing'),
      P('Cotton Kurta', 'Menswear', 'Kurta', 2990, 'each', 'shirt,men'),
      P('Leather Peshawari', 'Footwear', 'Khussa', 4990, 'pair', 'leather,sandals'),
      P('Woven Clutch Bag', 'Accessories', 'Bags', 2290, 'each', 'handbag,clutch'),
    ],
  },
  {
    id: 'hyperstar', name: 'Hyperstar Clifton', initials: 'HS', color: '#ff9800',
    industry: 'Electronics', rating: 4.5, followers: 15600, distanceKm: 4.7,
    tagline: 'Big brands, bigger savings', stores: 2,
    cats: [
      { name: 'Computers', subs: ['Laptops'] },
      { name: 'Audio', subs: ['Headphones', 'Power Banks'] },
      { name: 'Mobiles', subs: ['Smartphones'] },
      { name: 'Appliances', subs: ['Kitchen', 'Television'] },
    ],
    products: [
      P('HP Pavilion 15 i5', 'Computers', 'Laptops', 154900, 'each', 'laptop'),
      P('Sony WH-1000XM5', 'Audio', 'Headphones', 89900, 'each', 'headphones'),
      P('Anker PowerBank 20K', 'Audio', 'Power Banks', 6490, 'each', 'powerbank'),
      P('Samsung A55 5G', 'Mobiles', 'Smartphones', 119900, 'each', 'smartphone'),
      P('Air Fryer 5.5L', 'Appliances', 'Kitchen', 22900, 'each', 'airfryer,kitchen'),
      P('Smart LED 43"', 'Appliances', 'Television', 74900, 'each', 'television'),
    ],
  },
  {
    id: 'naheed', name: 'Naheed Supermarket', initials: 'NS', color: '#eb445a',
    industry: 'Grocery & Supermarket', rating: 4.4, followers: 9800, distanceKm: 2.9,
    tagline: 'Your neighbourhood grocer', stores: 2,
    cats: [
      { name: 'Fruits & Veg', subs: ['Fresh Fruit'] },
      { name: 'Dairy', subs: ['Milk & Yogurt', 'Butter & Cheese'] },
      { name: 'Bakery', subs: ['Cakes', 'Bread'] },
      { name: 'Snacks', subs: ['Nuts'] },
    ],
    products: [
      P('Fresh Apples 1kg', 'Fruits & Veg', 'Fresh Fruit', 420, 'kg', 'apples,fruit'),
      P('Yogurt 1kg', 'Dairy', 'Milk & Yogurt', 360, 'each', 'yogurt'),
      P('Butter 200g', 'Dairy', 'Butter & Cheese', 540, 'each', 'butter'),
      P('Chocolate Cake Slice', 'Bakery', 'Cakes', 280, 'each', 'chocolate,cake'),
      P('Whole Wheat Bread', 'Bakery', 'Bread', 190, 'each', 'bread,loaf'),
      P('Salted Cashews 250g', 'Snacks', 'Nuts', 890, 'each', 'cashew,nuts'),
    ],
  },
  {
    id: 'jalalsons', name: 'Jalal Sons', initials: 'JS', color: '#1a2d6b',
    industry: 'Bakery & Sweets', rating: 4.7, followers: 13400, distanceKm: 1.8,
    tagline: 'Fresh bakes since 1976', stores: 5,
    cats: [
      { name: 'Cakes', subs: ['Whole Cakes', 'Slices & Jars'] },
      { name: 'Breads', subs: ['Pastries', 'Savoury'] },
      { name: 'Snacks', subs: ['Patties'] },
      { name: 'Beverages', subs: ['Juices'] },
    ],
    products: [
      P('Chocolate Fudge Cake 1lb', 'Cakes', 'Whole Cakes', 1450, 'lb', 'chocolate,cake'),
      P('Red Velvet Jar', 'Cakes', 'Slices & Jars', 640, 'each', 'dessert,jar'),
      P('Croissant (Pack of 4)', 'Breads', 'Pastries', 520, 'pack', 'croissant'),
      P('Garlic Bread', 'Breads', 'Savoury', 380, 'each', 'garlic,bread'),
      P('Chicken Patties (6)', 'Snacks', 'Patties', 600, 'box', 'pastry,snack'),
      P('Fresh Orange Juice 500ml', 'Beverages', 'Juices', 320, 'each', 'orange,juice'),
      P('Tea-Time Party Box', 'Snacks', 'Patties', 1490, 'box', 'party,platter,snacks'),
    ],
  },
  {
    id: 'watsons', name: 'Watsons Pharmacy', initials: 'WP', color: '#2dd36f',
    industry: 'Pharmacy & Health', rating: 4.6, followers: 7600, distanceKm: 3.1,
    tagline: 'Health & wellness essentials', stores: 3,
    cats: [
      { name: 'Medicine', subs: ['Pain Relief', 'First Aid'] },
      { name: 'Wellness', subs: ['Vitamins'] },
      { name: 'Skincare', subs: ['Moisturisers'] },
      { name: 'Baby Care', subs: ['Wipes & Diapers'] },
    ],
    products: [
      P('Panadol Extra (20 tabs)', 'Medicine', 'Pain Relief', 260, 'pack', 'medicine,pills'),
      P('Digital Thermometer', 'Medicine', 'First Aid', 890, 'each', 'thermometer'),
      P('Hand Sanitiser 500ml', 'Medicine', 'First Aid', 420, 'each', 'sanitiser'),
      P('Vitamin C 1000mg', 'Wellness', 'Vitamins', 1290, 'bottle', 'vitamins,supplement'),
      P('CeraVe Moisturiser', 'Skincare', 'Moisturisers', 3490, 'each', 'skincare,cream'),
      P('Baby Wipes (72)', 'Baby Care', 'Wipes & Diapers', 640, 'pack', 'baby,wipes'),
    ],
  },
  {
    id: 'homebox', name: 'HomeBox Living', initials: 'HB', color: '#7c4dff',
    industry: 'Home & Living', rating: 4.3, followers: 5400, distanceKm: 4.9,
    tagline: 'Everything for a beautiful home', stores: 1,
    cats: [
      { name: 'Kitchen', subs: ['Cookware', 'Dinnerware'] },
      { name: 'Decor', subs: ['Candles', 'Wall Decor'] },
      { name: 'Bedding', subs: ['Bedsheets'] },
      { name: 'Storage', subs: ['Organisers'] },
    ],
    products: [
      P('Non-stick Pan Set', 'Kitchen', 'Cookware', 4890, 'set', 'cookware,pan'),
      P('Ceramic Dinner Set (18pc)', 'Kitchen', 'Dinnerware', 7490, 'set', 'plates,dinnerware'),
      P('Scented Candle Trio', 'Decor', 'Candles', 1290, 'set', 'candles'),
      P('Wall Clock Minimal', 'Decor', 'Wall Decor', 1690, 'each', 'wall,clock'),
      P('Cotton Bedsheet Queen', 'Bedding', 'Bedsheets', 3990, 'each', 'bedsheet,linen'),
      P('Storage Baskets (3)', 'Storage', 'Organisers', 2290, 'set', 'basket,storage'),
    ],
  },
]

// stable product id + fast lookup (pid → { p, b })
export const PID = {}
BUSINESSES.forEach((b) =>
  b.products.forEach((p, i) => {
    p.pid = b.id + '-' + i
    p.bizId = b.id
    PID[p.pid] = { p, b }
  }),
)

// discount % keyed by product name → drives the "Deals for you" rail
export const DISCOUNTS = {
  'Coca-Cola 1.5L': 15, 'Lays Masala 80g': 25, 'Surf Excel 1kg': 20,
  'Sony WH-1000XM5': 10, 'Embroidered Kurta': 30, 'Air Fryer 5.5L': 18,
  'Croissant (Pack of 4)': 20, 'CeraVe Moisturiser': 15, 'Non-stick Pan Set': 22,
  'Samsung A55 5G': 8,
}

// ── Helpers ──
export const money = (n) => 'Rs.' + n.toLocaleString('en-PK')
export const fFollowers = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : '' + n)
export const iconFor = (cat) => CAT_ICON[cat] || 'pricetag-outline'

export function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return h
}

export function allProducts() {
  const out = []
  BUSINESSES.forEach((b) => b.products.forEach((p) => out.push({ ...p, biz: b })))
  return out
}

export function platformCategories() {
  const map = {}
  BUSINESSES.forEach((b) => {
    b.products.forEach((p) => {
      if (!map[p.cat]) map[p.cat] = { name: p.cat, products: 0, bizIds: new Set() }
      map[p.cat].products++
      map[p.cat].bizIds.add(b.id)
    })
  })
  return Object.values(map)
    .map((c) => ({ name: c.name, products: c.products, stores: c.bizIds.size }))
    .sort((a, b) => b.products - a.products)
}

export function unitPrice(p) {
  const d = DISCOUNTS[p.name]
  return d ? Math.round(p.price * (1 - d / 100)) : p.price
}

// ── Product imagery (keyword-based photos with stable seed + icon fallback) ──
function imgKeyword(p) {
  let kw = p.img
  if (!kw) {
    kw = p.name
      .replace(/\(.*?\)/g, '')
      .replace(/\b(\d+[a-z]*|kg|g|ml|l|lb|mg|pack|tray|box|set|pair|suit|can|bag|bottle|dozen|each|pcs?|classic|extra|5g)\b/gi, '')
      .replace(/[^a-zA-Z ]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .join(',')
  }
  return kw || p.cat
}
function flickr(kw, size, lock) {
  return 'https://loremflickr.com/' + size + '/' + size + '/' + encodeURIComponent(kw) + '?lock=' + lock
}
export function imgUrl(p) {
  return flickr(imgKeyword(p), 320, (Math.abs(hashStr(p.name)) % 90) + 1)
}
export function productImages(p, n = 4, size = 640) {
  const kw = imgKeyword(p)
  const base = (Math.abs(hashStr(p.name)) % 70) + 1
  const out = []
  for (let i = 0; i < n; i++) out.push(flickr(kw, size, base + i * 11))
  return out
}

export function getDeals() {
  return allProducts()
    .filter((p) => DISCOUNTS[p.name])
    .map((p) => {
      const disc = DISCOUNTS[p.name]
      return { ...p, disc, oldPrice: p.price, price: Math.round(p.price * (1 - disc / 100)) }
    })
    .sort((a, b) => b.disc - a.disc)
}
