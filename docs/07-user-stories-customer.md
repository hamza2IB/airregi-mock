# User Stories — Customer (Ecommerce App)

## Role Summary
The Customer interacts with the RetailOS ecommerce marketplace — a unified app where all registered businesses are visible. Customers browse products, place orders, track deliveries, and manage their loyalty coins.

---

## Epic 1: Onboarding & Account

### US-CUS-001
**As a Customer**, I want to register on the platform with my email and phone number so that I can place orders and earn loyalty coins.

**Acceptance Criteria:**
- Registration: name, email, phone, password
- OTP or email verification to activate account
- After registration: redirected to home/marketplace

### US-CUS-002
**As a Customer**, I want to log in to my account so that I can access my order history, cart, and loyalty balance.

**Acceptance Criteria:**
- Login with email/phone + password
- "Remember me" option
- Forgot password: email-based reset

### US-CUS-003
**As a Customer**, I want to manage my profile so that my delivery addresses and contact info are up to date.

**Acceptance Criteria:**
- Edit: name, email, phone
- Multiple delivery addresses: add, edit, delete, set default
- View loyalty coin balance

---

## Epic 2: Marketplace & Discovery

### US-CUS-010
**As a Customer**, I want to see all active businesses on the marketplace home page so that I can discover brands and stores.

**Acceptance Criteria:**
- Business cards: logo, name, tagline, category type (clothing/grocery/electronics etc.), rating (future)
- Featured businesses section
- Recently added businesses
- Filter by city/category

### US-CUS-011
**As a Customer**, I want to open a business's storefront page so that I can browse their full product catalog.

**Acceptance Criteria:**
- Business profile: banner, logo, name, description, categories, operating hours
- Product grid with filters
- Search within the business

### US-CUS-012
**As a Customer**, I want to search for products across all businesses so that I can find what I need quickly without knowing which brand sells it.

**Acceptance Criteria:**
- Global search bar on home page
- Results: product name, image, price, business name, in-stock status
- Filters: platform category, price range, business, brand, rating
- Sort: relevance, price low to high, price high to low, newest

### US-CUS-013
**As a Customer**, I want to browse products by platform category so that I can explore items in a structured way.

**Acceptance Criteria:**
- Category tree visible in navigation
- Selecting a category shows products from all businesses in that category
- Subcategory drill-down supported

### US-CUS-014
**As a Customer**, I want to filter products by brand so that I can find my preferred brand's items easily.

**Acceptance Criteria:**
- Brand filter on category/search results page
- Brands listed alphabetically with product count

---

## Epic 3: Product Detail

### US-CUS-020
**As a Customer**, I want to view full product details so that I can make an informed purchase decision.

**Acceptance Criteria:**
- Product images (variant-specific where applicable)
- Product name, brand, category
- Short + full description
- Variant selector: attributes (size, color, etc.) with stock availability per option
- Price, compare-at price (strikethrough), discount badge
- Stock status: in stock / low stock / out of stock
- Business name (links to storefront)
- Related products section

### US-CUS-021
**As a Customer**, I want to select a product variant (size, color, etc.) before adding to cart so that I get exactly what I want.

**Acceptance Criteria:**
- Variant selection updates image, price, and stock status
- Unavailable options visually grayed out
- SKU shown after selection
- "Add to Cart" active only when a valid variant is selected

---

## Epic 4: Cart & Checkout

### US-CUS-030
**As a Customer**, I want to add products to my cart so that I can purchase multiple items in one order.

**Acceptance Criteria:**
- Cart icon shows item count badge
- Same product/variant can be added multiple times (qty increments)
- Cart persists across sessions (logged-in users)

### US-CUS-031
**As a Customer**, I want to view and edit my cart so that I can review my order before checkout.

**Acceptance Criteria:**
- Cart shows: product image, name, variant, qty, unit price, line total
- Update quantity or remove item
- Order summary: subtotal, estimated delivery, discount (if any), total
- Proceed to checkout button

### US-CUS-032
**As a Customer**, I want to checkout and place an order so that my purchase is confirmed.

**Acceptance Criteria:**
- Delivery address selection (from saved addresses or new)
- Payment method: cash on delivery (v1); card/digital wallet (future)
- Optional: apply loyalty coins
- Order summary review before placing
- On confirm: order created, customer receives confirmation email/SMS

### US-CUS-033
**As a Customer**, I want to apply my loyalty coins at checkout so that I can get a discount on my purchase.

**Acceptance Criteria:**
- Loyalty balance shown on checkout page
- Toggle to apply coins: enter amount (1 coin = PKR 1)
- Maximum redeemable: lesser of coin balance or order total
- Redemption reflected in order total breakdown
- Coins deducted from account on order confirmation

### US-CUS-034
**As a Customer**, I want the system to automatically assign my order to the closest store so that I get the fastest possible delivery.

**Acceptance Criteria:**
- System uses delivery address coordinates and store location
- Closest store with stock is assigned
- Customer sees assigned store info on order confirmation

---

## Epic 5: Order Tracking

### US-CUS-040
**As a Customer**, I want to view my order history so that I can see all past and current orders.

**Acceptance Criteria:**
- List: order number, date, business name, total, status
- Filter: all, active, delivered, cancelled

### US-CUS-041
**As a Customer**, I want to track my current order's status so that I know exactly where my order is.

**Acceptance Criteria:**
- Status timeline: Placed → Confirmed → Packing → Shipped → Delivered
- Each stage shows timestamp
- Store contact info for enquiries
- "Cancel Order" option visible before status is `packing`

### US-CUS-042
**As a Customer**, I want to receive real-time status notifications so that I don't have to keep checking the app.

**Acceptance Criteria:**
- Push notification (if app) / email on each status change
- Notification: order number, new status, estimated delivery (if applicable)

---

## Epic 6: Loyalty Program

### US-CUS-050
**As a Customer**, I want to see my loyalty coin balance prominently so that I am motivated to earn and redeem.

**Acceptance Criteria:**
- Coin balance shown on profile screen and checkout
- Balance in coins + equivalent PKR value

### US-CUS-051
**As a Customer**, I want to see a history of my coin transactions so that I can track how I earned and spent coins.

**Acceptance Criteria:**
- List: date, description (earned from order / redeemed on order), coins, running balance
- Filter: all, earned, redeemed

### US-CUS-052
**As a Customer**, I want to earn 1 loyalty coin for every PKR 100 I spend so that I am rewarded for my purchases.

**Acceptance Criteria:**
- Coin calculation: floor(order total after discounts / 100)
- Coins credited after order status = `delivered`
- Shown on order confirmation: "You will earn X coins"
- Shown on receipt: "X coins earned"

---

## Portal Pages Required (Customer App)

| Page | Description |
|---|---|
| `/` | Marketplace home (businesses + featured) |
| `/register` | Customer registration |
| `/login` | Customer login |
| `/search` | Global product search + filters |
| `/categories` | Platform category browser |
| `/businesses` | All businesses listing |
| `/business/:slug` | Business storefront |
| `/product/:slug` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Checkout + loyalty + address |
| `/orders` | Order history list |
| `/orders/:id` | Order detail + tracking |
| `/profile` | Customer profile + addresses |
| `/loyalty` | Loyalty coins balance + history |
