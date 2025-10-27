import { beforeAll, afterEach, afterAll, describe, it, expect } from "vitest"
import { server } from "./mocks/server"

// Start MSW
beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("GET /transactions", () => {
  it("returns a list of transactions", async () => {
    const res = await fetch("http://localhost/api/transactions")
    const data = await res.json()

    expect(data).toHaveLength(2)
    expect(data[0].description).toBe("Lunch")
  })
})
