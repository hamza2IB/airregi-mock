# Admin — Subscription Packages Page Specification
> **Section in file:** `demo/admin.html` → `#adm-packages`  
> **Triggered by:** Sidebar → Platform → Packages  
> **Status:** UI finalized — ready for backend integration  
> **Last updated:** Jul 13, 2026

---

## 1. Page Purpose

Where admin defines and manages the SaaS pricing tiers that businesses choose from during registration. Controls pricing, platform usage limits, and which platform features a tier unlocks. This is the single source of truth for what a business "buys" when subscribing to RetailOS.

---

## 2. Page Load Behaviour

- Page hidden on load; shown when `adminNav('packages')` is called
- `renderPkgCards()` renders all packages from `PKG_DATA` into the grid
- Header summary text computed live: total active subscriptions (sum of `activeSubs` across all packages) and total package count

---

## 3. Header Row

| Element | Detail |
|---|---|
| Summary text | "**N** active subscriptions across **M** packages" — both numbers computed live from `PKG_DATA` |
| Create Package button | Navy filled button, opens the form modal in create mode |

---

## 4. Info Banner

Static warning shown above the grid:

> *"Editing a package's price or limits only affects **new subscribers**. Businesses already subscribed keep their existing terms until they renew."*

This reflects the actual system rule (US-ADM-020 in `docs/02-user-stories-admin.md`): package edits are not retroactive.

---

## 5. Package Card Anatomy

Cards render in a 3-column grid, one per package in `PKG_DATA`. Each card is a vertical stack of 6 sections:

### 5a. Header
- Package name pill (colour-coded per package — see Section 9)
- Enabled/Disabled status pill (green "Enabled" or gray "Disabled")
- One-line description
- Background: subtle gradient tint using the package's accent colour

### 5b. Pricing
- Monthly price, large bold: `Rs.XXX,XXX/mo`
- Yearly price below in gray: `Rs.X,XXX,XXX/year`
- Savings badge: `(save N%)` — computed live as `1 - (yearly / (monthly × 12))`

### 5c. Platform Limits
Four rows, each with an icon, label, and value:

| Limit | Icon |
|---|---|
| Max Stores | `storefront-outline` |
| Max Warehouses | `business-outline` |
| Max Users | `people-outline` |
| Max Products | `cube-outline` |

Any limit set to `null` displays as **"Unlimited"**. Otherwise shows the formatted number (e.g. `10`, `5,000`).

### 5d. Features
Checklist of included feature flags only — features **not** included in the package simply don't appear in the list (no "greyed out" state). Each shown feature has a green checkmark icon.

### 5e. Active Subscribers
Footer strip showing the live count of businesses currently on this package (`activeSubs`).

### 5f. Actions
Two buttons:
- **Edit** — navy outline button, opens form modal pre-filled with this package's data
- **Disable** / **Enable** — orange (if currently enabled) or green (if currently disabled) outline button, opens the toggle confirmation modal

Disabled packages render the entire card at 70% opacity with a lighter border to visually distinguish them from active offerings.

---

## 6. Feature Flags

### 6a. Current Flag List (finalized)

| Key | Label | What it gates |
|---|---|---|
| `ecommerce` | Ecommerce Storefront | Whether the business appears on the customer marketplace app with a public storefront (products, cart, checkout). Off = POS/warehouse only, invisible to online customers. |
| `pos` | POS / Cashier Module | Whether cashiers can log into the POS terminal and process in-person sales. |
| `loyalty` | Loyalty Program | Whether the business can enable the coin-earning/redemption system for their customers. |

### 6b. Flags Removed and Why

Four flags were removed from the original 7-flag list because they were not cleanly enforceable as independent runtime checks:

| Removed flag | Reason for removal |
|---|---|
| **Multi-Store Management** | Redundant with the `maxStores` limit. If `maxStores > 1`, multi-store capability is already implied — having a separate boolean flag created a contradiction risk (flag says no, limit says yes). Store count limits alone fully express this capability. |
| **Advanced Reports & Analytics** | Never had a concrete definition of *which* report pages it would gate. No code path checked this flag — it was a marketing bullet point, not an enforced permission. |
| **API Access** | No API key issuance system exists yet to gate. Would need to be reintroduced once actual API infrastructure is built, with a real `fn(businessId) → boolean` check tied to key generation. |
| **Priority Support** | Not something the application can check at all — it's a support team SLA commitment (faster response time), not a software feature. Belongs in the package description text or an internal support routing system, not the feature flags list. |

**Principle applied:** every flag on this list must map to an actual `if (business.features.includes(key))` check somewhere in the product. If a flag doesn't gate real behaviour, it doesn't belong here — it becomes a false promise on the pricing page.

### 6c. Current Feature Matrix

| Feature | Enterprise | Pro | Starter |
|---|---|---|---|
| Ecommerce Storefront | ✅ | ✅ | ✅ |
| POS / Cashier Module | ✅ | ✅ | ✅ |
| Loyalty Program | ✅ | ✅ | ❌ |

---

## 7. Current Packages (seed data)

| Package | Monthly | Yearly | Savings | Max Stores | Max Warehouses | Max Users | Max Products | Active Subs |
|---|---|---|---|---|---|---|---|---|
| **Enterprise** | Rs.120,000 | Rs.1,296,000 | 10% | Unlimited | Unlimited | Unlimited | Unlimited | 8 |
| **Pro** | Rs.60,000 | Rs.648,000 | 10% | 10 | 3 | 50 | 5,000 | 18 |
| **Starter** | Rs.16,900 | Rs.182,400 | 10% | 1 | 1 | 10 | 500 | 22 |

---

## 8. Create / Edit Package Modal

Opened via header "Create Package" button (create mode) or a card's "Edit" button (edit mode, pre-filled).

### 8a. Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| Package Name | Text input | Yes | Red border on empty submit |
| Description | Textarea (2 rows) | No | Shown on public registration page |
| Monthly Price (Rs.) | Number input | Yes | Red border on empty/invalid submit |
| Yearly Price (Rs.) | Number input | No | If blank, auto-computed as `monthly × 12` on save |
| Max Stores | Number input | No | Blank = unlimited |
| Max Warehouses | Number input | No | Blank = unlimited |
| Max Users | Number input | No | Blank = unlimited |
| Max Products | Number input | No | Blank = unlimited |
| Feature Flags | Checkboxes (3) | No | Rendered dynamically from `PKG_FEATURE_LIST` |
| Package Enabled | Toggle switch | — | Defaults to `true` (checked) for new packages |

### 8b. Validation
- Name: required, red border shown if empty on save attempt
- Monthly Price: required and must be numeric, red border shown if empty or NaN

### 8c. On Save — Create Mode
```
New package pushed to PKG_DATA:
  - id: Date.now() (mock unique id)
  - activeSubs: 0
  - colorClass + accent: auto-assigned from a rotating 4-colour palette
    based on current package count
Modal closes
Grid re-renders
Toast: "{Name} package created." (success)
```

### 8d. On Save — Edit Mode
```
Existing package object updated in-place via Object.assign()
  (id, activeSubs, colorClass, accent are preserved — not overwritten)
Modal closes
Grid re-renders
Toast: "{Name} package updated. Existing subscribers are unaffected." (success)
```

This toast message deliberately reinforces the info banner rule — edits are forward-only.

---

## 9. Package Colour Assignment

| Package | Badge style | Accent hex |
|---|---|---|
| Enterprise | `bg-navy text-white` | `#1a2d6b` |
| Pro | `bg-brand-blue text-white` | `#3366cc` |
| Starter | `bg-gray-200 text-gray-600` | `#94a3b8` |

New packages created via the form rotate through a 4-colour palette (navy, blue, purple, green) based on `PKG_DATA.length % 4` at creation time — this is a mock convenience; production should let admin pick or auto-assign more deliberately.

---

## 10. Enable / Disable Flow

### 10a. Trigger
Card's "Disable" (if enabled) or "Enable" (if disabled) button → opens **Package Toggle Confirmation Modal**.

### 10b. Modal Content — Disabling

| Element | Value |
|---|---|
| Icon | `eye-off-outline`, orange |
| Title | "Disable Package" |
| Body | "**{Name}** will be hidden from the business registration page. No new businesses will be able to select it." |
| Confirm button | "Disable Package" — orange filled |

### 10c. Modal Content — Enabling

| Element | Value |
|---|---|
| Icon | `eye-outline`, green |
| Title | "Enable Package" |
| Body | "**{Name}** will become visible again on the business registration page for new signups." |
| Confirm button | "Enable Package" — green filled |

### 10d. Effect on Confirm
```
package.enabled toggled (true ↔ false)
Modal closes
Grid re-renders (card opacity changes to reflect new state)
Toast: "{Name} package enabled." (success)  or
       "{Name} package disabled." (error/orange styling)
```

### 10e. Key Behaviour Rule

**Disabling a package never affects existing subscribers.** It only removes the package as an option on the public registration page for *new* businesses. Any business already on that package keeps their subscription, pricing, and limits exactly as-is until they choose to change plans or their subscription lapses.

---

## 11. Data Model

```js
{
  id: number,
  name: string,
  description: string,
  monthly: number,              // price in PKR
  yearly: number,                // price in PKR
  enabled: boolean,
  maxStores: number | null,      // null = unlimited
  maxWarehouses: number | null,
  maxUsers: number | null,
  maxProducts: number | null,
  features: string[],            // subset of ['ecommerce', 'pos', 'loyalty']
  activeSubs: number,             // count of businesses currently subscribed
  colorClass: string,             // Tailwind classes for the name badge
  accent: string,                 // hex colour for card header gradient
}
```

---

## 12. Suggested API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `GET /api/admin/packages` | GET | List all packages with active subscriber counts |
| `POST /api/admin/packages` | POST | Create a new package |
| `PUT /api/admin/packages/:id` | PUT | Update package (name, price, limits, features) — does not affect existing subscriptions |
| `POST /api/admin/packages/:id/toggle` | POST | Enable/disable visibility on public registration page |

---

## 13. Business Rules Summary

| Rule | Enforcement point |
|---|---|
| Editing price/limits does not affect existing subscribers | Info banner + success toast copy; backend must snapshot terms at subscription time, not reference live package object |
| Disabling a package hides it from registration only | Toggle modal copy; backend must filter `enabled = true` on the public registration package list endpoint, while still honoring existing subscriptions on disabled packages |
| Every feature flag must map to a real enforced behaviour | Design principle — see Section 6b for rationale on removed flags |
| Blank limit fields mean unlimited, not zero | `pkgFmtLimit()` renders `null`/`undefined`/`''` as "Unlimited"; form stores blank inputs as `null` via `toNum()` helper |
