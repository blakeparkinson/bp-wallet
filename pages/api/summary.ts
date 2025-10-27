import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.query.userId as string

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { transactions: { orderBy: { date: "desc" } } },
  })

  if (!user) return res.status(404).json({ error: "User not found" })

  const total = user.balance
  const count = user.transactions.length
  const avg =
    count > 0
      ? Math.abs(user.transactions.reduce((sum, t) => sum + t.amount, 0)) /
        count
      : 0

  res.json({ total, count, avg, transactions: user.transactions })
}
