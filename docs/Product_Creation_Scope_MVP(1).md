# Product Creation Scope (Enterprise MVP)

## Goal

Support grocery, clothing, electronics, pharmacy, furniture, hardware,
wholesale, and other retail businesses with a single product creation
flow.

------------------------------------------------------------------------

# Product Creation Flow

``` text
Basic Information
        ↓
Product Options (Optional)
        ↓
Product Details (Optional)
        ↓
Pricing
        ↓
Inventory
        ↓
Images
        ↓
Marketplace
        ↓
Review & Save
```

------------------------------------------------------------------------

# 1. Basic Information

Required for every product.

-   Product Name
-   Product Type (Simple / Variant / Bundle)
-   Category
-   Description
-   Status

------------------------------------------------------------------------

# 2. Product Options (Optional)

Ask:

> Does this product have different versions?

If **No**, skip this step.

If **Yes**, create product options.

Examples:

## Clothing

-   Size: S, M, L
-   Color: Black, White

System generates:

-   Black / S
-   Black / M
-   White / S
-   White / M

## Grocery

-   Bottle Size: 250ml, 500ml, 1.5L

## Electronics

-   Storage: 128GB, 256GB
-   Color: Black, Blue

Each variant has its own:

-   SKU
-   Barcode
-   Price
-   Stock

------------------------------------------------------------------------

# 3. Product Details (Optional)

Extra information that DOES NOT create variants.

Examples by industry:

## Clothing

-   Material
-   Gender
-   Fit
-   Sleeve Type

## Grocery

-   Ingredients
-   Storage Instructions
-   Expiry Required

## Electronics

-   Warranty
-   Screen Size
-   Battery Capacity

## Furniture

-   Dimensions
-   Assembly Required

Businesses can add their own custom product details.

Example:

Field: Material Value: Cotton

Field: Warranty Value: 2 Years

------------------------------------------------------------------------

# 4. Pricing

-   Cost Price
-   Selling Price
-   Compare Price (Optional)
-   Tax Category

Variants can have separate pricing.

------------------------------------------------------------------------

# 5. Inventory

-   SKU
-   Barcode
-   Unit of Measure
-   Track Inventory
-   Low Stock Alert

Variants have separate inventory.

------------------------------------------------------------------------

# 6. Images

-   Main Image
-   Gallery Images
-   Variant Images (Optional)

------------------------------------------------------------------------

# 7. Marketplace

-   Publish Online
-   Pickup Available
-   Delivery Available
-   SEO Title
-   SEO Description

------------------------------------------------------------------------

# 8. Review & Save

-   Save Draft
-   Save & Publish

------------------------------------------------------------------------

# Why this approach?

## Product Options

Used only when a product has different versions.

Examples:

-   Color
-   Size
-   Storage
-   Flavor
-   Pack Size

These generate variants.

## Product Details

Used to describe the product.

Examples:

-   Material
-   Warranty
-   Ingredients
-   Country of Origin
-   Dimensions

These do NOT generate variants.

------------------------------------------------------------------------

# Covers

This structure supports:

-   Grocery
-   Clothing
-   Electronics
-   Pharmacy
-   Furniture
-   Hardware
-   Sports
-   Beauty
-   Pet Supplies
-   Automotive
-   Wholesale
-   General Retail

without creating separate product modules for each industry.
