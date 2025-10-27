// vitest.setup.ts
import { beforeAll, afterAll, afterEach } from "vitest"

if (typeof window === "undefined") {
  // Node environment
  const { server } = await import("./tests/mocks/server")
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
} else {
  // Browser environment (Storybook, etc.)
  const { worker } = await import("./tests/mocks/browser")
  beforeAll(async () => {
    await worker.start({ onUnhandledRequest: "bypass" })
  })
}
