# Admin — All Businesses Page Specification
> **Section in file:** `demo/admin.html` → `#adm-businesses`  
> **Triggered by:** Sidebar → Businesses → All Businesses  
> **Status:** UI finalized — ready for backend integration  
> **Last updated:** Jul 13, 2026

---

## 1. Page Purpose

Central hub for the admin to monitor, filter, and act on every business registered on the RetailOS platform — across all lifecycle stages from pending registration through to active, suspended, or banned.

---

## 2. Page Load Behaviour

- Page is hidden (`hidden` class) on initial load; shown when `adminNav('businesses')` is called
- Table is **pre-rendered on page load** (`bizFiltered = [...BIZ_DATA]; renderBizTable()`) so there is zero delay when switching to this page
- Default state: **All** tab active, no search query, no package filter, sorted by Name A–Z

---

## 3. Summary KPI Strip

Five cards at the top of the page. Display only — clicking does not filter.

| Card | Count source | Colour | Icon |
|---|---|---|---|
| Total | `COUNT(all businesses)` | `brand-blue` | `business-outline` |
| Active | `COUNT WHERE status = 'active'` | `brand-green` | `checkmark-circle-outline` |
| Pending | `COUNT WHERE status = 'pending'` | `brand-purple` | `hourglass-outline` |
| Suspended | `COUNT WHERE status = 'suspended'` | `brand-orange` | `pause-circle-outline` |
| Banned | `COUNT WHERE status = 'banned'` | `brand-red` | `ban-outline` |

---

## 4. Toolbar

### 4a. Search
- Searches live on `oninput`
- Matches: `business.name`, `owner.name`, `business.city` (case-insensitive)
- AND-combined with status tab and package filter

### 4b. Status Filter Tabs

| Tab | Filters to |
|---|---|
| All | All statuses |
| Active | `status = 'active'` |
| Pending | `status = 'pending'` |
| Suspended | `status = 'suspended'` |
| Banned | `status = 'banned'` |

Active tab: `bg-navy text-white`. Inactive: `text-gray-500`.

### 4c. Package Filter
Dropdown: All Packages / Enterprise / Pro / Starter. AND-combined with other filters.

### 4d. Sort Dropdown

| Option | Sort key |
|---|---|
| Name A–Z | `business.name` ascending |
| Name Z–A | `business.name` descending |
| Joined (newest) | `business.created_at` descending |
| Expiry (soonest) | `subscription.days_remaining` ascending |
| Stores (most) | `stores.count` descending |

### 4e. Export CSV
Exports current filtered + sorted result. Backend endpoint needed.

---

## 5. Table Columns

9 columns. Grid: `2fr 1.4fr 0.8fr 0.8fr 0.5fr 0.5fr 0.6fr 1.3fr 1.4fr`

### Col 1 — Business
- Avatar: first letter, color from deterministic name hash
- `businesses.name` + `businesses.city`

### Col 2 — Owner
- `users.name` (role = owner)
- `businesses.created_at` as "Jan 5, 2025"

### Col 3 — Package

| Package | Style |
|---|---|
| Enterprise | `bg-navy text-white` |
| Pro | `bg-brand-blue text-white` |
| Starter | `bg-gray-200 text-gray-600` |

### Col 4 — Status

| Status | Pill | Meaning |
|---|---|---|
| Active | Green | Full portal access |
| Pending | Purple | Registration submitted, payment unverified, no access |
| Suspended | Orange | Admin-suspended, all logins blocked |
| Banned | Red | Auto-banned on subscription expiry, all logins blocked |

### Col 5–7 — Stores / Staff / Products
- Source: counts from respective entities
- All show `—` for pending businesses

### Col 8 — Subscription

| State | Display | Colour |
|---|---|---|
| Healthy >7d | `● Expires [date]` / `Nd remaining` | Green dot, gray text |
| Expiring 3–7d | `● Expires [date]` / `Nd remaining` | Orange dot + text |
| Critical ≤2d | `● Expires [date]` / `Nd remaining` | Red dot + bold text |
| Suspended | `● Expires [date]` / `Nd remaining` | Orange dot, muted |
| Banned | `● Subscription expired` / `[end date]` | Red dot + label |
| Pending | `● Awaiting approval` (pulsing purple dot) | Purple |

### Col 9 — Actions

| Status | Button 1 | Button 2 |
|---|---|---|
| Active | 👁 View | ⏸ Suspend |
| Pending | 👁 View | 🚫 Reject |
| Suspended | 👁 View | ▶ Reactivate |
| Banned | 👁 View | 🟠 View Payment Queue |

> **Important:** Banned businesses have no direct Restore button. Restoration only happens through the Payment Verification flow.

---

## 6. Business Status — Full Lifecycle

```
[Business submits registration + payment]
        ↓
    PENDING
  (no portal access, awaiting admin review)
        ↓
   Admin opens Payment Verification Queue
        ↓
   Admin verifies bank payment
        ↓
   Admin clicks "Verify & Activate"
        ↓
    ACTIVE ◄─────────────────────────────────┐
  (full portal access)                        │
        │                                     │
        ├─ Admin clicks Suspend               │
        │  (reason required)                  │
        │        ↓                            │
        │   SUSPENDED                         │
        │  (all logins blocked)               │
        │        ↓                            │
        │  Admin clicks Reactivate            │
        │  (confirmation modal)               │
        │        └────────────────────────────┘
        │
        └─ Subscription expires (daily job)
                 ↓
            BANNED
          (all logins blocked)
                 ↓
         Owner submits renewal payment
                 ↓
         Admin opens Payment Verification Queue
                 ↓
         Admin clicks "Verify & Renew"
                 └────────────────────────────┐
                                              ↓
                                           ACTIVE
```

### Status Transition Table

| From | To | Trigger | Who | Modal |
|---|---|---|---|---|
| Pending | Active | Payment verified + activated | Admin via Payment Queue | None (from queue) |
| Pending | Rejected | Admin rejects registration | Admin via Reject button | Reject Modal |
| Active | Suspended | Admin suspends | Admin | Suspend Modal (reason required) |
| Active | Banned | Subscription expiry | System daily job | None |
| Suspended | Active | Admin reactivates | Admin | Reactivate Confirmation Modal |
| Banned | Active | Renewal payment verified | Admin via Payment Queue | None (from queue) |

---

## 7. Actions — Full Detail

### 7a. View (👁) — All statuses
Opens the **Business Detail Drawer** from the right side.  
Available on every row regardless of status.

---

### 7b. Suspend (⏸) — Active only

**Entry points:** Table row button / Drawer footer button

**Flow:**
1. Click Suspend → **Suspend Modal** opens
2. Admin types suspension reason (required)
3. Empty submit → red border on textarea, blocked
4. Confirm → modal closes
5. `business.status` → `suspended`, `suspension_reason` stored
6. Table re-renders, business moves to Suspended filter
7. Toast: `"{Name} has been suspended."` (red)

**Effect on business:**
- All owner + staff logins immediately blocked
- Business owner sees suspension reason on next login attempt
- Subscription clock continues ticking

---

### 7c. Reject (🚫) — Pending only

**Entry points:** Table row button / Drawer footer button ("Reject Registration")

**Flow:**
1. Click Reject → **Reject Registration Modal** opens
2. Shows: business name, payment reference (`—` if no payment ref on table row)
3. Warning box: *"This registration will be permanently rejected. The applicant will be notified and must reapply from scratch."*
4. Admin types rejection reason (required, shown to applicant)
5. Empty submit → red border on textarea, blocked
6. Confirm → modal closes, queue item fades
7. Toast: `"{Name} registration rejected. Applicant notified."` (red)

**Effect:**
- `business_registration.status` → `rejected`
- `subscription_payment.status` → `rejected`
- Rejection reason emailed to applicant
- Business is never created in the system
- Applicant must reapply from scratch with a new registration

---

### 7d. Reactivate (▶) — Suspended only

**Entry points:** Table row button / Drawer footer button

**Flow:**
1. Click Reactivate → **Reactivate Confirmation Modal** opens
2. Modal shows business name and explains:
   - *"Reactivating will restore full portal access immediately."*
   - Note box: *"The suspension reason will be cleared."*
3. Admin clicks "Yes, Reactivate"
4. `business.status` → `active`, `suspension_reason` cleared
5. Modal closes, table re-renders
6. Toast: `"{Name} has been reactivated."` (green)

**Effect on business:**
- All owner + staff logins immediately restored
- Suspension reason removed from record

---

### 7e. View Payment Queue (🟠) — Banned only

**Entry points:** Table row button / Drawer footer button ("Go to Payment Queue")

**This is not an action — it's a navigation.**

Banned businesses cannot be directly restored by admin. The restoration flow is:

```
Owner submits renewal payment
        ↓
Payment appears in Payment Verification Queue
with type = "renewal" and business status = "banned"
        ↓
Admin opens Payment Verification Queue
        ↓
Admin sees "Banned" badge on the renewal item
        ↓
Admin sees blue info strip:
"Verifying this payment will automatically restore
the business and reactivate all logins."
        ↓
Admin verifies bank payment and clicks "Verify & Renew"
        ↓
System:
  - payment.status → verified
  - subscription.end_date extended by 1 month
  - business.status → active
  - All logins restored automatically
```

Clicking "View Payment Queue" navigates to the Payment Verification page.

---

### 7f. Reject Payment (from Payment Queue) — Renewal items

**Entry points:** Reject button on renewal queue items (both active-expiring and banned renewals)

**Two sub-scenarios:**

**Scenario A — Active business renewal rejection:**
1. Reject Payment Modal opens
2. Warning: *"The business will remain active but the subscription expiry clock continues. The owner must resubmit a correct payment."*
3. Admin types reason → Confirm
4. `payment.status` → `rejected`, reason stored and emailed to owner
5. Business stays active, subscription clock continues
6. Owner must resubmit a new payment

**Scenario B — Banned business renewal rejection:**
1. Reject Payment Modal opens (red-tinted icon)
2. Warning: *"The business will remain banned. The owner must submit a new valid payment to restore access."*
3. Admin types reason → Confirm
4. `payment.status` → `rejected`
5. Business stays banned
6. Owner must resubmit with correct payment details

**Common rejection reasons:**
- Payment reference not found in bank records
- Wrong amount submitted
- Reference number already used
- Payment sent to wrong account
- Receipt/screenshot does not match

---

## 8. Modals Reference

### 8a. Suspend Modal

| Element | Detail |
|---|---|
| Trigger | Suspend button (active businesses only) |
| Business name | Dynamic from row |
| Body text | "You are suspending **{Name}**. A reason is required and will be shown to the business owner." |
| Reason textarea | Required. Red border on empty submit |
| Cancel | Closes modal, no action |
| Confirm | "Suspend Business" — red CTA |

---

### 8b. Reactivate Confirmation Modal

| Element | Detail |
|---|---|
| Trigger | Reactivate button (suspended businesses) |
| Title | "Reactivate Business" |
| Body | "{Name} is currently suspended. Reactivating will restore full portal access immediately." |
| Note box | "The suspension reason will be cleared." (green info box) |
| Cancel | Closes modal, no action |
| Confirm | "Yes, Reactivate" — green CTA |

---

### 8c. Reject Registration Modal

| Element | Detail |
|---|---|
| Trigger | Reject button (pending businesses) |
| Title | "Reject Registration" |
| Info row | Business name + payment reference |
| Warning box | "This registration will be permanently rejected. The applicant will be notified and must reapply from scratch." (red) |
| Reason textarea | Required. Label: "Rejection Reason (shown to business owner)" |
| Cancel | Closes modal, no action |
| Confirm | "Reject Registration" — red CTA |

---

### 8d. Reject Payment Modal

| Element | Detail |
|---|---|
| Trigger | Reject button on payment queue renewal items |
| Title | "Reject Renewal Payment" |
| Info rows | Business name + payment reference |
| Warning box | Different text per scenario (active vs banned — see 7f above) |
| Reason textarea | Required. Label: "Rejection Reason (shown to business owner)" |
| Cancel | Closes modal, no action |
| Confirm | "Reject Payment" — red CTA |

---

## 9. Business Detail Drawer

A right-side panel that slides in when View is clicked on any row. Width: 400px. Closes via X button, Close footer button, or clicking the background overlay.

### 9a. Cover Header
- Gradient cover using business brand color (deterministic from name hash)
- Decorative geometric circles overlay
- City + "Since [year]" label bottom-right
- Business avatar letter overlapping cover bottom-left (border-4, shadow)
- X close button top-right

### 9b. Identity Block (below cover)
- Package pill + Status pill + Org Type pill (if profile exists)
- Business name (large bold)
- Tagline (if profile exists) or city fallback
- Quick stats inline row (non-pending only): `Stores | Staff | Products`

### 9c. Alerts (context-sensitive, shown at top of scrollable body)

| Condition | Alert |
|---|---|
| `status = 'suspended'` | Orange warning box with suspension reason text |
| `status = 'banned'` | Red alert box explaining auto-ban + restoration via Payment Queue |
| `status = 'pending'` | Purple info box: "Profile not created yet. Owner fills in details after approval." |

### 9d. Scrollable Sections

Sections appear in this order:

**1. Owner**
- Avatar (initials, color-hashed from name)
- Full name + "Business Owner" label
- Email (clickable mailto link)
- Joined date (right-aligned)

**2. Subscription**
- Package name
- Expiry date with urgency colour (red/orange/green matching table)

**3. Business Identity** *(only if profile exists)*
- Legal Name
- Display Name
- Tagline
- Industry
- Org Type
- Company Size

**4. Legal & Registration** *(only if profile exists)*
- Registration Number
- NTN Number
- Head Office address

**5. Description** *(only if profile exists and description is non-empty)*
- Full description text

**6. Support Contact** *(only if profile exists)*
- Support Email
- Support Phone
- Website (clickable link)

**7. Social Links** *(only if profile exists)*
Each platform shown with branded icon + color:
- Facebook (blue `#1877f2`)
- Instagram (pink `#e1306c`)
- LinkedIn (blue `#0a66c2`)
- YouTube (red `#ff0000`)
- TikTok (black)

All show "Not provided" in gray italic if empty.

**8. Stores** *(non-pending businesses, always last)*
- Section header with active/inactive count pills
- Per store card (see 9e below)
- If `storeList = null`: shows total count only

### 9e. Store Card Layout

Each store card has a left accent bar (green = active, gray = inactive):

**Top row:** Number avatar + Store name + Active/Inactive badge  
**Middle row:** Location icon + Address, City  
**Footer (3-column grid):**

| Column | Icon | Label | Value |
|---|---|---|---|
| Manager | Blue person icon | Manager | First name |
| Staff | Purple people icon | Staff | Count |
| Cashiers | Green cash icon | Cashiers | Count |

Inactive stores: entire card at 65% opacity, no Staff/Cashiers columns.

### 9f. Drawer Footer Actions

| Business status | Left button | Right button |
|---|---|---|
| Active | Close | ⏸ Suspend (red) |
| Pending | Close | 🚫 Reject Registration (red) |
| Suspended | Close | ▶ Reactivate (green) |
| Banned | Close | 🟠 Go to Payment Queue (orange) |

Clicking Suspend/Reject from the drawer closes the drawer first, then opens the relevant modal.

---

## 10. Banned Business — Complete Restoration Flow

This is the only status that cannot be directly actioned from the All Businesses page.

```
1. Business subscription expires
   → System daily job sets status = 'banned'
   → All logins blocked

2. Owner logs in → sees "Subscription Expired" screen
   → Owner submits renewal: bank name, amount, ref#, receipt (optional)

3. Payment appears in Admin Dashboard:
   - Payment Verification Queue (dashboard widget)
   - Payment Verification page (full list)
   - Renewal item shows "Banned" red badge + "Business Banned" banner

4. Admin sees blue info strip on the queue item:
   "Verifying this payment will automatically restore the
   business and reactivate all logins."

5. Admin verifies ref# against bank records:
   ├── VERIFY → clicks "Verify & Renew"
   │         → payment.status = verified
   │         → subscription.end_date + 1 month
   │         → business.status = active
   │         → All logins restored
   │         → Toast: "{Name} renewal verified. Business restored."
   │
   └── REJECT → clicks "Reject Payment" → Reject Payment Modal
             → Admin types reason
             → payment.status = rejected
             → business STAYS banned
             → Owner notified to resubmit
```

---

## 11. Pending Business — Registration Rejection Flow

```
1. Business submitted registration, payment unverified

2. Admin sees business in Pending tab / Payment Queue (New Reg tab)

3. Admin rejects via:
   a) Table row "Reject" button
   b) Drawer "Reject Registration" footer button
   c) Payment Queue "Reject" button on the new-reg item

4. Reject Registration Modal opens:
   - Business name + payment reference shown
   - Warning: "permanently rejected, must reapply from scratch"
   - Admin types rejection reason (required)

5. Admin confirms:
   → registration.status = rejected
   → payment.status = rejected
   → Rejection reason stored + emailed to applicant
   → Business never created in system
   → No owner account created

6. Applicant must reapply from the public registration page
```

---

## 12. Pagination

- 10 rows per page (`BIZ_PER_PAGE = 10`)
- Footer: "Showing 1–N of M businesses"
- Numbered pills + prev/next arrows
- Resets to page 1 on any filter/sort change

---

## 13. Data Fields Summary

| Field | Entity | Used in |
|---|---|---|
| `businesses.id` | businesses | Row key, all action targets |
| `businesses.name` | businesses | Business col, search, avatar, drawer |
| `businesses.city` | businesses | Business col, search, drawer cover |
| `businesses.status` | businesses | Status col, filter tabs, action buttons, drawer |
| `businesses.created_at` | businesses | Owner col (joined), sort by joined |
| `businesses.suspension_reason` | businesses | Drawer alert, shown to owner on login |
| `users.name` (owner) | users | Owner col, drawer |
| `users.email` (owner) | users | Drawer owner email |
| `subscriptions.package_name` | subscriptions | Package col, drawer, package filter |
| `subscriptions.end_date` | subscriptions | Subscription col, drawer |
| `subscriptions.days_remaining` | subscriptions | Subscription col colour, sort by expiry |
| `stores.count` | stores | Stores col, drawer quick stats |
| `stores[]` (list) | stores | Drawer store cards |
| `stores[].name` | stores | Store card |
| `stores[].address` | stores | Store card |
| `stores[].city` | stores | Store card |
| `stores[].status` | stores | Store card accent + opacity |
| `stores[].manager` | stores | Store card footer |
| `stores[].staff_count` | stores | Store card footer |
| `stores[].cashier_count` | stores | Store card footer |
| `users.count` (staff) | users | Staff col, drawer quick stats |
| `products.count` | products | Products col, drawer quick stats |
| `profile.legal_name` | businesses | Drawer business identity |
| `profile.display_name` | businesses | Drawer business identity |
| `profile.tagline` | businesses | Drawer identity block |
| `profile.industry` | businesses | Drawer business identity |
| `profile.org_type` | businesses | Drawer identity pill + section |
| `profile.company_size` | businesses | Drawer business identity |
| `profile.reg_number` | businesses | Drawer legal |
| `profile.ntn` | businesses | Drawer legal |
| `profile.head_office` | businesses | Drawer legal |
| `profile.description` | businesses | Drawer description section |
| `profile.website` | businesses | Drawer contact |
| `profile.support_email` | businesses | Drawer contact |
| `profile.support_phone` | businesses | Drawer contact |
| `profile.facebook_url` | businesses | Drawer social links |
| `profile.instagram_url` | businesses | Drawer social links |
| `profile.linkedin_url` | businesses | Drawer social links |
| `profile.youtube_url` | businesses | Drawer social links |
| `profile.tiktok_url` | businesses | Drawer social links |

---

## 14. API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `GET /api/admin/businesses` | GET | Paginated list. Params: `status`, `package`, `search`, `sort`, `page`, `per_page` |
| `GET /api/admin/businesses/:id` | GET | Full business detail for drawer |
| `GET /api/admin/businesses/:id/stores` | GET | Store list for drawer store section |
| `POST /api/admin/businesses/:id/suspend` | POST | Body: `{ reason }`. Sets status → suspended |
| `POST /api/admin/businesses/:id/reactivate` | POST | Sets status → active, clears suspension_reason |
| `POST /api/admin/registrations/:id/reject` | POST | Body: `{ reason }`. Rejects pending registration |
| `GET /api/admin/businesses/export` | GET | CSV of current filtered set |

---

## 15. Color & Badge Reference

### Status badges
| Status | Badge bg | Badge text | Dot |
|---|---|---|---|
| Active | `brand-green/10` | `brand-green` | Green |
| Pending | `brand-purple/10` | `brand-purple` | Purple (pulsing) |
| Suspended | `brand-orange/10` | `brand-orange` | Orange |
| Banned | `brand-red/10` | `brand-red` | Red |

### Package badges
| Package | Badge bg | Text |
|---|---|---|
| Enterprise | `#1a2d6b` (navy) | White |
| Pro | `#3366cc` (brand-blue) | White |
| Starter | `gray-200` | `gray-600` |

### Subscription urgency
| Threshold | Dot | Text |
|---|---|---|
| > 7 days | Green | Gray |
| 3–7 days | Orange | Orange bold |
| ≤ 2 days | Red | Red bold |

### Store card accent bar
| Store status | Bar color | Card opacity |
|---|---|---|
| Active | `#2dd36f` (green) | 100% |
| Inactive | `#cbd5e1` (gray) | 65% |
