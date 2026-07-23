# RetailOS — Role Permissions Matrix

## Legend
- ✅ Full access
- 👁 View only
- ❌ No access
- ⚙️ Scoped to own location (warehouse or store)

---

## Platform & Business Management

| Module | Admin | Biz Owner | WH Manager | WH Staff | Store Mgr | Store Staff | Cashier | Customer |
|---|---|---|---|---|---|---|---|---|
| Manage subscription packages | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve business registrations | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Verify payments | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage platform categories | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View all businesses | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit own business profile | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Submit renewal payment | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View own subscription | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Store & Warehouse Management

| Module | Admin | Biz Owner | WH Manager | WH Staff | Store Mgr | Store Staff | Cashier | Customer |
|---|---|---|---|---|---|---|---|---|
| Create stores | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit stores | ❌ | ✅ | ❌ | ❌ | ⚙️ hours only | ❌ | ❌ | ❌ |
| Deactivate stores | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create warehouses | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit warehouses | ❌ | ✅ | ⚙️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View own store stats | ❌ | ✅ | ❌ | ❌ | ✅ | 👁 | ❌ | ❌ |
| View own warehouse stats | ❌ | ✅ | ⚙️ | 👁 | ❌ | ❌ | ❌ | ❌ |

---

## User Management

| Module | Admin | Biz Owner | WH Manager | WH Staff | Store Mgr | Store Staff | Cashier | Customer |
|---|---|---|---|---|---|---|---|---|
| Invite business owner | ✅ (on approval) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Invite warehouse manager/staff | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Invite store manager/staff/cashier | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View all business users | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Deactivate users | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Product Management

| Module | Admin | Biz Owner | WH Manager | WH Staff | Store Mgr | Store Staff | Cashier | Customer |
|---|---|---|---|---|---|---|---|---|
| Create products | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit products | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage variants | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage attributes/attribute sets | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage units of measure | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage barcodes | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Print barcodes | ❌ | ✅ | ✅ | ⚙️ assist | ❌ | ❌ | ❌ | ❌ |
| Assign product to category | ❌ | ✅ | ✅ (owner-defined tree only) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage categories (business) | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage brands | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage attributes/sets | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View product catalog | ❌ | ✅ | ⚙️ | ⚙️ | ⚙️ | ⚙️ | 👁 | ❌ |

---

## Inventory Management

| Module | Admin | Biz Owner | WH Manager | WH Staff | Store Mgr | Store Staff | Cashier | Customer |
|---|---|---|---|---|---|---|---|---|
| View warehouse inventory | ❌ | ✅ | ⚙️ | ⚙️ | ❌ | ❌ | ❌ | ❌ |
| Create GRN (receive stock) | ❌ | ✅ | ⚙️ | ⚙️ draft | ❌ | ❌ | ❌ | ❌ |
| Post/finalise GRN | ❌ | ✅ | ⚙️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Warehouse stock adjustment | ❌ | ✅ | ⚙️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View store inventory | ❌ | ✅ | ❌ | ❌ | ⚙️ | ⚙️ | ❌ | ❌ |
| Store stock adjustment | ❌ | ✅ | ❌ | ❌ | ⚙️ | ❌ | ❌ | ❌ |
| Approve/dispatch transfer | ❌ | ✅ | ⚙️ | ❌ | ⚙️ inter-store | ❌ | ❌ | ❌ |
| Request stock from warehouse | ❌ | ✅ | ❌ | ❌ | ⚙️ | ❌ | ❌ | ❌ |
| Receive transfer at store | ❌ | ✅ | ❌ | ❌ | ⚙️ | ⚙️ assist | ❌ | ❌ |
| View batch/expiry tracking | ❌ | ✅ | ⚙️ | ⚙️ | ⚙️ | ❌ | ❌ | ❌ |

---

## POS & Cashier

| Module | Admin | Biz Owner | WH Manager | WH Staff | Store Mgr | Store Staff | Cashier | Customer |
|---|---|---|---|---|---|---|---|---|
| Start/close shift | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚙️ | ❌ |
| Process POS sale | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚙️ | ❌ |
| Apply discount at POS | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚙️ configurable | ❌ |
| Process return at POS | ❌ | ❌ | ❌ | ❌ | ⚙️ | ❌ | ⚙️ | ❌ |
| View cashier shifts | ❌ | ✅ | ❌ | ❌ | ⚙️ | ❌ | ⚙️ own | ❌ |
| Force-close shift | ❌ | ✅ | ❌ | ❌ | ⚙️ | ❌ | ❌ | ❌ |
| Redeem loyalty at POS | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚙️ | ❌ |

---

## Ecommerce Order Fulfilment

| Module | Admin | Biz Owner | WH Manager | WH Staff | Store Mgr | Store Staff | Cashier | Customer |
|---|---|---|---|---|---|---|---|---|
| Accept/reject ecom order | ❌ | ✅ | ❌ | ❌ | ⚙️ | ❌ | ❌ | ❌ |
| Update order status | ❌ | ✅ | ❌ | ❌ | ⚙️ | ⚙️ assigned | ❌ | ❌ |
| Assign order to staff | ❌ | ❌ | ❌ | ❌ | ⚙️ | ❌ | ❌ | ❌ |
| View orders for their store | ❌ | ✅ all | ❌ | ❌ | ⚙️ | ⚙️ | ❌ | ❌ |
| Place order | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Track own orders | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Reports

| Report | Admin | Biz Owner | WH Manager | WH Staff | Store Mgr | Store Staff | Cashier | Customer |
|---|---|---|---|---|---|---|---|---|
| Platform revenue | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Platform usage analytics | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Business-wide sales | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Warehouse inventory movement | ❌ | ✅ | ⚙️ | 👁 | ❌ | ❌ | ❌ | ❌ |
| Store sales | ❌ | ✅ | ❌ | ❌ | ⚙️ | ❌ | ❌ | ❌ |
| Cashier performance | ❌ | ✅ | ❌ | ❌ | ⚙️ | ❌ | ⚙️ own | ❌ |
| Shift summary | ❌ | ✅ | ❌ | ❌ | ⚙️ | ❌ | ⚙️ own | ❌ |
