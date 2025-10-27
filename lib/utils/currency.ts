import axios from "axios"

interface ExchangeRates {
  [key: string]: number
}

let cachedRates: ExchangeRates | null = null
let lastFetched: number = 0

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<number> {
  if (from === to) return amount

  // cache rates for 1 hour
  if (!cachedRates || Date.now() - lastFetched > 60 * 60 * 1000) {
    const res = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    )
    cachedRates = res.data.rates
    lastFetched = Date.now()
  }

  if (!cachedRates) {
    throw new Error("Exchange rates not available")
  }

  if (!cachedRates || !cachedRates[from] || !cachedRates[to]) {
    throw new Error(`Unsupported currency: ${from} or ${to}`)
  }

  if (from === "USD") return amount * cachedRates[to]
  if (to === "USD" && cachedRates) return amount / cachedRates[from]

  // convert via USD

  const inUSD = amount / cachedRates[from]
  return inUSD * cachedRates[to]
}
