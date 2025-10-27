import axios from "axios"

let cachedRates = null
let lastFetched = 0

export async function convertCurrency(amount, from, to) {
  if (from === to) return amount

  // cache rates for 1 hour
  if (!cachedRates || Date.now() - lastFetched > 60 * 60 * 1000) {
    const res = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    )
    cachedRates = res.data.rates
    lastFetched = Date.now()
  }

  if (!cachedRates[from] || !cachedRates[to]) {
    throw new Error(`Unsupported currency: ${from} or ${to}`)
  }

  if (from === "USD") return amount * cachedRates[to]
  if (to === "USD") return amount / cachedRates[from]

  // convert via USD
  const inUSD = amount / cachedRates[from]
  return inUSD * cachedRates[to]
}
