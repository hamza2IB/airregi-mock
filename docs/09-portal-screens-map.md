# RetailOS — Complete Portal & Screen Map

This document lists every HTML mock file that needs to be created, organised by portal.

---

## 1. Public Landing Page

| File | Screen | Key Elements |
|---|---|---|
| `landing-page.html` | Marketing homepage | Hero, features, pricing, how it works, industries |
| `register.html` | Business registration wizard | 4-step: package → account → business info → payment |
| `register-success.html` | Registration submitted | Confirmation + next steps |

---

## 2. Admin Portal

| File | Screen | Key Elements |
|---|---|---|
| `admin/login.html` | Admin login | Email + password form |
| `admin/dashboard.html` | Platform overview | KPI cards, pending approvals counter, charts |
| `admin/businesses.html` | All businesses list | Table with filters, status badges |
| `admin/businesses-pending.html` | Pending approvals queue | Approval/reject actions |
| `admin/business-detail.html` | Business detail + actions | Info panel, payment info, approve/reject buttons |
| `admin/payments.html` | Payment verification queue | Pending payments list, verify/reject |
| `admin/packages.html` | Subscription packages | Package cards, create/edit/disable |
| `admin/package-form.html` | Create/edit package | All package fields |
| `admin/categories.html` | Platform category tree | Hierarchical tree, drag-drop reorder |
| `admin/reports-revenue.html` | Revenue report | MRR chart, payment history table |
| `admin/reports-platform.html` | Platform analytics | Business metrics, usage stats |
| `admin/users.html` | Admin team management | Admin users list, invite admin |

---

## 3. Business Owner Portal

| File | Screen | Key Elements |
|---|---|---|
| `owner/login.html` | Owner login | Email + password |
| `owner/setup-checklist.html` | First-login setup wizard | Checklist with progress bar |
| `owner/dashboard.html` | Business overview | KPIs, sales chart, top stores, channel split |
| `owner/profile.html` | Business profile + ecommerce settings | Logo, banner, description, social links |
| `owner/subscription.html` | Plan + usage + renewal | Usage bars, days remaining, renew form |
| `owner/stores.html` | Store list | Cards/table with stats, map view |
| `owner/store-form.html` | Create/edit store | All store fields + hours |
| `owner/store-detail.html` | Store overview | Info, staff, inventory snapshot |
| `owner/warehouses.html` | Warehouse list | Cards/table with stats |
| `owner/warehouse-form.html` | Create/edit warehouse | All warehouse fields |
| `owner/users.html` | All users list | Filterable by role/location/status |
| `owner/user-invite.html` | Invite user | Role, location assignment, email |
| `owner/categories.html` | Business categories + mapping | Tree + platform category mapping |
| `owner/brands.html` | Brand management | List + create/edit |
| `owner/attributes.html` | Attributes + attribute sets | Attribute list, set builder |
| `owner/products.html` | Product catalog list | Table with filters, bulk actions |
| `owner/product-new.html` | Create product wizard | 15-step product creation flow |
| `owner/product-detail.html` | Edit product | All product fields + variants |
| `owner/product-variants.html` | Variant management | Variant matrix, SKU/barcode/price per variant |
| `owner/inventory.html` | Inventory overview | All locations summary, low-stock alerts |
| `owner/reports-sales.html` | Sales reports | Per-store comparison charts |
| `owner/reports-inventory.html` | Inventory movement | Transfer + GRN history |

---

## 4. Warehouse Portal

| File | Screen | Key Elements |
|---|---|---|
| `warehouse/login.html` | Warehouse login | Email + password |
| `warehouse/dashboard.html` | Warehouse stats | KPI cards, activity feed |
| `warehouse/inventory.html` | Inventory list | Full stock list, search, filters |
| `warehouse/grn-list.html` | GRN history | List of received stock entries |
| `warehouse/grn-new.html` | New GRN form | Supplier, items, batch/serial input |
| `warehouse/grn-detail.html` | GRN detail | View posted GRN |
| `warehouse/adjustments.html` | Stock adjustments | Adjustment log + new adjustment form |
| `warehouse/transfers.html` | Transfer requests (inbound) | Requests from stores, status |
| `warehouse/transfer-detail.html` | Transfer detail + dispatch | Item approval, batch/serial selection |
| `warehouse/barcodes.html` | Barcode print | Variant selector, label preview, print |
| `warehouse/batches.html` | Batch + expiry view | Colour-coded expiry tracking table |
| `warehouse/reports.html` | Movement + low-stock report | Date filter, export |

---

## 5. Store Portal (Manager + Staff)

| File | Screen | Key Elements |
|---|---|---|
| `store/login.html` | Store login | Email + password |
| `store/dashboard.html` | Store overview | KPIs, open orders, alerts |
| `store/inventory.html` | Store inventory | Stock list, search, filters |
| `store/inventory-adjust.html` | Stock adjustment | Form + reason |
| `store/transfers-in.html` | Inbound transfers | Dispatched from warehouse, receive flow |
| `store/transfer-receive.html` | Receive transfer | Confirm quantities, scan |
| `store/stock-requests.html` | Stock request list | Status tracker |
| `store/stock-request-new.html` | New stock request | Warehouse/store selection, items |
| `store/stock-request-detail.html` | Request detail | Status timeline |
| `store/orders.html` | Ecommerce orders | List with status filters |
| `store/order-detail.html` | Order detail | Customer info, items, status actions |
| `store/shifts.html` | Cashier shift list | Shift history |
| `store/shift-detail.html` | Shift detail + review | Cash reconciliation, transaction list |
| `store/hours.html` | Operating hours | Per-day schedule |
| `store/reports-sales.html` | Sales reports | Daily/weekly/monthly |
| `store/reports-cashiers.html` | Cashier performance | Per-cashier metrics |

---

## 6. POS Terminal (Cashier)

| File | Screen | Key Elements |
|---|---|---|
| `pos/login.html` | Cashier login | Email + password |
| `pos/shift-start.html` | Start shift | Opening cash entry |
| `pos/register.html` | Main POS screen | Cart, search, customer, payment |
| `pos/payment.html` | Payment screen | Cash/card, change calculator |
| `pos/receipt.html` | Receipt preview | Printable receipt |
| `pos/shift-close.html` | Close shift | Cash count, variance, summary |
| `pos/transactions.html` | Current shift transactions | List of today's sales |
| `pos/holds.html` | Held transactions | Resume or discard |
| `pos/returns.html` | Returns / refunds | Transaction lookup, item selection |
| `pos/customer-lookup.html` | Customer search + register | Search by phone, quick register |

---

## 7. Customer Ecommerce App

| File | Screen | Key Elements |
|---|---|---|
| `ecom/index.html` | Marketplace home | Business cards, featured, search |
| `ecom/register.html` | Customer registration | Name, email, phone, password |
| `ecom/login.html` | Customer login | Email/phone + password |
| `ecom/search.html` | Search results | Product grid, filters, sort |
| `ecom/categories.html` | Category browser | Platform category tree |
| `ecom/businesses.html` | All businesses | Grid with filters |
| `ecom/business.html` | Business storefront | Profile, product grid |
| `ecom/product.html` | Product detail | Images, variants, description, add to cart |
| `ecom/cart.html` | Shopping cart | Items, qty, totals, checkout CTA |
| `ecom/checkout.html` | Checkout | Address, payment, loyalty, order summary |
| `ecom/order-success.html` | Order placed confirmation | Order number, next steps |
| `ecom/orders.html` | Order history | List of all orders |
| `ecom/order-detail.html` | Order detail + tracking | Status timeline, items |
| `ecom/profile.html` | Customer profile | Edit info, addresses |
| `ecom/loyalty.html` | Loyalty coins | Balance, transaction history |

---

## Design Consistency Rules for All Mocks

### Layout
- Sidebar navigation for all portals (admin, owner, warehouse, store, POS)
- Top navbar: logo, role indicator, notifications bell, user avatar + logout
- Breadcrumb navigation on detail pages
- Consistent card component for KPIs

### Color System
- Primary: `#1A56DB` (RetailOS brand blue)
- Success: `#0E9F6E`
- Warning: `#E3A008`
- Danger: `#E02424`
- Neutral: `#6B7280`
- Background: `#F9FAFB`
- Surface: `#FFFFFF`

### Typography
- Font: Inter or system-ui
- Page title: 24px bold
- Section heading: 18px semibold
- Body: 14px regular
- Labels: 12px medium

### Status Badges
- Active / Approved: green pill
- Pending: yellow pill
- Rejected / Suspended: red pill
- Invited: blue pill
- Inactive / Draft: gray pill

### Table Standards
- Striped rows
- Sticky header on scroll
- Pagination: 10/25/50 per page
- Column sorting indicators
- Bulk select checkbox column

### Form Standards
- Inline validation
- Required field asterisk (*)
- Helper text below fields
- Character count for text areas
- Multi-step wizards: progress bar + step indicator

### Notification Patterns
- Toast for quick confirmations (top-right, auto-dismiss 4s)
- Modal for destructive actions (delete, deactivate, reject)
- Inline alert for page-level warnings (subscription expiry, low stock)
- Badge on nav icon for pending counts
