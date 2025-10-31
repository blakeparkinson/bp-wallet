import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { motion } from "framer-motion"

export default function MarkEligibleButton({ 
  transactionId, 
  status, 
  onSuccess 
}: { 
  transactionId: string | number
  status: string
  onSuccess?: () => void 
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => axios.post(`/api/transactions/${transactionId}/mark-eligible`),

    // Optimistic UI
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] })
      const previousTransactions = queryClient.getQueryData(["transactions"])

      // Optimistically update transactions
      queryClient.setQueryData(["transactions"], (old: any = []) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        old.map((tx: any) =>
          tx.id === transactionId ? { ...tx, status: "eligible" } : tx
        )
      )

      // Optionally adjust balances
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tx = (previousTransactions as any[])?.find((t) => t.id === transactionId)
      if (tx) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryClient.setQueryData(["balances"], (old: any = []) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          old.map((b: any) =>
            b.id === tx.categoryId
              ? {
                  ...b,
                  remainingBalance: Math.max(b.remainingBalance - tx.amount, 0),
                }
              : b
          )
        )
      }

      return { previousTransactions }
    },

    onError: (err, _vars, context) => {
      // Rollback on error
      if (context?.previousTransactions)
        queryClient.setQueryData(["transactions"], context.previousTransactions)

      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Error marking eligible"
      alert(message)
    },

    onSettled: () => {
      // ✅ Re-sync both for correctness
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["balances"] })
      onSuccess?.()
    },
  })

  if (status === "eligible")
    return <span className="text-green-600 font-semibold text-sm">Eligible ✓</span>

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      onClick={() => mutation.mutate()}
      className="px-3 py-1 rounded-md bg-primary text-white hover:opacity-90 disabled:opacity-60 cursor-pointer"
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Processing..." : "Mark Eligible"}
    </motion.button>
  )
}
