# 🧭 Technical Approach (Design Doc)

## 🎯 Objectives & Scope

### ✅ Within 1–3 hours, I implemented

A full-stack mini Benefits Wallet app with:

- **View benefit category balances** (annual & remaining)
- **Browse and filter transactions** by search term and category
- **Mark transactions as eligible** (enforcing the budget rule)
- **Update balances immediately** via optimistic UI and backend enforcement
- **A clean responsive frontend** built with Next.js, TailwindCSS, and React Query
- **A backend** using Next.js API routes + Prisma, scoped to a stubbed current user (`u_123`)
- **Loading, empty, and error states** across all views

### 🚫 Intentionally Skipped

- Real authentication and multi-user logic (replaced with static stub)
- Complex history tracking (no claim timeline or audit trail)
- Full UI/e2e tests (used lightweight MSW mocks for API)
- Advanced mobile polish and accessibility testing (timeboxed)

---

## 🧩 Data Model

### Entities & Relationships

- **User** (1) — has many → Balances, Transactions
- **BenefitCategory** (1) — has many → Balances, Transactions
- **Merchant** (1) — has many → Transactions
- **Transaction** — belongs to User, Merchant, and BenefitCategory

### 🧮 Key Fields

| Entity           | Field              | Type                                     | Notes                      |
| ---------------- | ------------------ | ---------------------------------------- | -------------------------- |
| **Balance**      | `annualBalance`    | integer                                  | Annual allocation in cents |
| **Balance**      | `remainingBalance` | integer                                  | Must be ≥ 0                |
| **Transaction**  | `amount`           | integer                                  | Stored in cents (USD)      |
| **Transaction**  | `status`           | enum(`PENDING`, `ELIGIBLE`, `DECLINED`)  |                            |
| **Transaction**  | `benefitCategoryId`| FK                                       | Enforces spending rule     |
| **Merchant**     | `name`             | string                                   | Indexed for search         |

---

## 🌐 API Surface

| Endpoint                               | Method   | Description                                                          |
| -------------------------------------- | -------- | -------------------------------------------------------------------- |
| `/api/balances`                        | **GET**  | Returns user's balances with annual & remaining                      |
| `/api/transactions`                    | **GET**  | Lists user's transactions; supports `search` & `categoryId` filters  |
| `/api/transactions/:id/mark-eligible`  | **POST** | Applies eligibility + budget rule, updates balances                  |

### 📤 Example Response

**GET** `/api/balances`

```json
[
  {
    "id": "c_commuter",
    "name": "Commuter",
    "annualBalance": 120000,
    "remainingBalance": 100000
  }
]
```

### 💰 Budget Rule

- If `remainingBalance >= transaction.amount`, mark eligible and deduct
- Otherwise return `400 { "error": "Insufficient funds" }`

### 🔐 Auth Stub

All endpoints use `const CURRENT_USER_ID = "u_123"` (no client userId allowed).

---

## ⚙️ Backend Design

### Layers

- **Routing**: Next.js API routes
- **Business Logic**: Prisma service per endpoint
- **Data Access**: Prisma ORM (Postgres/supabase)
- **Testing**: Vitest + MSW mocks for API integration

### Concurrency Handling

Balance updates use `prisma.$transaction()` to ensure atomicity when multiple claims modify the same category simultaneously.

---

## 💻 Frontend Design

### Structure

```
/ → Main Wallet Page
├── <BalanceSummary />     – card summary with category balances
├── <TransactionList />    – searchable list + mark-eligible buttons
└── <TransactionDetail />  – modal for transaction details
```

### State Management

- **React Query** for fetching, caching, and optimistic updates
- **Optimistic mutation** on "Mark Eligible" gives instant feedback and rollback on error

### UI / UX

- Responsive layout via **TailwindCSS**
- **Framer Motion** for smooth animations
- Clear **loading, error, and empty states**
- Accessible color contrast & focus styles (partially implemented)

---

## ⚖️ Tradeoffs & Risks

### Cuts

- Full authentication & sessions (stubbed)
- Pagination (used `findMany` without limits)
- Detailed benefit history or timeline views
- Originally was going to make a django app but went with next.js for speed

### Alternatives Considered

- Could use **tRPC** for end-to-end type safety
- Could implement **WebSocket** push for real-time balance updates
- Skipped to stay within 3-hour timebox and maintain clarity

---

## 🚀 If I Had More Time

| Area                      | Next Steps                                             |
| ------------------------- | ------------------------------------------------------ |
| **Auth & Security**       | Real JWT sessions, per-user scoping, row-level access  |
| **Observability**         | Logging, metrics, tracing with OpenTelemetry           |
| **Caching**               | Redis caching for hot `/balances` reads                |
| **Internationalization**  | Multi-currency conversions and localization            |
| **Testing & CI/CD**       | Add Playwright e2e + GitHub Actions                    |
| **UX Polish**             | Animated transitions, a11y audit, keyboard shortcuts   |
| **Elastic Search**        | Current searching isn't scalable


## Scaling Prompt Response — Scaling to 1 Million Users

At one million users, the current Next.js + Prisma monolith would face serious scaling bottlenecks — mainly from serverless cold starts, limited database connections, and shared execution environments. While Next.js excels for rapid iteration and full-stack development, it’s not ideal for a backend handling high-frequency transactional updates.

To evolve, We'd move toward a service-oriented architecture, keeping Next.js for the frontend and lightweight API aggregation, while extracting transaction and balance logic into dedicated backend services deployed on Kubernetes. These would be split into read and write microservices, each optimized for its access pattern:

Write service enforces the budget rule, updates ledgers, and emits domain events.

Read service serves cached and denormalized balance/transaction data for fast queries.

An API gateway would sit in front to route traffic, handle authentication, rate limiting, and aggregation. Services would communicate asynchronously via a message bus (e.g., Pub/Sub or Kafka) to ensure scalability and resilience.

The database would evolve into a sharded Postgres setup with optimistic concurrency control and idempotent balance updates to guarantee correctness. Frequently accessed data like /balances would be cached in Redis, while analytics workloads hit read replicas.

Reliability would come from structured logging, distributed tracing (OpenTelemetry), and performance tracking (Sentry, Datadog). React Query would still manage client-side caching, but all data fetching would go through the API gateway to reduce coupling.

This hybrid model keeps Next.js for UI agility while enabling independently scalable, event-driven services designed for throughput, resilience, and long-term growth.
