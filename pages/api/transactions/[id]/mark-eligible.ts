import { prisma } from "@/lib/prisma" // Make sure this path is correct
import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "@prisma/client" // Import main Prisma object and enum

// Per the spec, we scope data to a single user (authorization stub)
const CURRENT_USER_ID = "u_123"

enum TransactionStatus {
  PENDING = "PENDING",
  ELIGIBLE = "ELIGIBLE",
  DECLINED = "DECLINED",
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { id } = req.query // This is the transaction ID from the URL

    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid transaction ID" })
    }

    // Use a database transaction to ensure this either all succeeds or all fails
    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // 1. Find the transaction, ensuring it belongs to the current user
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const transaction = await tx.transaction.findFirst({
          where: { id: id, userId: CURRENT_USER_ID },
        })

        if (!transaction) {
          throw new Error("Transaction not found") // 404
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (transaction.status !== TransactionStatus.PENDING) {
          throw new Error("Transaction is not pending") // 400
        }

        // 2. Find the user's specific balance for this benefit category
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const balance = await tx.balance.findFirst({
          where: {
            userId: CURRENT_USER_ID,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            benefitCategoryId: transaction.benefitCategoryId,
          },
        })

        if (!balance) {
          console.log("Benefit balance not found")
          throw new Error("Benefit balance not found") // 404
        }

        // 3. 🛡️ ENFORCE THE BUDGET RULE 🛡️
        if (balance.remainingBalance < transaction.amount) {
          console.log("Insufficient funds")
          throw new Error("Insufficient funds") // 400
        }

        // 4. If rule passes, update the balance
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const updatedBalance = await tx.balance.update({
          where: { id: balance.id },
          data: {
            remainingBalance: balance.remainingBalance - transaction.amount,
          },
        })

        // 5. Update the transaction status
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        await tx.transaction.update({
          where: { id: transaction.id },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          data: { status: TransactionStatus.ELIGIBLE },
        })

        // 6. Return the newly updated balance to the frontend
        return updatedBalance
      }
    )

    // Success!
    return res
      .status(200)
      .json({ newRemainingBalance: result.remainingBalance })
  } catch (error: unknown) {
    // Handle specific errors thrown from inside the transaction
    if (error instanceof Error) {
      if (error.message === "Transaction not found") {
        return res.status(404).json({ error: error.message })
      }
      if (error.message === "Benefit balance not found") {
        return res.status(404).json({ error: error.message })
      }
      if (error.message === "Insufficient funds") {
        return res.status(400).json({ error: error.message })
      }
      if (error.message === "Transaction is not pending") {
        return res.status(400).json({ error: error.message })
      }
    }

    // Generic server error
    console.error("Error marking transaction eligible:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
