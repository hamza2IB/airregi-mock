# RetailOS — Data Architecture

## Multi-Tenancy Model

Every record that belongs to a business is scoped by `business_id`. Platform-level records (admin-managed) have no `business_id` or use a null value.

---

## Core Entity Relationships

```
Platform
└── Businesses (tenants)
    ├── Subscription (package + billing dates)
    ├── Warehouses
    │   ├── Warehouse Users (Manager, Staff)
    │   └── Inventory (variant + batch/serial)
    ├── Stores / Branches
    │   ├── Store Users (Manager, Staff, Cashier)
    │   ├── Inventory (variant + batch/serial)
    │   └── POS Sessions (Shifts)
    ├── Users
    ├── Products
    │   ├── Variants
    │   │   ├── Barcodes
    │   │   ├── Prices (per price list)
    │   │   ├── Packaging levels
    │   │   ├── Inventory records
    │   │   ├── Batch records (if batch-tracked)
    │   │   └── Serial records (if serial-tracked)
    │   ├── Attribute values (specs)
    │   ├── Media
    │   └── Industry extension tables
    ├── Categories (business-level)
    │   └── Mapped to Platform Categories
    ├── Brands
    └── Orders
        ├── Online Orders (ecommerce)
        └── POS Transactions
```

---

## Key Tables Reference

### Tenancy & Subscription

```
businesses
  id, name, slug, logo, status, subscription_package_id,
  subscription_start, subscription_end, created_at

subscription_packages
  id, name, max_stores, max_warehouses, max_users,
  max_products, price_monthly, price_yearly, features_json

business_payments
  id, business_id, package_id, amount, currency,
  payment_reference, payment_date, status (pending/verified/rejected),
  verified_by_admin_id, verified_at, period_start, period_end
```

### Locations

```
warehouses
  id, business_id, name, code, address, city, country,
  contact_person, phone, status

stores
  id, business_id, name, code, address, city, country,
  contact_person, phone, status, ecommerce_enabled,
  opening_time, closing_time, latitude, longitude
```

### Users

```
users
  id, business_id (null = platform admin), role, name, email,
  phone, password_hash, invitation_token, invitation_sent_at,
  status (invited/active/suspended), created_at

user_location_assignments
  user_id, location_type (warehouse/store), location_id, assigned_at
```

### Product Architecture

```
products
  id, business_id, name, slug, product_type, category_id,
  brand_id, description, short_description, status,
  inventory_tracking (none/quantity/batch/serial),
  selling_method (unit/weight/volume/length/service),
  ecommerce_enabled, pos_enabled, returnable,
  warranty_enabled, batch_tracking_enabled,
  expiry_tracking_enabled, serial_tracking_enabled,
  tax_category_id, created_at, updated_at

product_variants
  id, product_id, business_id, sku, variant_name,
  cost_price, retail_price, compare_at_price,
  weight, length, width, height,
  status, is_default, created_at

product_variant_attribute_values
  variant_id, attribute_id, attribute_value_id

product_barcodes
  id, business_id, variant_id, packaging_id,
  barcode, barcode_type, is_primary, status

product_packagings
  id, variant_id, name, unit_quantity, barcode,
  purchase_enabled, sales_enabled

attributes
  id, business_id, name, code, data_type,
  is_variant_attribute, is_filterable, is_required, unit_id

attribute_values
  id, attribute_id, value, sort_order

attribute_sets
  id, business_id, name

attribute_set_items
  attribute_set_id, attribute_id, required, display_order

category_attribute_sets
  category_id, attribute_set_id
```

### Inventory

```
inventory
  id, business_id, variant_id, location_type, location_id,
  quantity, reserved_quantity, reorder_level, updated_at

inventory_batches
  id, business_id, variant_id, location_id, batch_number,
  manufacturing_date, expiry_date, supplier_id,
  quantity, cost_price, status

inventory_serials
  id, business_id, variant_id, serial_number, imei_1, imei_2,
  batch_id, location_type, location_id, status,
  warranty_start, warranty_end

stock_transfer_requests
  id, business_id, from_location_type, from_location_id,
  to_location_type, to_location_id, requested_by,
  status (pending/approved/dispatched/received/cancelled),
  notes, created_at, updated_at

stock_transfer_items
  transfer_id, variant_id, requested_qty, approved_qty,
  dispatched_qty, received_qty, batch_id, notes
```

### POS / Shifts

```
cashier_shifts
  id, cashier_id, store_id, opened_at, closed_at,
  opening_cash, closing_cash, expected_cash,
  difference, status (open/closed), notes

pos_transactions
  id, shift_id, store_id, cashier_id, customer_id,
  subtotal, discount, tax, total, payment_method,
  loyalty_points_used, loyalty_points_earned,
  status, created_at

pos_transaction_items
  id, transaction_id, variant_id, batch_id, serial_id,
  quantity, unit_price, discount, total
```

### Ecommerce Orders

```
orders
  id, business_id, customer_id, store_id (assigned),
  subtotal, discount, delivery_fee, tax, total,
  loyalty_points_used, loyalty_points_earned,
  status (pending/confirmed/packed/shipped/delivered/cancelled),
  delivery_address, tracking_notes, created_at

order_items
  id, order_id, variant_id, quantity, unit_price, total

order_status_logs
  id, order_id, status, changed_by, notes, created_at
```

### Customer & Loyalty

```
customers
  id, name, email, phone, address,
  loyalty_coins, total_spent, created_at

loyalty_transactions
  id, customer_id, transaction_type (earn/redeem),
  coins, reference_type (pos/order), reference_id, created_at
```

### Categories

```
platform_categories
  id, parent_id, name, slug, level, status (admin-managed)

categories (business-level)
  id, business_id, parent_id, name, slug, level, status

category_platform_mappings
  business_category_id, platform_category_id
```

---

## Product Type Reference

| Type | Tracking | Example |
|---|---|---|
| Simple | Quantity | Pen, notebook |
| Variant | Quantity per variant | T-shirt (size/color) |
| Weighted | Weight/volume | Fresh meat, fabric |
| Serialized | Serial/IMEI | Mobile phone |
| Batch | Batch | Medicine, packaged food |
| Expiry | Batch + Expiry date | Dairy, bakery |
| Bundle | Component stock reduction | Gift set |
| Kit | Assembly into new unit | DIY kit |
| Service | No inventory | Alteration, repair |
| Digital | No inventory | E-gift card |

---

## Pricing Layers

```
price_lists
  id, business_id, name, currency, customer_group_id,
  store_id, channel (pos/online/wholesale),
  start_date, end_date

variant_prices
  price_list_id, variant_id, packaging_id,
  price, minimum_quantity
```

Supports: retail, wholesale, online, store-specific, promo, package pricing.
