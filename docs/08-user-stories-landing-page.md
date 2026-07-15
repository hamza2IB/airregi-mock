# User Stories — Public Landing Page

## Role Summary
The Landing Page serves as the marketing and conversion entry point for RetailOS. It targets prospective business owners, showcasing features, pricing packages, and guiding them through registration.

---

## Epic 1: Marketing & Discovery

### US-LP-001
**As a prospective business owner**, I want to understand what RetailOS offers at a glance so that I can decide whether to proceed with registration.

**Acceptance Criteria:**
- Hero section: tagline, primary CTA ("Get Started" / "Book Demo")
- Features section: key capabilities by role (POS, Inventory, Ecommerce, Multi-Store, etc.)
- How it works: step-by-step visual onboarding journey
- Industries served: Clothing, Grocery, Electronics, Cosmetics, Pharmacy, etc.
- Testimonials / brand logos (when available)

### US-LP-002
**As a prospective business owner**, I want to see all available subscription packages and their features so that I can choose the right plan.

**Acceptance Criteria:**
- Pricing cards: plan name, price (monthly/yearly toggle), list of features, limits (stores, warehouses, users, products)
- Highlighted/recommended plan
- "Get Started" CTA per plan leads to registration with plan pre-selected
- FAQ section below pricing

### US-LP-003
**As a visitor**, I want to navigate to the ecommerce marketplace from the landing page so that I can shop from listed businesses.

**Acceptance Criteria:**
- "Shop Now" or "Marketplace" link in navigation
- Links to the customer-facing ecommerce app

---

## Epic 2: Business Registration Flow

### US-LP-010
**As a prospective business owner**, I want to register on the platform by selecting a package so that I can start the onboarding process.

**Acceptance Criteria:**
- Step 1: Package selection (pre-selected if coming from pricing CTA)
- Package summary shown throughout the form

### US-LP-011
**As a prospective business owner**, I want to create my owner account during registration so that my identity is linked to the business from the start.

**Acceptance Criteria:**
- Step 2: Owner account form
  - Full name, email, phone, password, confirm password
- Email uniqueness validated in real-time
- Password strength indicator

### US-LP-012
**As a prospective business owner**, I want to enter my business information so that RetailOS knows about my business.

**Acceptance Criteria:**
- Step 3: Business information form
  - Business name, business type (dropdown), city, country, business registration number (optional), brief description
- Business name uniqueness validated

### US-LP-013
**As a prospective business owner**, I want to submit my manual payment reference so that the admin can verify my payment.

**Acceptance Criteria:**
- Step 4: Payment information
  - Package name + price shown
  - Fields: payment date, bank/payment method, transaction reference ID, optional screenshot upload
- Clearly states: "Payment will be manually verified. You will be notified within 1–2 business days."

### US-LP-014
**As a prospective business owner**, I want to see a confirmation screen after submitting my registration so that I know what to expect next.

**Acceptance Criteria:**
- Success screen: "Application submitted! We are verifying your payment. You will receive your portal credentials by email once approved."
- Shows submitted payment reference for reference
- Contact support link

---

## Epic 3: Subscription Expiry Alert (Business Users)

### US-LP-020
**As a logged-in business owner whose subscription is expiring**, I want to see a prominent alert on the landing page so that I am reminded to renew.

**Acceptance Criteria:**
- Banner visible at top of landing page (when session detects near-expiry status)
- Message: "Your subscription expires in X days. Renew now to avoid interruption."
- CTA: "Renew Subscription" → Opens renewal payment form

### US-LP-021
**As a business owner whose subscription has expired**, I want the suspension screen to clearly tell me how to restore access so that I can act quickly.

**Acceptance Criteria:**
- Suspension page (shown instead of portal for banned businesses):
  - Message: "Your subscription has expired."
  - Button: "Submit Renewal Payment"
  - Contact support link

---

## Landing Page Sections

| Section | Purpose |
|---|---|
| Navigation | Logo, Features, Pricing, Marketplace, Login, Register |
| Hero | Main value proposition + CTA |
| Features Overview | Visual feature highlights by module |
| How It Works | 4-step visual onboarding journey |
| Industries | Clothing, Grocery, Electronics, etc. |
| Pricing | Package cards with feature comparison |
| FAQ | Common questions answered |
| CTA Banner | Final push to register |
| Footer | Links, contact, social media, legal |

## Registration Steps Summary

```
Step 1: Select Package
Step 2: Create Owner Account
Step 3: Enter Business Information
Step 4: Submit Manual Payment Reference
  ↓
Confirmation Screen → Wait for Admin Approval → Receive Email → Access Portal
```
