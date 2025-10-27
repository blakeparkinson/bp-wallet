import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node", // Node environment for API tests
    include: ["tests/**/*.test.ts"], // only your API tests
  },
})
