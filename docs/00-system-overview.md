# RetailOS — System Overview

## What is RetailOS?

RetailOS is a **multi-tenant retail management + ecommerce ecosystem** designed for large brands, malls, and marts (e.g., Al Fatah, Jalal Sons, Metro). Every business that onboards onto RetailOS is automatically exposed on the shared ecommerce marketplace, giving customers one place to discover and purchase from all brands.

---

## Core Pillars

| Pillar | Description |
|---|---|
| **SaaS Platform** | Subscription-based, multi-tenant, admin-controlled |
| **Multi-Business Marketplace** | All approved businesses visible on the customer app |
| **Multi-Location Management** | Each business can have multiple warehouses and stores/branches |
| **Flexible Product Architecture** | One universal product model covering clothing, grocery, electronics, cosmetics, pharmacy, etc. |
| **POS System** | Cashier-operated, shift-based, barcode-driven |
| **Loyalty Program** | 1 coin per PKR 100 spent; 1 coin = PKR 1 |
| **Inventory Intelligence** | Warehouse → Store stock transfers, batch/serial/expiry tracking |

---

## Platform Roles

| # | Role | Scope |
|---|---|---|
| 1 | **Admin** | Platform-wide (RetailOS operator) |
| 2 | **Business Owner** | Their own business (all stores + warehouses) |
| 3 | **Warehouse Manager** | Assigned warehouse(s) |
| 4 | **Warehouse Staff** | Assigned warehouse(s) |
| 5 | **Store Manager** | Assigned store/branch |
| 6 | **Store Staff** | Assigned store/branch |
| 7 | **Cashier** | Assigned store/branch POS |
| 8 | **Customer** | Ecommerce app |

---

## High-Level Module Map

```
RetailOS
├── Public Landing Page (marketing + pricing)
├── Admin Portal
│   ├── Business Onboarding & Approval
│   ├── Platform Category Management
│   ├── Subscription Package Management
│   ├── Payment Verification
│   └── Platform Analytics
├── Business Owner Portal
│   ├── Business Setup & Profile
│   ├── Store Management
│   ├── Warehouse Management
│   ├── User Management
│   ├── Product & Catalog Management
│   ├── Inventory Overview
│   ├── Category & Brand Management
│   ├── Subscription & Billing
│   └── Reports
├── Warehouse Portal (Manager + Staff)
│   ├── Inventory Management
│   ├── Stock Receiving (GRN)
│   ├── Stock Transfer to Stores
│   ├── Barcode Printing
│   ├── Batch / Expiry / Serial Tracking
│   └── Reports
├── Store Portal (Manager + Staff + Cashier)
│   ├── Store Inventory
│   ├── Stock Request from Warehouse
│   ├── POS (Cashier)
│   ├── Shift Management
│   ├── Order Fulfillment (Ecommerce)
│   ├── Customer Lookup
│   └── Reports
└── Customer App (Ecommerce)
    ├── Marketplace (all businesses)
    ├── Product Discovery
    ├── Cart & Checkout
    ├── Order Tracking
    └── Loyalty Points
```

---

## Onboarding Flow (Business)

```
1. Visit Landing Page
2. Select Subscription Package
3. Create Owner Account
4. Enter Business Information
5. Submit Manual Payment Reference
6. Wait for Admin Verification
7. Admin Verifies Bank Payment
8. Admin Approves Business
9. System Creates: Business Record + Owner User
10. System Sends Activation Email (Portal Link + Credentials)
11. Owner Sets Password via Secure Invitation Link
12. Owner Completes Setup Checklist
    ├── Complete Business Profile
    ├── Add Warehouses
    ├── Add Stores/Branches
    ├── Invite Staff
    ├── Add Products & Inventory
    └── Configure Ecommerce Visibility
```

---

## Subscription & Billing Rules

- Packages defined by Admin (limits: stores, warehouses, users, products, etc.)
- Payment is manual (no gateway in v1; gateway in future)
- Business submits payment reference → Admin verifies → Approves
- **7 days before expiry**: email alert + in-portal popup banner
- **On expiry**: business status → `banned`; all portals inaccessible
- Reactivation: owner submits new payment → Admin approves → Status restored

---

## Loyalty Program Rules

- **Earn**: PKR 100 spent = 1 coin (online + POS)
- **Redeem**: 1 coin = PKR 1 discount
- Coins tracked per customer account
- Redeemable at POS (cashier) and ecommerce checkout

---

## Stock Flow

```
Supplier → Warehouse (GRN) → Store (Transfer Request) → POS Sale / Ecommerce Fulfillment
```

- Store Manager requests stock from Warehouse or another Store
- Warehouse Manager approves and dispatches
- Both parties can track transfer status
- Every movement is logged

---

## Ecommerce Order Flow

```
Customer Places Order
        ↓
System Assigns to Closest Store
        ↓
Store Manager / Staff Accepts Order
        ↓
Packs & Ships
        ↓
Status Updates (trackable by Customer + Store)
        ↓
Delivered → Loyalty Coins Awarded
```
