# User Stories — Admin (Platform Operator)

## Role Summary
The Admin is the RetailOS platform operator. They manage all businesses, subscription packages, payment verifications, platform-wide categories, and have full visibility across the system.

---

## Epic 1: Authentication & Access

### US-ADM-001
**As an Admin**, I want to log in to the admin portal with my credentials so that I can access all platform management tools.

**Acceptance Criteria:**
- Secure login with email + password
- Session timeout after inactivity
- Failed login attempt lockout after 5 tries

---

## Epic 2: Business Onboarding & Approval

### US-ADM-010
**As an Admin**, I want to see a list of all pending business registrations so that I can review and process them in order.

**Acceptance Criteria:**
- List shows: Business name, owner name, package selected, registration date, payment reference
- Filterable by status: pending, approved, rejected
- Sortable by date

### US-ADM-011
**As an Admin**, I want to view full details of a business registration so that I can verify all submitted information before approving.

**Acceptance Criteria:**
- View: business info, owner info, selected package, submitted payment reference, payment date, payment screenshot (if uploaded)
- Inline notes field for admin remarks

### US-ADM-012
**As an Admin**, I want to verify a manual payment reference against my bank records and mark it as verified or rejected so that the business approval process can proceed.

**Acceptance Criteria:**
- Two actions: "Verify Payment" and "Reject Payment"
- Rejection requires a reason (shown to business owner)
- Verified payment locks the amount and reference for audit

### US-ADM-013
**As an Admin**, I want to approve a verified business registration so that the system automatically creates the business record and owner account.

**Acceptance Criteria:**
- On approval:
  - Business record created with status `active`
  - Owner user account created with status `invited`
  - Secure invitation email sent with portal link and temporary credentials
  - Subscription start/end dates set based on selected package
- Approval cannot happen if payment is not verified

### US-ADM-014
**As an Admin**, I want to reject a business registration with a reason so that the applicant is informed and can reapply.

**Acceptance Criteria:**
- Rejection reason stored and emailed to applicant
- Registration marked as `rejected`

### US-ADM-015
**As an Admin**, I want to suspend or reactivate a business at any time so that I can enforce policy or respond to issues.

**Acceptance Criteria:**
- Actions: Suspend, Reactivate
- Suspension immediately revokes all portal access for that business
- Reason required for suspension
- Reactivation restores all access

---

## Epic 3: Subscription & Payment Management

### US-ADM-020
**As an Admin**, I want to create and manage subscription packages so that businesses have appropriate tiers to choose from.

**Acceptance Criteria:**
- Fields: name, description, monthly price, yearly price, max stores, max warehouses, max users, max products, feature flags
- Packages can be enabled/disabled
- Existing subscribers are not affected when a package is edited

### US-ADM-021
**As an Admin**, I want to view all businesses' subscription statuses so that I can proactively follow up on expiring or expired accounts.

**Acceptance Criteria:**
- List: business name, package, start date, end date, days remaining, status
- Filter: expiring within 7 days, expired, active
- Exportable

### US-ADM-022
**As an Admin**, I want to review and verify renewal payment submissions so that I can reactivate businesses that have made payment.

**Acceptance Criteria:**
- Queue of pending renewal payments
- Same verify/reject flow as initial onboarding
- On verification + approval: subscription dates extended, status restored to `active`

### US-ADM-023
**As an Admin**, I want the system to automatically ban a business when their subscription expires so that revenue collection is enforced.

**Acceptance Criteria:**
- Automated daily job checks expiry dates
- On expiry day: business status → `banned`, all user logins for that business return "subscription expired" message
- Admin notified of newly banned businesses

---

## Epic 4: Platform Category Management

### US-ADM-030
**As an Admin**, I want to create and manage the platform-level category tree so that all businesses map their products to a standardised structure.

**Acceptance Criteria:**
- Unlimited hierarchical depth (e.g., Fashion > Men > Clothing > T-Shirts)
- Fields: name, slug, parent, icon, status
- Reordering via drag-and-drop
- Categories can be deactivated (not deleted if in use)

### US-ADM-031
**As an Admin**, I want to view how business categories are mapped to platform categories so that I can maintain marketplace consistency.

**Acceptance Criteria:**
- Mapping report: business name, their category, mapped platform category
- Highlight unmapped business categories
- Ability to suggest/force a mapping

---

## Epic 5: Platform Analytics & Reports

### US-ADM-040
**As an Admin**, I want to see a platform-wide dashboard so that I have an overview of system health at a glance.

**Acceptance Criteria:**
- KPIs: total active businesses, total stores, total warehouses, total registered customers, total GMV (ecommerce), total POS transactions today, businesses expiring this week, pending approvals count

### US-ADM-041
**As an Admin**, I want to view revenue reports from subscription payments so that I can track SaaS earnings.

**Acceptance Criteria:**
- Monthly recurring revenue (MRR)
- Payment history with status
- Revenue by package tier
- Exportable to CSV

### US-ADM-042
**As an Admin**, I want to view a list of all businesses with key metrics so that I understand platform utilisation.

**Acceptance Criteria:**
- Per business: name, package, stores count, warehouses count, products count, staff count, last active date
- Sortable and filterable

---

## Epic 6: User Management (Platform Level)

### US-ADM-050
**As an Admin**, I want to create additional admin accounts so that the team can share responsibilities.

**Acceptance Criteria:**
- Admin user has no `business_id`
- Fields: name, email, role permissions (view only, full access)
- Invitation email sent on creation

### US-ADM-051
**As an Admin**, I want to impersonate (view-only audit mode) a business owner account so that I can troubleshoot issues on their behalf without changing their data.

**Acceptance Criteria:**
- View-only mode; no edits permitted
- Impersonation session logged with admin identity and timestamp
- Visible "audit mode" banner while active

---

## Portal Pages Required (Admin)

| Page | Description |
|---|---|
| `/admin/login` | Admin login |
| `/admin/dashboard` | Platform overview KPIs |
| `/admin/businesses` | All businesses list |
| `/admin/businesses/pending` | Pending approvals queue |
| `/admin/businesses/:id` | Business detail + approval actions |
| `/admin/payments` | Payment verification queue |
| `/admin/packages` | Subscription package management |
| `/admin/categories` | Platform category tree management |
| `/admin/reports/revenue` | SaaS revenue report |
| `/admin/reports/platform` | Platform usage analytics |
| `/admin/users` | Admin team management |
