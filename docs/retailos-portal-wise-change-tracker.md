# RetailOS Portal-wise Required Change Tracker

Priority legend:
- P0 — blocks backend/database implementation or causes financial/stock risk
- P1 — required for first production release
- P2 — useful after core release
- DECISION — business permission or policy must be confirmed

## Shared changes across all portals

### P0 — Shared domain and security
- Use one multi-tenant backend. Every business-owned record must include `businessId`.
- Use shared `Location` records with types such as STORE, WAREHOUSE, DARK_STORE and FULFILLMENT_CENTER.
- Use Cognito for identity, `BusinessMembership` for business roles, and `LocationAssignment` for store/warehouse scope.
- All write actions must be checked server-side; hiding a button in the portal is not authorization.
- Add `createdBy`, `updatedBy`, timestamps and an immutable `AuditEvent` for sensitive actions.
- Add idempotency keys to POS sale, payment, refund, stock receipt, stock adjustment, transfer dispatch and loyalty mutations.

### P0 — Shared status rules
- Replace generic `pending`, `active`, `processed` labels with controlled status enums.
- Keep order, payment, fulfillment, return, refund and inventory movement statuses separate.
- Every status transition must record who changed it, when, reason and previous/new status.
- Prevent invalid transitions on the backend.

### P0 — Shared product and inventory model
- Separate Product, ProductVariant, LocationListing, PriceBookItem and InventoryBalance.
- Never store one global stock number on Product.
- Use an immutable InventoryLedger for RECEIVE, SALE, RETURN_IN, TRANSFER_OUT, TRANSFER_IN, DAMAGE, ADJUSTMENT and RESERVATION events.
- Keep `onHand`, `reserved`, `available` and optional `inTransit` separately.

---

# 1. SaaS Admin Portal

## Current modules
Dashboard, All Businesses, Payment Verification, Platform Users, Packages, Industries, Revenue and Platform Settings.

## P0 — Required changes

### Business lifecycle
- Define business statuses: DRAFT, ONBOARDING, PAYMENT_REVIEW, ACTIVE, GRACE_PERIOD, SUSPENDED, REJECTED and CLOSED.
- Add explicit actions: approve, reject, request more information, suspend, reactivate and close.
- Every destructive or restrictive action requires confirmation, reason and audit log.
- Suspending a business must block operational mutations but preserve read-only access according to policy.

### Subscription/payment verification
- Separate subscription status from payment-proof status.
- Payment proof statuses: SUBMITTED, UNDER_REVIEW, VERIFIED, REJECTED and EXPIRED.
- Subscription statuses: TRIAL, ACTIVE, PAST_DUE, GRACE_PERIOD, SUSPENDED, CANCELLED and EXPIRED.
- Add duplicate-reference detection and proof attachment viewing through private S3 URLs.
- Verification must create a subscription-payment transaction, not only change a UI badge.

### Platform users
- Separate platform administrators from tenant users.
- Admin must not directly edit business operational data without a support impersonation/audit policy.
- Add invite, disable, reset MFA and revoke sessions actions.

### Packages and features
- Store plan features as structured entitlements, not descriptive text only.
- Enforce limits for stores, warehouses, registers, staff, products, marketplace, reports and storage.
- Plan changes need effective date, proration policy and history.

### Industries
- Clarify whether Industries are only onboarding classification or control templates/categories.
- Prevent deletion when used; support deactivate/archive instead.

## P1 — UI and flow fixes
- Dashboard should show businesses needing action, payment proofs awaiting review, expiring subscriptions and platform incidents.
- Business details drawer should include company, owner, subscription, locations, staff count, usage and audit history.
- Add search/filter/export for businesses and payments.
- Add empty, loading, error and retry states to every page.

## DECISION
- Can SaaS Admin edit a tenant’s products/orders, or only view them under audited support access?
- Does rejection permanently close onboarding, or allow resubmission?

---

# 2. Business Owner Portal

## Current modules
Dashboard, Company Profile, Stores, Products, Categories, Users & Staff, Subscription, Revenue Report and Settings.

## P0 — Required changes

### Company and locations
- Company profile must own legal name, trade name, tax details, contacts, branding and marketplace settings.
- Stores must be backed by Location records.
- Add location statuses: DRAFT, ACTIVE, TEMPORARILY_CLOSED, INACTIVE and ARCHIVED.
- Do not hard-delete locations with orders, shifts or inventory history.

### Products
- Owner is the primary master-data authority.
- Product create/edit flow must create Product plus one or more ProductVariants.
- SKU and barcode must be unique within the business.
- Product status and marketplace publication status must be separate.
- Add validation for variant combinations, bundle components, tax, unit of measure, cost and price.
- Initial stock entered in product creation must call an opening-balance inventory mutation, not write stock into product.

### Categories
- Add cycle prevention for parent categories.
- Slug uniqueness should be scoped to business.
- Prevent deletion when products use the category; archive/deactivate instead.
- Category marketplace visibility should not automatically disable POS products unless explicitly configured.

### Staff and permissions
- Replace one role dropdown with role + granular permissions + location assignments.
- Invitation statuses: INVITED, ACTIVE, SUSPENDED, EXPIRED and REVOKED.
- Add resend invite, revoke invite, deactivate account and remove location access.
- Owner cannot remove the final active owner without transferring ownership.

### Subscription
- Make portal read-only or feature-limited according to grace/suspension policy.
- Show usage against plan limits.
- Payment upload should create a verification request and S3 proof record.

### Revenue reports
- Use aggregated daily metrics rather than scanning all orders.
- Distinguish gross sales, discounts, refunds, tax, delivery fees and net sales.
- Separate POS and marketplace channels.

## P1 — UI and flow fixes
- Owner dashboard should focus on business-wide exceptions: stores offline, pending transfers, low stock, unfulfilled online orders, refund exposure and subscription risk.
- Add store comparison and date/location filters.
- Product detail should show variants, listings, prices and stock by location—not one stock value.
- Add confirmation and impact summary before deactivating products, categories, staff or locations.

## DECISION
- Can warehouse managers create/edit products, or only request new product setup?
- Can store managers override local selling prices?
- Can the owner initiate stock transfers directly?

---

# 3. Warehouse Manager Portal

## Current modules
Dashboard, Product Master, Stock Levels, Stock Transfers, Barcodes, Online Orders and Refunds.

## P0 — Required changes

### Product Master
- This overlaps with Owner Portal and requires a permission decision.
- Default recommendation: warehouse manager can view products, print labels and maintain warehouse-specific logistical data.
- Product name, category, tax, global price and marketplace publication should remain owner-controlled unless explicit permission is granted.
- Do not edit stock from the product form.

### Stock levels
- Display on-hand, reserved, available, in-transit and reorder level.
- Every adjustment requires reason, optional note, actor and audit record.
- High-value or large adjustments should require owner approval based on configurable threshold.
- Support lot/batch, expiry and serial number only for applicable product types.

### Stock requests and transfers
- Separate StockRequest from StockShipment and ShipmentReceipt.
- Correct request flow: DRAFT → SUBMITTED → APPROVED/REJECTED → PREPARING → DISPATCHED → PARTIALLY_RECEIVED/RECEIVED → COMPLETED.
- Requested, approved, dispatched and received quantities must be stored separately.
- Dispatch must reduce source available stock and create in-transit stock atomically.
- Receipt must increase destination stock and resolve shortages/damage separately.
- Prevent a manager from approving their own request if segregation of duties is required.

### Online orders
- Only show orders whose `fulfillmentLocationId` is this warehouse.
- Keep order, payment and fulfillment statuses separate.
- Accepting an order must reserve inventory.
- Rejection/cancellation must release reservation.
- Partial acceptance must create unavailable lines and refund requirements; do not directly mark a refund as complete.
- Shipment needs courier, tracking number, packed-by, dispatched-by and timestamp.

### Refunds
- Replace `pending/processed` with PENDING, PROCESSING, SUCCEEDED and FAILED.
- Refund must reference PaymentTransaction and ReturnRequest when applicable.
- Warehouse manager should not manually type “processed” without payment-provider confirmation or authorized cash handling.

### Barcodes
- Barcode generation must map to ProductVariant.
- Prevent generating a second conflicting barcode.
- Bulk-print jobs should record template, quantity and actor.

## P1 — UI and flow fixes
- Dashboard should show transfer requests awaiting action, shipments to dispatch, receipts with discrepancies, low stock and fulfillment SLA breaches.
- Add transfer detail timeline and discrepancy resolution drawer.
- Add confirmation screens showing stock impact before dispatch/adjustment.
- Add clear source/destination labels; avoid ambiguous inbound/outbound wording.

## DECISION
- Is the warehouse a marketplace fulfillment location?
- Can warehouse staff approve requests, or only prepare approved shipments?
- Who authorizes inventory adjustments above threshold?

---

# 4. Store Manager Portal

## Current modules
Dashboard, Stock Levels, Stock Transfers, Online Orders, Refunds, Cashier Shifts and Store Sales.

## P0 — Required changes

### Complete placeholder sections
- Some navigation sections use a temporary “Coming soon” renderer. Every production navigation item must have a real loading, empty and operational state.
- Remove placeholder navigation until its backend flow is implemented, or mark it disabled with an explanation.

### Store scope
- All queries and mutations must be restricted to the manager’s assigned location.
- Store manager must not access another store by changing an ID in the request.

### Stock levels and adjustments
- Show on-hand, reserved, available and incoming quantities.
- Adjustment needs reason, counted quantity, calculated delta and optional evidence.
- Large adjustments require approval.
- Directly assigning `onHand` in UI logic must be replaced by a backend adjustment command and ledger event.

### Stock requests
- Store manager creates StockRequest; warehouse/source later creates StockShipment.
- Add request statuses and approved/dispatched/received quantities.
- Store manager must explicitly receive shipment and record damaged/missing quantity.
- Request cancellation should only be possible before preparation/dispatch unless source approves.

### Online orders
- Only show store-allocated orders.
- Accept must reserve stock.
- Add separate pickup and delivery fulfillment flows.
- Required states include ALLOCATED, ACCEPTED, PACKING, READY_FOR_PICKUP or READY_FOR_DISPATCH, SHIPPED/PICKED_UP, DELIVERED and COMPLETED.
- Reject and partial-accept actions require reason and stock release.

### Refunds
- Store Manager should handle store-fulfilled returns/refunds only.
- Return inspection and inventory disposition must be captured: RESTOCK, DAMAGED, QUARANTINE or DISCARD.
- Payment refund status must be provider-driven.

### Cashier shifts
- Shift states: OPENING_REQUIRED, OPEN, CLOSING, CLOSED and DISPUTED.
- Store manager can review opening float, expected cash, counted cash, variance and cashier note.
- Add approve variance/escalate dispute flow; do not silently close large differences.

### Store sales
- Separate POS sales, marketplace pickup, marketplace delivery, returns, discounts, tax and net sales.
- Store sales page should use aggregates and offer drill-down to immutable orders.

## P1 — Dashboard changes
Keep only actionable store data:
- Today’s net sales
- Orders requiring action
- Low/out-of-stock items
- Incoming stock awaiting receipt
- Pending returns/refunds
- Open/disputed shifts

Remove company-wide or non-actionable totals from the Store Manager dashboard.

## DECISION
- Can Store Manager change local prices or only request changes?
- Can Store Manager process cash refunds directly?
- Can Store Manager approve cashier shift variances?

---

# 5. Cashier POS Portal

## Current scope
Cashier login, register/cart, customer lookup, coupons, loyalty redemption, payment, receipt, sales history, returns/refunds, held orders and shift closing.

## P0 — Required changes

### Authentication and register assignment
- Use Cognito authentication plus a server-validated active staff membership.
- Require an assigned active register and location.
- Add secure register-device pairing; do not trust a locally selected terminal.
- Prevent login when business/location/register is suspended or no shift can be opened.

### Shift opening/closing
- Cashier must open a shift with opening float before sales.
- Only one active shift per register unless explicitly supported.
- Cash movement events: OPENING_FLOAT, CASH_SALE, CASH_REFUND, PAY_IN, PAY_OUT and CLOSING_COUNT.
- Close shift must be a server transaction and must not be editable afterward; corrections use an audited manager action.

### Cart and sale
- Recalculate price, tax, coupon, loyalty and stock on server before payment.
- Reserve/decrement stock atomically when sale completes.
- Add idempotency key to prevent duplicate sale on retries.
- Held carts must have owner cashier, register, expiry and restoration rules.
- Product lookup must return only active, locally listed and sellable variants.

### Payments
- Create Payment and PaymentTransaction records per attempt.
- Support split payment only if designed end-to-end; otherwise remove any implied UI.
- Card/QR success must be confirmed by provider callback/status, not cashier button only.
- Cash payment must record tendered amount and change.

### Coupons and loyalty
- Validate customer, eligibility, date, usage limit and stacking server-side.
- Loyalty redemption and earning must use an immutable LoyaltyLedger.
- Do not deduct points until sale succeeds.
- Reversal/refund must reverse earned/redeemed points proportionally.

### Returns/refunds/exchanges
- Cashier refund authority needs configurable limits and manager approval above limit.
- Return quantity cannot exceed unreturned sold quantity.
- Refund should use exact original line allocation, tax and discounts—not only proportional approximation.
- Exchange should create linked return and new sale/order records.
- Digital refunds go to original payment method; cash refund becomes a cash movement.

### Receipts
- Receipt number must be server-generated and unique per business/register policy.
- Persist immutable receipt snapshot including tax/FBR data used at sale time.
- Reprint should not regenerate using current product/store settings.

## P1 — UI and operational fixes
- Add offline/network status with clear policy; do not claim “Cloud Synced” unless synchronization is real.
- Disable payment button during submission and show retry-safe failure state.
- Add scanner error, duplicate barcode and age/restricted-item flow if applicable.
- Align visual design and status terminology with the updated management portals.

## DECISION
- Is offline selling required in v1?
- Are exchanges supported at launch?
- What refund amount needs manager PIN/approval?

---

# 6. POS Customer Display Portal

## Current scope
Idle promotions, live cart display and payment/success states.

## P0 — Required changes
- Treat display as read-only; it must never change cart or payment records.
- Pair display with a RegisterDevice using a short-lived code/token.
- Use session events: SESSION_STARTED, CART_UPDATED, CUSTOMER_LINKED, PAYMENT_STARTED, PAYMENT_SUCCEEDED, PAYMENT_FAILED and SESSION_RESET.
- Do not expose customer phone, full loyalty details or private identifiers.
- Reset display after timeout, shift close or register disconnect.
- Ensure stale events from a previous sale cannot appear in the next session.

## P1 — UI fixes
- Follow the same RetailOS branding/design standard as updated portals.
- Replace fixed 1024 assumptions with supported display breakpoints.
- Add disconnected/register unavailable state.
- Promotions should be business/location-configured and served from S3/CloudFront.
- Add accessible totals and payment-state messaging.

## DECISION
- Will POS and display run in the same browser/device or separate devices?
- Will QR payment be displayed here, and which provider owns the QR lifecycle?

---

# 7. Customer Marketplace Portal

## Current scope
Home/discovery, search, categories, stores, product detail, cart, checkout/payment, order history/detail, loyalty, saved items, notifications, addresses, payment cards and support tickets.

## P0 — Required changes

### Marketplace catalog
- Show only active businesses, active marketplace locations and published LocationListings.
- Product pricing/availability must be location-aware.
- Do not expose exact raw stock unless business policy allows; return IN_STOCK, LOW_STOCK or OUT_OF_STOCK and purchasable quantity.
- Store follows, wishlist and recently viewed must be persisted per customer rather than demo/local storage.

### Cart
- Decide whether one cart may contain multiple businesses.
- Recommended v1: one business/fulfillment group per order, with cart split before checkout.
- Cart line must reference variant and selected fulfillment location, not only product name.
- Revalidate price, stock, coupon, tax and delivery at checkout.

### Checkout and orders
- Store customer address snapshots on the order.
- Add fulfillment type: DELIVERY or PICKUP.
- Determine fulfillmentLocationId before confirmation.
- Payment status, order status and fulfillment status must be separate.
- Add stock reservation with expiry during payment.
- Customer cancellation must follow state/time policy and automatically release stock.

### Payments and saved cards
- Never store full card details in DynamoDB.
- Store payment-provider token/reference and masked metadata only.
- Use provider-hosted/tokenized flow and webhook-confirmed payment status.

### Loyalty
- Use platform-wide or business-specific loyalty accounts according to policy; do not mix silently.
- Use immutable loyalty transactions for earn, redeem, expire, reverse and adjustment.
- Show pending points separately until order completion.

### Orders, returns and support
- Customer order timeline must map to backend status events.
- Add return eligibility window and line-level return request.
- Support ticket statuses: OPEN, WAITING_FOR_CUSTOMER, WAITING_FOR_SUPPORT, RESOLVED and CLOSED.
- Attachments must upload privately to S3; current local/demo attachment state is insufficient.

### Notifications
- Store notification records and user preferences.
- Add email/SMS/push delivery status separately.
- Order-critical notifications should be event-driven.

## P1 — UI and flow fixes
- Align terminology with management portals: same order and refund statuses.
- Add clear multi-business cart handling.
- Add out-of-stock replacement/removal flow before payment.
- Add payment failure recovery without duplicate order creation.
- Add empty, loading, offline and retry states.
- Bring this older portal to the same component/design standard as the newer portals.

## DECISION
- Is loyalty global across RetailOS or isolated by business?
- Can one checkout contain products from multiple businesses?
- Who handles delivery: business, platform fleet or third party?
- Are customer reviews moderated by business owners or SaaS Admin?

---

# Recommended implementation order

1. Shared tenancy, Cognito membership and location authorization.
2. Product/variant/listing/price models.
3. Inventory balance and immutable ledger.
4. Stock request, shipment and receipt workflows.
5. POS shift, sale, payment and receipt.
6. Marketplace cart, checkout, order allocation and reservation.
7. Fulfillment, return and refund workflows.
8. Loyalty, notifications and support.
9. Aggregated dashboards and reports.
10. Admin subscriptions, payment proof and platform governance hardening.

# Tracking format recommendation

For each change create a ticket with:
- Portal
- Module/page
- UI component/modal/drawer
- Current behavior
- Required behavior
- Backend command/query
- Models affected
- Allowed roles
- Valid statuses/transitions
- Validation/error cases
- Audit requirement
- Priority
- Acceptance criteria
