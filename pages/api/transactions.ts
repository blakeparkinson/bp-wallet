import { prisma } from "@/lib/prisma"
import { convertCurrency } from "@/lib/utils/currency"

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query
    if (!userId) return res.status(400).json({ error: "Missing userId" })

    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      include: { transactions: { orderBy: { date: "desc" } } },
    })

    if (!user) return res.status(404).json({ error: "User not found" })

    return res.json(user.transactions)
  }

  if (req.method === "POST") {
    const { userId, amount, description, type, currency = "USD" } = req.body

    if (!userId || !amount || !description || !type) {
      return res.status(400).json({ error: "Missing fields" })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.status(404).json({ error: "User not found" })

    console.log("user", user)

    // 💱 Convert to USD if needed (ledger stays in USD)
    const amountInUSD =
      currency === "USD"
        ? amount
        : await convertCurrency(amount, currency, "USD")

    // 💸 Prevent overspending (based on USD balance)
    if (type === "SPEND" && amountInUSD > user.balance) {
      return res.status(400).json({ error: "Insufficient balance" })
    }

    // 💾 Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount: type === "SPEND" ? -amountInUSD : amountInUSD, // always store in USD
        originalAmount: amount,
        originalCurrency: currency,
        type,
        userId,
      },
    })

    // 🧮 Update user balance in USD
    const updatedBalance =
      user.balance + (type === "SPEND" ? -amountInUSD : amountInUSD)

    await prisma.user.update({
      where: { id: userId },
      data: { balance: updatedBalance },
    })

    return res.status(201).json(transaction)
  }

  return res.status(405).json({ error: "Method not allowed" })
}
