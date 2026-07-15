# User Stories — Business Owner

## Role Summary
The Business Owner manages their entire business: all stores, all warehouses, all staff, all products, categories, and subscription. They have the highest privilege within their own tenant scope.

---

## Epic 1: First Login & Setup Checklist

### US-OWN-001
**As a Business Owner**, I want to receive a secure invitation email after admin approval so that I can set my password and access my portal.

**Acceptance Criteria:**
- Email contains: portal link, temporary credentials or secure one-time invitation link
- Link expires after 48 hours
- On first login, forced password change or secure password setup screen

### US-OWN-002
**As a Business Owner**, I want to see a setup checklist on first login so that I know exactly what needs to be done to get my business live.

**Acceptance Criteria:**
- Checklist items (with completion status):
  1. Complete business profile
  2. Add at least one warehouse
  3. Add at least one store
  4. Configure ecommerce profile
  5. Add first product
  6. Invite first staff member
- Each item links to the relevant section
- Progress bar showing overall completion
- Checklist dismissable after all items complete

---

## Epic 2: Business Profile

### US-OWN-010
**As a Business Owner**, I want to complete my business profile so that my brand is represented correctly on the ecommerce marketplace.

**Acceptance Criteria:**
- Fields: business name, logo, banner image, tagline, description, website, social media links (Instagram, Facebook, etc.), business type, contact email, contact phone, business address
- Preview shows how the profile appears on the ecommerce marketplace
- Changes save as draft until explicitly published

### US-OWN-011
**As a Business Owner**, I want to configure ecommerce settings for my business so that customers can find and buy from me online.

**Acceptance Criteria:**
- Toggle: ecommerce enabled / disabled
- Delivery zones and estimated delivery time
- Minimum order value
- Return policy text
- Business operating hours (default for all stores)

---

## Epic 3: Subscription & Billing

### US-OWN-020
**As a Business Owner**, I want to view my current subscription plan and its usage so that I know my limits and when to renew.

**Acceptance Criteria:**
- Display: plan name, start date, end date, days remaining
- Usage bars: stores used / max, warehouses used / max, users used / max, products used / max
- Visual warning when usage reaches 80% of any limit

### US-OWN-021
**As a Business Owner**, I want to receive an alert 7 days before my subscription expires so that I can submit payment on time.

**Acceptance Criteria:**
- Email notification at 7 days, 3 days, 1 day before expiry
- In-portal persistent banner showing days remaining
- Banner links to the renewal payment form

### US-OWN-022
**As a Business Owner**, I want to submit a manual payment renewal so that my subscription continues without interruption.

**Acceptance Criteria:**
- Form: payment amount, payment date, bank/payment method, reference/transaction ID, optional screenshot upload
- Submission creates a pending payment record
- Confirmation screen: "Payment submitted. Awaiting admin verification. Reference: [ID]"
- Email confirmation sent

### US-OWN-023
**As a Business Owner**, I want to see my payment history so that I have a record of all past transactions.

**Acceptance Criteria:**
- List: date, amount, reference, status (pending/verified/rejected), period covered
- Download invoice/receipt

### US-OWN-024
**As a Business Owner**, I want to see a "Business Suspended" message when my account is banned so that I know exactly what to do to restore access.

**Acceptance Criteria:**
- All portal pages redirect to a suspension screen
- Screen shows: reason (expired/payment rejected), instructions to submit payment, support contact
- Payment submission still accessible from the suspension screen

---

## Epic 4: Store (Branch) Management

### US-OWN-030
**As a Business Owner**, I want to create a new store/branch so that it becomes operational and can receive stock and process sales.

**Acceptance Criteria:**
- Fields: store name, code, address, city, country, phone, email, latitude/longitude, opening hours, ecommerce enabled toggle
- System checks store limit against subscription
- Store is created with status `active`

### US-OWN-031
**As a Business Owner**, I want to view and manage all my stores on a single page so that I can monitor them efficiently.

**Acceptance Criteria:**
- Cards/list view: store name, city, manager name, staff count, today's sales, status
- Quick actions: view details, edit, deactivate
- Map view option showing store locations

### US-OWN-032
**As a Business Owner**, I want to edit store details and operating hours so that information is always up to date.

**Acceptance Criteria:**
- All fields editable
- Operating hours: per day of week, open/closed toggle per day
- Changes reflect immediately on ecommerce listing

### US-OWN-033
**As a Business Owner**, I want to deactivate a store so that it stops appearing on ecommerce and no new transactions are processed.

**Acceptance Criteria:**
- Deactivation requires confirmation
- In-progress orders at the store are flagged for manual resolution
- Store data retained; reactivation possible

---

## Epic 5: Warehouse Management

### US-OWN-040
**As a Business Owner**, I want to create a warehouse so that inventory can be stocked and distributed to stores.

**Acceptance Criteria:**
- Fields: warehouse name, code, address, city, country, contact person, phone
- System checks warehouse limit against subscription

### US-OWN-041
**As a Business Owner**, I want to view all warehouses with key stats so that I know the health of my inventory operations.

**Acceptance Criteria:**
- List: warehouse name, location, manager name, total SKUs, total units in stock, pending transfer requests
- Quick actions: view details, edit, assign manager

---

## Epic 6: User Management

### US-OWN-050
**As a Business Owner**, I want to invite a user (warehouse manager, warehouse staff, store manager, store staff, cashier) so that they can access the appropriate portal.

**Acceptance Criteria:**
- Form: name, email, role selection, location assignment (warehouse or store)
- System checks user limit against subscription
- Invitation email sent with portal link and credentials
- User appears in list with status `invited` until they accept

### US-OWN-051
**As a Business Owner**, I want to view all users across my business so that I can manage them from one place.

**Acceptance Criteria:**
- Filterable by role, location, status
- Per user: name, role, assigned location, last login, status
- Actions: edit, resend invitation, deactivate

### US-OWN-052
**As a Business Owner**, I want to reassign a user to a different store or warehouse so that staffing adjustments are reflected immediately.

**Acceptance Criteria:**
- Role and location can be changed
- Old access revoked; new access granted immediately
- User notified by email of assignment change

### US-OWN-053
**As a Business Owner**, I want to deactivate a user so that former employees lose access immediately.

**Acceptance Criteria:**
- Deactivation is immediate
- Active sessions terminated
- Audit log entry created

---

## Epic 7: Category & Brand Management

### US-OWN-060
**As a Business Owner**, I want to create and manage my business categories so that my catalog is organised for my staff and customers.

**Acceptance Criteria:**
- Unlimited hierarchy (parent → child → grandchild)
- Fields: name, slug, parent, icon, status
- Each category can be mapped to a platform category

### US-OWN-061
**As a Business Owner**, I want to map my business categories to platform categories so that my products appear in the correct marketplace sections.

**Acceptance Criteria:**
- For each business category, select corresponding platform category from dropdown
- Unmapped categories flagged with warning
- Mapping visible on category list

### US-OWN-062
**As a Business Owner**, I want to manage brands so that products are correctly attributed.

**Acceptance Criteria:**
- Fields: brand name, logo, description, country of origin, status
- Brands used in products cannot be deleted (only deactivated)

### US-OWN-063
**As a Business Owner**, I want to manage attribute sets so that my team uses consistent product fields per category.

**Acceptance Criteria:**
- Create attribute sets (e.g., "Clothing Set", "Electronics Set")
- Assign attributes to sets with required/optional flag
- Assign attribute sets to categories
- When product category is selected, correct attribute set loads automatically

---

## Epic 8: Product Management

### US-OWN-070
**As a Business Owner**, I want to add a new product so that it is available for inventory management, POS, and ecommerce.

**Acceptance Criteria:**
- Step-by-step creation flow:
  1. Select product type (simple, variant, weighted, serialized, batch, expiry, bundle, service, digital)
  2. Select category → attribute set loads automatically
  3. Enter basic info: name, brand, description, short description, SKU
  4. Enter product specifications (loaded from attribute set)
  5. If variant product: choose variant attributes, generate variant combinations
  6. Per variant: SKU, barcode, cost price, retail price, compare price, weight/dimensions
  7. Configure units and packaging
  8. Configure inventory tracking (quantity/batch/serial/expiry settings)
  9. Add pricing (default + optional price lists)
  10. Upload images and videos
  11. Configure ecommerce settings (visibility, SEO title, SEO description)
  12. Configure POS settings (visible on POS, returnable)
  13. Save as draft → Review → Publish

### US-OWN-071
**As a Business Owner**, I want to manage product variants so that each sellable variation has its own SKU, barcode, and pricing.

**Acceptance Criteria:**
- Generate variants from attribute combinations (e.g., Size × Color)
- Each variant: SKU (auto-suggested or manual), barcode, cost price, retail price, stock reorder level
- Variants can be individually enabled/disabled
- Bulk price update for all variants

### US-OWN-072
**As a Business Owner**, I want to assign barcodes to product variants so that they can be scanned at POS and warehouse.

**Acceptance Criteria:**
- Manual barcode entry or system-generated
- Multiple barcodes per variant (manufacturer, internal, packaging)
- Barcode uniqueness enforced across the business
- Barcode type: manufacturer / internal / packaging / weighted

### US-OWN-073
**As a Business Owner**, I want to manage product images per variant so that customers see the correct product colour/style image.

**Acceptance Criteria:**
- Product-level images (shared across variants)
- Variant-specific images (e.g., blue shirt shows blue images)
- Primary image designation
- Support: JPEG, PNG, WebP; max 5MB per image; up to 10 images per variant

### US-OWN-074
**As a Business Owner**, I want to create product bundles so that grouped products can be sold as a set.

**Acceptance Criteria:**
- Select component variants and quantities
- Bundle SKU and barcode
- When bundle is sold, each component's inventory decreases
- Bundle price set independently

### US-OWN-075
**As a Business Owner**, I want to manage product pricing across channels so that retail, wholesale, and online prices are correctly configured.

**Acceptance Criteria:**
- Default price list: retail (POS)
- Optional: online price, wholesale price, promotional price (with date range)
- Store-specific price override

### US-OWN-076
**As a Business Owner**, I want to view my full product catalog so that I can manage it efficiently.

**Acceptance Criteria:**
- List with: image thumbnail, name, SKU, category, brand, variants count, stock total, POS enabled, ecommerce enabled, status
- Filters: category, brand, status, product type, stock status
- Bulk actions: activate, deactivate, update price list, export

---

## Epic 9: Inventory Overview

### US-OWN-080
**As a Business Owner**, I want to see an inventory summary across all locations so that I know total stock levels.

**Acceptance Criteria:**
- Summary: total SKUs, total units in warehouses, total units in stores, low-stock items count, out-of-stock count
- Drill-down by warehouse or store
- Filter by category or brand

### US-OWN-081
**As a Business Owner**, I want to see low-stock and out-of-stock alerts so that I can take action before a stockout occurs.

**Acceptance Criteria:**
- Items below reorder level highlighted
- Alert: product name, variant, location, current stock, reorder level
- Email summary daily (configurable)

---

## Epic 10: Reports & Analytics

### US-OWN-090
**As a Business Owner**, I want to see a business dashboard so that I understand overall performance at a glance.

**Acceptance Criteria:**
- KPIs: today's total sales (POS + online), orders pending, total customers, active products, total staff
- Charts: sales trend (daily/weekly/monthly), top-selling products, top stores by sales, channel split (POS vs online)

### US-OWN-091
**As a Business Owner**, I want to view sales reports per store so that I can compare performance.

**Acceptance Criteria:**
- Per-store: total sales, transactions, avg basket size, date range filter
- Exportable

### US-OWN-092
**As a Business Owner**, I want to see inventory movement reports so that I can track how stock moves from warehouse to store.

**Acceptance Criteria:**
- Transfer history: from, to, product, qty, date, status
- Receive history: warehouse, GRN number, supplier, product, qty, date

---

## Portal Pages Required (Business Owner)

| Page | Description |
|---|---|
| `/owner/dashboard` | Business overview KPIs + charts |
| `/owner/setup` | First-login setup checklist |
| `/owner/profile` | Business profile + ecommerce settings |
| `/owner/subscription` | Plan, usage, renewal |
| `/owner/stores` | Store list |
| `/owner/stores/new` | Create store |
| `/owner/stores/:id` | Store details + edit |
| `/owner/warehouses` | Warehouse list |
| `/owner/warehouses/new` | Create warehouse |
| `/owner/warehouses/:id` | Warehouse details + edit |
| `/owner/users` | All users management |
| `/owner/users/invite` | Invite new user |
| `/owner/categories` | Business category tree |
| `/owner/brands` | Brand management |
| `/owner/attributes` | Attribute + attribute sets |
| `/owner/products` | Product catalog list |
| `/owner/products/new` | Create product wizard |
| `/owner/products/:id` | Edit product |
| `/owner/inventory` | Inventory overview |
| `/owner/reports/sales` | Sales reports |
| `/owner/reports/inventory` | Inventory movement reports |
