# Admin — Platform Settings Page Specification
> **Section in file:** `demo/admin.html` → `#adm-settings`
> **Triggered by:** Sidebar → Admin → Platform Settings
> **Status:** UI finalized, tested live via Playwright — ready for backend integration
> **Last updated:** Jul 14, 2026

---

## 1. Page Purpose

Global, platform-wide configuration that applies to **every** business on RetailOS — not a per-business setting. Covers the loyalty program rate, subscription/billing rules referenced in `docs/00-system-overview.md` and `docs/11-notifications-and-alerts.md`, platform-wide security policy, and the support contact info shown to business owners on suspension/help screens.

### 1a. Distinct from per-business settings

Each Business Owner has their own settings inside their own portal (business profile, ecommerce visibility, store hours, etc.) — those are scoped to `business_id` and are not managed here. This page only holds settings with no `business_id`, i.e. rules that apply identically across the whole platform.

---

## 2. Page Load Behaviour

- Page hidden on load; shown when `adminNav('settings')` is called
- No async data fetch required in the mock — all fields are pre-filled with sensible current values (see Section 3 for defaults)
- Each of the four cards saves independently; there's no single page-wide "Save" button

---

## 3. Sections

### 3a. Loyalty Program

Platform-wide coin earn/redeem rates, per `docs/00-system-overview.md`'s stated rule (100 PKR spent = 1 coin, 1 coin = 1 PKR redeemed).

| Field | Type | Default |
|---|---|---|
| Loyalty Program Enabled | Toggle | On |
| Earn Rate | Number (Rs. X spent = 1 coin) | 100 |
| Redeem Rate | Number (1 coin = Rs. X) | 1 |

Info note clarifies: rate changes apply platform-wide immediately and are not retroactive — existing customer coin balances are never recalculated when the rate changes.

**Validation:** both rate fields must be positive numbers.

### 3b. Subscription & Billing

| Field | Type | Default |
|---|---|---|
| Renewal Reminder Schedule | 3 number inputs (days before expiry) | 7 / 3 / 1 |
| Bank Name | Text | Habib Bank Limited (HBL) |
| Account Title | Text | RetailOS Technologies Pvt. Ltd. |
| Account Number | Text (monospace) | 0123-4567890-001 |
| IBAN | Text (monospace) | PK36HABB0000123456789001 |

The reminder schedule directly maps to the alert flow documented in `docs/11-notifications-and-alerts.md` (Day -7 / Day -3 / Day -1 emails + banners before auto-ban on Day 0). The bank details are what's shown to a business owner on the "Submit Payment" screen when registering or renewing — this is the single source of truth for the manual payment instructions displayed platform-wide, since RetailOS v1 has no payment gateway integration.

**Validation:** bank name and account number are required.

### 3c. Security Policy

Applies to every login across the platform, per **US-ADM-001**'s acceptance criteria (`docs/02-user-stories-admin.md`).

| Field | Type | Default |
|---|---|---|
| Session Timeout | Number (minutes) | 30 |
| Failed Login Lockout | Number (attempts) | 5 |

**Validation:** session timeout ≥ 5 minutes, lockout threshold ≥ 3 attempts.

### 3d. Support Contact

Shown to business owners on the subscription-expired suspension screen and general help/contact touchpoints.

| Field | Type | Default |
|---|---|---|
| Support Email | Email | support@retailos.io |
| Support Phone | Text | +92-42-111-000-111 |
| Help Center URL | Text | https://help.retailos.io |

**Validation:** support email must contain `@`.

---

## 4. Save Behavior

Each card has its own "Save {Section} Settings" button. On click:
- Validates that card's fields only (not the whole page)
- On failure: red error toast, field values are untouched (no partial-save)
- On success: green success toast, mock state accepted (no backend persistence in this build)

There is no "unsaved changes" warning or dirty-state tracking in this mock — each card is independently and immediately saveable.

---

## 5. Data Model

```js
{
  loyalty: {
    enabled: boolean,
    earnAmount: number,     // PKR spent per 1 coin
    redeemAmount: number,   // PKR value per 1 coin redeemed
  },
  billing: {
    reminderDays: [number, number, number], // e.g. [7, 3, 1]
    bank: {
      name: string,
      accountTitle: string,
      accountNumber: string,
      iban: string,
    },
  },
  security: {
    sessionTimeoutMinutes: number,
    failedLoginLockoutAttempts: number,
  },
  support: {
    email: string,
    phone: string,
    helpCenterUrl: string,
  },
}
```

In a real backend this would live in a single `platform_settings` table/document (likely a singleton row, since there's exactly one platform), not per-business.

---

## 6. Suggested API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `GET /api/admin/settings` | GET | Fetch all platform settings on page load |
| `PUT /api/admin/settings/loyalty` | PUT | Update loyalty program rates |
| `PUT /api/admin/settings/billing` | PUT | Update renewal reminder schedule + bank details |
| `PUT /api/admin/settings/security` | PUT | Update session timeout + lockout policy |
| `PUT /api/admin/settings/support` | PUT | Update support contact info |

Each section is a separate `PUT` endpoint mirroring the independent save-per-card UI, rather than one large settings blob endpoint.

---

## 7. Business Rules Summary

| Rule | Enforcement point |
|---|---|
| Loyalty rate changes are not retroactive | Info note in the Loyalty card; backend must apply new rates only to future earn/redeem transactions, never recalculate existing balances |
| Settings here are platform-wide, never per-business | No `business_id` scoping anywhere on this page; contrasts with Business Owner portal settings |
| Renewal reminder days configured here drive the actual notification schedule | Must stay in sync with the cron/scheduled job described in `docs/11-notifications-and-alerts.md` — changing the numbers here should change when those jobs fire |
| Bank details shown here are the only payment instructions given to business owners (no gateway in v1) | Must be kept accurate; a wrong account number here means owners send money to the wrong place |

---

## 8. Known Limitation

This is a UI-only mock — there's no backend to persist against, so "Save" only validates and shows a toast; refreshing the page resets all fields to their hardcoded defaults. Real implementation needs the `GET`/`PUT` endpoints in Section 6 wired to a singleton settings record.
