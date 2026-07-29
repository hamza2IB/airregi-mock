// Air Register POS — catalog, customers, coupons & config.
// Ported from dummy/pos-shared.js so both views share one source of truth.

// discount: { type: 'percent'|'flat', value: number, label: string }
export const CATALOG = [
  { sku: '8964000100011', name: 'Nestle Water 1.5L', price: 40, icon: 'water-outline', img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=80&h=80&fit=crop' },
  { sku: '8964000100028', name: "Olper's Milk 1L", price: 180, icon: 'nutrition-outline', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=80&h=80&fit=crop', discount: { type: 'percent', value: 10, label: '10% OFF' } },
  { sku: '8964000100035', name: 'Pepsi 500ml', price: 80, icon: 'beer-outline', img: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=80&h=80&fit=crop' },
  { sku: '8964000100042', name: 'Sooper Biscuits', price: 30, icon: 'pizza-outline', img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&h=80&fit=crop' },
  { sku: '8964000100059', name: 'Lays Classic', price: 50, icon: 'fast-food-outline', img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=80&h=80&fit=crop', discount: { type: 'flat', value: 10, label: 'Rs.10 OFF' } },
  { sku: '8964000100066', name: 'Dairy Milk', price: 100, icon: 'heart-outline', img: 'https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=80&h=80&fit=crop' },
  { sku: '8964000100073', name: 'Shan Biryani Masala', price: 85, icon: 'restaurant-outline', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=80&h=80&fit=crop' },
  { sku: '8964000100080', name: 'Tapal Tea 500g', price: 480, icon: 'cafe-outline', img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=80&h=80&fit=crop', discount: { type: 'percent', value: 5, label: '5% OFF' } },
]

export const QUICK_ADD = [
  { name: 'Plastic Bag S', price: 10, icon: 'bag-outline', isQuick: true, img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=80&h=80&fit=crop' },
  { name: 'Plastic Bag L', price: 20, icon: 'bag-outline', isQuick: true, img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=80&h=80&fit=crop' },
  { name: 'Paper Bag', price: 15, icon: 'newspaper-outline', isQuick: true, img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=80&h=80&fit=crop' },
  { name: 'Bottle Deposit', price: 5, icon: 'water-outline', isQuick: true, img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=80&h=80&fit=crop' },
]

export const CUSTOMERS = {
  a: {
    userId: 'AH-12345678',
    name: 'Ahmed Hassan', initial: 'A', area: 'Clifton, Karachi',
    title: 'Mr.', lastName: 'Hassan',
    visits: 15, lifetime: 'Rs.62,400', last: '3 days ago',
    loyaltyPoints: 1240, loyaltyTier: 'Gold',
    phone: '0300-1111111',
  },
  b: {
    userId: 'FK-87654321',
    name: 'Fatima Khan', initial: 'F', area: 'DHA Phase 5, Karachi',
    title: 'Ms.', lastName: 'Khan',
    visits: 4, lifetime: 'Rs.8,200', last: '2 weeks ago',
    loyaltyPoints: 320, loyaltyTier: 'Silver',
    phone: '0321-2222222',
  },
}

export const STAFF_CREDENTIALS = [
  { id: 'S001', username: 'hamza', pin: '1234', name: 'Hamza' },
  { id: 'S002', username: 'ali', pin: '5678', name: 'Ali' },
  { id: 'S003', username: 'bilal', pin: '0000', name: 'Bilal' },
]

export const COUPONS = [
  { code: 'SAVE50', type: 'flat', value: 50, label: 'Rs.50 OFF', minOrder: 200, description: 'Rs.50 off on orders above Rs.200' },
  { code: 'WELCOME10', type: 'percent', value: 10, label: '10% OFF', minOrder: 0, description: '10% off for new customers', maxDiscount: 500 },
  { code: 'FRIDAY20', type: 'percent', value: 20, label: '20% OFF', minOrder: 500, description: '20% off on orders above Rs.500', maxDiscount: 1000 },
  { code: 'FLAT100', type: 'flat', value: 100, label: 'Rs.100 OFF', minOrder: 1000, description: 'Rs.100 off on orders above Rs.1000' },
]

export const LOYALTY_CONFIG = {
  earnPerRupees: 10,
  redemptionRate: 10, // 10 points = Rs.1
  minRedeemPoints: 100,
  maxRedeemPercent: 50,
  tierThresholds: { Member: 500, Silver: 1000, Gold: 2500, Platinum: 5000 },
}

export const STORE_CONFIG = {
  name: 'Clifton Mart',
  address: 'Shop 4, Block 5, Clifton, Karachi',
  phone: '021-3583-0000',
  storeCode: 'CLF01',
  strn: '17-00-1234-567-89',
  ntn: '1234567-8',
  terminal: 'Register 1',
  logo: '',
  policies: [
    'OPEN 7 DAYS/WEEK (8:00 AM - 11:45 PM).',
    "FRIDAY'S BREAK (12:30 PM - 2:30 PM).",
    'FOR REFUND & EXCHANGE ON UNUSED ITEMS PLEASE BRING RECEIPT WITHIN 07 DAYS.',
    'NO REFUND OR EXCHANGE ON BAKERY AND DELI PRODUCTS.',
    'TERMS AND CONDITION APPLY.',
  ],
}

// ===== Help / FAQ content (US_COMMON_518) =====
export const FAQ_ITEMS = [
  { q: 'How do I add a product without a barcode?', a: 'Type the product name in the search bar at the top of the Register screen. Matching products appear in a dropdown — tap one to add it to the cart. Products without barcodes show "NO-BARCODE" in the cart.' },
  { q: 'How do I reprint a receipt for a past sale?', a: 'Tap "Orders" in the header, find the transaction, tap it to expand the details, then tap "Print". The full receipt including the FBR invoice number and QR code is regenerated exactly as originally issued.' },
  { q: 'How do I process a return or refund?', a: 'Open "Orders", expand the transaction, and tap "Return". Select the items to return, choose Refund or Exchange, pick a reason, and confirm. Refunds always go back to the original payment method. Cash refunds are deducted from the drawer and reflected in Close Day.' },
  { q: 'What do I do if the cash drawer does not balance at Close Day?', a: 'Recount the cash carefully, check for missed refunds or held orders, and enter the actual amount in "Actual Cash Count". The difference (over/short) is recorded on the shift closing report. Add an explanation in the Notes field for the manager.' },
  { q: 'How do I close my shift and log out?', a: 'Tap "Close" in the header, count the drawer, enter the Actual Cash Count, and tap "Close Day". Review the Shift Closing Report, print it if needed, then tap "End Shift & Logout". Resolve any held orders first — the register locks until the next staff logs in.' },
  { q: 'What is the FBR invoice number and QR code on receipts?', a: 'Every receipt carries an FBR (Federal Board of Revenue) invoice number and a verification QR code, as required for POS-integrated retailers in Pakistan. Customers can scan the QR to verify the invoice with FBR. Never hand-edit or skip these.' },
]
