# RetailOS — Documentation Index

## What is RetailOS?
Multi-tenant retail management + ecommerce ecosystem for large brands, malls, and marts.
All businesses onboarded onto RetailOS are automatically exposed on a shared ecommerce marketplace.

---

## Documents

| # | File | Description |
|---|---|---|
| 00 | [System Overview](./00-system-overview.md) | Platform purpose, roles, module map, core flows |
| 01 | [Data Architecture](./01-data-architecture.md) | Full entity model, table schemas, relationships |
| 02 | [Admin User Stories](./02-user-stories-admin.md) | All admin flows + portal pages |
| 03 | [Business Owner User Stories](./03-user-stories-business-owner.md) | Owner setup, stores, warehouses, products, reports |
| 04 | [Warehouse User Stories](./04-user-stories-warehouse.md) | Warehouse manager + staff flows |
| 05 | [Store User Stories](./05-user-stories-store.md) | Store manager + staff flows |
| 06 | [Cashier User Stories](./06-user-stories-cashier.md) | POS, shifts, loyalty, returns |
| 07 | [Customer User Stories](./07-user-stories-customer.md) | Ecommerce app, orders, loyalty |
| 08 | [Landing Page User Stories](./08-user-stories-landing-page.md) | Marketing page + registration flow |
| 09 | [Portal & Screens Map](./09-portal-screens-map.md) | Every HTML mock file needed + design system |
| 10 | [Product Module Spec](./10-product-module-spec.md) | Full product creation wizard, all industry types |
| 11 | [Notifications & Alerts](./11-notifications-and-alerts.md) | All notification events by role + UI patterns |
| 12 | [Permissions Matrix](./12-permissions-matrix.md) | What each role can and cannot do |
| 13 | [Admin Dashboard Spec](./13-admin-dashboard-spec.md) | `demo/admin.html` dashboard screen specification |
| 14 | [Admin All Businesses Spec](./14-admin-all-businesses-spec.md) | All Businesses screen specification |
| 15 | [Admin Payment Verification Spec](./15-admin-payment-verification-spec.md) | Payment Verification screen specification |
| 16 | [Admin Subscription Packages Spec](./16-admin-subscription-packages-spec.md) | Packages screen specification |
| 17 | [Admin Categories/Industries Spec](./17-admin-categories-industries-spec.md) | Industries screen specification |
| 18 | [Admin Platform Users Spec](./18-admin-platform-users-spec.md) | Platform Users screen specification |
| 19 | [Admin Revenue Spec](./19-admin-revenue-spec.md) | Revenue report screen specification |
| 20 | [Admin Platform Settings Spec](./20-admin-platform-settings-spec.md) | Platform Settings screen specification |
| 21 | [Owner Portal Spec](./21-owner-portal-spec.md) | Full specification of `demo/owner.html` — all pages, panels, flows, data models, business rules |

---

## Quick Reference: Portals to Build

| Portal | Primary Users | Mock Files Count |
|---|---|---|
| Landing Page | Public / Business Registrants | 3 |
| Admin Portal | Platform Admin | 12 |
| Business Owner Portal | Business Owner | 21 |
| Warehouse Portal | WH Manager + Staff | 12 |
| Store Portal | Store Manager + Staff | 15 |
| POS Terminal | Cashier | 9 |
| Ecommerce App | Customers | 15 |
| **Total** | | **87 screens** |

---

## User Story Count by Role

| Role | Epics | User Stories |
|---|---|---|
| Admin | 6 | 17 |
| Business Owner | 10 | 31 |
| Warehouse Manager | 5 | 12 |
| Warehouse Staff | 2 | 3 |
| Store Manager | 7 | 16 |
| Store Staff | 3 | 4 |
| Cashier | 4 | 13 |
| Customer | 6 | 17 |
| Landing Page | 3 | 8 |
| **Total** | **46** | **121** |
