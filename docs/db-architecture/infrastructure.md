# RetailOS — AWS Infrastructure (serverless, cost-aware, scalable)

> Status: **DRAFT for review**. Companion to the data-model docs. Defines the AWS
> stack that runs RetailOS for **thousands of tenants** (scaling to millions of
> rows) with a **startup-friendly, pay-per-use** cost profile and **no
> quality compromise**. No OpenSearch anywhere (see `search-and-reporting.md`
> / §5 below for the replacement patterns).

---

## 1. Guiding principle

**Serverless-first, pay-per-use, scale-to-zero.** Nothing in the core stack runs
24/7 billing whether used or not. At startup traffic the bill is tiny (mostly
free-tier); the *same* stack scales to thousands of tenants without a re-platform.
Managed serverless services are multi-AZ and highly available by default, so
"cheap" here does **not** mean "lower quality".

The rule of thumb for every choice: **cost should grow with real usage, not with
idle capacity or tenant count sitting idle.**

---

## 2. Foundation

RetailOS is built on **AWS Amplify Gen2** (`amplify/data` = AppSync + DynamoDB),
which is CDK under the hood, so the whole stack below is defined in code and
reproducible across `dev` / `staging` / `prod` environments.

---

## 3. Recommended stack (component by component)

| Concern | Service | Why it fits (cost + quality) |
|---|---|---|
| **Frontend hosting** (6 React apps) | **Amplify Hosting** | Managed static hosting + global CDN + TLS (S3 + CloudFront under the hood), with built-in per-branch CI/CD, preview environments, and custom domains. One app per portal, deployed from Git. |
| **API** | **AppSync (GraphQL)** | Pay-per-request, no idle cost, native DynamoDB resolvers, real-time subscriptions (POS, orders). Core of Amplify Gen2. |
| **Database** | **DynamoDB (on-demand)** | Pay-per-request, scales to millions of rows, zero idle cost, multi-AZ. Pooled multi-tenancy via `businessId`. |
| **Auth** | **Cognito User Pools** | ~50k MAU free tier covers staff + early marketplace customers. Groups per role + pre-token Lambda for `businessId`/`locationId` claims. |
| **Business logic / compute** | **Lambda** | Resolvers, Streams consumers, counter/metric maintenance, search-index maintenance, reconciliation. Pay per invocation; idle = $0. |
| **Event processing** | **DynamoDB Streams → Lambda** | Backbone of the "compute-at-write-time" model: counters, `DailyMetrics`, audit log, search index. |
| **Scheduled jobs** | **EventBridge Scheduler** | Subscription expiry auto-ban, renewal reminders, nightly rollups + reconciliation. Serverless cron. |
| **File storage** | **S3** | Receipts, product images, logos, exports. Cheap + durable; served via CloudFront. |
| **Async / reliability** | **SQS** (+ **SNS**) | Decouple heavier flows (order processing, FBR invoice allocation, bulk notifications); absorb spikes; prevent loss. |
| **Email / notifications** | **SES** + Cognito triggers | Credentials, "payment verified", reminders. Fractions of a cent/email. In-app via `Notification` table + AppSync subscriptions. |
| **Search (catalog + admin)** | **DynamoDB-native** (GSIs + inverted-index table + `begins_with`; Lambda-finishing for small admin grids) | No search cluster to pay for. Detailed in `search-and-reporting.md`. |
| **Reporting / BI / exports** | **`DailyMetrics`** now; **S3 + Athena** *when needed* | Dashboards/KPIs are served by `DailyMetrics` on day one. Athena is the **later, on-demand** escape hatch for ad-hoc/historical/audit queries over S3 exports — serverless, pay-per-query, $0 until used. Not required upfront. |
| **Observability** | **CloudWatch + X-Ray** | Logs, metrics, alarms, tracing. Set log retention (e.g. 30 days). |
| **IaC / deploy** | **Amplify Gen2 (CDK)** | Everything above defined in code; reproducible envs. |

---

## 4. Multi-tenancy model (cost + isolation)

- **Pooled** model: shared tables partitioned by `businessId` — the most
  cost-efficient approach for thousands of tenants (one table set, not one per
  tenant). Isolation via Cognito group + `businessId` claim auth rules.
- No per-tenant infrastructure to provision → onboarding a tenant is a row, not a
  stack. Cost scales with usage, not tenant count.

---

## 5. Search & reporting without a cluster (summary)

Full detail in `search-and-reporting.md`. In short:
- **Admin filterable grids** (businesses, payments, users) → **Lambda-finishing**
  over small structured tables/GSIs (filter + sort + paginate + count in memory).
- **Catalog facet filtering** → GSIs with composite sort keys.
- **Catalog keyword / type-ahead** → a **DynamoDB inverted-index table**
  (Streams-fed) + normalized-name GSI queried with `begins_with`.
- **Dashboards** → `DailyMetrics` materialized aggregates.
- **Ad-hoc / heavy / historical reporting + exports** → **S3 + Athena**, added
  **later, only when the need arises** (serverless, pay-per-query, $0 until used).
  Day-one dashboards do not depend on it.

Everything is serverless/pay-per-use; nothing runs a 24/7 search or warehouse
cluster.

---

## 6. Cost traps to avoid (where startups overpay)

- **No NAT Gateway.** Keep Lambdas out of private VPC subnets unless forced —
  NAT is ~$32/mo each **plus** data processing, 24/7. DynamoDB/S3/AppSync/SQS/SES
  are reachable without a VPC.
- **No OpenSearch, no provisioned RDS, no ECS/EKS, no idle EC2** — all carry a
  fixed always-on baseline.
- **DynamoDB on-demand**, not provisioned, until load is steady + predictable
  (then reserved/provisioned capacity is a later cost optimization).
- **Set CloudWatch log retention** (e.g. 30 days) and disable verbose prod logging.
- **S3 lifecycle rules** — transition old receipts/exports to IA / Glacier.
- **Cache reads** (AppSync cache / CloudFront / client SWR) so refreshes don't
  re-hit the backend — see `stats-and-scaling-strategy.md`.

---

## 7. Rough cost shape

At startup traffic (few tenants, light usage), most of the stack sits inside free
tiers or costs single-digit → low-tens of USD/month total, because nothing idles.
Cost then grows **proportionally with actual usage**, not with tenant count. There
is **no large fixed floor** to pay before you have customers — the key startup win.

---

## 8. Quality & security (not compromised)

- Every service is managed + multi-AZ (HA without server management).
- Streams-driven counters/metrics/audit give the traceability + no-scan
  performance defined in the data-model docs.
- AppSync subscriptions give real-time POS/order updates.
- Add on demand when justified: **WAF** on CloudFront, **Cognito advanced
  security**, **AWS Backup / PITR** on DynamoDB (PITR is cheap — enable early for
  safety), **GuardDuty**. These are incremental quality/security upgrades, not
  upfront costs.

---

## 9. What to add later (only when scale/revenue justifies)

| Trigger | Add |
|---|---|
| Catalog search needs true relevance / typo tolerance | Managed search (Typesense/Algolia) or OpenSearch — *only then* |
| Steady, predictable DynamoDB load | Reserved/provisioned capacity (cost optimization) |
| Genuinely relational reporting needs | Aurora Serverless v2 |
| Global users / strict latency SLA | Multi-region + DynamoDB global tables |
| High-volume transactional email | SES dedicated IP / scaling |

---

## 9a. Scale-hardening checklist (plain-language)

These are the decisions that make the difference between "works in a demo" and
"survives millions of events". The first two are **must-do**; the rest are cost /
safety / tidiness.

### Must-do (these bite at high throughput)

1. **Counter sharding — "one cashier can't handle the whole crowd".**
   Every stat is a running tally updated as events happen. If millions of events
   all update the *same single tally*, they queue behind one item and it jams
   (DynamoDB allows ~1,000 writes/sec per partition). Fix: split each hot tally
   into N mini-tallies (`counter#0…counter#N`); each event updates a **random**
   shard; **sum the shards on read**. Same number, no bottleneck. (Detail in
   `stats-and-scaling-strategy.md` §3a.)

2. **POS speed — "the cash register must never lag".**
   Ringing up a sale must be instant, but Lambdas can be slow on first wake
   ("cold start"). Fix: keep the sale/payment Lambdas **warm** with *provisioned
   concurrency*, and give them *reserved concurrency* so a busy marketplace can't
   starve them. The FBR invoice `Counter` is an atomic per-store item — fine
   per store, just never share one across stores.

### Should-do (cost / safety / tidiness)

3. **Database billing mode — "pay-as-you-go vs. a monthly plan".**
   Start DynamoDB **on-demand** (great for small, bumpy load). When a hot table
   (InventoryItem, Sale, StockMovement) has steady heavy traffic, switch it to
   **provisioned + auto-scaling** (or reserved capacity) — cheaper for the same
   usage. A cost lever, not a redesign.

4. **Backups — "an undo button for the whole database".**
   Turn on **PITR (point-in-time recovery)** now on all tables — cheap, and lets
   us restore to any moment in the retention window. Non-negotiable for a system
   of record. Decide RPO/RTO; add AWS Backup vaulting if compliance needs it.

5. **Caching — "don't re-ask the same question every 2 seconds".**
   Repeated refreshes shouldn't hit the DB each time. Add **AppSync cache**
   (30–60s TTL) on KPI/aggregate queries + **CloudFront** for read-only data +
   **client stale-while-revalidate**. Refreshes become instant and nearly free.

6. **Security wall — "a bouncer at the door".**
   Add **WAF** in front of CloudFront/AppSync (blocks bots/attacks + rate limits)
   and enable **Cognito advanced security** when ready.

7. **Two login systems — "staff badges vs. customer memberships".**
   Staff (cashiers/managers) and marketplace shoppers are different groups with
   different rules and scale. Use **two separate Cognito user pools** — decide now;
   splitting later is painful.

8. **Cost alarms — "a spending alert on your card".**
   **AWS Budgets** + billing alarms + cost-allocation tags per service, so a
   surprise spike is caught early, not at month-end.

---

## 10. Reference architecture (text diagram)

```
                    +-------------------+
   6 React apps ->  | Amplify Hosting   |  (managed CDN + TLS + CI/CD;
                    | (S3 + CloudFront) |   S3 + CloudFront under the hood)
                    +-------------------+
                             |
                    +-------------------+      +----------------+
   Auth (JWT)  <->  | Cognito User Pool |      |  SES (email)   |
                    +-------------------+      +----------------+
                             |                          ^
                    +-------------------+               |
   GraphQL      ->  |      AppSync      | -> Lambda resolvers (+ cache TTL)
                    +-------------------+
                             |
                    +-------------------+
   System of record| DynamoDB (on-dmd) |
                    +-------------------+
                             | Streams
                             v
                    +-------------------+     writes
   at write-time    | Lambda consumers  | --> counters / DailyMetrics /
   (idempotent)     +-------------------+     audit log / search index
                             |
              +--------------+--------------+
              v              v              v
        +----------+   +----------+   +--------------+
        |   SQS    |   |   S3     |   | EventBridge  |
        | (async)  |   | (files/  |   | Scheduler    |
        +----------+   |  export) |   | (cron jobs + |
                       +----------+   | reconcile)   |
                             |        +--------------+
                             v
                       +----------+
                       |  Athena  |  (serverless BI over S3 —
                       +----------+   add later, when needed)
```

See `stats-and-scaling-strategy.md` for how stats/counters/caching keep this fast
and cheap at millions of rows.
