# RetailOS — Product Module Specification

This document details the complete product module design, covering all use cases across clothing, grocery, electronics, cosmetics, pharmacy, and other retail sectors.

---

## Core Design Principles

1. **Product stores shared information** — name, description, brand, category, tax, media
2. **Variant represents the exact sellable item** — every SKU, barcode, price, and inventory record belongs to a variant
3. **A product without variations always has one default variant** — consistent architecture
4. **Attributes are configurable, never fixed columns** — one schema serves all industries
5. **Inventory is always variant + location + (optionally batch or serial)**
6. **Category selection drives attribute set loading** automatically

---

## Product Creation Wizard — Step by Step

### Step 1: Product Type
Select the behaviour of this product:

| Type | Use Case | Auto-features |
|---|---|---|
| Simple | Single SKU, no variants | 1 default variant created |
| Variant | Multiple size/color/etc. options | Variant generator |
| Weighted | Sold by weight/volume/length | Weight barcode parsing |
| Serialized | IMEI/serial-tracked | Serial entry at GRN and POS |
| Batch | Batch-tracked (e.g. medicine, FMCG) | Batch entry at GRN |
| Expiry | Batch + expiry date | Expiry tracking, FEFO |
| Bundle | Sold as a set of other products | Component picker |
| Kit | Assembled into new inventory | Bill of materials |
| Service | No stock (e.g. tailoring) | No inventory module |
| Digital | No stock (e.g. e-voucher) | Fulfilment via email/code |

---

### Step 2: Category Selection
- Platform category → Business category tree displayed
- On selection: attribute set is loaded automatically
- Breadcrumb shown: e.g. "Fashion > Men > T-Shirts"

---

### Step 3: Basic Information
| Field | Type | Required |
|---|---|---|
| Product name | Text | Yes |
| Brand | Select (from business brands) | No |
| Short description | Text (150 chars) | No |
| Full description | Rich text | No |
| Product status | Select (Draft/Active/Inactive) | Yes |
| POS enabled | Toggle | Yes |
| Ecommerce enabled | Toggle | Yes |
| Returnable | Toggle | Yes |
| Tax category | Select | No |

---

### Step 4: Product Specifications
Fields loaded from the attribute set for the selected category.

**Example — Clothing attribute set:**
- Gender (select: Men / Women / Kids / Unisex)
- Fit (select: Regular / Slim / Relaxed / Oversized)
- Sleeve (select: Full / Half / Sleeveless)
- Fabric (text: Cotton, Polyester, etc.)
- Care instructions (text)
- Season (multi-select: Summer / Winter / All-season)

**Example — Electronics attribute set:**
- Model number (text)
- Voltage (number + unit)
- Warranty period (number + unit: months/years)
- Technical specs (rich text)

---

### Step 5: Variant Attributes (for Variant products)
- Choose which attributes define variants
- Example: Color + Size selected as variant attributes
- System shows a variant combination generator

**Variant Generator UI:**
```
Color values: [Blue] [Black] [White]    [+ Add value]
Size values:  [S] [M] [L] [XL]         [+ Add value]

Generate Variants → Creates 12 combinations (3 × 4)

✓ Blue / S    ✓ Blue / M    ✓ Blue / L    ✓ Blue / XL
✓ Black / S   ✓ Black / M   ✓ Black / L   ✓ Black / XL
✗ White / S   ✓ White / M   ✓ White / L   ✗ White / XL

(unchecked variants won't be created)
```

---

### Step 6: Variant Details
For each generated variant, enter:

| Field | Required |
|---|---|
| SKU | Yes (auto-suggested: PROD-BLU-S) |
| Barcode | No (can add later) |
| Cost price (PKR) | Yes |
| Retail price (PKR) | Yes |
| Compare-at price | No |
| Weight (g) | No |
| Dimensions (L × W × H cm) | No |
| Reorder level | No |
| Status | Yes |

**Bulk fill option:** Apply same cost/retail price to all variants, then override individually.

---

### Step 7: Units & Packaging

**Base unit:** The smallest unit tracked in inventory (e.g., Can)

**Purchase unit:** How it arrives from supplier (e.g., Carton = 24 cans)

**Sales unit:** How it is sold (e.g., 6-pack = 6 cans, or single can)

**Packaging levels:**
| Name | Units | Barcode | Purchaseable | Saleable |
|---|---|---|---|---|
| Single | 1 | 1000001 | No | Yes |
| 6-Pack | 6 | 1000002 | No | Yes |
| Carton | 24 | 1000003 | Yes | No |

---

### Step 8: Inventory Tracking Settings
| Setting | Description |
|---|---|
| Inventory tracking | none / quantity / batch / serial |
| Selling method | unit / weight / volume / length / service |
| Batch tracking enabled | Toggle |
| Expiry tracking enabled | Toggle |
| Serial tracking enabled | Toggle |
| Weighted barcode enabled | Toggle (for weight/price-embedded barcodes) |

**Weighted barcode rule (if enabled):**
- Prefix: digits that identify weighted items (e.g., `27`)
- Product code position: characters 2–6
- Value position: characters 7–11
- Value type: weight / price
- Decimal places: 3

---

### Step 9: Pricing

**Default price list (retail/POS):**
- Already entered per variant in Step 6

**Additional price lists (optional):**
- Online price
- Wholesale price
- Promotional price (with start/end date)
- Store-specific price (select store)

---

### Step 10: Images & Media

Per product:
- Upload up to 10 images (shared across all variants)
- Set primary image

Per variant (optional override):
- Upload variant-specific images (e.g., blue shirt shows blue images)
- Video URL (YouTube/Vimeo embed or direct upload)

---

### Step 11: Industry Extension (auto-detected from product type/category)

**Food & Grocery** (if category maps to grocery):
- Ingredients text
- Allergens (multi-select)
- Nutrition information
- Storage instructions
- Halal status (toggle + certification)
- Country of origin

**Cosmetics:**
- Skin type compatibility
- Ingredients
- Usage instructions
- Safety information
- Shade family (for colour products)

**Electronics:**
- Model number
- Voltage / power rating
- Warranty period
- Technical specifications

**Pharmacy:**
- Generic name
- Dosage form (tablet/capsule/syrup/etc.)
- Strength/concentration
- Prescription required (toggle)
- Manufacturer
- Storage conditions

**Fashion:**
- Gender
- Season
- Care instructions
- Fabric details
- Fit type

---

### Step 12: Ecommerce Settings
| Setting | Description |
|---|---|
| Ecommerce visible | Toggle |
| SEO title | Text |
| SEO description | Text (160 chars) |
| Tags | Comma-separated |
| Related products | Search and select |
| Frequently bought together | Search and select |

---

### Step 13: Review & Publish
- Full product summary shown
- Variants table
- Save as Draft / Publish

---

## Barcode Types Reference

| Type | Description |
|---|---|
| Manufacturer | Printed by supplier/manufacturer on packaging |
| Internal | Generated by the business |
| Packaging | Carton/multi-pack barcode |
| Weighted | Scale-generated (contains weight or price) |
| Legacy | Old system barcodes being migrated |

---

## Industry Examples

### Clothing — Men's T-Shirt
```
Product: Nike Sports T-Shirt
Type: Variant
Category: Fashion > Men > T-Shirts
Brand: Nike
Variant attributes: Color, Size

Variant          SKU           Barcode        Price
Blue / Small     NTS-BLU-S     8901000000001  PKR 2,500
Blue / Medium    NTS-BLU-M     8901000000002  PKR 2,500
Blue / Large     NTS-BLU-L     8901000000003  PKR 2,500
Black / Small    NTS-BLK-S     8901000000004  PKR 2,500
Black / Medium   NTS-BLK-M     8901000000005  PKR 2,500
Black / Large    NTS-BLK-L     8901000000006  PKR 2,500
```

### Grocery — Fresh Milk
```
Product: Nurpur Full Cream Milk
Type: Expiry (Batch + Expiry tracked)
Category: Grocery > Dairy > Milk
Brand: Nurpur
Variant: 500ml / 1L / 1.5L
Selling method: Unit
Inventory: Batch

Batch MILK-101: Expiry 15-Jul-2026, Qty 100 (1L variant)
Batch MILK-102: Expiry 18-Jul-2026, Qty 150 (1L variant)
FEFO applied: MILK-101 sold first
```

### Electronics — Mobile Phone
```
Product: Samsung Galaxy S25
Type: Serialized
Category: Electronics > Mobiles
Brand: Samsung
Variant attributes: Color, Storage

Variant              SKU            Tracking
Black / 256GB        SGS25-BLK-256  Serial + IMEI
Black / 512GB        SGS25-BLK-512  Serial + IMEI
Silver / 256GB       SGS25-SLV-256  Serial + IMEI

Each unit has individual: Serial number, IMEI 1, IMEI 2, Warranty start/end
```

### Fresh Produce — Apples
```
Product: Fresh Apples (Royal Gala)
Type: Weighted
Category: Grocery > Fruits
Selling method: Weight
Base unit: Kilogram
Price: PKR 450/kg

POS: Cashier scans scale barcode
Scale barcode: 2700123012500 → Product: Apples → Weight: 1.250kg → Total: PKR 562.50
```

---

## Bundle Example

```
Bundle: Ramadan Grocery Bundle
Components:
  - Rice (5kg bag) × 2
  - Cooking Oil (1L) × 1
  - Sugar (1kg) × 2
  - Tea (200g) × 1

Bundle SKU: RMDN-BNDL-001
Bundle price: PKR 2,200 (vs individual total PKR 2,450)

On sale: each component's inventory decremented individually
```
