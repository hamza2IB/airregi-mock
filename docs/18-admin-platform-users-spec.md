# Admin — Platform Users Page Specification
> **Section in file:** `demo/admin.html` → `#adm-platform-users`
> **Triggered by:** Sidebar → Businesses → Platform Users
> **Status:** UI finalized, tested live via Playwright — ready for backend integration
> **Last updated:** Jul 14, 2026

---

## 1. Page Purpose

A single, read-oriented directory of **every non-admin, non-owner account across the platform**: warehouse managers, warehouse staff, store managers, store staff, cashiers, and marketplace customers. This is the platform-level oversight view — it is **not** where these accounts are created or day-to-day managed.

### 1a. What this page is NOT

Per the permissions matrix (`docs/12-permissions-matrix.md`), inviting and managing warehouse/store/cashier staff is exclusively the **Business Owner's** job, done from their own portal (`owner/users.html`, `owner/user-invite.html`). Customers self-register through the ecommerce app. Admin never invites, edits roles, or reassigns locations for any of these users here.

What admin *can* do from this page:
- View every platform user in one place, regardless of which business or role they belong to
- Search/filter/sort across the entire user base
- Suspend a user's login as an emergency, platform-level override (fraud, abuse, policy violation reports) — separate from and in addition to whatever access controls the business owner applies inside their own portal
- Reactivate a login previously suspended this way

This page complements — and never replaces — each Business Owner's own user management inside their portal.

---

## 2. Page Load Behaviour

- Page hidden on load; shown when `adminNav('platform-users')` is called
- `renderPuTable()` pre-renders on script load so the page is instantly ready when the sidebar link is clicked
- Default filter on load: **All** (every role, every status)

---

## 3. KPI Strip

Four cards, all computed live from `PU_DATA`:

| KPI | Source | Icon |
|---|---|---|
| Total Platform Users | `PU_DATA.length` | `people-circle-outline`, navy |
| Business Staff | Count where `role !== 'customer'` (warehouse + store + cashier roles combined) | `business-outline`, blue |
| Customers | Count where `role === 'customer'` | `person-outline`, purple |
| Suspended | Count where `status === 'suspended'` | `ban-outline`, red |

---

## 4. Toolbar

| Element | Behaviour |
|---|---|
| Search input (`pu-search`) | Live filter across name, email, and business name — case-insensitive substring match |
| Status tabs (All / Active / Suspended) | `setPuFilter(status, btn)` — mutually exclusive |
| Role filter (`pu-role-filter`) | Dropdown: Warehouse Manager, Warehouse Staff, Store Manager, Store Staff, Cashier, Customer |
| Sort (`pu-sort`) | Name A–Z / Z–A, Joined newest / oldest |

All filters and sort combine (AND logic) and reset to page 1 on change.

---

## 5. Table

| Column | Content |
|---|---|
| User | Avatar (initial, deterministic color) + name + email |
| Role | Color-coded pill — see Section 6 |
| Business / Location | Business name + specific store/warehouse the user is assigned to. Shows `—` / `—` for customers, who aren't scoped to a single business |
| Status | Green "Active" or red "Suspended" pill |
| Joined | Date the account was created |
| Actions | View / Suspend or Reactivate |

Paginated at 10 per page, same pill-pagination pattern as All Businesses.

---

## 6. Role Reference

| Role key | Label | Pill color | Notes |
|---|---|---|---|
| `wh_manager` | Warehouse Manager | Blue | Assigned to one warehouse |
| `wh_staff` | Warehouse Staff | Blue | Assigned to one warehouse |
| `store_manager` | Store Manager | Navy | Assigned to one store |
| `store_staff` | Store Staff | Navy | Assigned to one store |
| `cashier` | Cashier | Green | Assigned to one store (operates its POS) |
| `customer` | Customer | Purple | Not scoped to any business — shops across the marketplace |

---

## 7. Actions

### 7a. View
Opens a lightweight, read-only detail modal (not a separate page — consistent with the drawer pattern used for the All Businesses page, just modal-sized since there's far less data per user). Shows role, status, business, location, and joined date, plus a contextual footer action (Suspend or Reactivate depending on current status).

### 7b. Suspend
Opens the **Suspend Login Modal** (Section 8). This is explicitly framed as a platform-level *emergency override* for abuse/fraud — the modal body text says so directly, to prevent admins from treating this as the normal offboarding flow (which belongs to the business owner).

A reason is required, same validation pattern as the All Businesses Suspend modal (red border on empty submit).

### 7c. Reactivate
One-click, no confirmation modal — restores `status` to `active` and clears `suspendReason`. Deliberately lower-friction than Suspend since reactivating is the safe direction (restoring access) versus revoking it.

---

## 8. Suspend Login Modal

| Element | Value |
|---|---|
| Icon | `pause-circle-outline`, red |
| Title | "Suspend User Login" |
| Subtitle | "Platform-level emergency override." |
| Body | "You are suspending **{Name}**'s login. This is for abuse/fraud cases only — routine staff management (role changes, offboarding) should be done by the business owner from their own portal." |
| Reason field | Required textarea, red border on empty submit |
| Confirm button | "Suspend Login" — red filled |

### On Confirm
```
user.status = 'suspended'
user.suspendReason = <entered reason>
Modal closes
Table + KPIs re-render
Toast: "{Name}'s login has been suspended." (error/red styling)
```

### On Reactivate
```
user.status = 'active'
delete user.suspendReason
Table + KPIs re-render
Toast: "{Name}'s login has been reactivated." (success)
```

---

## 9. Data Model

```js
{
  id: number,
  name: string,
  email: string,
  role: 'wh_manager' | 'wh_staff' | 'store_manager' | 'store_staff' | 'cashier' | 'customer',
  bizName: string,       // '—' for customers
  location: string,      // specific store/warehouse name, '—' for customers
  status: 'active' | 'suspended',
  joined: string,         // display date
  suspendReason?: string, // present only while status === 'suspended'
}
```

In the real system this table is a view/join across `users` (warehouse/store roles, scoped by `business_id` per `docs/01-data-architecture.md`) and `customers` (platform-wide, no `business_id`) — not a single physical table. The mock flattens both into one array for simplicity.

### 9a. Mock generation — `genPlatformUsers()`

Since this is an admin oversight page across **every** business, `PU_DATA` is generated from `BIZ_DATA` rather than hand-listed, so all 27 non-pending businesses are represented (not just a couple with detailed mock data):

- For each non-pending business, walk its `storeList` if one exists (Al Fatah, Metro Karachi, TrendMart have full rosters); otherwise synthesize store shells matching the business's real `stores` count, so every business is covered even without hand-authored detail.
- Each active store yields 3 users: a store manager (reuses the real `manager` name from `storeList` when available), one store staff, and one cashier.
- Inactive stores are skipped — no roster shown for a closed location.
- Any business with `stores > 0` also gets one warehouse manager + one warehouse staff at a `"{city} Central Warehouse"` location, since every operating business needs at least one place stock arrives before reaching stores.
- Pending businesses are skipped entirely — they have zero stores/staff until approved and set up (matches the All Businesses page's pending-state behavior).
- Customers remain a separate, fixed pool of 8 — platform-wide and never tied to a specific business, consistent with Section 1a.
- A deterministic `id % 17 === 0` rule sprinkles a handful of business-staff accounts into `suspended` status, so the Suspended KPI and filter have real data to demonstrate against.

This keeps the count realistic (hundreds of platform users spread across dozens of businesses) rather than the handful of hardcoded rows from the initial build.

---

## 10. Suggested API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `GET /api/admin/platform-users` | GET | List all platform users (joined across `users` + `customers`), with search/role/status filters and pagination |
| `GET /api/admin/platform-users/:id` | GET | Single user detail for the View modal |
| `POST /api/admin/platform-users/:id/suspend` | POST | Platform-level emergency suspend — separate flag from any business-owner-level deactivation, so the two don't overwrite each other |
| `POST /api/admin/platform-users/:id/reactivate` | POST | Clears the platform-level suspend flag |

---

## 11. Business Rules Summary

| Rule | Enforcement point |
|---|---|
| Admin never creates, edits roles, or reassigns locations for these users | No create/edit UI exists on this page by design — only View/Suspend/Reactivate |
| Suspend here is a platform-level override, distinct from business-owner-level user deactivation | Modal body copy explicitly states this; backend should use a separate `platform_suspended` flag rather than overloading the business owner's own `status` field, so the two authorities don't clobber each other |
| Customers are never scoped to a business | `bizName`/`location` render as `—` for `role === 'customer'`; backend join must treat customers as a platform-wide, business-agnostic entity per `docs/01-data-architecture.md` |
| Reactivating a business-staff user does not re-grant any role or location — only the login itself | Confirmed by scope: `puReactivate()` only touches `status`, nothing else on the record |

---

## 12. Known Limitation

This mock's `PU_DATA` is a static, flattened array covering both scoped staff and unscoped customers. A real implementation should keep these as genuinely separate backend queries (staff scoped per business, customers platform-wide) joined only at the API response layer for this page — never merge them into one physical table.
