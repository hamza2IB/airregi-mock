# 21 — Business Owner Portal Specification
> File: `demo/owner.html` · Single-page mobile-first web app

---

## 1. Overview

The **Business Owner Portal** is the primary management interface for a brand/business owner registered on the RetailOS marketplace platform. It is a self-contained single-file SPA (no backend, no router) that simulates all owner-facing workflows as a high-fidelity mock.

### Responsive Shell
| Breakpoint | App Width | Presentation |
|---|---|---|
| `< 640px` | 430px | Full-screen mobile layout |
| `640px+` | 480px | Slightly wider, same layout |
| `1024px+` | 560px | Floats as a centred "device card" over a navy gradient backdrop |

---

## 2. Navigation Model

### Bottom Navigation (4 tabs, always visible)
| Tab | Icon | Page ID | Renders |
|---|---|---|---|
| Sales | `stats-chart-outline` | `page-sales` | `renderSales()` |
| Stores | `storefront-outline` | `page-stores` | `renderStores()` |
| Plan | `card-outline` | `page-plan` | `renderPlan()` |
| Settings | `settings-outline` | `page-settings` | `renderSettings()` |

### Sub-pages (not in bottom nav)
- `page-store-detail` — entered via `openStoreDetail(id)`, back via `closeStoreDetailPage()`. Bottom nav highlights **Stores**.

### Navigation function
```js
navTo(page)
```
- Sets `.active` class on the target page div, removes from all others
- Checks `checkBusinessSuspension()` first — if banned, only `plan` page is accessible
- Re-renders target page on every visit to ensure fresh data
- Calls `window.scrollTo(0, 0)` on every navigation


---

## 3. Data Models

### 3.1 OWNER
```js
{ name, email, brand, plan }
```
- `name` — full name (displayed in Settings header, initials in Sales header avatar)
- `email` — login email (displayed in Settings, used in Change Email flow)
- `brand` — brand name (displayed in Sales page header)
- `plan` — plan name string matching `PLAN.name`

---

### 3.2 PLAN
```js
{
  name,        // 'Starter' | 'Pro' | 'Enterprise'
  price,       // monthly price in PKR (Rs.)
  cycle,       // 'month'
  expiry,      // ISO date string 'YYYY-MM-DD'
  startDate,   // ISO date string 'YYYY-MM-DD'
  stores:   { used, limit },     // limit: number | 'Unlimited'
  products: { used, limit },
  registers:{ used, limit },
  payments: [ PaymentRecord ]
}
```

#### PaymentRecord
```js
{
  amount,          // PKR integer
  months,          // number of months covered
  ref,             // bank reference string e.g. 'TRX-HBL-0601'
  date,            // 'YYYY-MM-DD'
  status,          // 'pending' | 'verified' | 'rejected'
  bank,            // e.g. 'HBL'
  receipt,         // filename string | null
  rejectionReason, // string | undefined (only on rejected)
  planSwitchTo,    // plan name string | undefined (plan-change payments only)
  planSwitchBilling // 'monthly' | 'yearly' | undefined
}
```

#### Plan Status Thresholds (for badge + progress bar color)
| Days Remaining | Badge | Progress Bar |
|---|---|---|
| > 30 | `Active` (green) | Green |
| 8–30 | `Expiring Soon` (orange) | Orange |
| 1–7 | `N days left` (red) | Red |
| 0 | `Expired` (red) | Red |


---

### 3.3 STORES
Each store is a location record. Fields:

| Field | Type | Description |
|---|---|---|
| `id` | number | Unique integer |
| `name` | string | Display name |
| `code` | string | Auto-generated e.g. `RS-001`, `WH-001` |
| `type` | `'retail'` \| `'warehouse'` | Determines form fields and roles allowed |
| `color` | string | One of: `blue green purple orange navy red` |
| `status` | `'active'` \| `'inactive'` | Shown as Open/Closed badge |
| `street` | string | Street address |
| `area` | string | Area/neighbourhood |
| `city` | string | From `PAKISTAN_CITIES` list |
| `province` | string | From `PAKISTAN_PROVINCES` list |
| `country` | string | Default `'Pakistan'` |
| `postalCode` | string | Optional |
| `phone` | string | Contact phone |
| `email` | string | Contact email |
| `lat` / `lng` | number | Optional GPS coordinates for map view |
| `hours` | HoursObject | Per-day operating hours |
| `inventory` | InventoryObject | Stock summary + optional `items[]` |
| `stockRequests` | `{ pending }` | Retail only |
| `ecomOrders` | `{ pending, confirmed, packing, shipped }` | Retail only |
| `shifts` | ShiftRecord[] | Retail only |
| `activity` | ActivityRecord[] | Recent events |
| `sales` | `{ today, week, month, year }` | Revenue in PKR |
| `orders` | `{ today, week, month, year }` | Order counts |
| `payments` | `{ today, week, month, year }` each `{ cash, card, qr, cod }` | Breakdown |

#### HoursObject
```js
{ mon, tue, wed, thu, fri, sat, sun }
// each: { open: boolean, from: 'HH:MM', to: 'HH:MM' }
```

#### InventoryObject
```js
{
  totalSkus, totalUnits, lowStock, outOfStock,
  items?: [{
    sku, name, variant, category, qty, reserved,
    reorder, status  // 'ok' | 'low' | 'out'
  }]
}
```

#### ShiftRecord
```js
{
  id, cashierName, register, active,
  openedAt, closedAt,
  openingCash, cashCollected, cardCollected, qrCollected,
  transactions, closingCash, expectedCash, variance,
  submittedBy, submittedAt
}
```

#### Store Status Values
| Value | Display | Meaning |
|---|---|---|
| `active` | Open (green dot) | Fully operational |
| `inactive` | Closed (grey dot) | Deactivated, no new transactions |


---

### 3.4 STAFF
```js
{
  id, name, email, phone,
  role,        // see STAFF_ROLES
  locationId,  // references STORES[].id
  status,      // 'active' | 'invited' | 'inactive'
  lastLogin    // display string
}
```

#### Staff Status Values
| Value | Badge | Meaning |
|---|---|---|
| `active` | none | Has accepted invite, can log in |
| `invited` | Orange "Invited" pill | Invite sent, not yet accepted |
| `inactive` | hidden from active lists | Deactivated, no portal access |

#### STAFF_ROLES
| id | label | Location Type |
|---|---|---|
| `store_manager` | Store Manager | retail |
| `store_staff` | Store Staff | retail |
| `cashier` | Cashier | retail |
| `warehouse_manager` | Warehouse Manager | warehouse |
| `warehouse_staff` | Warehouse Staff | warehouse |

---

### 3.5 CATEGORIES
```js
{
  id, parentId,  // null = root category
  name, slug,    // slug: lowercase, hyphens only, globally unique
  status,        // 'active' | 'inactive'
  sortOrder      // integer, 0-based within same parent
}
```

#### Category Status Values
| Value | Badge | Meaning |
|---|---|---|
| `active` | Green "Active" | Visible on marketplace |
| `inactive` | Grey "Inactive" | Hidden from marketplace |

**Cascade rule:** Deactivating a parent cascades `inactive` to all descendants. Activating a parent also cascades `active` to all descendants.

---

### 3.6 BUSINESS_PROFILE
Two parallel objects: `BUSINESS_PROFILE_PUBLISHED` (live) and `BUSINESS_PROFILE_DRAFT` (working copy).

Fields: `legalName, displayName, tagline, industry, orgType, companySize, description, regNumber, ntn, headOffice, supportEmail, supportPhone, website, facebook, instagram, linkedin, youtube, tiktok, logoUrl, bannerUrl, hours`

**Draft state:** `bpIsDirty()` compares draft vs published via `JSON.stringify`. Draft banner shown when dirty.

**Publish:** Copies draft → published via `Object.assign`. Validates `displayName` non-empty and `supportEmail` valid before publishing.


---

## 4. Pages

### 4.1 Sales Page (`page-sales`)
**Rendered by:** `renderSales()`
**Trigger:** On load + every `navTo('sales')` + every `setPeriod()`

#### Header
- Brand name + owner initials avatar
- Revenue hero card: total revenue, trend badge (`↑ N% vs last period`), order count, store count

#### Subscription Expiry Banner (`renderSubscriptionBanner()`)
- Hidden when `daysLeft > 7`
- Orange warning when `3–7 days` remaining
- Red critical when `0–2 days` remaining
- Shows days remaining, expiry date, "Renew Now" CTA → `openRenewalPanel()`

#### Period Filter Pills
Values: `today` | `week` (this week Mon–Sun) | `month` (this month) | `year` (Jan 1 – today)
Active period stored in `currentPeriod`. Date range label shown below pills.

#### Channel Split Cards
- **In-Store (POS):** `totalSales × 0.82`, bar progress, order count, % share
- **Online (EC):** `totalSales × 0.18`, bar progress, order count, % share

#### Store Performance List
Per store: colour avatar, name, revenue amount, trend badge (▲/▼ %), bar proportional to max store, order count.
Per-store growth map: hardcoded `{ 1:12, 2:7, 3:3, 4:-8, 5:-15 }`.

#### Payment Methods Breakdown
Four rows: Cash, Card, App QR, COD. Each has bar, amount, % of total.

---

### 4.2 Stores Page (`page-stores`)
**Rendered by:** `renderStores()`

#### Header Stats
- Total stores, Active count, Today's total revenue

#### Search + Filter Bar
- Text search: matches store name and `area, city`
- Status filters: All | Open | Closed | Top Selling
- View toggle: List | Map

#### List View (`renderStoreCards()`)
Per card:
- Store type icon, name, Open/Closed badge, type label, location
- Today's Revenue progress bar (relative to highest store)
- 3-stat footer: Orders (today), This Week, This Month
- Kebab `⋮` → `openStoreActions(id)`
- Tap card → `openStoreDetail(id)`

#### Map View (`renderStoresMap()`)
- CSS grid map with gradient background
- Pins positioned via normalised lat/lng (no external map SDK)
- Pin shows store name label + location icon in store's depth colour
- Tap pin → `openStoreDetail(id)`


---

### 4.3 Store Detail Page (`page-store-detail`)
**Entered via:** `openStoreDetail(id)` → sets `sdCurrentStoreId`, calls `navTo('store-detail')`
**Back:** `closeStoreDetailPage()` → `navTo('stores')`
**Re-rendered by:** `renderStoreDetailPage()` called after any mutation

#### Header
- Back button, letter-initial avatar (store colour), name, code + type + location, Open/Closed badge
- Actions button `⋮` → `openStoreActions(id)`
- 4 KPI stats: Today Revenue, Month Revenue, Staff count, Stock Alerts (orange if > 0)

#### Tab Bar (5 tabs, horizontally scrollable)
| Tab | ID | Rendered by |
|---|---|---|
| Overview | `sd-tab-overview` | `renderSdOverview(s)` |
| Staff | `sd-tab-staff` | `renderSdStaff(s)` |
| Sales | `sd-tab-sales` | `renderSdSales(s)` |
| Inventory | `sd-tab-inventory` | `renderSdInventory(s)` |
| Location | `sd-tab-location` | `renderSdLocation(s)` |

Active tab stored in `sdCurrentTab`. `sdTab(name)` switches styling and calls renderer.

#### Overview Tab
1. **Today's Revenue hero card** — amount, trend vs yesterday, order count, channel split bar (POS vs COD)
2. **Cashier Shifts card** — see § 5.3 for full shift logic
3. **Period comparison** — Week / Month / Year revenues + orders
4. **Today's Payments** — Cash / Card / QR / COD bars

#### Staff Tab
- Manager section: name, initials, email, call button, ⋮ actions
- "No manager" warning with Assign CTA if none assigned
- Staff members list: name, role badge, last login, ⋮ actions
- Invite button → `openStaffForm(locationId)`

#### Sales Tab
- Period selector (Today / Week / Month / Year), stored in `window._sdSalesActive`
- Hero card: revenue, trend, orders, avg basket, total collected
- Channel split: POS vs COD bars + cards
- Payment methods breakdown
- Performance summary table (all 4 periods)

#### Inventory Tab
- Stock health bar (green healthy / orange low / red out)
- 4-stat row: SKUs, Units, Low, Out
- "Needs Attention" card — items with `status:'low'` or `status:'out'` only (from `inventory.items`)
- "All Clear" state when no alerts
- "View Full Inventory" CTA → `openStoreInventory(id)`

#### Location Tab
- Map-style visual header with store pin (links to Google Maps if coords exist)
- Full address: street, area, city, province, country, postal code
- "Open in Google Maps" button (only when lat/lng present)
- Contact card: phone (tel link), email (mailto link)
- Coordinates card: lat/lng displayed, Edit/Add button → `openStoreForm(id)`


---

### 4.4 Plan Page (`page-plan`)
**Rendered by:** `renderPlan()`

#### Plan Hero (navy card)
- Plan name + price/cycle
- Status badge (Active / Expiring Soon / N days left / Expired) — see § 3.2
- Subscription progress bar (filled = days elapsed / total days)
- Start date and expiry date labels

#### Plan Body Content
1. **Usage card** — Stores, Products, Registers used vs limit; progress bar per item
2. **Payment History** — last 5 payments, each with amount, date, months/label, bank, ref, status badge; "View All" → `openAllPayments()`
3. **Upgrade / Change Plan** button → `openChangePlan()`
4. **Submit Payment for Renewal** button → `openRenewalPanel()`

---

### 4.5 Settings Page (`page-settings`)
**Rendered by:** `renderSettings()`

#### Profile Header
- Initials avatar, owner name, email, plan badge

#### Business Section
| Row | Action |
|---|---|
| Business Profile | `openBusinessProfile()` |
| Categories | `openCategoriesPanel()` |

#### Account Section
| Row | Action |
|---|---|
| Edit Profile | `openEditProfile()` |
| Change Email | `openChangeEmail()` |
| Change Password | `openChangePassword()` |

#### Sign Out
Red button → `confirmSignOut()` → sign-out confirmation dialog → `doSignOut()`


---

## 5. Flows & Panels

### 5.1 Store Management

#### Store Actions Sheet (`store-actions-sheet`)
**Triggered by:** `openStoreActions(id)` (kebab ⋮ on store card or store detail header)
**Actions:**
| Button | Function | Behaviour |
|---|---|---|
| Edit Store | `storeActionEdit()` | Opens `openStoreForm(id)` |
| Deactivate / Reactivate | `storeActionToggleStatus()` | Opens confirm dialog → sets `status` |
| Delete Store | `storeActionDelete()` | Opens confirm dialog → splices from `STORES[]` |

**Deactivation confirm message:** Warns about in-progress orders being flagged. Data retained, reactivation always possible.
**Delete confirm message:** Permanent, cannot be undone.

---

#### Store Form Panel (`store-form-panel`) — Add / Edit
**Triggered by:** `openStoreForm(id?)` (null = create, number = edit)
**Pattern:** Full slide-over from right (`translate-x-full` → `translate-x-0`)

**Pre-condition check (create only):** If `STORES.length >= PLAN.stores.limit`, shows toast error and aborts.

**Form sections:**
1. **Basic Information** — Store Type toggle (Retail / Warehouse), Name*, Code* (auto-generated, editable)
2. **Address** — Country, Province* (dropdown), City* (dropdown from PAKISTAN_CITIES), Area*, Postal Code, Street*
3. **Coordinates** — Latitude, Longitude (optional, enables map pin + Google Maps)
4. **Contact** — Phone*, Email*
5. **Opening Hours** — Per-day toggle + time range pickers (Mon–Sun)

**Store Type toggle:** Switching type auto-regenerates code unless user has hand-edited it (`storeFormCodeTouched`). Type determines allowed staff roles.

**Code auto-generation:** `{prefix}-{NNN}` where prefix = `RS` (retail) or `WH` (warehouse), NNN = count of that type + 1, zero-padded to 3 digits.

**Validation (on save):**
- name, code, country, province, city, area, street, phone, email — all required
- email must contain `@`
- code must be unique across all stores

**On create success:** Pushes new store object with `defaultStoreOps(type)` + zero sales/payments, assigns next available colour from `STORE_COLORS` cycle, increments `PLAN.stores.used`.

**On edit success:** Merges fields into existing store object in-place.


---

### 5.2 Staff Management

#### Staff Actions Sheet (`staff-actions-sheet`)
**Triggered by:** `openStaffActions(userId)` (⋮ per staff row in Store Detail → Staff tab)

| Button | Function | Behaviour |
|---|---|---|
| Edit Role | `staffActionEdit()` | `openStaffForm(locationId, userId)` |
| Reassign Location | `staffActionReassign()` | Same form, location dropdown enables move |
| Resend Invitation | `staffActionResendInvite()` | Shows success toast only |
| Deactivate User | `staffActionDeactivate()` | Confirm dialog → sets `status:'inactive'` |

**Deactivation:** Immediately revokes portal access and ends active session. User is removed from active lists but retained in STAFF array with `status:'inactive'`.

---

#### Staff Form Panel (`staff-form-panel`) — Invite / Edit
**Triggered by:** `openStaffForm(locationId, userId?)` (null userId = invite mode)
**Pattern:** Bottom sheet (`translate-y-full` → `translate-y-0`)

**Pre-condition check (invite only):** If active staff count >= plan `userLimit`, shows toast and aborts.

**Form fields:**
- Full Name* (text)
- Email* (email, must be unique across STAFF)
- Phone (tel, optional)
- Role* (dropdown — filtered to `locationType` matching the store type)
- Location* (dropdown — all stores/warehouses, enables reassignment)

**Role options by location type:**
- Retail: Store Manager, Store Staff, Cashier
- Warehouse: Warehouse Manager, Warehouse Staff

**On invite success:** Pushes new user with `status:'invited'`, `lastLogin:'Never'`. Appears immediately with orange "Invited" badge.
**On edit success:** Updates name, email, phone, role, locationId. If location changed, shows "reassigned to X" toast.


---

### 5.3 Cashier Shift Detail (within Store Detail → Overview)

Rendered by `renderSdOverview(s)` from `s.shifts[]`.

#### Open Shift Display
- Cashier name, register badge, opened-at time, transaction count
- "Shift Open" green pill
- Live POS Recorded section: Cash / Card / QR collected + expected cash in drawer
- Formula shown: `opening float + cash sales = expected`

#### Closed Shift Display (two-column comparison)
- Left: **POS Recorded** — Cash, Card, QR digital totals
- Right: **Cashier Counted** — Opening float, cash in drawer, "Should be" total
- **Balanced verdict** (green): `closingCash === expectedCash` or `variance === 0`
- **Short verdict** (red): `variance < 0`, shows amount short (e.g. `−Rs.150`)

#### Multi-shift Day (multiple registers)
- Card header shows total registers, total transactions, alert badge if any short
- Each shift is a separate section within the same card
- Footer: day total (cash + card + QR combined across all shifts) with colour-coded breakdown

#### No-shift State
- "No cashier shifts today" placeholder card

---

### 5.4 Store Inventory Panel (`store-inventory-panel`)
**Triggered by:** `openStoreInventory(storeId)` (CTA in Store Detail → Inventory tab)
**Pattern:** Full slide-over from right

**Controls:**
- Search: matches name, SKU, variant, category
- Filter pills: All | Low Stock | Out of Stock | In Stock

**Per-item display:**
- Status dot (green/orange/red)
- Product name + variant + category + SKU (mono)
- Status badge (Out / Low / In Stock)
- Stock bar: `qty / (reorder × 2)` clamped to 100%
- Plain-language summary: "N can sell" (available = qty − reserved) or "None available to sell"
- Restock reminder level shown for non-ok items


---

### 5.5 Subscription Renewal Flow (`renewal-panel`)
**Triggered by:** `openRenewalPanel()` or `openRenewalPanel(true)` (from plan-change flow)
**Pattern:** Bottom sheet, 3-step wizard

#### Step 1 — Duration (skipped for plan-switch)
- 4 options: 1 Month, 3 Months, 6 Months (−10%), 12 Months (−17%)
- Price calculated: `PLAN.price × months × (1 − discount/100)`
- "New expiry after payment" preview: current expiry + N months
- Continue → Step 2

#### Step 2 — Bank Details + Reference
- Bank details card: Bank name, Account name, Account no., IBAN, Amount (all copyable)
- Transaction/Reference Number* (text, min 5 chars to enable Next)
- Optional receipt upload (JPEG/PNG/PDF, max 5MB): stored as filename in `renewalReceiptName`
- Back → Step 1 (or Cancel for plan-switch) | Review → Step 3

#### Step 3 — Confirm & Submit
- Summary table: Plan, Duration, Amount, New Expiry, Reference No., Receipt (if uploaded)
- Info banner: verification takes up to 24 hours
- Back → Step 2 | Confirm & Submit → `submitRenewal()`

#### On Submit
- Pushes `PaymentRecord` with `status:'pending'` to front of `PLAN.payments`
- Closes renewal panel
- Opens renewal success dialog after 350ms delay

#### Renewal Success Dialog
- Reference number display
- Context-sensitive message (regular renewal vs plan-switch vs post-suspension)
- Done button → `closeRenewalSuccess()` → `renderPlan()`

---

### 5.6 Change Plan Flow (`change-plan-panel`)
**Triggered by:** `openChangePlan()` (Plan page)
**Pattern:** Bottom sheet

#### Controls
- Billing toggle: Monthly | Yearly
- Plan cards: Starter / Pro / Enterprise (current highlighted, upgrade/downgrade badges)
- Each card shows: price/cycle, limits (stores/products/users), features checklist

#### Plan Selection Logic
- `selectPlan(id)` updates `selectedPlanId` and calls `updateConfirmBar()`
- If selected plan == current plan: confirm bar hidden
- If downgrade blocker present: confirm bar replaced by blocker message

#### Downgrade Blockers (`planDowngradeBlockers(plan)`)
- Checked before showing confirm bar
- Blocks if `PLAN.stores.used > plan.storeLimit` (number only, 'Unlimited' never blocks)
- Blocks if `PLAN.products.used > plan.productLimit`

#### Confirm
- `confirmPlanChange()` sets `pendingPlanSwitch = plan`, `pendingPlanSwitchBilling = selectedBilling`
- Closes change-plan panel, then opens `openRenewalPanel(true)` after 350ms
- Plan change is paid via the same bank-transfer + admin-verification flow as renewal
- Plan does NOT change immediately — only when admin verifies the payment


---

### 5.7 All Payments Panel (`all-payments-panel`)
**Triggered by:** "View All Payments" link on Plan page
**Pattern:** Full slide-over from right

#### Header Stats
- Total payment count, total verified amount, pending amount (hidden if zero)

#### Filters
- Status pills: All | Verified | Pending | Rejected
- Year dropdown (populated from distinct years in `PLAN.payments`, newest first)
- Month dropdown (cascades from year — disabled until year selected, only months with data)

#### Payment List
- Grouped by year (descending), yearly verified total shown per group
- Per payment: amount, status badge (green/orange/red), date, cycle label, bank, ref (mono)
- Receipt attachment row shown if `receipt !== null` — "View Receipt" CTA (toast only in mock)
- Rejection reason shown if `status === 'rejected'` and `rejectionReason` present
- Pending row shows "Awaiting verification" + "Contact Support" button

---

### 5.8 Business Profile Panel (`bizprofile-panel`)
**Triggered by:** `openBusinessProfile()` (Settings page)
**Pattern:** Full slide-over from right

#### Modes
- `edit` — form fields, draft banner, Save as Draft / Publish footer
- `preview` — read-only marketplace storefront card (how customers see it)
- Toggle: edit/preview buttons in header

#### Edit Mode Sections
1. **Logo / Banner** — live image preview, camera buttons, file inputs (JPEG/PNG/WebP, max 5MB)
2. **Business Identity** — Legal Name, Display Name*, Tagline, Industry, Org Type, Company Size, Description (400 char max)
3. **Legal & Registration** — Registration Number, NTN, Head Office
4. **Support Contact** — Support Email*, Support Phone, Website
5. **Social Media Links** — Facebook, Instagram, LinkedIn, YouTube, TikTok (all optional)

#### Draft / Publish Flow
- Any field change calls `bpSet(key, value)` → `updateBpDraftBanner()`
- "Save as Draft" → toast only (data already in `BUSINESS_PROFILE_DRAFT`)
- "Publish" → validates display name + email → `Object.assign(PUBLISHED, draft)` → toast

#### Preview Mode
- Banner + logo visual (gradient fallback if no image)
- Display name, tagline, industry badge, description
- Social links row (icons in brand colours)
- Contact info: email, phone, website, head office


---

### 5.9 Categories Panel (`categories-panel`)
**Triggered by:** `openCategoriesPanel()` (Settings → Business section)
**Pattern:** Full slide-over from right

#### Header Stats
- Total categories, Active count, Root categories count

#### Controls
- Search: real-time filter on name + slug, flattens tree when active
- Filter pills: All | Active | Inactive

#### Tree Display (`renderCategoryTree()`)
- Hierarchical indentation: `depth × 20px` left margin
- Tree-line connectors: vertical + horizontal CSS lines for nested rows
- Letter-initial avatar (first char of name, uppercased) — colour based on depth:
  - Depth 0 (root): Navy `#1a2d6b`
  - Depth 1: Purple `#7c4dff`
  - Depth 2: Green `#2dd36f`
  - Depth 3: Orange `#ff9800`
  - Depth 4+: Red `#eb445a`
- Left accent bar matches depth colour
- Expand/collapse chevron (only visible if has children)
- Badges: Active/Inactive status pill, "N subs" count (direct children only)
- Slug path shown in monospace below name (e.g. `/fashion/men/clothing`)
- Kebab ⋮ → `openCatActions(id)`
- Rows start expanded for root categories (`catExpanded` Set)

#### Category Actions Sheet (`cat-actions-sheet`)
| Button | Function | Behaviour |
|---|---|---|
| Add Sub-Category | `catActionAddSub()` | `openCategoryForm(null, parentId)` |
| Edit Category | `catActionEdit()` | `openCategoryForm(id)` |
| Activate / Deactivate | `catActionToggle()` | Cascades to all descendants |
| Delete | `catActionDelete()` | Confirm dialog, recursive delete of descendants |

#### Category Form Panel (`category-form-panel`)
**Pattern:** Bottom sheet (`translate-y-full` → `translate-y-0`)
**Modes:** "Add Root Category" | "Add Sub-category" (shows parent info) | "Edit Category"

**Fields:**
- Name* — text, auto-fills slug
- Slug* — auto-generated (`autoSlug(name)`), editable, validates lowercase + hyphens only, must be globally unique
- Parent Category — dropdown of all valid parents (excludes self and own descendants to prevent circular refs)
- Active — toggle, default on

**Slug auto-generation:** `name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')` — only re-runs while user hasn't manually edited the slug field (`catFormSlugTouched` flag)

**On create:** Auto-expands parent in tree so new child is immediately visible.
**On cascade deactivate:** Shows "N sub-categories also deactivated" in toast.


---

### 5.10 Account Settings Flows

#### Edit Profile (`edit-profile-panel`)
- Fields: Full Name, Phone
- `saveProfile()` validates name non-empty → updates `OWNER.name` → re-renders Settings

#### Change Password (`change-password-panel`)
- Fields: Current Password, New Password (≥ 8 chars), Confirm New Password
- Real-time strength meter (`checkPasswordStrength()`):
  - 0 bars: empty
  - Weak (25%, red): only length ≥ 8
  - Fair (50%, orange): + uppercase
  - Good (75%, blue): + digit
  - Strong (100%, green): + special character
- Validation: current required, new ≥ 8 chars, confirm must match

#### Change Email — 2-step (`change-email-panel`)
**Step 1:** Enter new email (must be valid, must differ from current). "Send Verification Code" enabled only when valid.
**Step 2:** Enter 6-digit code (numeric, exactly 6 digits to enable Confirm). "Resend Code" toast. On confirm: updates `OWNER.email`, re-renders Settings.

---

### 5.11 Support Sheet (`support-sheet`)
**Triggered by:** `openSupportSheet(type)` — types: `faq`, `contact`, `report`, `terms`

| Type | Content |
|---|---|
| `faq` | 5 `<details>` accordion items |
| `contact` | Subject dropdown, message textarea, reply email shown, Send button + direct email link |
| `report` | Issue type + page dropdowns, description textarea, Submit button |
| `terms` | Terms of Service, Privacy Policy, Refund Policy links + app version |

---

### 5.12 Sign Out Flow
1. Settings page "Sign Out" → `confirmSignOut()` → shows `signout-dialog`
2. User confirms → `doSignOut()` → shows `signed-out-screen` (full-screen overlay)
3. "Sign In Again" → `doSignIn()` → hides signed-out screen, `navTo('sales')`


---

## 6. Business Rules & System Behaviours

### 6.1 Business Suspension — US-OWN-024
**Trigger:** `daysLeft(PLAN.expiry) <= 0`
**Checked on:** Every `navTo()` call + DOMContentLoaded

**Effect:**
- `suspended-screen` shown as a full-screen fixed overlay (`z-[150]`)
- All `navTo()` calls except `navTo('plan')` are blocked
- Owner can: submit renewal payment, contact support, sign out
- **Restoration:** Only when admin verifies a renewal payment (no self-serve reactivation button)

**Suspended screen content:**
- Lock icon, "Business Suspended" title
- Explanation of what happened
- 2-step restoration instructions
- "Submit Payment for Renewal" → `openRenewalPanel()`
- "Contact Support" → `openSupportSheet('contact')`
- "Sign Out" → `confirmSignOut()`

---

### 6.2 Subscription Expiry Warning — US-OWN-021
- Banner appears when `daysLeft(PLAN.expiry) <= 7`
- Orange styling for days 3–7
- Red/critical styling for days 0–2
- Banner is **persistent** — visible on the Sales page until expired or renewed
- "Renew Now" CTA links directly to renewal panel

---

### 6.3 Store Limit Check
- Checked in `openStoreForm()` before opening the form
- If `STORES.length >= PLAN.stores.limit` (when limit is a number): shows error toast, aborts
- Does not apply when `limit === 'Unlimited'`

---

### 6.4 User (Staff) Limit Check
- Checked in `saveStaffForm()` before creating new staff
- Compares `STAFF.filter(active).length >= currentPlanEntry().userLimit`
- Does not apply when `userLimit === 'Unlimited'`

---

### 6.5 Plan Downgrade Blockers
Checked in `planDowngradeBlockers(plan)` before showing the "Confirm Plan Change" bar:
- Blocked if `PLAN.stores.used > plan.storeLimit` (number limits only)
- Blocked if `PLAN.products.used > plan.productLimit` (number limits only)
- Shows list of specific blockers instead of confirm button

---

### 6.6 Category Cascade Rules
- **Deactivate parent → deactivates all descendants** recursively via `setStatusRecursive()`
- **Activate parent → activates all descendants** recursively
- **Delete parent → deletes all descendants** recursively via `deleteRecursive()`
- Toast shows count of affected descendants

---

### 6.7 Store Code Uniqueness
- Validated on `saveStoreForm()`: case-insensitive match across all stores excluding self (edit mode)
- Auto-generation: prefix + zero-padded sequence, regenerated on type switch (unless `storeFormCodeTouched`)

---

### 6.8 Category Slug Uniqueness
- Validated on `saveCategoryForm()`: exact match across all categories excluding self (edit mode)
- Auto-fill only runs when `catFormSlugTouched === false`


---

## 7. Overlay / Panel Reference

All overlays are `position:fixed; max-width:var(--app-max); margin:0 auto` — constrained to the app frame.

| ID | Type | Z-index | Trigger | Close |
|---|---|---|---|---|
| `suspended-screen` | Full screen | 150 | Auto on expiry | Never (sign out only) |
| `signed-out-screen` | Full screen | 500 | `doSignOut()` | `doSignIn()` |
| `categories-panel` | Slide-over right | 200 | `openCategoriesPanel()` | `closeCategoriesPanel()` |
| `bizprofile-panel` | Slide-over right | 200 | `openBusinessProfile()` | `closeBusinessProfile()` |
| `all-payments-panel` | Slide-over right | 200 | `openAllPayments()` | `closeAllPayments()` |
| `store-inventory-panel` | Slide-over right | 210 | `openStoreInventory(id)` | `closeStoreInventory()` |
| `settings-panel` | Slide-over right | 200 | `openSettingsPanel(panel, title)` | `closeSettingsPanel()` |
| `store-form-panel` | Slide-over right | 260 | `openStoreForm(id?)` | `closeStoreForm()` |
| `renewal-panel` | Bottom sheet | 260 | `openRenewalPanel()` | `closeRenewalPanel()` |
| `change-plan-panel` | Bottom sheet | 250 | `openChangePlan()` | `closeChangePlan()` |
| `category-form-panel` | Bottom sheet | 260 | `openCategoryForm(id?, parentId?)` | `closeCategoryForm()` |
| `staff-form-panel` | Bottom sheet | 260 | `openStaffForm(locId, userId?)` | `closeStaffForm()` |
| `edit-profile-panel` | Bottom sheet | 260 | `openEditProfile()` | `closeEditProfile()` |
| `change-password-panel` | Bottom sheet | 260 | `openChangePassword()` | `closeChangePassword()` |
| `change-email-panel` | Bottom sheet | 260 | `openChangeEmail()` | `closeChangeEmail()` |
| `support-sheet` | Bottom sheet | 350 | `openSupportSheet(type)` | `closeSupportSheet()` |
| `store-actions-sheet` | Bottom sheet | 300 | `openStoreActions(id)` | `closeStoreActions()` |
| `staff-actions-sheet` | Bottom sheet | 300 | `openStaffActions(id)` | `closeStaffActions()` |
| `cat-actions-sheet` | Bottom sheet | 300 | `openCatActions(id)` | `closeCatActions()` |
| `signout-dialog` | Bottom sheet | 300 | `confirmSignOut()` | backdrop click |
| `confirm-dialog` | Bottom sheet | 320 | `openConfirmDialog({...})` | `closeConfirmDialog()` |
| `renewal-success-dialog` | Bottom sheet | 300 | After `submitRenewal()` | `closeRenewalSuccess()` |
| `toast` | Fixed top | 400 | `showToast(msg, type)` | Auto-dismiss 2.8s |

### Animation Patterns
- **Slide-over right:** `translate-x-full` (hidden) → `translate-x-0` (shown). Transition: `duration-300`.
- **Bottom sheet:** `translate-y-full` (hidden) → `translate-y-0` (shown). Transition: `duration-300`. Panel must have `flex items-end justify-center` when shown.
- **Backdrop close:** All overlays have `onclick` on the backdrop `div` to close.


---

## 8. Helper Functions Reference

| Function | Description |
|---|---|
| `fmtRs(n)` | Formats PKR: `Cr` ≥ 10M, `L` ≥ 100K, `K` ≥ 1K, raw otherwise |
| `fmtNum(n)` | `n.toLocaleString('en-PK')` — comma-separated |
| `pct(part, total)` | Safe percentage, returns 0 if total is 0 |
| `daysLeft(dateStr)` | Days until ISO date, floored to 0 |
| `colorClass(c)` | `'navy'` → `'navy'`, anything else → `'brand-' + c` |
| `getDateRangeLabel(period)` | Human-readable date range for period filter label |
| `getAggregates(period)` | Sums STORES data for the given period, computes POS/EC split |
| `initials(name)` | First letter of each word, max 2, uppercased |
| `storeShortLocation(s)` | `'Area, City'` |
| `storeFullAddress(s)` | Full address string comma-joined |
| `storeTypeInfo(typeId)` | Returns STORE_TYPES entry (fallback: retail) |
| `generateStoreCode(typeId)` | `RS-001` / `WH-001` style auto-code |
| `defaultStoreHours()` | Mon–Thu 9–22, Fri–Sat 9–23, Sun 10–21 |
| `defaultStoreOps(type)` | Zero-state ops object for new stores |
| `staffForLocation(id)` | Active + invited staff at a location |
| `locationManager(id)` | First store_manager or warehouse_manager at location |
| `locationStaffCount(id)` | Count of non-inactive staff at location |
| `staffRoleLabel(roleId)` | Readable role label |
| `isBusinessBanned()` | `daysLeft(PLAN.expiry) <= 0` |
| `catChildren(parentId)` | Direct children sorted by sortOrder |
| `catById(id)` | Find category by id |
| `catDepth(id)` | Distance from root (0 = root) |
| `catSlugPath(cat)` | `/root/parent/child` full path |
| `catDescendantCount(id)` | Recursive total descendants |
| `catSubCount(id)` | Direct children count only |
| `autoSlug(name)` | Lowercase, hyphens-only slug from name |
| `showToast(msg, type)` | Show toast: `success` (default) \| `info` \| `error`. Auto-dismisses in 2.8s |
| `openConfirmDialog({...})` | Reusable confirm bottom sheet with custom title, message, icon, confirm button |

---

## 9. Subscription Plans Catalog

Defined in `PLANS_DATA`. Matches admin's package catalog (`docs/16-admin-subscription-packages-spec.md`).

| Plan | Monthly | Yearly | Stores | Products | Users | Features |
|---|---|---|---|---|---|---|
| Starter | Rs. 16,900 | Rs. 182,400 | 1 | 500 | 10 | Ecommerce, POS |
| Pro | Rs. 60,000 | Rs. 648,000 | 10 | 5,000 | 50 | Ecommerce, POS, Loyalty |
| Enterprise | Rs. 120,000 | Rs. 1,296,000 | Unlimited | Unlimited | Unlimited | Ecommerce, POS, Loyalty |

Yearly savings badge computed live: `Math.round((1 − yearly / (monthly × 12)) × 100)%`

---

## 10. Initialisation

`DOMContentLoaded` triggers:
1. `renderSales()` — default period: `month`
2. `renderStores()` — default view: `list`, default filter: `all`
3. `renderPlan()`
4. `renderSettings()`
5. `checkBusinessSuspension()` — may overlay the portal immediately

---

## 11. User Story Cross-Reference

| US ID | Feature |
|---|---|
| US-OWN-010 | Business Profile management |
| US-OWN-011 | Business Profile publish/draft |
| US-OWN-021 | Subscription expiry banner |
| US-OWN-024 | Business suspension screen |
| US-OWN-030 | Add store (type, code, address, hours) |
| US-OWN-031 | Store detail page + map view |
| US-OWN-032 | Edit store |
| US-OWN-033 | Deactivate / delete store |
| US-OWN-050 | Invite staff |
| US-OWN-051 | Staff status (invited badge) |
| US-OWN-052 | Edit staff role |
| US-OWN-053 | Deactivate staff |
| US-OWN-080 | Store inventory panel |
| US-OWN-081 | Operations snapshot |
| US-SM-030/031 | Cashier shift display (owner view) |
