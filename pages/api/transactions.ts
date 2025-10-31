import { prisma } from "@/lib/prisma" // Make sure this path is correct
import type { NextApiRequest, NextApiResponse } from "next"

// fetch the user id from the headers
// TODO: Replace this with a proper authentication system.
const CURRENT_USER_ID = "u_123"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"])
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { search, categoryId } = req.query
    // Build the dynamic 'where' clause for filtering
    const where: {
      userId: string
      benefitCategoryId?: string
      OR?: Array<{
        description?: { contains: string; mode: string }
        merchant?: { name: { contains: string; mode: string } }
      }>
    } = {
      userId: CURRENT_USER_ID, // Scope to the current user
    }

    if (categoryId) {
      where.benefitCategoryId = categoryId as string
    }

    if (search) {
      const searchString = search as string
      // Filter on transaction description OR merchant name
      where.OR = [
        { description: { contains: searchString, mode: "insensitive" } },
        { merchant: { name: { contains: searchString, mode: "insensitive" } } },
      ]
    }

    const transactions = await prisma.transaction.findMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: where as any,
      include: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        merchant: { select: { name: true } }, // Include merchant name
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        benefitCategory: { select: { name: true } }, // Include category name
      },
      orderBy: { date: "desc" },
    })

    return res.status(200).json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
