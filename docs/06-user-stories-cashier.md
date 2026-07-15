# User Stories — Cashier

## Role Summary
The Cashier operates the POS terminal at a specific store/branch. They start and close shifts, process sales transactions, handle cash and card payments, look up or register customers, apply loyalty points, and submit day-end closing reports.

---

## Epic 1: Shift Management

### US-CSH-001
**As a Cashier**, I want to start my shift by entering my opening cash amount so that the system can track cash flow for my session.

**Acceptance Criteria:**
- Login → "Start Shift" screen appears before POS is accessible
- Fields: opening cash amount (counted manually), optional note
- Shift record created: status `open`, cashier id, store id, opened_at timestamp
- POS terminal unlocked after shift start

### US-CSH-002
**As a Cashier**, I want to close my shift by submitting the closing cash count and a summary so that management can reconcile the day's sales.

**Acceptance Criteria:**
- "Close Shift" button visible throughout shift
- Closing flow:
  1. Enter closing cash count
  2. System shows: expected cash (opening + cash sales), declared closing cash, variance
  3. Cashier adds closing note (optional)
  4. Submit
- Shift status → `closed`; no more transactions allowed on this shift
- Manager notified of shift close with summary
- Printable shift summary receipt

### US-CSH-003
**As a Cashier**, I want to see a real-time running total of my current shift so that I am always aware of my session's performance.

**Acceptance Criteria:**
- Shift info bar: start time, total transactions, total sales value, total cash sales, total card sales

---

## Epic 2: POS — Transaction Processing

### US-CSH-010
**As a Cashier**, I want to scan a product barcode or search by name/SKU to add items to the cart so that I can process sales quickly.

**Acceptance Criteria:**
- Barcode scanner input (USB/Bluetooth) or manual search
- Search: product name, SKU, barcode
- On barcode scan: correct variant added to cart automatically
- For weighted items: prompt for weight entry; price calculated as weight × unit price
- For packaging levels: scanning carton barcode adds correct quantity of base units

### US-CSH-011
**As a Cashier**, I want to update item quantities and remove items from the cart so that I can correct mistakes before checkout.

**Acceptance Criteria:**
- Increase/decrease quantity buttons
- Remove item button
- On quantity change: line total recalculates; order total recalculates

### US-CSH-012
**As a Cashier**, I want to apply a discount to a line item or the entire order so that I can process promotional pricing or authorised discounts.

**Acceptance Criteria:**
- Line item discount: fixed amount or percentage
- Order-level discount: fixed amount or percentage
- Discount entry may require manager PIN/approval (configurable per business)
- Discount recorded in transaction log

### US-CSH-013
**As a Cashier**, I want to process a payment (cash, card, or mixed) so that the transaction is completed.

**Acceptance Criteria:**
- Payment methods: cash, card (manual entry — no gateway in v1), split payment (partial cash + card)
- Cash payment: enter amount tendered → system shows change due
- Card payment: enter card reference/approval code
- On payment confirm: transaction saved, inventory decremented, receipt printable

### US-CSH-014
**As a Cashier**, I want to print or send a receipt after each transaction so that the customer has proof of purchase.

**Acceptance Criteria:**
- Print thermal receipt
- Optional: email receipt if customer email on record
- Receipt includes: store name, cashier name, date/time, items, qty, prices, discounts, subtotal, tax, total, payment method, change given, loyalty points earned/used, loyalty balance

### US-CSH-015
**As a Cashier**, I want to put a transaction on hold so that I can serve the next customer while the first resolves a query.

**Acceptance Criteria:**
- Hold saves current cart with all items and customer
- New empty cart starts for next customer
- Held transactions retrievable from a list

### US-CSH-016
**As a Cashier**, I want to process a return/refund so that customers can return items and get their money back.

**Acceptance Criteria:**
- Look up original transaction by receipt number or customer
- Select items to return and quantity
- Reason required: damaged, wrong item, customer changed mind, etc.
- Refund method: cash or reverse card charge
- Inventory returned to store stock
- Loyalty points earned on original transaction reversed if applicable
- Return logged and linked to original transaction

---

## Epic 3: Customer Management at POS

### US-CSH-020
**As a Cashier**, I want to look up a customer by phone number or name so that I can link the transaction to their account.

**Acceptance Criteria:**
- Search input on POS screen
- Results show: name, phone, loyalty coin balance
- Select customer to attach to current transaction

### US-CSH-021
**As a Cashier**, I want to quickly register a new customer at the POS so that they can earn loyalty points on their first purchase.

**Acceptance Criteria:**
- Minimal form: name, phone number (required), email (optional)
- Customer created immediately; transaction linked
- Full profile can be completed later

### US-CSH-022
**As a Cashier**, I want to apply a customer's loyalty coins as a discount so that they can redeem their earned points.

**Acceptance Criteria:**
- After customer is selected: loyalty balance displayed on POS
- "Redeem Points" button: enter coins to redeem (1 coin = PKR 1)
- Cannot redeem more coins than available balance
- Cannot redeem more than total order value
- Redeemed amount shown as discount line on receipt
- Loyalty balance deducted on transaction completion

### US-CSH-023
**As a Cashier**, I want to see how many loyalty coins a customer will earn from the current transaction before finalising so that I can inform the customer.

**Acceptance Criteria:**
- Coins to earn shown in checkout summary: "You will earn X coins (1 per PKR 100)"
- Calculation: floor(total_after_discounts / 100)
- Coins credited to customer account on transaction completion

---

## Epic 4: Serial & Batch Items at POS

### US-CSH-030
**As a Cashier**, I want to scan a serial-tracked item's serial number at checkout so that the specific unit is recorded as sold.

**Acceptance Criteria:**
- After product is added: if serial-tracked, prompt to scan serial number
- Serial number validated as available (not sold/reserved)
- Serial status updated to `sold` on transaction complete

### US-CSH-031
**As a Cashier**, I want the system to automatically select the correct batch for batch-tracked items using FEFO so that older stock is sold first.

**Acceptance Criteria:**
- System auto-selects batch with earliest expiry date (FEFO)
- Cashier can override if needed (with reason)
- Batch quantity decremented on sale

---

## Portal Pages Required (Cashier)

| Page | Description |
|---|---|
| `/pos/login` | Cashier login |
| `/pos/shift/start` | Start shift — opening cash |
| `/pos/register` | Main POS screen (cart + payment) |
| `/pos/shift/close` | Close shift — cash count + summary |
| `/pos/transactions` | Current shift transaction history |
| `/pos/holds` | Held transactions list |
| `/pos/returns` | Process return/refund |
| `/pos/customer/lookup` | Customer search + quick register |
