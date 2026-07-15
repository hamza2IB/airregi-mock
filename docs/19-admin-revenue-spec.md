# Admin — Revenue Page Specification
> **Section in file:** `demo/admin.html` → `#adm-revenue`
> **Triggered by:** Sidebar → Reports → Revenue
> **Status:** UI finalized, tested live via Playwright — ready for backend integration
> **Last updated:** Jul 14, 2026

---

## 1. Page Purpose

Dedicated payment history reporting for admin. Covers the **"Payment history with status"** and **"Exportable to CSV"** parts of **US-ADM-041** (`docs/02-user-stories-admin.md`).

MRR, revenue-by-package-tier, and the MRR trend chart — also part of US-ADM-041 — are **not duplicated here**. They already live on the **Dashboard** page (`#adm-dashboard`), which is the single source of truth for those metrics. This page focuses exclusively on the payment ledger, to avoid showing the same numbers twice in two different places.

This is distinct from the **Payment Verification** page (`#adm-payments`), which only ever shows the live, unverified/pending queue. Once a payment is verified or rejected there, it's removed from that queue and recorded permanently here as a payment history entry — this page is the ledger, Payment Verification is the inbox.

---

## 2. Page Load Behaviour

- Page hidden on load; shown when `adminNav('revenue')` is called
- Pre-rendered on script load (`renderPaymentHistory()`) so it's ready instantly on first visit
- Default payment history filter: **All**

---

## 3. Payment History

The permanent, append-only ledger of every subscription payment that has been **verified or rejected** by admin (as opposed to Payment Verification's live pending-only queue).

### 3a. KPI Strip

| KPI | Source |
|---|---|
| Total Collected | Sum of `amount` across all `status: 'verified'` records |
| Total Transactions | `PH_DATA.length` |
| Verified | Count where `status === 'verified'` |
| Rejected | Count where `status === 'rejected'` |

### 3b. Quick Range Chips

A row of pill buttons above the toolbar for the fast path to "recent activity," the most common thing admin actually wants to check, without touching Year/Month at all:

| Chip | Range |
|---|---|
| All Time | No date restriction (default) |
| Last 30 Days | Today minus 30 days → today |
| This Month | 1st of current month → today |
| Last Month | 1st → last day of the previous calendar month |
| This Quarter | 1st day of the current quarter → today |

Quick range and the Year/Month selects are mutually exclusive — picking a quick range resets Year/Month back to "All," and picking a Year or Month resets the quick range chip back to "All Time." Combining both would be ambiguous (e.g. "Last 30 Days" + "March 2025").

### 3c. Toolbar

| Element | Behaviour |
|---|---|
| Search | Live filter across business name, reference number, bank |
| Status tabs (All / Verified / Rejected) | Mutually exclusive |
| Business filter | Populated dynamically from the distinct businesses present in `PH_DATA`, alphabetical |
| Package filter | Enterprise / Pro / Starter |
| Year filter | Populated from the distinct years present in `PH_DATA`, newest first |
| Month filter | Cascading off Year — disabled until a year is picked, then scoped to just that year's months (max 12 options, ever). Selecting "All Years" resets and disables it |
| Export CSV | Downloads the **currently filtered view**, not the full dataset — see Section 4 |

Year + Month are deliberately split into two cascading selects rather than one flat "All Months" list. A single list mixing month and year (e.g. "July 2026", "June 2026", "May 2025"...) would grow unbounded as more years of payment history accumulate, becoming unusable after a couple of years of data. Splitting them keeps each dropdown short regardless of how much history exists — the year list grows by one entry per year, and the month list never exceeds 12 entries.

### 3d. Active Filter Chips

A summary row appears directly below the toolbar whenever at least one filter beyond the defaults is applied (search text, a non-"All" status, business, package, year/month, or a quick range). Each active filter renders as a removable chip (e.g. "Business: Metro Karachi ✕", "Last 30 Days ✕"), plus a "Clear all" link that resets every filter back to its default in one click. The row disappears entirely when no filters are active, keeping the default view uncluttered.

This solves the discoverability problem of having 6 different filter controls (search, status, business, package, year, month) plus 5 quick-range chips — it's not always obvious at a glance which ones are currently narrowing the results, especially after navigating away and back. The chip row makes every active constraint visible and individually reversible without hunting for which specific dropdown to reset.

Records are always shown newest-first; there is no separate sort control.

### 3e. Table Columns

Business, Package (colored pill), Type (Renewal/New Reg pill), Amount, Bank/Ref (stacked), Date, Status (Verified/Rejected pill).

Paginated at 10/page using the same windowed pill pagination pattern as Platform Users (`pillWindow()`).

---

## 4. CSV Export

Per US-ADM-041's "Exportable to CSV" requirement, the Export CSV button generates a real downloadable file client-side:

```
Columns: Business, Package, Type, Amount (PKR), Bank, Reference, Date, Status
```

Key behavior: it exports whatever is currently visible under the active search/status/business/package/year/month/quick-range filters — not the entire `PH_DATA` array. This lets admin narrow to e.g. "Al Fatah Mall's rejected payments in June 2026" or "Rejected payments in the last 30 days" and export just that slice. Values are CSV-escaped (quoted, internal quotes doubled) to handle any commas or quotes safely. The filename includes the current date: `payment-history-YYYY-MM-DD.csv`.

Tested live: exporting all 20 records produces a valid CSV readable by any spreadsheet tool, with correct headers and per-row data matching the on-screen table exactly.

---

## 5. Data Model

```js
// Payment History record
{
  id: number,
  bizName: string,
  pkg: 'Enterprise' | 'Pro' | 'Starter',
  type: 'renewal' | 'new-reg',
  amount: number,          // PKR
  bank: string,
  ref: string,              // transaction reference
  date: string,             // display date
  dateSort: string,         // ISO date for sorting
  status: 'verified' | 'rejected',
}
```

MRR / revenue-by-package / MRR trend use the separate `revData` structure, which is documented in `docs/13-admin-dashboard-spec.md` since that's the page that owns and renders it.

---

## 6. Suggested API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `GET /api/admin/payments/history` | GET | Full payment history ledger with search/status/package filters and pagination |
| `GET /api/admin/payments/history/export?...` | GET | Server-side CSV generation honoring the same filter params as the list endpoint (mirrors the client-side "export current view" behavior) |

---

## 7. Business Rules Summary

| Rule | Enforcement point |
|---|---|
| Payment history is permanent and append-only — records are never edited or deleted once verified/rejected | No edit/delete UI exists for `PH_DATA` rows by design |
| MRR / revenue-by-package / MRR trend are not duplicated on this page | Dashboard (`#adm-dashboard`) is the single source of truth for those metrics; this page only covers the payment ledger + CSV export |
| CSV export respects active filters, not just the full dataset | `exportPaymentHistoryCSV()` reads from `phFiltered`, not `PH_DATA` |
| Payment Verification (live queue) and Payment History (ledger) are separate concerns | Distinct datasets (`PV_DATA` vs `PH_DATA`); moving from one to the other is a backend responsibility once verify/reject actions are wired to real persistence — the mock keeps them as separate static arrays since there's no live hookup between them yet (see Section 8) |

---

## 8. Known Limitation

In this mock, verifying or rejecting a payment on the Payment Verification page removes it from `PV_DATA` but does **not** append a corresponding record to `PH_DATA` on this page — the two datasets are seeded independently. Backend integration must wire the verify/reject action to insert a permanent `payment_history` row (with the final `verified`/`rejected` status) as part of the same transaction that clears the item from the pending queue, so the ledger stays complete and accurate.
