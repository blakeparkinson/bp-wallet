import { beforeAll, afterEach, afterAll, describe, it, expect } from "vitest"
import { server } from "./mocks/server"
beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Benepass API mocks", () => {
  it("returns balances for the user", async () => {
    const res = await fetch("http://localhost/api/balances")
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(3)
    expect(data[0]).toHaveProperty("annualBalance")
    expect(data[0]).toHaveProperty("remainingBalance")
  })

  it("returns transactions with merchants and categories", async () => {
    const res = await fetch("http://localhost/api/transactions")
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(3)
    expect(data[0].merchant.name).toBe("Planet Fitness")
    expect(data[1].benefitCategory.name).toBe("Commuter")
  })

  it("filters transactions by search", async () => {
    const res = await fetch("http://localhost/api/transactions?search=bus")
    const data = await res.json()

    expect(data).toHaveLength(1)
    expect(data[0].description).toBe("Bus Pass")
  })

  it("filters transactions by categoryId", async () => {
    const res = await fetch(
      "http://localhost/api/transactions?categoryId=c_wfh"
    )
    const data = await res.json()

    expect(data).toHaveLength(1)
    expect(data[0].merchant.name).toBe("IKEA")
  })

  it("marks a transaction as eligible and updates balance", async () => {
    const res = await fetch(
      "http://localhost/api/transactions/t_1/mark-eligible",
      {
        method: "POST",
      }
    )
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.newRemainingBalance).toBe(50000) // 55000 - 5000
  })

  it("returns 400 if insufficient funds", async () => {
    const res = await fetch(
      "http://localhost/api/transactions/t_3/mark-eligible",
      {
        method: "POST",
      }
    )
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe("Insufficient funds")
  })
})
