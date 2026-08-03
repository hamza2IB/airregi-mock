# RetailOS — Search & Reporting (no OpenSearch)

> Status: **DRAFT for review**. RetailOS uses **no OpenSearch anywhere**. This doc
> defines the DynamoDB-native + serverless replacements for search, filterable
> admin grids, and reporting/exports. Companion to `access-patterns-and-indexes.md`,
> `infrastructure.md`, and `stats-and-scaling-strategy.md`.

---

## 1. Why no OpenSearch

OpenSearch (managed domain or Serverless) is an **always-on cluster** with a fixed
monthly baseline regardless of usage — the opposite of the startup, pay-per-use
goal. RetailOS stays fully serverless (DynamoDB + Lambda + S3, with Athena added
later only when ad-hoc reporting is needed), so cost grows with real usage and
there is no cluster to run.

Tradeoff accepted: we get **keyword + prefix + faceted** search, not relevance
ranking / typo tolerance / semantic search. For a structured retail catalog and
admin grids this is sufficient. If true full-text relevance is ever needed, add a
managed search **later** (see `infrastructure.md` §9) — it is not needed now.

---

## 2. Admin filterable grids → Lambda-finishing

Screens: All Businesses, Payment ledger, Platform Users. These are **small,
structured tables** (thousands of rows), so a search engine is unnecessary.

An AppSync **Lambda resolver**:
1. Queries the relevant GSI partition (e.g. `Business.byStatus`) — or reads the
   whole small table on an "All" view.
2. Applies the extra filters + free-text match (name / owner / city) + sort
   (name / joined / expiry / stores) **in memory**.
3. Slices the requested page and returns it **with an exact total count**.

This delivers combined filters, arbitrary sorts, numbered pagination and exact
totals — none of which raw DynamoDB does natively — because the candidate set is
small. Counts shown as KPI cards / tab badges still come from **counters**
(`business_status_counts`, etc.), not from row counting — see
`stats-and-scaling-strategy.md`.

> Denormalize what the grid sorts/filters on so no cross-entity join is needed at
> read time: e.g. stamp `expiresAt` / `daysLeft` source (`Subscription`) and
> `storeCount` onto the business record via Streams.

### Read-path abstraction (future-proofing)
Put all grids behind one service, e.g. `businessSearch.query({ filters, sort,
page })`. The UI never talks to the data source directly. If a grid ever outgrows
Lambda-finishing, only that service's implementation changes — no UI/schema
rewrite.

---

## 3. Marketplace catalog search → GSIs + DynamoDB inverted index

The large, text-y case (products/stores across tenants). Two techniques, both
DynamoDB-native:

### 3a. Structured facet filtering → GSIs
Category, price band, status, store, channel → composite sort keys
(`byCategory(categoryId → status)`, `byBusinessPublished(businessId → status)`,
etc., per `access-patterns-and-indexes.md`). Serves "browse category / filter by
price / in-stock only" with no scan.

### 3b. Keyword + type-ahead → inverted-index table (Streams-fed)
- A **DynamoDB search table** maintained by a Streams→Lambda that **tokenizes**
  each product's `name` / brand / category into terms and writes rows:
  `PK = term (normalized/lowercased)` → `SK = productId` (+ minimal display fields).
- **Keyword search** = query the term partition(s) and intersect results.
- **Type-ahead / prefix** = a normalized-name GSI queried with `begins_with`.
- Kept in sync on product create/update/delete via the same Streams pipeline.

Cost: extra write amplification (a few index rows per product) + one extra table —
no cluster. Scales with the catalog.

---

## 4. Reporting, dashboards & exports → DailyMetrics now, S3 + Athena later

- **Dashboards / KPIs (day one)** → the `DailyMetrics` materialized aggregate table
  (counters + time-series), read instantly with a single ranged query. No engine,
  no Athena needed — this covers all the built-in dashboard reporting.
- **Ad-hoc / heavy / historical reporting (add later, when needed)** → export
  DynamoDB to **S3** (Streams or point-in-time export) and query with **Athena**
  (serverless SQL, pay-per-query, $0 until used). This is the escape hatch for
  questions you didn't precompute (audits, tax exports, cross-tenant analytics) —
  set it up when such a need actually arises, not upfront.
- **Large CSV/data exports** (e.g. full filtered business/sales export) → generate
  server-side (from S3/Athena once available, or a paginated query for small sets)
  and hand back a download link — **never** a client-side slice of a huge result
  set.

---

## 5. Summary

| Need | Replacement | Extra always-on infra? |
|---|---|---|
| Admin grids (filter/sort/paginate/count) | Lambda-finishing over small tables/GSIs | None |
| Catalog facet filtering | GSIs with composite sort keys | None |
| Catalog keyword / type-ahead | DynamoDB inverted-index table + `begins_with` GSI (Streams-fed) | None (extra table) |
| Counts / KPIs | Streams-maintained counters | None |
| Dashboards | `DailyMetrics` | None |
| Heavy / ad-hoc reporting + exports *(later, when needed)* | S3 + Athena (serverless) | None (pay-per-query, $0 until used) |

Everything is serverless / pay-per-use; nothing runs a 24/7 search or warehouse
cluster.
