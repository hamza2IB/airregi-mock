# RetailOS — Stats, Counters & Scaling Strategy

> Status: **DRAFT for review**. Defines how RetailOS shows **stats, counts and
> filtered lists** cheaply and accurately at **millions of rows**, without
> recomputing or re-scanning on every page load / refresh. Companion to
> `access-patterns-and-indexes.md` and `infrastructure.md`.

---

## 1. The problem

Dashboards and list pages show many **stats** (KPI cards, filter-tab counts,
"X at risk", plan splits) and **filtered lists** (businesses, orders, sales…).
Two failure modes to avoid:

1. **Recomputing on every refresh** — recalculating a stat over millions of rows
   each time the page loads is slow and expensive.
2. **Scanning to filter/count** — counting a filtered set of a million-row table
   on the fly is the classic cost blow-up.

Requirement: cheap, **accurate**, and stable under repeated refresh, at scale.

---

## 2. Core idea — compute at *write-time*, not *read-time*

Move the work to **when data changes**, spread across many tiny events, instead of
doing it when the page loads:

- Every mutating write (new business, payment, sale, status change, stock move)
  fires a **DynamoDB Stream → Lambda** that does an incremental `+1 / −1` (or `ADD
  delta`) on a **counter / aggregate item**.
- The UI then **reads that one number** — O(1), ~1 read unit — regardless of how
  many rows are behind it.

A refresh therefore **never recalculates**; it reads a pre-made value. The
calculation already happened once, at the moment each row changed.

---

## 3. Rule 1 — every displayed stat is a precomputed counter

Never derive a number from `list().length` or an on-read aggregation.

- **Per-value counters:** store a count per filter value, e.g.
  `business_status_counts = { active, pending, suspended, banned }`,
  `plan_distribution = { Enterprise, Pro, Starter }`, `expiring_7d`,
  `pending_new_reg`, `pending_renewal`. (These are the `DailyMetrics` /
  counter metricTypes enumerated in `access-patterns-and-indexes.md` §8.)
- **Time-series metrics:** `revenue`, `new_subs`, `renewals`, etc. as one row per
  date (+ a `#month` grain for long ranges) so period reports are a bounded range
  read, not a scan.

### 3a. Counter sharding — avoid the single-hot-item bottleneck

A counter is a single DynamoDB item. If **every** write updates the same item, all
those writes queue behind one partition (~1,000 writes/sec cap) and throttle —
"one cashier can't handle the whole crowd".

Fix for high-throughput counters:
- Split each hot counter into **N shards**: `counter#0`, `counter#1`, … `counter#N`.
- Each event updates a **random shard** (`ADD delta`), spreading writes across N
  partitions.
- **Read = sum the N shards.** (Cache the summed value — see Rule 2 — so you don't
  re-sum on every request.)
- Pick N to fit expected write rate (e.g. 10 shards ≈ ~10k writes/sec headroom).
  Low-traffic counters can stay unsharded (N=1); only shard the hot ones.

This keeps the "compute-at-write-time" model from becoming a write bottleneck at
scale, while reads stay O(N) tiny + cached.

### Which combinations to precompute
- Precompute the **primary dimensions** (status, package) and the **common pairs
  you actually display**.
- **Do not** try to precompute every possible filter combination — that explodes
  combinatorially and bloats write cost.
- For **rare / ad-hoc combinations**, run a **bounded query** instead of keeping a
  counter. (On small tables like admin `Business` — thousands of rows — an ad-hoc
  filtered count is cheap anyway.)

---

## 4. Rule 2 — refresh hits a cache, not the database

Even counter reads shouldn't be hammered on every refresh:

- **AppSync server-side cache** with a short TTL (e.g. 30–60s) on KPI/counter
  queries.
- **Client cache with stale-while-revalidate** (React Query / SWR): show the last
  value instantly, revalidate in the background.
- Optionally **CloudFront** in front of read-only aggregate endpoints.

Result: repeated refresh = cache hits = near-zero cost + instant UI.

---

## 5. Rule 3 — filtered lists over millions: key-based query + paging

For the large tables (InventoryItem, StockMovement, Sale, Order, AuditLog…):

- Every supported filter must map to a **key** — a GSI whose PK is the filter
  dimension and whose SK encodes sort/secondary filter (`status#createdAt`,
  `locationId#variantId`, …). You then fetch **only the matching page**, never the
  whole set.
- **Paginate with cursors** (`nextToken`) — "load more", not "page 1…9999 of Z".
- **Do not show a live exact total of a filtered million-row set.** Options:
  - show a **precomputed counter** for the number that matters, or
  - show **"1,000+"** / omit the exact total for arbitrary ad-hoc filters.
- **Exception — small tables** (admin `Business`, `UserProfile`): only thousands
  of rows, so a Lambda-finishing resolver can filter + sort + paginate **and**
  return an exact total cheaply. Numbered pagination is fine there.

See the dashboard list-rendering + period conventions in
`access-patterns-and-indexes.md` §8.

### 5a. Hot partitions / whale tenants — key by store, not by tenant

DynamoDB caps throughput **per partition-key value** (~1,000 writes/sec,
~3,000 reads/sec). A giant chain (e.g. Carrefour with hundreds of stores) can
funnel all its traffic into one key and hit that ceiling while every other tenant
is idle — a "whale tenant" hot partition.

Rules to avoid it:
- **Partition million-row tables by `locationId`, not `businessId`.** Sales, stock
  levels, and stock movements (`Sale`, `InventoryItem`, `StockMovement`,
  `RegisterSession`) key on `locationId` so **each store gets its own lane**. A
  400-store chain is 400 partitions on these tables, not one.
- **`locationId` is already globally unique** — use it directly as the PK. Don't
  build a `businessId#storeId` composite for spread (the store id is what creates
  the lanes); keep `businessId` as an **attribute / GSI key** for tenant-wide
  queries only.
- **Catalog tables** (`Product`, `ProductVariant`, `Category`) can stay
  `businessId`-partitioned — their writes are low-frequency (occasional edits, not
  thousands/sec), so no whale problem in practice.
- **Business-wide hot GSIs** are the one thing to watch — e.g. a whale's
  business-wide Order list (`byBusinessStatus(businessId → …)`). Mitigate by
  reading via the **location-scoped GSI** (`byFulfillmentStatus(fulfillmentLocationId)`)
  which already spreads by store, or by **write-sharding** the GSI key
  (`businessId#shard0..N`) and scatter-gathering on read.
- **Don't over-partition.** Finer partitions spread writes but make "all stores of
  a business" reads need fan-out (scatter-gather) or a dedicated GSI. DynamoDB
  **adaptive capacity** also auto-isolates/splits hot partitions, so shard/spread
  only the keys that genuinely take whale-level throughput.

> Per-table PK/SK/GSI specifics live in `access-patterns-and-indexes.md` (DB-design
> phase); this is the guiding principle.

---

## 6. Rule 4 — accuracy: idempotency + reconciliation

Counters are only trustworthy if they can't drift. Two safeguards:

### 6a. Idempotent stream consumers (exactly-once effect)
- DynamoDB Streams **can redeliver** an event (at-least-once). A naive `+1` will
  double-count on retry.
- Make the counter update **idempotent**: dedupe by a processed-event id, or use a
  **DynamoDB transaction** that writes the counter delta together with a marker so
  the same event can't apply twice.

### 6b. Periodic reconciliation from the ledgers (self-healing truth)
- Run a scheduled **EventBridge** job (nightly/hourly) that **recomputes** key
  aggregates from the **immutable ledgers** (`StockMovement`, `Sale`,
  `SubscriptionPayment`, `LoyaltyTransaction`) and **corrects** any counter drift.
- So: **counters give speed, ledgers give truth, reconciliation keeps them in
  sync.** For big historical recomputes, run over the **S3 + Athena** export
  rather than the hot tables.

### 6c. Consistency expectation
- Aggregates are **eventually consistent** — a counter may lag a write by
  milliseconds→seconds. This is the standard, unavoidable tradeoff at scale; exact
  *real-time* counts over millions of rows are expensive anywhere. Seconds-fresh
  stats are correct and accurate for dashboards.

---

## 7. What NOT to aim for

Do **not** try to show an **exact, live count of every arbitrary filter
combination over millions of rows on every page load.** Nothing does that cheaply
(not DynamoDB, not a search cluster). Aim instead for:

> **precomputed counters for the stats you show + key-based paged lists +
> reconciliation for accuracy.**

---

## 8. Summary

| Concern | Strategy |
|---|---|
| Recalculating stats every refresh | Counters computed at **write-time**; read one number |
| Refresh re-fetching repeatedly | **AppSync + client cache** (stale-while-revalidate) |
| Millions of rows, multiple filters | Filters map to **keys**; fetch only the page; no on-read scan |
| Exact total of a huge filtered set | Precomputed counter, or "1,000+"; exact totals only on small tables |
| Accurate results | **Idempotent** stream updates + **ledger reconciliation** |
| Cost | All pay-per-use; reads are O(1) counters + single-page queries |

This keeps stats instant, filtered lists bounded, results accurate, and cost
proportional to real usage — at millions of rows.
