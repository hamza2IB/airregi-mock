# Admin — Categories (Platform Industries) Page Specification
> **Section in file:** `demo/admin.html` → `#adm-categories`
> **Triggered by:** Sidebar → Platform → Categories
> **Status:** UI finalized, tested live via Playwright — ready for backend integration
> **Last updated:** Jul 14, 2026

---

## 1. Page Purpose

This page is **not** a product category tree. It manages the flat, platform-level list of **Industry** types that a business owner picks from during registration — e.g. "Grocery / Supermarket", "Fashion & Apparel", "Electronics". It's an organization-level classification used for reporting, filtering, and platform analytics (e.g. "how many businesses are in Restaurant / Food Service?").

### 1a. Explicit distinction from the Business Owner product category tree

RetailOS has two entirely separate "category" concepts, and this page is only responsible for the first:

| Concept | Scope | Structure | Owner | Where it lives |
|---|---|---|---|---|
| **Industry** (this page) | Platform-wide, org-level | Flat list, no hierarchy | Admin | `demo/admin.html` → `#adm-categories` |
| **Product Category** | Per-business, product catalog | Unlimited-depth hierarchical tree (e.g. Fashion → Men → Clothing → T-Shirts) | Business Owner | Business Owner portal (not built in this file) |

A business selects **one Industry** at registration (via admin's `IND_DATA` list). Once operating, that same business independently builds its **own** product category tree for organizing its catalog — completely separate data, completely separate UI, scoped only to that business. Admin has no visibility into or control over a business's internal product category tree.

This page was originally built (in error) as the hierarchical product-category tree. It was corrected to this flat Industry list per clarification: the hierarchical tree belongs to the Business Owner portal, not Admin.

---

## 2. Page Load Behaviour

- Page hidden on load; shown when `adminNav('categories')` is called
- `renderIndustryList()` pre-renders on script load so the page is ready instantly when the sidebar link is clicked
- Default filter on load: **All** (shows every industry regardless of status)
- KPI strip (`indKpis()`) recalculates on every render call

---

## 3. KPI Strip

Three cards at the top of the page:

| KPI | Source | Icon |
|---|---|---|
| Total Industries | `IND_DATA.length` | `briefcase-outline`, navy |
| Active | Count where `status === 'active'` | `checkmark-circle-outline`, green |
| Businesses Classified | Sum of `businessCount` across all industries | `business-outline`, blue |

All three update live after every add / edit / activate / deactivate / delete action.

---

## 4. Info Banner

Static explanatory text shown above the toolbar:

> *"This is the platform-level **Industry** list businesses choose from during registration (e.g. "Grocery / Supermarket", "Fashion & Apparel"). Product category trees are managed separately by each business inside their own portal."*

Exists specifically to prevent this page from being mistaken for a product catalog feature during future development or handoff.

---

## 5. Toolbar

| Element | Behaviour |
|---|---|
| Search input (`ind-search`) | Live filter on industry name, case-insensitive substring match |
| Status tabs (All / Active / Inactive) | `setIndFilter(status, btn)` — mutually exclusive, restyles active tab, re-renders list |
| Add Industry button | Opens the Create/Edit modal in create mode |

---

## 6. Table

Simple flat list, one row per industry, columns:

| Column | Content |
|---|---|
| Industry Name | Icon + name |
| Status | Green "Active" pill or gray "Inactive" pill |
| Businesses | Live count of businesses currently classified under this industry |
| Actions | Edit / Deactivate-Activate / Delete buttons |

Rows for inactive industries render at 70% opacity to visually recede without disappearing.

---

## 7. Actions

### 7a. Edit
Opens the Create/Edit modal pre-filled with the industry's current name and active state.

### 7b. Deactivate / Activate
Opens the **Toggle Confirmation Modal** (see Section 9). Button label and icon flip based on current status (`eye-off-outline` orange when active → offers Deactivate; `eye-outline` green when inactive → offers Activate).

### 7c. Delete
Always enabled, regardless of how many businesses are classified under the industry. Opens the **Delete Confirmation Modal** (see Section 10), which shows different copy depending on whether businesses are linked. This lets admin freely add and remove industries without ever getting blocked by existing data — see Section 10b for how linked businesses are handled.

---

## 8. Create / Edit Industry Modal

### 8a. Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| Industry Name | Text input | Yes | Red border shown on empty submit |
| Industry Active | Toggle switch | — | Defaults to checked (active) for new industries |

Deliberately minimal — an Industry is just a name and a visibility state. There's no icon, slug, parent, or description field, because none of that applies at this flat, org-level classification tier.

### 8b. On Save — Create Mode
```
New industry pushed to IND_DATA:
  - id: indNextId++ (mock unique id)
  - status: 'active' or 'inactive' per toggle
  - businessCount: 0
Modal closes
List re-renders
Toast: "{Name} industry added." (success)
```

### 8c. On Save — Edit Mode
```
Existing industry object updated in-place via Object.assign()
  (id and businessCount are preserved — not overwritten)
Modal closes
List re-renders
Toast: "{Name} industry updated." (success)
```

---

## 9. Deactivate / Activate Confirmation Modal

### 9a. Content — Deactivating

| Element | Value |
|---|---|
| Icon | `eye-off-outline`, orange |
| Title | "Deactivate Industry" |
| Subtitle | "This will hide it from registration." |
| Body | "**{Name}** will be hidden from the industry list during business registration. Businesses already classified under it are unaffected." |
| Conditional warning (shown only if `businessCount > 0`) | "**{N}** business(es) are currently classified under this industry. They will remain classified — this only hides the option for new registrations." |
| Info strip (always shown) | "Industries with businesses assigned are never deleted — only deactivated — to preserve classification history." |
| Confirm button | "Deactivate" — orange filled |

### 9b. Content — Activating

| Element | Value |
|---|---|
| Icon | `eye-outline`, green |
| Title | "Activate Industry" |
| Subtitle | "This will make it available again." |
| Body | "**{Name}** will become available again for businesses to select during registration." |
| Confirm button | "Activate" — green filled |

### 9c. Effect on Confirm
```
industry.status toggled ('active' ↔ 'inactive')
Modal closes
List + KPIs re-render
Toast: "{Name} industry activated." (success)  or
       "{Name} industry deactivated." (error/orange styling)
```

### 9d. Key Behaviour Rule

**Deactivating never touches `businessCount` or reassigns businesses.** It only removes the option from the registration picker for new signups going forward. This is the same non-destructive pattern used for Suspend on the All Businesses page and Disable on the Subscription Packages page — status changes are reversible and never silently mutate unrelated data.

---

## 10. Delete Confirmation Modal

Always reachable — Delete is never blocked by linked businesses.

### 10a. Body copy — no businesses linked

| Element | Value |
|---|---|
| Icon | `trash-outline`, red |
| Title | "Delete Industry" |
| Subtitle | "This cannot be undone." |
| Body | "Delete **{Name}**? No businesses are currently classified under it. This cannot be undone." |
| Confirm button | "Delete" — red filled |

### 10b. Body copy — N businesses linked

| Element | Value |
|---|---|
| Body | "Delete **{Name}**? **{N}** business(es) are currently classified under it — they will be unassigned (no industry) and can be reclassified anytime. This cannot be undone." |

### 10c. On Confirm
```
For every business in BIZ_DATA where business.industryId === deletedId:
    business.industryId = null   // unassigned, not deleted, not reassigned to another industry
Industry spliced out of IND_DATA entirely
Modal closes
List + KPIs re-render
Toast: "{Name} industry deleted." or
       "{Name} industry deleted. {N} business(es) unassigned." (success)
```

### 10d. Design rationale

Industries are admin-managed taxonomy, not a foreign-key constraint that should ever block an edit. Deleting an industry unassigns the businesses under it (`industryId → null`) rather than refusing the delete or cascading a business deletion. This means admin can freely restructure the industry list — add, rename, remove — without ever hitting a dead end. Unassigned businesses simply show no industry until an admin reclassifies them (via each business's Edit flow, not built in this mock yet).

---

## 11. Data Model

```js
// Industry
{
  id: number,
  name: string,
  status: 'active' | 'inactive',
}

// Business (relevant field only — full model lives in docs/14-admin-all-businesses-spec.md)
{
  id: number,
  industryId: number | null,   // FK to Industry.id; null = unclassified
  ...
}
```

`businessCount` is **not stored** on the industry record. It's computed live via `indBusinessCount(industryId)`, which counts `BIZ_DATA` entries where `industryId` matches. This guarantees the count can never drift from the actual linkage — see Section 15 (this replaces the static-counter limitation from the previous revision of this page).

---

## 12. Seed Data (current)

Trimmed to the 6 industries the platform actually targets for "Shop by Industry" on the customer-facing marketplace:

| Industry | Status | Businesses |
|---|---|---|
| Grocery & Food | Active | 22 |
| Fashion | Active | 9 |
| Electronics | Active | 6 |
| Beauty | Active | 4 |
| Home & Living | Active | 3 |
| Pharmacy | Active | 5 |

---

## 13. Suggested API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `GET /api/admin/industries` | GET | List all industries with live business counts |
| `POST /api/admin/industries` | POST | Create a new industry |
| `PUT /api/admin/industries/:id` | PUT | Update industry name / active state |
| `POST /api/admin/industries/:id/toggle` | POST | Activate/deactivate visibility on the public registration picker |
| `DELETE /api/admin/industries/:id` | DELETE | Permanently remove — must first unassign (`industry_id = NULL`) any linked businesses in the same transaction, never rejects due to linkage |

---

## 14. Business Rules Summary

| Rule | Enforcement point |
|---|---|
| This page never manages product categories, only org-level Industry classification | Info banner; distinction documented in Section 1a |
| Industries can always be added or deleted freely — never blocked by linked businesses | Delete button always enabled; deleting unassigns linked businesses (`industryId → null`) instead of refusing the action |
| Deactivating an industry does not affect businesses already classified under it | Toggle modal copy; backend must only filter `status = 'active'` on the public registration industry-picker endpoint |
| Business counts are always live, never stored | `indBusinessCount()` derives the count from `BIZ_DATA` on every render — see Section 11 |
| New industries start with zero businesses linked | No business record points to a brand-new `industryId` until one is explicitly assigned/reclassified |

---

## 15. Backend Integration Note

On the real backend, `DELETE /api/admin/industries/:id` should run in a transaction: bulk `UPDATE businesses SET industry_id = NULL WHERE industry_id = :id`, then delete the industry row. This mirrors the mock's `confirmIndDelete()` behavior exactly — unassign first, then remove the taxonomy entry — so no business record is ever left pointing at a deleted industry.
