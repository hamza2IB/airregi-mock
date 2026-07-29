import { hashStr } from './catalog'

// Mirrors what the owner/warehouse portal captures per product:
// type, variant options, bundle contents, description, spec details.
export const PRODUCT_META = {
  'Printed Lawn 3-Piece': { type: 'variant', desc: 'Premium unstitched lawn suit with intricate digital prints — includes shirt, trouser and dupatta. Perfect for summer stitching.', options: [{ name: 'Size', values: ['S', 'M', 'L', 'XL'] }], specs: { Material: '100% Lawn Cotton', Includes: 'Shirt · Trouser · Dupatta', 'Country of Origin': 'Pakistan', Care: 'Dry clean recommended' } },
  'Embroidered Kurta': { type: 'variant', desc: 'Ready-to-wear embroidered kurta with a regular fit, crafted from breathable cotton blend.', options: [{ name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] }, { name: 'Colour', values: ['Ivory', 'Black', 'Teal'] }], specs: { Material: 'Cotton blend', Fit: 'Regular', 'Country of Origin': 'Pakistan', Care: 'Machine wash cold' } },
  'Silk Dupatta': { type: 'variant', desc: 'Lightweight pure-silk dupatta with a soft drape and finished edges.', options: [{ name: 'Colour', values: ['Maroon', 'Emerald', 'Gold', 'Navy'] }], specs: { Material: '100% Silk', Length: '2.5 m', 'Country of Origin': 'Pakistan' } },
  'Men’s Shalwar Kameez': { type: 'variant', desc: 'Classic stitched shalwar kameez in a tailored fit — an everyday staple.', options: [{ name: 'Size', values: ['S', 'M', 'L', 'XL', 'XXL'] }, { name: 'Colour', values: ['White', 'Grey', 'Beige'] }], specs: { Material: 'Wash & wear', Fit: 'Tailored', 'Country of Origin': 'Pakistan' } },
  'Cotton Kurta': { type: 'variant', desc: 'Soft cotton kurta for daily comfort.', options: [{ name: 'Size', values: ['S', 'M', 'L', 'XL'] }], specs: { Material: '100% Cotton', Fit: 'Relaxed', 'Country of Origin': 'Pakistan' } },
  'Leather Peshawari': { type: 'variant', desc: 'Handcrafted genuine-leather Peshawari chappal with a cushioned sole.', options: [{ name: 'Size', values: ['6', '7', '8', '9', '10', '11'] }], specs: { Material: 'Genuine leather', Sole: 'Rubber grip', 'Country of Origin': 'Pakistan', Warranty: '30-day stitching warranty' } },
  'Woven Clutch Bag': { type: 'variant', desc: 'Hand-woven clutch with detachable strap and magnetic clasp.', options: [{ name: 'Colour', values: ['Tan', 'Black', 'Rust'] }], specs: { Material: 'Woven jute + faux leather', Dimensions: '24 × 14 cm', 'Country of Origin': 'Pakistan' } },
  'HP Pavilion 15 i5': { type: 'variant', desc: '15.6-inch full-HD laptop powered by 12th-gen Intel Core i5 — built for work and everyday multitasking.', options: [{ name: 'RAM', values: ['8GB', '16GB'] }, { name: 'Storage', values: ['512GB SSD', '1TB SSD'] }], specs: { Processor: 'Intel Core i5-1335U', Display: '15.6" FHD IPS', Graphics: 'Intel Iris Xe', Warranty: '1-year official', 'Country of Origin': 'China' } },
  'Sony WH-1000XM5': { type: 'variant', desc: 'Industry-leading noise-cancelling over-ear headphones with 30-hour battery life.', options: [{ name: 'Colour', values: ['Black', 'Silver'] }], specs: { Type: 'Over-ear, ANC', Battery: 'Up to 30 hours', Connectivity: 'Bluetooth 5.2', Warranty: '1-year official' } },
  'Anker PowerBank 20K': { desc: '20,000mAh power bank with fast charging and dual USB output.', specs: { Capacity: '20,000 mAh', Output: 'USB-C PD 20W', Warranty: '18-month warranty' } },
  'Samsung A55 5G': { type: 'variant', desc: '6.6-inch Super AMOLED 5G smartphone with a 50MP triple camera and all-day battery.', options: [{ name: 'Storage', values: ['128GB', '256GB'] }, { name: 'Colour', values: ['Awesome Navy', 'Lilac', 'Lemon'] }], specs: { Display: '6.6" Super AMOLED 120Hz', Battery: '5000 mAh', Camera: '50MP + 12MP + 5MP', Warranty: '1-year official' } },
  'Air Fryer 5.5L': { desc: 'Family-size 5.5L air fryer with rapid-air technology and digital controls.', specs: { Capacity: '5.5 L', Power: '1700 W', Warranty: '1-year warranty', 'Country of Origin': 'China' } },
  'Smart LED 43"': { type: 'variant', desc: '43-inch Full-HD Smart LED TV with built-in streaming apps.', options: [{ name: 'Size', values: ['43"', '50"', '55"'] }], specs: { Resolution: '1920 × 1080 FHD', 'Smart OS': 'Android TV', Warranty: '2-year panel warranty' } },
  'Basmati Rice 5kg': { desc: 'Aged extra-long-grain basmati rice — aromatic and fluffy every time.', specs: { Weight: '5 kg', Type: 'Extra long grain', 'Country of Origin': 'Pakistan', Storage: 'Store in a cool, dry place' } },
  'Coca-Cola 1.5L': { desc: 'Chilled classic Coca-Cola, 1.5-litre bottle.', specs: { Volume: '1.5 L', Type: 'Carbonated soft drink', Storage: 'Best served chilled' } },
  'Nestlé Milk Pak 1L': { desc: 'UHT full-cream milk, 1-litre pack.', specs: { Volume: '1 L', Type: 'UHT full cream', Storage: 'Refrigerate after opening', Shelf: '6 months (sealed)' } },
  'Farm Eggs (Tray of 30)': { desc: 'Farm-fresh eggs, tray of 30.', specs: { Quantity: '30 eggs', Grade: 'Medium', Storage: 'Refrigerate' } },
  'Lays Masala 80g': { desc: 'Crispy potato chips, masala flavour.', specs: { Weight: '80 g', Flavour: 'Masala', Storage: 'Store in a dry place' } },
  'Surf Excel 1kg': { desc: 'High-performance detergent powder for tough stains.', specs: { Weight: '1 kg', Type: 'Detergent powder', Usage: 'Machine & hand wash' } },
  'Nescafé Classic 100g': { desc: 'Rich instant coffee, 100g jar.', specs: { Weight: '100 g', Type: 'Instant coffee', 'Country of Origin': 'Pakistan' } },
  'CeraVe Moisturiser': { desc: 'Daily moisturising cream with hyaluronic acid and ceramides.', specs: { Volume: '340 g', 'Skin Type': 'Normal to dry', Ingredients: 'Hyaluronic acid, 3 ceramides', 'Country of Origin': 'USA' } },
  'Vitamin C 1000mg': { desc: 'High-strength Vitamin C supplement to support immunity.', specs: { Count: '60 tablets', Dosage: '1000 mg', Storage: 'Store below 30°C' } },
  'Panadol Extra (20 tabs)': { desc: 'Fast pain relief with paracetamol and caffeine.', specs: { Count: '20 tablets', 'Active Ingredient': 'Paracetamol 500mg + Caffeine', Storage: 'Store below 30°C' } },
  'Baby Wipes (72)': { desc: 'Gentle, alcohol-free baby wipes.', specs: { Count: '72 wipes', Feature: 'Alcohol-free, aloe vera', 'Skin Type': 'Sensitive' } },
  'Non-stick Pan Set': { desc: 'Durable non-stick cookware set with heat-resistant handles.', specs: { Includes: '2 pans + lid', Material: 'Aluminium, non-stick coating', Compatibility: 'Gas & induction', Warranty: '6-month warranty' } },
  'Ceramic Dinner Set (18pc)': { desc: '18-piece ceramic dinner set for six.', specs: { Pieces: '18 (serves 6)', Material: 'Ceramic', 'Microwave Safe': 'Yes', 'Dishwasher Safe': 'Yes' } },
  'Cotton Bedsheet Queen': { type: 'variant', desc: 'Soft cotton queen bedsheet with two pillowcases.', options: [{ name: 'Colour', values: ['White', 'Grey', 'Blue', 'Blush'] }], specs: { Size: 'Queen (90 × 100 in)', Material: '100% Cotton', Includes: '1 sheet + 2 pillowcases' } },
  'Chocolate Fudge Cake 1lb': { desc: 'Rich, moist chocolate fudge cake — freshly baked daily.', specs: { Weight: '1 lb', Flavour: 'Chocolate fudge', 'Best Before': '2 days', Storage: 'Refrigerate' } },
  'Tea-Time Party Box': {
    type: 'bundle',
    desc: 'A ready-made tea-time platter — everything you need for guests, bundled at a saving.',
    bundle: [
      { name: 'Croissant (Pack of 4)', qty: 1 },
      { name: 'Chicken Patties (6)', qty: 1 },
      { name: 'Fresh Orange Juice 500ml', qty: 2 },
    ],
    specs: { Serves: '3–4 people', 'Best Before': 'Same day', Storage: 'Consume fresh' },
  },
}

export function productMeta(p) {
  const m = PRODUCT_META[p.name] || {}
  return { type: m.type || 'simple', desc: m.desc || '', options: m.options || [], bundle: m.bundle || [], specs: m.specs || {} }
}

const UOM = { each: 'Piece', kg: 'Kg', dozen: 'Dozen', tray: 'Tray', pack: 'Pack', box: 'Box', bag: 'Bag', can: 'Can', bottle: 'Bottle', pair: 'Pair', suit: 'Suit', lb: 'Pound', set: 'Set' }
export const uomLabel = (p) => UOM[p.unit] || 'Piece'
export const stockOf = (p) => (Math.abs(hashStr(p.pid + 'stk')) % 220) + 6

// surcharge for premium option tiers (RAM / storage / TV size); size/colour = 0
export function optSurcharge(o, sel) {
  const idx = o.values.indexOf(sel)
  if (idx <= 0) return 0
  const n = o.name.toLowerCase()
  if (n.includes('ram')) return idx * 15000
  if (n.includes('storage')) return idx * 20000
  if (n === 'size' && /["”]/.test(sel)) return idx * 20000
  return 0
}
