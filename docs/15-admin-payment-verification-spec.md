# Admin — Payment Verification Page Specification
> **Section in file:** `demo/admin.html` → `#adm-payments`  
> **Triggered by:** Sidebar → Businesses → Payment Verification  
> **Status:** UI finalized — ready for backend integration  
> **Last updated:** Jul 13, 2026

---

## 1. Page Purpose

Dedicated full-page view of every payment awaiting admin verification — both **new business registrations** and **subscription renewals** (including renewals from already-banned businesses). This is the operational hub where admin approves money and, as a direct consequence, changes business account state (`pending → active`, `banned → active`, or `active → active` with extended subscription).

This page is the sibling of the smaller Payment Verification widget embedded on the Dashboard — same visual language, same card design, but full-page with search, filters, sort, and pagination.

---

## 2. Page Load Behaviour

- Page is hidden (`hidden` class) on initial load; shown when `adminNav('payments')` is called
- List is initialized on every visit: `pvFiltered = [...PV_DATA]; renderPvList();`
- KPIs and sidebar badge counts are also synced once on initial page load (`pvKpis()`), so counts are correct even before the admin navigates here
- Default state: **All** tab active, no search query, no receipt filter, sorted by Newest First

---

## 3. Summary KPI Strip

Four cards, all computed live from `PV_DATA`. Update instantly on every Verify or Reject action.

| Card | Count source | Colour | Icon |
|---|---|---|---|
| Total Pending | `PV_DATA.length` | Navy | `layers-outline` |
| New Registrations | `COUNT WHERE type = 'new-reg'` | Purple | `business-outline` |
| Renewals | `COUNT WHERE type = 'renewal'` | Orange | `refresh-circle-outline` |
| From Banned Businesses | `COUNT WHERE bizStatus = 'banned'` | Red | `ban-outline` |

The 4th card is important — it isolates renewals belonging to **already-banned** businesses, since these carry a different consequence when verified (see Section 6c).

---

## 4. Toolbar

### 4a. Search
- Live search on `oninput`
- Matches: `payment.bizName`, `payment.ref`, `payment.bank` (case-insensitive substring)
- AND-combined with type tab and receipt filter

### 4b. Type Filter Tabs

| Tab | Filters to |
|---|---|
| All | Every pending payment |
| New Reg | `type = 'new-reg'` |
| Renewals | `type = 'renewal'` (includes both active-business and banned-business renewals) |

Counts shown inline update live. Active tab: `bg-navy text-white`.

### 4c. Receipt Filter
Dropdown: Any / Has Receipt / No Receipt. AND-combined with other filters.

### 4d. Sort Dropdown

| Option | Sort key |
|---|---|
| Newest First | `date` descending |
| Oldest First | `date` ascending |
| Amount (high–low) | `amount` descending |
| Amount (low–high) | `amount` ascending |

### 4e. Export CSV
Exports current filtered set. Backend endpoint needed.

---

## 5. Payment Card Anatomy

Each payment renders as a card with a **context banner** on top that changes shape depending on scenario (see Section 6), then a common body:

| Element | Source |
|---|---|
| Business name | `payment.name` |
| Subtitle line | Package + amount + context (owner name for new-reg, "renewing"/"expired" for renewal) |
| Right-side badges | Status pills (varies by scenario) |
| Bank | `payment.bank` |
| Amount | `payment.amount` formatted as `Rs.###,###` |
| Reference # | `payment.ref` (monospace) |
| Date | `payment.date` |
| Receipt row | Filename + "View Receipt" link, or "No receipt uploaded" in italic gray |
| Primary CTA | Green, label varies by scenario |
| Secondary CTA | Red outline, label varies by scenario |

---

## 6. The Three Payment Scenarios

This is the core of the page — each scenario has a distinct banner, badge set, and consequence when verified or rejected.

### 6a. Scenario: New Registration

**When it occurs:** A brand new business has submitted their first-ever payment during registration. The business does not exist in the system yet — no owner account, no portal access.

**Visual identity:**
- Banner: purple-tinted, `business-outline` icon, "New Registration" label, "Submitted [date]" on the right
- Right badge: "New Reg" purple pill
- Subtitle includes: `Package · Amount/mo · Owner: [name]`

**Primary CTA: "Verify & Activate"**
```
Admin clicks Verify & Activate
        ↓
System:
  - payment.status → verified
  - business record created with status = 'active'
  - owner user account created with status = 'invited'
  - subscription.start_date = today, end_date = today + package duration
  - invitation email sent to owner with portal link + temp credentials
        ↓
Card removed from queue
Toast: "{Name} verified & activated. Credentials sent." (green)
KPI strip + tab counts + sidebar badge update live
```

**Secondary CTA: "Reject"**
```
Admin clicks Reject → Reject Registration Modal opens
        ↓
Modal shows: business name + payment ref
Warning: "This registration will be permanently rejected.
The applicant will be notified and must reapply from scratch."
        ↓
Admin types rejection reason (required)
        ↓
Admin confirms
        ↓
System:
  - registration.status → rejected
  - payment.status → rejected
  - rejection reason emailed to applicant
  - business is NEVER created — no owner account exists
        ↓
Card removed from queue
Toast: "{Name} registration rejected. Applicant notified." (red)
```

**Why this matters:** Rejecting a new registration has zero effect on any existing business — there is nothing to "keep banned" or "keep active." The applicant simply has to start over.

---

### 6b. Scenario: Renewal — Active Business (expiring soon)

**When it occurs:** An existing active business is approaching subscription expiry (within the 7-day warning window) and has submitted their renewal payment ahead of the deadline.

**Visual identity:**
- Banner: orange-tinted, `refresh-circle-outline` icon, "Renewal Payment" label, "Sub expires in **Nd**" on the right (red text if ≤2 days, orange if 3-7 days)
- Right badge: "Unverified" orange pill only (no status pill — business is still active)
- Subtitle includes: `Package · Amount/mo · renewing`

**Primary CTA: "Verify & Renew"**
```
Admin clicks Verify & Renew
        ↓
System:
  - payment.status → verified
  - subscription.end_date extended by 1 billing cycle
  - business.status remains 'active' (was never interrupted)
        ↓
Card removed from queue
Toast: "{Name} renewal verified. Subscription extended." (green)
```

**Secondary CTA: "Reject Payment"**
```
Admin clicks Reject Payment → Reject Renewal Payment Modal opens
        ↓
Modal shows: business name + payment ref
Warning: "The business will remain active but the subscription
expiry clock continues. The owner must resubmit a correct payment."
        ↓
Admin types rejection reason (required)
        ↓
Admin confirms
        ↓
System:
  - payment.status → rejected
  - rejection reason emailed to owner
  - business.status UNCHANGED — stays active
  - subscription.end_date UNCHANGED — expiry clock keeps ticking
        ↓
Card removed from queue
Toast: "{Name} payment rejected. Owner notified to resubmit." (red)
```

**Why this matters:** Rejecting here is low-risk — the business isn't locked out yet. But the clock is still running, so if the owner doesn't resubmit before expiry, the business will auto-ban on its own (see Scenario 6c below, which is what happens next in that case).

---

### 6c. Scenario: Renewal — Banned Business (subscription already expired)

**When it occurs:** A business's subscription expired, the system auto-banned it (daily job), and the owner has since submitted a renewal payment to try to restore access. This is the highest-urgency scenario because real users are currently locked out.

**Visual identity:**
- **Two banners stacked:**
  1. Red-tinted banner: `ban-outline` icon, "Renewal Payment — Business Banned" label, "Expired **[date]**" on the right in red
  2. Blue info strip below it: `information-circle-outline` icon, *"Verifying this payment will automatically restore the business and reactivate all logins."*
- Right badges: "Banned" red pill + "Unverified" orange pill (both shown together)
- Subtitle includes: `Package · Amount/mo · expired [date]`

**Primary CTA: "Verify & Renew"**
```
Admin clicks Verify & Renew
        ↓
System:
  - payment.status → verified
  - subscription.end_date extended by 1 billing cycle from today
  - business.status → active  (THIS IS THE KEY DIFFERENCE vs 6b)
  - ALL owner + staff logins immediately restored
        ↓
Card removed from queue
Toast: "{Name} renewal verified. Business restored & all logins reactivated." (green)
```

**Secondary CTA: "Reject Payment"**
```
Admin clicks Reject Payment → Reject Renewal Payment Modal opens
        ↓
Modal shows: business name + payment ref
Warning: "The business will remain banned. The owner must
submit a new valid payment to restore access."
        ↓
Admin types rejection reason (required)
        ↓
Admin confirms
        ↓
System:
  - payment.status → rejected
  - rejection reason emailed to owner
  - business.status UNCHANGED — stays banned
  - All logins remain blocked
        ↓
Card removed from queue
Toast: "{Name} payment rejected. Owner notified to resubmit." (red)
```

**Why this matters:** This is the ONLY path by which a banned business can be restored. There is no direct "Restore" button anywhere in the admin portal (see All Businesses spec, section 7e) — restoration is always gated behind a verified renewal payment appearing in this queue. Rejecting here keeps the business locked and forces the owner to submit a correct payment.

---

## 7. Scenario Comparison Table

| Aspect | New Registration | Renewal (Active) | Renewal (Banned) |
|---|---|---|---|
| Business exists yet? | No | Yes | Yes |
| Banner colour | Purple | Orange | Red + Blue info strip |
| Status badges shown | "New Reg" | "Unverified" only | "Banned" + "Unverified" |
| Primary CTA | Verify & Activate | Verify & Renew | Verify & Renew |
| Verify effect on business | Creates business + owner, status → active | Extends subscription, status stays active | Extends subscription, status → active (restores access) |
| Secondary CTA | Reject | Reject Payment | Reject Payment |
| Reject effect on business | Nothing created; applicant must reapply | Stays active; owner resubmits | Stays banned; owner resubmits |
| Urgency | Medium (blocks new customer onboarding) | Low–Medium (business still running) | High (real users locked out right now) |

---

## 8. Reject Modal — Shared Component

One modal handles all three reject scenarios, with content swapped dynamically based on the `type` argument passed to `openRejectModal(type, bizName, paymentRef)`.

| `type` value | Title | Warning text |
|---|---|---|
| `'new-reg'` | "Reject Registration" | "This registration will be **permanently rejected**. The applicant will be notified and must reapply from scratch." |
| `'renewal'` | "Reject Renewal Payment" | "The business will **remain active** but the subscription expiry clock continues. The owner must resubmit a correct payment." |
| `'renewal-banned'` | "Reject Renewal Payment" | "The business will **remain banned**. The owner must submit a new valid payment to restore access." |

**Common elements across all three:**
- Info rows: Business name + Payment Ref
- Reason textarea: required, red border on empty submit attempt, label "Rejection Reason (shown to business owner)"
- Cancel button: closes modal, no changes
- Confirm button label: "Reject Registration" (new-reg) or "Reject Payment" (both renewal types)

**On confirm (any type):**
1. Validates reason is non-empty
2. Closes modal
3. Removes the matching payment from the queue (matched by business name)
4. Fires the appropriate toast message
5. Triggers KPI + tab count + sidebar badge refresh

---

## 9. Common Rejection Reasons (for admin reference / placeholder text)

| Reason | Applies to |
|---|---|
| Payment reference not found in bank records | All types |
| Wrong amount submitted (doesn't match package price) | All types |
| Reference number already used on another payment | All types |
| Payment sent to wrong bank account | All types |
| Receipt/screenshot doesn't match submitted details | All types |
| Suspicious or fraudulent transaction pattern | All types |

---

## 10. Live Sync Behaviour

Every Verify or Reject action triggers `pvKpis()` which updates, in this order:

1. **KPI strip** (this page) — Total Pending, New Registrations, Renewals, From Banned Businesses
2. **Tab counts** (this page) — All / New Reg / Renewals inline counters
3. **Sidebar badges** — purple pill (new-reg count) and orange pill (renewal count) next to "Payment Verification" nav item
4. **Dashboard widget tab counts** — the smaller queue widget on the Dashboard page has its own `#queue-tabs` counters kept in sync so both views never disagree, even though the dashboard widget itself still renders its own static demo cards

> **Known limitation in current mock:** The Dashboard's embedded queue widget uses its own hardcoded card markup (separate from `PV_DATA`) for the initial demo cards. Verifying/rejecting from the *dashboard widget* only fades that card visually and does not currently decrement `PV_DATA` or trigger the full sync described above. Verifying/rejecting from the *dedicated Payment Verification page* is fully wired and is the source of truth. **Recommendation for backend integration:** both surfaces should read from the same live API endpoint so this discrepancy disappears naturally.

---

## 11. Pagination

- 5 payments per page (`PV_PER_PAGE = 5`)
- Footer: "Showing 1–N of M payments"
- Numbered pills + prev/next arrows
- Resets to page 1 on any filter/sort change
- Empty state: "No payments match your filters." when a filter yields zero results
- End-of-list marker: "No more payments in queue." shown after the last card on the final page

---

## 12. Data Model

```js
{
  id: number,
  type: 'new-reg' | 'renewal',
  bizStatus: 'pending' | 'active' | 'banned',   // determines which of the 3 scenarios renders
  name: string,                                  // business name
  pkg: 'Enterprise' | 'Pro' | 'Starter',
  amountLabel: string,                           // e.g. "Rs.120,000/mo"
  amount: number,                                // raw number for sorting
  bank: string,
  ref: string,                                   // payment reference number
  date: string,                                  // display date
  dateSort: string,                              // ISO date for sorting
  receipt: string | null,                        // filename or null
  // new-reg only:
  owner: string,
  submitted: string,
  // renewal (active) only:
  expiresIn: string,                             // e.g. "2d"
  expiresColor: 'red' | 'orange',
  // renewal (banned) only:
  expiredOn: string,
}
```

---

## 13. Suggested API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `GET /api/admin/payments` | GET | Paginated queue. Params: `type`, `receipt`, `search`, `sort`, `page`, `per_page` |
| `POST /api/admin/payments/:id/verify` | POST | Verifies payment. Behaviour branches server-side based on `type` + business `status` (see Section 6 for each branch's effects) |
| `POST /api/admin/payments/:id/reject` | POST | Body: `{ reason }`. Rejects payment, no business state change except for new-reg (registration marked rejected) |
| `GET /api/admin/payments/export` | GET | CSV of current filtered set |

---

## 14. Color & Badge Reference

| Element | Colour |
|---|---|
| New Registration banner | `brand-purple` bg tint, purple text |
| Renewal (active) banner | `brand-orange` bg tint, orange text |
| Renewal (banned) banner | `brand-red` bg tint, red text |
| Info strip (banned renewal only) | `brand-blue` bg tint, blue text |
| "New Reg" badge | Purple pill |
| "Unverified" badge | Orange pill |
| "Banned" badge | Red pill |
| Verify CTA | `brand-green` filled button |
| Reject CTA | `brand-red` low-opacity fill, red text |
| Expiry countdown ≤2d | Red bold text |
| Expiry countdown 3–7d | Orange text |
