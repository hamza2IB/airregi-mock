# User Stories — Warehouse Manager & Warehouse Staff

---

## Warehouse Manager

### Role Summary
The Warehouse Manager is responsible for a specific warehouse. They receive stock from suppliers, manage inventory within the warehouse, process stock transfer requests from stores, print barcodes, and track batch/expiry/serial-tracked items.

---

## Epic 1: Dashboard & Stats

### US-WM-001
**As a Warehouse Manager**, I want to see a dashboard with my warehouse's key stats so that I have a clear picture of its current state.

**Acceptance Criteria:**
- KPIs: total SKUs, total units in stock, incoming transfers pending, outgoing transfer requests pending, low-stock items, expiring-soon items (within 30 days)
- Recent activity feed: last 5 GRNs, last 5 stock transfers

---

## Epic 2: Inventory Management

### US-WM-010
**As a Warehouse Manager**, I want to view the complete inventory of my warehouse so that I know exactly what stock is available.

**Acceptance Criteria:**
- List: product name, variant, SKU, barcode, quantity on hand, reserved quantity, available quantity, reorder level, batch info (if applicable)
- Filters: category, brand, status, low stock, expiring soon, out of stock
- Search by product name, SKU, or barcode

### US-WM-011
**As a Warehouse Manager**, I want to receive incoming stock from a supplier (Goods Received Note) so that inventory is accurately updated.

**Acceptance Criteria:**
- GRN form: supplier, reference number, date, list of variants with quantity received
- For batch-tracked products: enter batch number, manufacturing date, expiry date, cost price per batch
- For serial-tracked products: scan or enter each serial/IMEI
- On save: inventory quantities updated, GRN record created
- Printable GRN document

### US-WM-012
**As a Warehouse Manager**, I want to do a stock adjustment so that inventory counts match physical reality after a count or discrepancy.

**Acceptance Criteria:**
- Select variant, enter adjusted quantity, select reason (damage, theft, count correction, expiry write-off, other)
- Adjustment logged with manager identity, timestamp, reason, before/after values
- Negative adjustments require confirmation

### US-WM-013
**As a Warehouse Manager**, I want to view batch-tracked inventory with expiry dates so that I can proactively manage near-expiry stock.

**Acceptance Criteria:**
- List: product, variant, batch number, expiry date, quantity, days remaining
- Color coding: green (> 30 days), yellow (7–30 days), red (< 7 days or expired)
- FIFO/FEFO picking guidance on transfers

---

## Epic 3: Stock Transfer to Stores

### US-WM-020
**As a Warehouse Manager**, I want to view all incoming stock transfer requests from stores so that I can process them.

**Acceptance Criteria:**
- List: store name, request date, items count, urgency, status (pending/approved/dispatched/received)
- Sortable by date, status, store

### US-WM-021
**As a Warehouse Manager**, I want to approve and dispatch a stock transfer request so that the store receives the correct items.

**Acceptance Criteria:**
- View request line items: requested product/variant, requested qty
- Per item: enter approved/dispatched qty (may differ from requested)
- If batch-tracked: select which batch(es) to dispatch
- If serial-tracked: scan or select serial numbers
- Generate dispatch note on approval
- Status changes to `dispatched`; store notified

### US-WM-022
**As a Warehouse Manager**, I want to reject a stock transfer request with a reason so that the store knows and can take alternative action.

**Acceptance Criteria:**
- Rejection reason required
- Store notified via in-portal notification
- Request status → `rejected`

### US-WM-023
**As a Warehouse Manager**, I want to initiate a stock transfer to a store proactively so that I can push stock without waiting for a request.

**Acceptance Criteria:**
- Same dispatch flow as approving a request, but initiated by the warehouse manager
- Destination store receives a notification

### US-WM-024
**As a Warehouse Manager**, I want to track the status of all transfers (in and out) so that I have full visibility of stock movement.

**Acceptance Criteria:**
- Transfer log: from, to, products, qty, date initiated, date dispatched, date received, status
- Filter by status, store, date range

---

## Epic 4: Barcode Management

### US-WM-030
**As a Warehouse Manager**, I want to generate and print barcodes for product variants so that physical products can be labeled for scanning.

**Acceptance Criteria:**
- Select product → select variant(s)
- Preview barcode (Code 128, Code 39, EAN-13, QR — configurable per business)
- Print options: quantity of labels, label size (e.g., 50mm × 25mm, 100mm × 50mm)
- Bulk print: select multiple variants, print all in one batch
- Barcode includes: barcode number, product name, variant info, price (optional)

### US-WM-031
**As a Warehouse Manager**, I want to assign a new barcode to a variant if it doesn't have one so that it can be tracked in the system.

**Acceptance Criteria:**
- Manual entry or system-generated barcode
- Barcode uniqueness validated
- Barcode type selectable: internal / packaging / etc.

---

## Epic 5: Reports

### US-WM-040
**As a Warehouse Manager**, I want to view inventory movement reports for my warehouse so that I can audit stock in and stock out.

**Acceptance Criteria:**
- Report: product, variant, opening stock, received, transferred out, adjustments, closing stock
- Date range filter
- Export to CSV/PDF

### US-WM-041
**As a Warehouse Manager**, I want to see low-stock and reorder alerts so that I can notify the business owner or supplier.

**Acceptance Criteria:**
- Items at or below reorder level listed
- Shows: product, variant, current stock, reorder level, last received date

---

---

## Warehouse Staff

### Role Summary
Warehouse Staff work under the Warehouse Manager. They can view inventory, assist with stock receiving, and process picking for dispatches, but they cannot approve transfers or make inventory adjustments independently.

---

## Epic 1: Inventory Visibility

### US-WS-001
**As a Warehouse Staff member**, I want to view the current inventory of my warehouse so that I can assist with locating and counting stock.

**Acceptance Criteria:**
- Read-only inventory view (same as manager view)
- Search by product name, SKU, barcode

### US-WS-002
**As a Warehouse Staff member**, I want to receive a picking list for approved transfer dispatches so that I can physically pick and pack the items.

**Acceptance Criteria:**
- Picking list shows: product name, variant, barcode, quantity to pick, bin/location (if configured)
- Mark items as picked
- Printable picking list

---

## Epic 2: Stock Receiving Assistance

### US-WS-010
**As a Warehouse Staff member**, I want to assist with GRN data entry so that large shipments can be processed quickly.

**Acceptance Criteria:**
- Can create a GRN draft (submitted to manager for final approval/posting)
- Cannot post (finalise) a GRN without manager confirmation

---

## Portal Pages Required (Warehouse)

| Page | Description |
|---|---|
| `/warehouse/dashboard` | Warehouse stats overview |
| `/warehouse/inventory` | Full inventory list |
| `/warehouse/grn` | GRN list |
| `/warehouse/grn/new` | Create new GRN |
| `/warehouse/grn/:id` | GRN detail |
| `/warehouse/adjustments` | Stock adjustment log + new adjustment |
| `/warehouse/transfers` | Transfer request list (inbound from stores) |
| `/warehouse/transfers/:id` | Transfer detail + approve/dispatch |
| `/warehouse/barcodes` | Barcode generation + printing |
| `/warehouse/batches` | Batch + expiry tracking view |
| `/warehouse/reports` | Inventory movement + low-stock report |
