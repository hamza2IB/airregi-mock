# User Stories — Store Manager & Store Staff

---

## Store Manager

### Role Summary
The Store Manager oversees a single store/branch. They manage the store's inventory, handle stock requests to the warehouse, manage staff and cashier shifts, fulfil ecommerce orders, and monitor daily sales.

---

## Epic 1: Dashboard

### US-SM-001
**As a Store Manager**, I want to see my store's dashboard so that I have a real-time overview of today's performance.

**Acceptance Criteria:**
- KPIs: today's sales (POS + online), open orders (ecommerce), pending stock requests, active cashier shift, low-stock alerts count
- Recent activity: last 5 POS transactions, last 5 online orders

---

## Epic 2: Store Inventory Management

### US-SM-010
**As a Store Manager**, I want to view current inventory in my store so that I know what's in stock.

**Acceptance Criteria:**
- List: product name, variant, SKU, barcode, quantity on hand, reserved (pending orders), available, reorder level
- Filters: category, brand, low stock, out of stock, expiring soon
- Search by name, SKU, barcode

### US-SM-011
**As a Store Manager**, I want to manually adjust store inventory (add or subtract) so that the system reflects the real stock count.

**Acceptance Criteria:**
- Select variant, enter adjustment quantity (positive = add, negative = subtract)
- Reason required: damaged, theft, count correction, returned from customer, etc.
- Adjustment logged with store manager identity, timestamp, before/after values
- Large negative adjustments require second confirmation

### US-SM-012
**As a Store Manager**, I want to receive transferred stock from the warehouse so that inventory is updated when physical stock arrives.

**Acceptance Criteria:**
- View dispatched transfers assigned to my store
- "Mark as Received" action: confirm received quantities per item
- Partial receipts supported (received qty may be less than dispatched)
- On receipt: store inventory updated

---

## Epic 3: Stock Request from Warehouse

### US-SM-020
**As a Store Manager**, I want to request stock from a warehouse so that I can replenish items running low in my store.

**Acceptance Criteria:**
- Form: select warehouse (same business), add items (product/variant + qty requested), optional urgency level, notes
- Request submitted with status `pending`
- Warehouse manager notified

### US-SM-021
**As a Store Manager**, I want to request stock from another store/branch so that I can handle urgent needs when the warehouse is low.

**Acceptance Criteria:**
- Select source store, add items, optional note
- Source store manager notified of inter-store transfer request
- Same approval and dispatch flow as warehouse → store

### US-SM-022
**As a Store Manager**, I want to track the status of all my stock requests so that I know when stock will arrive.

**Acceptance Criteria:**
- Request list: date, source (warehouse/store), items summary, status (pending/approved/dispatched/received/rejected), expected arrival
- Click to view full request detail and line-item status
- In-portal notification when status changes

---

## Epic 4: Cashier & Shift Management

### US-SM-030
**As a Store Manager**, I want to view all cashier shifts for my store so that I can monitor and audit daily POS activity.

**Acceptance Criteria:**
- List: cashier name, shift open time, close time, opening cash, closing cash, expected cash, difference, status
- Date range filter

### US-SM-031
**As a Store Manager**, I want to review a cashier's day-end closing summary so that I can verify their cash and sales figures.

**Acceptance Criteria:**
- Shift summary: total transactions, total cash sales, total card sales, total discounts, opening cash, closing cash declared, system-expected cash, variance
- Line-by-line transaction list for the shift
- Accept or flag discrepancy

### US-SM-032
**As a Store Manager**, I want to force-close a cashier shift if the cashier has left without closing so that the day-end reconciliation can proceed.

**Acceptance Criteria:**
- Force close requires reason
- Logged as "force closed by manager"
- Closing cash defaults to last known amount

---

## Epic 5: Ecommerce Order Fulfilment

### US-SM-040
**As a Store Manager**, I want to view all incoming ecommerce orders assigned to my store so that I can process them promptly.

**Acceptance Criteria:**
- List: order number, customer name, items count, total value, order date, status
- Status filter: pending, confirmed, packing, shipped, delivered, cancelled
- New order notification (in-portal + optional sound alert)

### US-SM-041
**As a Store Manager**, I want to accept or reject an incoming ecommerce order so that the customer is informed of fulfilment availability.

**Acceptance Criteria:**
- Accept: status → `confirmed`; customer notified
- Reject: reason required; customer notified; order cancelled
- Acceptance should check that all items are in stock

### US-SM-042
**As a Store Manager**, I want to update the order status as it progresses so that the customer can track their order in real time.

**Acceptance Criteria:**
- Status progression: confirmed → packing → shipped → delivered
- Each status change timestamped
- Optional note per status change
- Customer notified on each status change (push/SMS/email based on configuration)

### US-SM-043
**As a Store Manager**, I want to assign a staff member to handle an order so that packing and dispatch is clearly owned.

**Acceptance Criteria:**
- Assign order to a store staff member
- Assigned staff sees order in their queue

---

## Epic 6: Opening & Closing Hours Management

### US-SM-050
**As a Store Manager**, I want to update my store's opening and closing hours so that the ecommerce app shows accurate availability.

**Acceptance Criteria:**
- Per day of week: open time, close time, closed toggle
- Special dates: mark a specific date as closed (holiday, etc.)
- Changes reflect on ecommerce listing within minutes

---

## Epic 7: Reports

### US-SM-060
**As a Store Manager**, I want to view daily, weekly, and monthly sales reports for my store so that I can understand performance.

**Acceptance Criteria:**
- Total sales, transactions, average basket size, top-selling products, returns value
- Date range selector
- Channel split: POS vs online
- Exportable

### US-SM-061
**As a Store Manager**, I want to view cashier performance reports so that I know each cashier's contribution.

**Acceptance Criteria:**
- Per cashier: total sales, transactions, discounts given, refunds processed
- Date range filter

---

---

## Store Staff

### Role Summary
Store Staff work under the Store Manager. They can view inventory, help with order packing, update order statuses, and assist with stock receiving. They cannot adjust inventory independently or access financial reports.

---

## Epic 1: Inventory Visibility

### US-SS-001
**As a Store Staff member**, I want to view the store's current inventory so that I can assist customers and handle orders.

**Acceptance Criteria:**
- Read-only inventory view
- Search by product name, SKU, barcode

---

## Epic 2: Order Handling

### US-SS-010
**As a Store Staff member**, I want to view and manage orders assigned to me so that I can pick, pack, and dispatch them.

**Acceptance Criteria:**
- My queue shows: order number, customer, items, due time, status
- Can update status: confirmed → packing → packed
- Cannot accept or reject orders (manager only)

### US-SS-011
**As a Store Staff member**, I want to mark an order as packed so that the manager can arrange dispatch.

**Acceptance Criteria:**
- "Mark as Packed" button on order detail
- Manager notified

---

## Epic 3: Stock Receiving

### US-SS-020
**As a Store Staff member**, I want to assist with confirming received stock transfers so that inventory is updated when stock arrives.

**Acceptance Criteria:**
- View dispatched transfers
- Scan barcodes to confirm received items
- Confirmation submitted to manager for final posting

---

## Portal Pages Required (Store)

| Page | Description |
|---|---|
| `/store/dashboard` | Store overview KPIs |
| `/store/inventory` | Store inventory list |
| `/store/inventory/adjust` | Stock adjustment form |
| `/store/transfers` | Inbound transfer list |
| `/store/transfers/:id` | Transfer detail + receive |
| `/store/stock-requests` | Stock request list |
| `/store/stock-requests/new` | Create stock request |
| `/store/stock-requests/:id` | Request detail + status tracking |
| `/store/orders` | Ecommerce orders list |
| `/store/orders/:id` | Order detail + status management |
| `/store/shifts` | Cashier shift list |
| `/store/shifts/:id` | Shift detail + closing review |
| `/store/hours` | Opening/closing hours management |
| `/store/reports/sales` | Sales reports |
| `/store/reports/cashiers` | Cashier performance reports |
