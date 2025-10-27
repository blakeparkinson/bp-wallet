// pages/api/transactions.ts (example)
import { prisma } from "@/lib/prisma"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, description, amount, type } = req.body

  if (!userId || !description || !amount || !type) {
    return res.status(400).json({ error: "Missing fields" })
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return res.status(404).json({ error: "User not found" })

  if (type === "SPEND" && user.balance < amount) {
    return res.status(400).json({ error: "Insufficient balance" })
  }

  const transaction = await prisma.transaction.create({
    data: {
      description,
      amount: type === "SPEND" ? -amount : amount,
      type,
      userId,
    },
  })

  // Update user balance
  const newBalance = user.balance + (type === "SPEND" ? -amount : amount)
  await prisma.user.update({
    where: { id: userId },
    data: { balance: newBalance },
  })

  res.status(201).json(transaction)
}
