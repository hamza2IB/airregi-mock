# Admin Dashboard — Screen Specification
> **File:** `demo/admin.html`  
> **Status:** UI finalized — ready for backend integration  
> **Last updated:** Jul 13, 2026

---

## 1. Layout Shell

| Element | Detail |
|---|---|
| Sidebar width | 260px, `bg-navy-dark` (`#0a1535`), sticky, full-height scroll |
| Header height | 64px, white, sticky `z-40`, subtle drop shadow |
| Content area | `p-8` padding, `bg-page` (`#f4f6f9`) |
| Font | Plus Jakarta Sans (400/500/600/700/800) |
| Responsive breakpoint | ≤768px: sidebar hidden, 2-col KPI grid, single-col sections |

---

## 2. Sidebar Navigation

### Sections & Links

| Section Label | Nav Item | Icon | Badge |
|---|---|---|---|
| Overview | Dashboard | `grid-outline` | — |
| Businesses | All Businesses | `business-outline` | — |
| Businesses | Payment Verification | `card-outline` | Purple pill (new-reg count) + Orange pill (renewal count) |
| Platform | Packages | `layers-outline` | — |
| Platform | Categories | `list-outline` | — |
| Reports | Revenue | `trending-up-outline` | — |
| Reports | Platform Analytics | `stats-chart-outline` | — |
| Admin | Admin Users | `people-outline` | — |

### Sidebar Badge Logic — Payment Verification
Two inline pills, always visible:
- **Purple pill** = count of new business registrations with unverified payment
- **Orange pill** = count of renewal payments awaiting verification
- Example display: `[4] [2]` (not a combined "6")

### Active State
`.sidebar-link.active` → `background: rgba(255,255,255,0.12)`, `font-weight: 600`, `color: #fff`

### Profile Footer
| Field | Value source |
|---|---|
| Avatar initials | First letters of admin name |
| Name | `admin.name` |
| Email | `admin.email` |
| Logout button | `log-out-outline` icon |

---

## 3. Header

| Element | Detail |
|---|---|
| Breadcrumb | Section name → Page title (e.g. "Overview → Dashboard") |
| Page heading | Large bold title, updates on nav change via `adminNav()` |
| User chip | Avatar (gradient green), name, role label "Platform Admin", dropdown chevron |

### `adminNav(page)` — Page Metadata Map

| Page key | Breadcrumb section | Heading |
|---|---|---|
| `dashboard` | Overview | Dashboard |
| `businesses` | Businesses | All Businesses |
| `payments` | Businesses | Payment Verification Queue |
| `packages` | Platform | Subscription Packages |
| `categories` | Platform | Platform Categories |
| `revenue` | Reports | Revenue Report |
| `analytics` | Reports | Platform Analytics |
| `users` | Admin | Admin Team |

---

## 4. Subscription Expiry Alert Strip

A dismissible banner that appears at the top of the dashboard content area when any business has ≤7 days remaining on their subscription.

### Data Fields
| Field | Source |
|---|---|
| Business name | `businesses.name` |
| Days remaining | Computed: `subscription.end_date - today` |
| Strip visibility | Show if any `subscription.days_remaining <= 7` |
| Dismiss | Client-side only (removes element from DOM, no server call needed) |

### Urgency Colour Rules (pill chips in strip)
| Days | Pill border/bg | Dot | Text colour |
|---|---|---|---|
| ≤2 | `brand-red/25` bg | Pulsing red dot | `text-brand-red` |
| 3–7 | `brand-orange/25` bg | Static orange dot | `text-brand-orange` |

### "Review all" Link
→ Navigates to Payment Verification page filtered to renewals.

---

## 5. Platform Health — KPI Cards

4-column grid (`grid-cols-4`), collapses to 2-col on mobile.

### Card 1 — Active Businesses
| Field | API source | Notes |
|---|---|---|
| Primary number | `COUNT(businesses WHERE status = 'active')` | |
| Sub-label | `COUNT(stores WHERE business.status = 'active')` | e.g. "214 total stores" |
| Trend badge | New businesses this week | Green pill, `↑ N this week` |
| Accent colour | `brand-blue` | |

### Card 2 — Registered Customers
| Field | API source | Notes |
|---|---|---|
| Primary number | `COUNT(customers)` | Formatted e.g. "18.6k" |
| Trend badge | New customers this week | Green pill, `↑ N this week` |
| Accent colour | `brand-green` | |

### Card 3 — Pending Approvals *(clickable)*
| Field | API source | Notes |
|---|---|---|
| Primary number | `COUNT(business_registrations WHERE payment_status = 'unverified' AND type = 'new_registration')` | |
| Sub-label | "New registrations" | Static |
| Badge | "Approve needed" | Purple pill |
| Accent colour | `brand-purple` | |
| On click | Scrolls to Payment Queue, activates "New Reg" tab | `switchQueueTab('new-reg')` |

### Card 4 — Renewals to Verify *(clickable)*
| Field | API source | Notes |
|---|---|---|
| Primary number | `COUNT(subscription_payments WHERE status = 'unverified' AND type = 'renewal')` | |
| Sub-label | "Existing businesses" | Static |
| Badge | "Action needed" | Orange pill |
| Accent colour | `brand-orange` | |
| On click | Scrolls to Payment Queue, activates "Renewals" tab | `switchQueueTab('renewal')` |

---

## 6. Revenue Section

### Period Filter Tabs
| Tab | Period |
|---|---|
| This Month | 1st of current month → today |
| Last Month | Full previous calendar month |
| Last 3 Months | 3 full calendar months back |
| This Year | Jan 1 of current year → today |

Active tab style: `bg-navy text-white`. Inactive: `text-gray-500 hover:bg-gray-50`.

All widgets below re-render when a tab is selected via `applyRevData(period)`.

### 6a. Hero Revenue Card
Dark gradient card (`from-navy-dark to-navy`).

| Element ID | Field | API source |
|---|---|---|
| `rev-period-label` | Human-readable period string | Computed from filter |
| `rev-hero-trend` | % change vs previous period | Computed |
| `rev-hero-total` | Total subscription revenue in period | `SUM(subscription_payments.amount WHERE status='verified' AND date IN period)` |
| `rev-hero-subs` | Active subscription count | `COUNT(subscriptions WHERE status='active')` |
| `rev-hero-new` | New subscriptions in period | `COUNT(subscriptions WHERE created_at IN period)` |
| `rev-hero-new-label` | Dynamic label | e.g. "New This Month" |
| `rev-hero-renewals` | Renewals collected in period | `COUNT(subscription_payments WHERE type='renewal' AND status='verified' AND date IN period)` |
| `rev-hero-renewals-label` | Dynamic label | e.g. "Renewals This Month" |

### 6b. Revenue by Package
Three horizontal bar rows: Enterprise, Pro, Starter.

| Element ID pattern | Field | API source |
|---|---|---|
| `rev-pkg-{tier}-rev` | Revenue from tier in period | `SUM(payments) GROUP BY package_id` |
| `rev-pkg-{tier}-biz` | Business count on tier | `COUNT(subscriptions) GROUP BY package_id` |
| `rev-pkg-{tier}-bar` | Bar width % | Relative to highest-revenue tier = 100% |
| `rev-pkg-{tier}-note` | Price per business + MRR % | Computed |

Tier identifiers: `ent` (Enterprise), `pro` (Pro), `str` (Starter).

### Package Pricing Reference (current mock values)
| Package | Monthly price | Colour |
|---|---|---|
| Enterprise | Rs. 120,000 | `navy` (`#1a2d6b`) |
| Pro | Rs. 60,000 | `brand-blue` (`#3366cc`) |
| Starter | Rs. 16,900 | `brand-blue/40` (muted) |

### 6c. MRR Trend Bar Chart
Rendered dynamically into `#rev-mrr-bars`.

| Element ID | Field |
|---|---|
| `rev-mrr-subtitle` | Period label (e.g. "Last 6 months") |
| `rev-mrr-bars` | Bar chart — each bar: label (value), bar div (height % of max), month label |
| `rev-mrr-growth` | MoM or period growth % |
| `rev-mrr-growth-note` | Absolute Rs. delta vs prior period |

Bar colour logic (current bar = always highlighted):
- Last bar (current period): `bg-brand-blue ring-2 ring-brand-blue/20`, label `text-brand-blue font-bold`
- Previous bars: opacity stepped — ≥85% height → `/70`, ≥65% → `/50`, else → `/30`

---

## 7. Payment Verification Queue

### Header
| Field | Value |
|---|---|
| Total count | `COUNT(all unverified payments)` |
| New reg count | `COUNT WHERE type = 'new_registration'` |
| Renewal count | `COUNT WHERE type = 'renewal'` |
| Display format | "6 total · **4 new reg** · **2 renewals**" |

### Tab Filter
Three tabs — All / New Reg / Renewals. Filtering is **client-side** (`data-type` attribute on each `.queue-item`). No re-fetch needed per tab switch.

| Tab | `data-type` shown | Badge colour |
|---|---|---|
| All | all | Navy |
| New Reg | `new-reg` | Purple |
| Renewals | `renewal` | Orange |

### Queue Item — Common Fields
| Field | API source |
|---|---|
| Business name | `businesses.name` |
| Package name | `packages.name` |
| Monthly price | `packages.monthly_price` |
| Bank name | `subscription_payments.bank_name` |
| Amount | `subscription_payments.amount` |
| Reference number | `subscription_payments.reference_number` |
| Payment date | `subscription_payments.payment_date` |
| Receipt file | `subscription_payments.receipt_url` (nullable) |

### Queue Item — Type-Specific Fields

**Renewal items** (`data-type="renewal"`)
| Field | Source |
|---|---|
| Context banner | Orange "Renewal Payment" |
| Days until expiry | `subscription.end_date - today` |
| Renewal date | `subscription.end_date` formatted |
| Status badge | "Unverified" (orange) |
| Primary CTA | **Verify & Renew** → sets `subscription_payments.status = 'verified'`, extends `subscription.end_date` by 1 month |
| Secondary CTA | **Reject** → sets `status = 'rejected'`, triggers rejection reason modal |

**New Registration items** (`data-type="new-reg"`)
| Field | Source |
|---|---|
| Context banner | Purple "New Registration" |
| Submission date | `business_registrations.created_at` |
| Owner name | `users.name WHERE role = 'owner' AND business_id = this` |
| Status badge | "New Reg" (purple) |
| Primary CTA | **Verify & Activate** → sets `payment.status = 'verified'`, sets `business.status = 'active'`, creates owner user account, sends invitation email |
| Secondary CTA | **Reject** → sets `registration.status = 'rejected'`, triggers rejection reason modal |

### Receipt Display Logic
- If `receipt_url` is present: show filename + "View Receipt" button → opens file in new tab / lightbox
- If `receipt_url` is null: show "No receipt uploaded" in italic grey

### Post-Action Toast
| Action | Toast message | Type |
|---|---|---|
| Verify & Renew (renewal) | "{Business} renewal verified. Subscription extended." | success |
| Verify & Activate (new reg) | "{Business} verified & activated. Credentials sent." | success |
| Reject | "{Business} rejected." | error |

Toast style: fixed top-right, `border-left: 4px solid brand-green/red`, 3s auto-dismiss.

---

## 8. Subscription Overview

Two-column grid (`grid-cols-2`): Expiring Soon + Plan Distribution.

### 8a. Expiring Soon

Scrollable list (`max-height: 280px`), sorted ascending by days remaining.

| Field | API source |
|---|---|
| Business name | `businesses.name` |
| Package name | `packages.name` |
| Amount due | `packages.monthly_price` |
| Days remaining | `subscription.end_date - today` |
| Header count badge | `COUNT(subscriptions WHERE days_remaining <= 7)` |
| Footer progress bar | `at-risk count / total active businesses * 100` |

**Urgency badge rules per row:**
| Days remaining | Row icon | Day colour | Badge |
|---|---|---|---|
| ≤2 | `alert-circle` red | `text-brand-red` | "Critical" — red filled pill |
| 3–4 | `warning` orange | `text-brand-orange` | "Urgent" — orange outline pill |
| 5–7 | `warning` orange | `text-brand-orange` | No badge, just day count |
| 7 | `time-outline` gray | `text-gray-400` | No badge |

**Sticky footer fields:**
| Element | Value |
|---|---|
| Risk text | "N of M businesses at risk" |
| Progress bar fill | `N/M * 100%`, gradient `#eb445a → #ff9800` |
| "Send reminders" link | → triggers bulk reminder email to all expiring businesses |

### 8b. Plan Distribution

Static breakdown of active subscriptions by package tier.

| Field | API source |
|---|---|
| Tier name | `packages.name` |
| Business count per tier | `COUNT(subscriptions) GROUP BY package_id WHERE status='active'` |
| Percentage | `tier_count / total_active * 100` |
| Stacked bar widths | Same percentages |
| Footer pills | Active / Suspended / Banned counts from `businesses.status` |

**Status pill colours:**
| Status | Colour |
|---|---|
| Active | `brand-green` bg |
| Suspended | `brand-red` bg |
| Banned | `gray-100` bg, gray text |

---

## 9. Data Dependencies Summary

The dashboard depends on these backend entities. All must be available via API at load time.

| Entity | Key fields used |
|---|---|
| `businesses` | `id`, `name`, `status` (`active`/`suspended`/`banned`) |
| `stores` | `business_id`, `status` |
| `subscriptions` | `business_id`, `package_id`, `status`, `start_date`, `end_date`, `days_remaining` (computed) |
| `subscription_payments` | `id`, `business_id`, `type` (`new_registration`/`renewal`), `status` (`unverified`/`verified`/`rejected`), `amount`, `bank_name`, `reference_number`, `payment_date`, `receipt_url` |
| `packages` | `id`, `name`, `monthly_price` |
| `customers` | `id` (count only) |
| `users` | `id`, `name`, `email`, `role`, `business_id` |
| `business_registrations` | `id`, `business_id`, `status`, `created_at` |

---

## 10. Suggested API Endpoints for Dashboard Load

| Endpoint | Returns |
|---|---|
| `GET /api/admin/dashboard/stats` | KPI counts: active businesses, total stores, total customers, pending approvals, renewals to verify |
| `GET /api/admin/dashboard/expiry` | Subscriptions expiring in ≤7 days, sorted by days_remaining ASC |
| `GET /api/admin/dashboard/revenue?period=this_month` | Revenue total, subs count, new count, renewals count, per-package breakdown, MRR series |
| `GET /api/admin/payments/queue` | All unverified payments with full detail, sorted by urgency (renewals with ≤2d first) |
| `GET /api/admin/subscriptions/distribution` | Count and % per package, status counts (active/suspended/banned) |

---

## 11. Business Status Values

Used across expiry strip, queue, and plan distribution — must be consistent.

| Value | Meaning | Triggered by |
|---|---|---|
| `active` | Fully operational | Admin approves registration or renewal |
| `invited` | Owner account created, awaiting first login | System after approval |
| `suspended` | Manually suspended by admin | Admin action (requires reason) |
| `banned` | Auto-banned on subscription expiry | Automated daily job |
| `pending` | Registration submitted, payment not yet verified | Business self-registration |
| `rejected` | Registration or payment rejected | Admin action (requires reason) |

---

## 12. Payment Status Values

| Value | Meaning |
|---|---|
| `unverified` | Submitted by business, not yet reviewed |
| `verified` | Admin confirmed against bank records |
| `rejected` | Admin rejected (reason stored) |

---

## 13. Subscription Payment Types

| Value | Meaning | CTA shown |
|---|---|---|
| `new_registration` | First payment for a brand new business | "Verify & Activate" |
| `renewal` | Monthly/annual renewal for existing active business | "Verify & Renew" |

---

## 14. Color Token Reference

| Token | Hex | Used for |
|---|---|---|
| `navy-dark` | `#0a1535` | Sidebar bg, primary text, gradient start |
| `navy` | `#1a2d6b` | Active nav, gradient end, Enterprise tier |
| `brand-blue` | `#3366cc` | Pro tier, links, KPI accent |
| `brand-green` | `#2dd36f` | Success states, active badges, CTA verify |
| `brand-orange` | `#ff9800` | Renewals, warnings, expiry 3–7d |
| `brand-red` | `#eb445a` | Critical expiry ≤2d, rejection, banned |
| `brand-purple` | `#7c4dff` | New registrations, pending approvals |
| `page` | `#f4f6f9` | Page background |
| `border` | `#e8ecf1` | Card borders, dividers |
