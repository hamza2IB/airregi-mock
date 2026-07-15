/**
 * Air Register POS — Shared state & communication layer
 * Used by both V3 (cashier) and V4 (customer display).
 * Communication via BroadcastChannel API for cross-tab real-time sync.
 */

// ===== Catalog =====
// discount: { type: 'percent'|'flat', value: number, label: string } — set from admin portal
const CATALOG = [
  { sku: '8964000100011', name: 'Nestle Water 1.5L', price: 40, icon: 'water-outline', color: 'brand-blue', img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=80&h=80&fit=crop' },
  { sku: '8964000100028', name: "Olper's Milk 1L",   price: 180, icon: 'nutrition-outline', color: 'brand-green', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=80&h=80&fit=crop', discount: { type: 'percent', value: 10, label: '10% OFF' } },
  { sku: '8964000100035', name: 'Pepsi 500ml',       price: 80,  icon: 'beer-outline', color: 'brand-red', img: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=80&h=80&fit=crop' },
  { sku: '8964000100042', name: 'Sooper Biscuits',   price: 30,  icon: 'pizza-outline', color: 'brand-orange', img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&h=80&fit=crop' },
  { sku: '8964000100059', name: 'Lays Classic',      price: 50,  icon: 'fast-food-outline', color: 'brand-purple', img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=80&h=80&fit=crop', discount: { type: 'flat', value: 10, label: 'Rs.10 OFF' } },
  { sku: '8964000100066', name: 'Dairy Milk',        price: 100, icon: 'heart-outline', color: 'brand-red', img: 'https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=80&h=80&fit=crop' },
  { sku: '8964000100073', name: 'Shan Biryani Masala', price: 85, icon: 'restaurant-outline', color: 'brand-orange', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=80&h=80&fit=crop' },
  { sku: '8964000100080', name: 'Tapal Tea 500g',    price: 480, icon: 'cafe-outline', color: 'brand-purple', img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=80&h=80&fit=crop', discount: { type: 'percent', value: 5, label: '5% OFF' } },
];

const QUICK_ADD = [
  { name: 'Plastic Bag S',  price: 10, icon: 'bag-outline', color: 'gray-500', isQuick: true, img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=80&h=80&fit=crop' },
  { name: 'Plastic Bag L',  price: 20, icon: 'bag-outline', color: 'gray-700', isQuick: true, img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=80&h=80&fit=crop' },
  { name: 'Paper Bag',      price: 15, icon: 'newspaper-outline', color: 'brand-orange', isQuick: true, img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=80&h=80&fit=crop' },
  { name: 'Bottle Deposit', price: 5,  icon: 'water-outline', color: 'brand-blue', isQuick: true, img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=80&h=80&fit=crop' },
];

const CUSTOMERS = {
  a: {
    userId: 'AH-12345678',
    name: 'Ahmed Hassan', initial: 'A', area: 'Clifton, Karachi',
    title: 'Mr.', lastName: 'Hassan',
    visits: 15, lifetime: 'Rs.62,400', last: '3 days ago',
    note: 'Groceries, Dairy', rec: 'Groceries, Dairy', favorite: true,
    loyaltyPoints: 1240, loyaltyTier: 'Gold',
    phone: '0300-1111111',
  },
  b: {
    userId: 'FK-87654321',
    name: 'Fatima Khan', initial: 'F', area: 'DHA Phase 5, Karachi',
    title: 'Ms.', lastName: 'Khan',
    visits: 4, lifetime: 'Rs.8,200', last: '2 weeks ago',
    note: 'Bakery, Snacks', rec: 'Bakery, Snacks', favorite: false,
    loyaltyPoints: 320, loyaltyTier: 'Silver',
    phone: '0321-2222222',
  }
};

// ===== Store Config (single source for receipt identifiers / policies) =====
const STORE_CONFIG = {
  name: 'Clifton Mart',
  address: 'Shop 4, Block 5, Clifton, Karachi',
  phone: '021-3583-0000',
  storeCode: 'CLF01',
  strn: '17-00-1234-567-89',
  ntn: '1234567-8',
  terminal: 'Register 1',
  logo: '../img/CLIFTON-MARKET icon.jpg',
  policies: [
    'OPEN 7 DAYS/WEEK (8:00 AM - 11:45 PM).',
    "FRIDAY'S BREAK (12:30 PM - 2:30 PM).",
    'FOR REFUND & EXCHANGE ON UNUSED ITEMS PLEASE BRING RECEIPT WITHIN 07 DAYS.',
    'NO REFUND OR EXCHANGE ON BAKERY AND DELI PRODUCTS.',
    'TERMS AND CONDITION APPLY.',
  ],
};

// ===== FBR Invoice Counter (persisted so reprints reuse the original number) =====
function nextFbrInvoice() {
  const key = 'air-register-fbr-counter';
  const seq = (parseInt(localStorage.getItem(key), 10) || 0) + 1;
  localStorage.setItem(key, String(seq));
  return `${STORE_CONFIG.storeCode}-${String(seq).padStart(8, '0')}`;
}

function fbrVerifyUrl(fbrInvoice, amount) {
  return `https://fbr.gov.pk/verify?inv=${encodeURIComponent(fbrInvoice)}&ntn=${encodeURIComponent(STORE_CONFIG.ntn)}&amount=${amount}`;
}

// ===== Loyalty Points Config =====
const LOYALTY_CONFIG = {
  earnPerRupees: 10,       // Earn 1 point per Rs.10 spent
  redemptionRate: 10,      // 10 points = Rs.1 discount
  minRedeemPoints: 100,    // Minimum 100 points to redeem
  maxRedeemPercent: 50,    // Can't redeem more than 50% of order total
  tierThresholds: { Member: 500, Silver: 1000, Gold: 2500, Platinum: 5000 },
};

// ===== BroadcastChannel for V3 ↔ V4 sync =====
const posChannel = new BroadcastChannel('air-register-pos');

/**
 * Send a message to the other side (V3 → V4 or V4 → V3).
 * @param {string} type - Message type
 * @param {object} payload - Message data
 */
function posSend(type, payload) {
  posChannel.postMessage({ type, payload, ts: Date.now() });
}

/**
 * Listen for messages from the other side.
 * @param {function} handler - (type, payload) => void
 */
function posListen(handler) {
  posChannel.onmessage = (event) => {
    const { type, payload } = event.data;
    handler(type, payload);
  };
}

// ===== Coupons =====
const COUPONS = [
  { code: 'SAVE50',    type: 'flat',    value: 50,  label: 'Rs.50 OFF',  minOrder: 200,  description: 'Rs.50 off on orders above Rs.200' },
  { code: 'WELCOME10', type: 'percent', value: 10,  label: '10% OFF',    minOrder: 0,    description: '10% off for new customers', maxDiscount: 500 },
  { code: 'FRIDAY20',  type: 'percent', value: 20,  label: '20% OFF',    minOrder: 500,  description: '20% off on orders above Rs.500', maxDiscount: 1000 },
  { code: 'FLAT100',   type: 'flat',    value: 100, label: 'Rs.100 OFF', minOrder: 1000, description: 'Rs.100 off on orders above Rs.1000' },
];

// ===== Utility =====
function getEffectivePrice(item) {
  if (!item.discount) return item.price;
  if (item.discount.type === 'percent') return Math.round(item.price * (1 - item.discount.value / 100));
  if (item.discount.type === 'flat') return Math.max(0, item.price - item.discount.value);
  return item.price;
}

function calcCouponDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  if (subtotal < coupon.minOrder) return 0;
  if (coupon.type === 'flat') return coupon.value;
  if (coupon.type === 'percent') {
    const discount = Math.round(subtotal * (coupon.value / 100));
    return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
  }
  return 0;
}

function calcTotals(cart, appliedCoupon, redeemedPoints) {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const sub = cart.reduce((s, i) => s + getEffectivePrice(i) * i.qty, 0);
  const totalDiscount = cart.reduce((s, i) => s + (i.price - getEffectivePrice(i)) * i.qty, 0);
  const couponDiscount = calcCouponDiscount(appliedCoupon, sub);
  const taxableSub = sub - couponDiscount;
  const tax = Math.round(taxableSub * 0.16);
  const totalBeforePoints = taxableSub + tax;
  const pointsDiscount = redeemedPoints ? Math.round(redeemedPoints / LOYALTY_CONFIG.redemptionRate) : 0;
  const total = Math.max(0, totalBeforePoints - pointsDiscount);
  return { count, sub, tax, total, totalDiscount, couponDiscount, pointsDiscount, totalBeforePoints };
}

/**
 * Display values for the current GST mode. In GST-included mode prices already
 * contain 16% GST, so tax is backed out of the coupon-adjusted subtotal.
 * Both V3 and V4 must render these values so the two screens always match.
 */
function calcDisplayTotals(totals, gstIncluded) {
  const { sub, tax, total, couponDiscount, pointsDiscount } = totals;
  if (!gstIncluded) return { displaySub: sub, displayTax: tax, displayTotal: total };
  const afterCoupon = sub - couponDiscount;
  const displayTotal = Math.max(0, afterCoupon - pointsDiscount);
  const displayTax = Math.round(afterCoupon - (afterCoupon / 1.16));
  return { displaySub: afterCoupon - displayTax, displayTax, displayTotal };
}
