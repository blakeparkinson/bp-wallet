import { prisma } from "@/lib/prisma" // Make sure this path is correct
import type { NextApiRequest, NextApiResponse } from "next"

// TODO: Replace this with a proper authentication system.
// fetch the user id from the headers
const CURRENT_USER_ID = "u_123"
// Define an explicit type for the object returned by the prisma query
type BalanceWithCategory = {
  benefitCategory: {
    name: string
    annualBalance: number
    id: string
  }
  remainingBalance: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"])
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    // 1. Fetch the user's balances
    // 2. Include the related benefit category to get its name and annualBalance
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const balances = await prisma.balance.findMany({
      where: { userId: CURRENT_USER_ID },
      include: {
        benefitCategory: {
          select: { name: true, annualBalance: true, id: true },
        },
      },
    })

    // 3. Format the data to match the requirements
    const formattedBalances = balances.map((b: BalanceWithCategory) => ({
      id: b.benefitCategory.id,
      name: b.benefitCategory.name,
      annualBalance: b.benefitCategory.annualBalance,
      remainingBalance: b.remainingBalance,
    }))

    return res.status(200).json(formattedBalances)
  } catch (error) {
    console.error("Error fetching balances:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
