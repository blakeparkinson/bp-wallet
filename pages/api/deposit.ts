import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end()

  const { userId, amount, description } = req.body
  if (!userId || !amount)
    return res.status(400).json({ error: "Missing params" })

  const tx = await prisma.transaction.create({
    data: {
      description: description || "Deposit",
      amount: Number(amount),
      type: "DEPOSIT",
      userId,
    },
  })

  const user = await prisma.user.update({
    where: { id: userId },
    data: { balance: { increment: Number(amount) } },
  })

  res.status(201).json({ transaction: tx, balance: user.balance })
}
