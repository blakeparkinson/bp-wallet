// vitest.setup.ts
import { beforeAll, afterAll, afterEach } from "vitest"

if (typeof window === "undefined") {
  // Node environment
  const { server } = await import("./tests/mocks/server")
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
}
