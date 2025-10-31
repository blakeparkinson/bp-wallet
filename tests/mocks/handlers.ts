import { http, HttpResponse } from "msw"

// 🧾 Mock Transactions
const mockTransactions = [
  {
    id: "t_1",
    description: "Gym Membership",
    amount: 5000,
    status: "PENDING",
    merchant: { name: "Planet Fitness" },
    benefitCategoryId: "c_wellness",
    benefitCategory: { name: "Wellness" },
  },
  {
    id: "t_2",
    description: "Bus Pass",
    amount: 2500,
    status: "PENDING",
    merchant: { name: "Metro Transit" },
    benefitCategoryId: "c_commuter",
    benefitCategory: { name: "Commuter" },
  },
  {
    id: "t_3",
    description: "Desk Lamp",
    amount: 48000,
    status: "PENDING",
    merchant: { name: "IKEA" },
    benefitCategoryId: "c_wfh",
    benefitCategory: { name: "Work From Home" },
  },
]

// 💰 Mock Balances
const mockBalances = [
  {
    id: "c_wellness",
    name: "Wellness",
    annualBalance: 60000,
    remainingBalance: 55000,
  },
  {
    id: "c_commuter",
    name: "Commuter",
    annualBalance: 120000,
    remainingBalance: 117500,
  },
  {
    id: "c_wfh",
    name: "Work From Home",
    annualBalance: 50000,
    remainingBalance: 42000,
  },
]

export const handlers = [
  // 🧾 GET /api/transactions (supports ?search & ?categoryId)
  http.get("http://localhost/api/transactions", ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get("search")?.toLowerCase()
    const categoryId = url.searchParams.get("categoryId")

    let filtered = mockTransactions

    if (categoryId) {
      filtered = filtered.filter((t) => t.benefitCategoryId === categoryId)
    }

    if (search) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(search) ||
          t.merchant.name.toLowerCase().includes(search)
      )
    }

    return HttpResponse.json(filtered)
  }),

  // 💰 GET /api/balances
  http.get("http://localhost/api/balances", () => {
    return HttpResponse.json(mockBalances)
  }),

  // 🪄 POST /api/transactions/:id/mark-eligible
  http.post(
    "http://localhost/api/transactions/:id/mark-eligible",
    ({ params }) => {
      const { id } = params
      const tx = mockTransactions.find((t) => t.id === id)
      if (!tx)
        return HttpResponse.json(
          { error: "Transaction not found" },
          { status: 404 }
        )

      const balance = mockBalances.find((b) => b.id === tx.benefitCategoryId)
      if (!balance)
        return HttpResponse.json(
          { error: "Benefit balance not found" },
          { status: 404 }
        )

      if (balance.remainingBalance < tx.amount)
        return HttpResponse.json(
          { error: "Insufficient funds" },
          { status: 400 }
        )

      // Update both balance and transaction
      balance.remainingBalance -= tx.amount
      tx.status = "ELIGIBLE"

      return HttpResponse.json({
        newRemainingBalance: balance.remainingBalance,
      })
    }
  ),
]
