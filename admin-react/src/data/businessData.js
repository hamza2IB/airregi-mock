// All-businesses dataset — ported from BIZ_DATA in the original admin.html.
// Profile fields shown in the detail drawer are derived on the fly (see
// deriveProfile in BusinessDrawer), matching the original behaviour, so only
// storeList / ownerEmail / suspendReason are carried where they existed.
export const BIZ_DATA = [
  {
    id: 1, name: 'Al Fatah Mall', city: 'Lahore', owner: 'Khalid Mehmood',
    ownerEmail: 'khalid.mehmood@alfatah.com.pk', pkg: 'Enterprise', stores: 12, staff: 148,
    products: 4200, status: 'active', joined: 'Jan 5, 2025', subEnd: 'Jul 15, 2026', daysLeft: 2,
    storeList: [
      { name: 'Al Fatah MM Alam', city: 'Lahore', address: '24-A MM Alam Road, Gulberg III', manager: 'Salman Butt', status: 'active', staff: 14, cashiers: 6 },
      { name: 'Al Fatah DHA Phase 5', city: 'Lahore', address: 'Plot 12, DHA Phase 5', manager: 'Usman Tariq', status: 'active', staff: 10, cashiers: 4 },
      { name: 'Al Fatah Johar Town', city: 'Lahore', address: 'Block Q, Johar Town', manager: 'Ayesha Noor', status: 'active', staff: 12, cashiers: 5 },
      { name: 'Al Fatah Model Town', city: 'Lahore', address: '54-C, Model Town Extension', manager: 'Hamid Raza', status: 'active', staff: 8, cashiers: 3 },
      { name: 'Al Fatah Bahria Town', city: 'Lahore', address: 'Commercial Zone, Bahria Town', manager: 'Zara Iqbal', status: 'active', staff: 10, cashiers: 4 },
      { name: 'Al Fatah Wapda Town', city: 'Lahore', address: 'Block M, Wapda Town', manager: 'Faisal Ahmed', status: 'active', staff: 7, cashiers: 3 },
      { name: 'Al Fatah Canal Road', city: 'Lahore', address: 'Canal Bank Road, Gulshan-e-Ravi', manager: 'Sara Malik', status: 'active', staff: 9, cashiers: 4 },
      { name: 'Al Fatah Township', city: 'Lahore', address: 'Sector B, Township', manager: 'Naveed Khan', status: 'active', staff: 7, cashiers: 3 },
      { name: 'Al Fatah Ferozepur', city: 'Lahore', address: 'Ferozepur Road', manager: 'Bilal Hussain', status: 'active', staff: 6, cashiers: 3 },
      { name: 'Al Fatah Raiwind', city: 'Lahore', address: 'Raiwind Road', manager: 'Imran Shah', status: 'active', staff: 5, cashiers: 2 },
      { name: 'Al Fatah Gulshan', city: 'Lahore', address: 'Gulshan-e-Iqbal', manager: 'Asma Riaz', status: 'active', staff: 7, cashiers: 3 },
      { name: 'Al Fatah Samanabad', city: 'Lahore', address: 'Samanabad Main Road', manager: 'Talha Mir', status: 'inactive', staff: 0, cashiers: 0 },
    ],
  },
  {
    id: 2, name: 'Metro Karachi', city: 'Karachi', owner: 'Raza Hussain',
    ownerEmail: 'raza.hussain@metro-cc.com.pk', pkg: 'Pro', stores: 6, staff: 72, products: 2800,
    status: 'active', joined: 'Feb 12, 2025', subEnd: 'Jul 18, 2026', daysLeft: 5,
    storeList: [
      { name: 'Metro Korangi', city: 'Karachi', address: 'Plot 15, Korangi Industrial Area', manager: 'Owais Siddiqui', status: 'active', staff: 18, cashiers: 8 },
      { name: 'Metro Clifton', city: 'Karachi', address: 'Block 7, Clifton', manager: 'Hina Shah', status: 'active', staff: 14, cashiers: 6 },
      { name: 'Metro North Nazimabad', city: 'Karachi', address: 'Block H, North Nazimabad', manager: 'Waheed Mirza', status: 'active', staff: 12, cashiers: 5 },
      { name: 'Metro Gulshan', city: 'Karachi', address: 'Block 13-D, Gulshan-e-Iqbal', manager: 'Sana Baig', status: 'active', staff: 11, cashiers: 5 },
      { name: 'Metro Malir', city: 'Karachi', address: 'Malir Cantonment', manager: 'Arif Qureshi', status: 'active', staff: 10, cashiers: 4 },
      { name: 'Metro SITE Area', city: 'Karachi', address: 'SITE Industrial Area', manager: 'Daud Rauf', status: 'inactive', staff: 0, cashiers: 0 },
    ],
  },
  { id: 3, name: 'Jalal Sons', city: 'Lahore', owner: 'Imran Jalal', pkg: 'Starter', stores: 3, staff: 28, products: 900, status: 'active', joined: 'Mar 1, 2025', subEnd: 'Jul 19, 2026', daysLeft: 6 },
  { id: 4, name: 'DHA Grocers', city: 'Lahore', owner: 'Tariq Abbas', pkg: 'Pro', stores: 4, staff: 44, products: 1600, status: 'active', joined: 'Mar 22, 2025', subEnd: 'Jul 14, 2026', daysLeft: 1 },
  { id: 5, name: 'Hyperstar Clifton', city: 'Karachi', owner: 'Farrukh Noor', pkg: 'Enterprise', stores: 8, staff: 110, products: 3900, status: 'active', joined: 'Apr 10, 2025', subEnd: 'Jul 16, 2026', daysLeft: 3 },
  { id: 6, name: 'Naheed Supermarket', city: 'Karachi', owner: 'Nadia Saeed', pkg: 'Starter', stores: 2, staff: 18, products: 620, status: 'active', joined: 'Apr 28, 2025', subEnd: 'Jul 19, 2026', daysLeft: 6 },
  { id: 7, name: 'Khaadi Flagship', city: 'Islamabad', owner: 'Amna Qureshi', pkg: 'Pro', stores: 5, staff: 55, products: 1100, status: 'active', joined: 'May 3, 2025', subEnd: 'Jul 20, 2026', daysLeft: 7 },
  { id: 8, name: 'Packages Mall', city: 'Lahore', owner: 'Bilal Ahmed', pkg: 'Pro', stores: 4, staff: 48, products: 1350, status: 'active', joined: 'May 15, 2025', subEnd: 'Jul 17, 2026', daysLeft: 4 },
  { id: 9, name: 'Outfitters Karachi', city: 'Karachi', owner: 'Zara Malik', pkg: 'Pro', stores: 7, staff: 80, products: 2100, status: 'active', joined: 'May 20, 2025', subEnd: 'Aug 20, 2026', daysLeft: 38 },
  { id: 10, name: 'Lal Qila Restaurant', city: 'Lahore', owner: 'Hassan Rauf', pkg: 'Starter', stores: 2, staff: 22, products: 310, status: 'active', joined: 'Jun 1, 2025', subEnd: 'Aug 1, 2026', daysLeft: 19 },
  { id: 11, name: 'Gul Ahmed Fabrics', city: 'Karachi', owner: 'Sobia Gul', pkg: 'Enterprise', stores: 9, staff: 120, products: 3600, status: 'active', joined: 'Jun 5, 2025', subEnd: 'Aug 5, 2026', daysLeft: 23 },
  { id: 12, name: 'Chen One', city: 'Lahore', owner: 'Chen Waqas', pkg: 'Enterprise', stores: 7, staff: 95, products: 2900, status: 'active', joined: 'Jun 10, 2025', subEnd: 'Aug 10, 2026', daysLeft: 28 },
  { id: 13, name: 'Sapphire Retail', city: 'Lahore', owner: 'Ayesha Nawaz', pkg: 'Pro', stores: 5, staff: 60, products: 1800, status: 'active', joined: 'Jun 18, 2025', subEnd: 'Aug 18, 2026', daysLeft: 36 },
  { id: 14, name: 'Ideas by Gul Ahmed', city: 'Islamabad', owner: 'Kamran Gul', pkg: 'Pro', stores: 4, staff: 44, products: 1500, status: 'active', joined: 'Jun 22, 2025', subEnd: 'Aug 22, 2026', daysLeft: 40 },
  { id: 15, name: 'ChenOne Islamabad', city: 'Islamabad', owner: 'Sarah Chen', pkg: 'Starter', stores: 1, staff: 12, products: 480, status: 'active', joined: 'Jun 25, 2025', subEnd: 'Aug 25, 2026', daysLeft: 43 },
  { id: 16, name: 'Agha Supermarket', city: 'Karachi', owner: 'Agha Mustafa', pkg: 'Starter', stores: 2, staff: 20, products: 740, status: 'active', joined: 'Jul 1, 2025', subEnd: 'Sep 1, 2026', daysLeft: 50 },
  { id: 17, name: 'FoodPanda Partners', city: 'Lahore', owner: 'Umar Farooq', pkg: 'Starter', stores: 1, staff: 8, products: 200, status: 'active', joined: 'Jul 3, 2025', subEnd: 'Sep 3, 2026', daysLeft: 52 },
  { id: 18, name: 'Miniso Pakistan', city: 'Karachi', owner: 'Lin Wei', pkg: 'Pro', stores: 6, staff: 66, products: 2200, status: 'active', joined: 'Jul 5, 2025', subEnd: 'Sep 5, 2026', daysLeft: 54 },
  { id: 19, name: 'EBM Bakers', city: 'Lahore', owner: 'Tariq Bakshi', pkg: 'Starter', stores: 3, staff: 30, products: 580, status: 'active', joined: 'Jul 6, 2025', subEnd: 'Sep 6, 2026', daysLeft: 55 },
  { id: 20, name: 'Shan Foods Outlets', city: 'Karachi', owner: 'Sikander Shan', pkg: 'Starter', stores: 2, staff: 18, products: 420, status: 'active', joined: 'Jul 7, 2025', subEnd: 'Sep 7, 2026', daysLeft: 56 },
  { id: 21, name: 'Bonanza Satrangi', city: 'Lahore', owner: 'Waqar Sattar', pkg: 'Pro', stores: 5, staff: 55, products: 1700, status: 'active', joined: 'Jul 8, 2025', subEnd: 'Sep 8, 2026', daysLeft: 57 },
  { id: 22, name: 'Crossroads Mall', city: 'Karachi', owner: 'Rohail Shah', pkg: 'Enterprise', stores: 10, staff: 130, products: 4500, status: 'active', joined: 'Jul 9, 2025', subEnd: 'Sep 9, 2026', daysLeft: 58 },
  { id: 23, name: 'Park Lane Pharmacy', city: 'Lahore', owner: 'Asim Rauf', pkg: 'Starter', stores: 1, staff: 9, products: 310, status: 'active', joined: 'Jul 9, 2025', subEnd: 'Sep 9, 2026', daysLeft: 58 },
  { id: 24, name: 'Servis Shoes', city: 'Lahore', owner: 'Haris Servis', pkg: 'Pro', stores: 6, staff: 68, products: 1900, status: 'active', joined: 'Jul 10, 2025', subEnd: 'Sep 10, 2026', daysLeft: 59 },
  { id: 25, name: 'Hang Ten Pakistan', city: 'Islamabad', owner: 'Danial Riaz', pkg: 'Starter', stores: 2, staff: 16, products: 550, status: 'active', joined: 'Jul 10, 2025', subEnd: 'Sep 10, 2026', daysLeft: 59 },
  {
    id: 26, name: 'Zellbury', city: 'Karachi', owner: 'Faiza Siddiqui', ownerEmail: 'faiza.siddiqui@zellbury.com',
    pkg: 'Pro', stores: 3, staff: 34, products: 980, status: 'suspended', joined: 'Mar 14, 2025',
    subEnd: 'Jul 25, 2026', daysLeft: 12, suspendReason: 'Policy violation — counterfeit products.',
  },
  {
    id: 27, name: 'TrendMart', city: 'Lahore', owner: 'Nasir Khan', ownerEmail: 'nasir.khan@trendmart.pk',
    pkg: 'Starter', stores: 1, staff: 6, products: 140, status: 'banned', joined: 'Feb 2, 2025',
    subEnd: 'Jun 2, 2026', daysLeft: -41,
    storeList: [
      { name: 'TrendMart Main Branch', city: 'Lahore', address: '12-B, Cavalry Ground, Lahore', manager: 'Nasir Khan', status: 'active', staff: 6, cashiers: 2 },
    ],
  },
  { id: 28, name: 'Al Fatah Superstore', city: 'Lahore', owner: 'Ahmed Raza', pkg: 'Enterprise', stores: 0, staff: 0, products: 0, status: 'pending', joined: 'Jul 10, 2026', subEnd: '—', daysLeft: null },
  { id: 29, name: 'FreshGrocers Karachi', city: 'Karachi', owner: 'Bilal Mehmood', pkg: 'Starter', stores: 0, staff: 0, products: 0, status: 'pending', joined: 'Jul 10, 2026', subEnd: '—', daysLeft: null },
  { id: 30, name: 'Urban Threads', city: 'Lahore', owner: 'Sara Khan', pkg: 'Pro', stores: 0, staff: 0, products: 0, status: 'pending', joined: 'Jul 9, 2026', subEnd: '—', daysLeft: null },
  { id: 31, name: 'Carrefour Gulberg', city: 'Lahore', owner: 'Hamza Siddiqui', pkg: 'Pro', stores: 0, staff: 0, products: 0, status: 'pending', joined: 'Jul 9, 2026', subEnd: '—', daysLeft: null },
]

// Platform-industry classification per business id (mirrors the original
// industryId field on each business). Used by the Industries page to derive
// live "businesses classified" counts.
export const BIZ_INDUSTRY = {
  1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 2, 8: 3, 9: 2, 10: 1,
  11: 2, 12: 5, 13: 2, 14: 2, 15: 5, 16: 1, 17: 1, 18: 5, 19: 1, 20: 1,
  21: 2, 22: 3, 23: 6, 24: 2, 25: 2, 26: 2, 27: 2, 28: 1, 29: 1, 30: 2, 31: 1,
}

// Area / manager pools used to synthesize store lists for businesses that
// don't ship an explicit storeList, so every business shows proper stores.
const STORE_AREAS = [
  'Main Branch', 'City Center', 'Mall Road', 'Gulberg', 'DHA', 'Cantt', 'Saddar',
  'Model Town', 'Clifton', 'Johar Town', 'Bahria Town', 'Airport Road',
  'University Road', 'Township', 'North Branch', 'Garden Town',
]
const STORE_MANAGERS = [
  'Ali Hassan', 'Sana Tariq', 'Bilal Khan', 'Ayesha Noor', 'Usman Raza', 'Hina Malik',
  'Faisal Iqbal', 'Zara Sheikh', 'Kamran Butt', 'Nida Aslam', 'Omar Farooq', 'Rabia Javed',
  'Hamza Yousaf', 'Mariam Zahid',
]

function hashName(s) {
  let h = 0
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) & 0xffffff
  return h
}

// Deterministically generate a store list for a business, distributing its
// total staff across stores. Used when b.storeList isn't provided.
export function generateStores(b) {
  const n = b.stores
  if (!n) return []
  const h = hashName(b.name)
  const areaStart = h % STORE_AREAS.length
  const mgrStart = h % STORE_MANAGERS.length
  const base = Math.floor(b.staff / n)
  const rem = b.staff % n
  return Array.from({ length: n }, (_, i) => {
    const staff = base + (i < rem ? 1 : 0)
    const area = STORE_AREAS[(areaStart + i) % STORE_AREAS.length]
    return {
      name: `${b.name} ${area}`,
      city: b.city,
      address: `${area} Branch`,
      manager: STORE_MANAGERS[(mgrStart + i) % STORE_MANAGERS.length],
      status: 'active',
      staff,
      cashiers: Math.max(1, Math.round(staff / 2.4)),
    }
  })
}

// Prefer an explicit storeList; otherwise synthesize one.
export function getStoreList(b) {
  return b.storeList && b.storeList.length ? b.storeList : generateStores(b)
}

// Deterministic avatar colour from a name (ported from bizAvatarColor).
export function bizAvatarColor(n) {
  const c = ['#1a2d6b', '#3366cc', '#7c4dff', '#2dd36f', '#ff9800', '#0891b2', '#7c3aed', '#059669', '#dc2626', '#d97706']
  let h = 0
  for (const ch of n) h = (h * 31 + ch.charCodeAt(0)) & 0xffff
  return c[h % c.length]
}

export const STATUS_BADGE = {
  active: 'text-brand-green bg-brand-green/10',
  pending: 'text-brand-purple bg-brand-purple/10',
  suspended: 'text-brand-orange bg-brand-orange/10',
  banned: 'text-brand-red bg-brand-red/10',
}

export const STATUS_LABEL = {
  active: 'Active',
  pending: 'Pending',
  suspended: 'Suspended',
  banned: 'Banned',
}

export const PKG_COLOR = {
  Enterprise: 'bg-navy text-white',
  Pro: 'bg-brand-blue text-white',
  Starter: 'bg-gray-200 text-gray-600',
}
