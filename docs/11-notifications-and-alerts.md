# RetailOS — Notifications & Alerts Specification

## Notification Channels
- In-portal (bell icon with unread badge)
- Email
- Future: SMS, push notification (mobile app)

---

## Notification Events by Role

### Admin
| Event | Channel | Trigger |
|---|---|---|
| New business registration submitted | In-portal + Email | Business owner completes registration |
| Payment submitted for verification | In-portal + Email | Business submits payment reference |
| Business subscription expired (auto-banned) | In-portal | Daily job detects expiry |
| Business renewal payment submitted | In-portal + Email | Business submits renewal reference |

### Business Owner
| Event | Channel | Trigger |
|---|---|---|
| Registration approved + credentials | Email | Admin approves business |
| Registration rejected + reason | Email | Admin rejects registration |
| Subscription expires in 7 days | Email + In-portal banner | Daily job, 7 days before expiry |
| Subscription expires in 3 days | Email + In-portal banner | Daily job, 3 days before expiry |
| Subscription expires in 1 day | Email + In-portal banner | Daily job, 1 day before expiry |
| Subscription expired (banned) | Email + Suspension screen | Day of expiry |
| Subscription renewal approved | Email | Admin approves renewal payment |
| Renewal payment rejected | Email | Admin rejects renewal payment |
| New user invited successfully | In-portal | User invitation sent |
| Staff accepted invitation | In-portal | Staff completes account setup |

### Warehouse Manager
| Event | Channel | Trigger |
|---|---|---|
| New stock transfer request from store | In-portal + Email | Store submits request |
| Stock low (below reorder level) | In-portal | Inventory check (daily or on sale) |
| Product expiring within 30 days | In-portal | Daily job |

### Store Manager
| Event | Channel | Trigger |
|---|---|---|
| Transfer request: approved | In-portal | Warehouse approves request |
| Transfer request: dispatched | In-portal + Email | Warehouse dispatches |
| Transfer request: rejected | In-portal | Warehouse rejects |
| New ecommerce order assigned | In-portal (urgent) | Order placed by customer |
| Order cancelled by customer | In-portal | Customer cancels before packing |
| Cashier shift closed | In-portal | Cashier submits day-end |
| Stock low in store | In-portal | Daily inventory check |

### Cashier
| Event | Channel | Trigger |
|---|---|---|
| Shift reminder (if not started by opening time) | In-portal | Scheduled job |
| Shift summary after closing | In-portal + Email | Shift close submitted |

### Customer
| Event | Channel | Trigger |
|---|---|---|
| Order confirmation | Email + In-app | Order placed |
| Order confirmed by store | Email + In-app | Store accepts order |
| Order packed | In-app | Store marks packed |
| Order shipped/out for delivery | Email + In-app | Store marks shipped |
| Order delivered | Email + In-app | Store marks delivered |
| Order cancelled | Email + In-app | Order cancelled |
| Loyalty coins credited | In-app | Order delivered |
| Loyalty coins redeemed | In-app | Transaction with redemption |

---

## Alert Types & UI Patterns

| Alert Type | UI Component | Example |
|---|---|---|
| Info | Blue banner (dismissable) | "Setup checklist: 3 steps remaining" |
| Warning | Yellow banner (persistent) | "Subscription expires in 5 days" |
| Critical | Red banner (non-dismissable) | "Your subscription has expired" |
| Success toast | Green toast (4s auto-dismiss) | "Product saved successfully" |
| Error toast | Red toast (manual dismiss) | "Failed to save. Check required fields." |
| Confirmation modal | Modal overlay | "Are you sure you want to delete this store?" |
| Badge | Nav icon number badge | "3 pending approvals" |

---

## Subscription Expiry Alert Flow

```
Day -7: Email sent to owner "Subscription expires in 7 days"
        In-portal yellow banner appears

Day -3: Email sent to owner "Subscription expires in 3 days"
        Banner updated with urgency

Day -1: Email sent "Last day to renew"
        Banner turns orange

Day 0:  Subscription expires
        Business status → banned
        Email: "Your account has been suspended"
        All portals (owner, warehouse, store, POS) → Suspension screen
        Suspension screen shows: Submit Payment button + contact support

After payment submission:
        Owner sees: "Payment submitted. Ref: XXXX. Awaiting admin verification."
        Admin notified of renewal payment pending
        Admin verifies → Approves
        Business status → active
        All portals accessible
        Email: "Your subscription has been renewed until [date]"
```
