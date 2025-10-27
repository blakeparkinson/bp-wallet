import { useState } from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import axios from "axios"

export default function TransactionForm({ userId }: { userId: string }) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"DEPOSIT" | "SPEND">("DEPOSIT")
  const [currency, setCurrency] = useState("USD")
  const queryClient = useQueryClient()

  // fetch current balance so we can check overspending
  const { data } = useQuery({
    queryKey: ["summary", userId],
    queryFn: async () => {
      const resp = await axios.get(`/api/transactions?userId=${userId}`)
      const transactions = resp.data
      const total = transactions.reduce((acc, tx) => acc + tx.amount, 0)
      return { total }
    },
    refetchInterval: 5000,
  })

  const userBalance = data?.total || 0

  const mutation = useMutation({
    mutationFn: async () =>
      axios.post("/api/transactions", {
        userId,
        description,
        amount: Number(amount),
        type,
        currency, // 👈 include currency in request
      }),
    onSuccess: () => {
      // invalidate to update all data immediately
      queryClient.invalidateQueries({ queryKey: ["summary", userId] })
      queryClient.invalidateQueries({ queryKey: ["transactions", userId] })
      setDescription("")
      setAmount("")
      setCurrency("USD")
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (type === "SPEND" && Number(amount) > userBalance) {
          alert("⚠️ Insufficient balance!")
          return
        }
        mutation.mutate()
      }}
      className="bg-white p-6 shadow-card rounded-xl mb-6 space-y-4 max-w-md mx-auto"
    >
      <div className="flex space-x-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "DEPOSIT" | "SPEND")}
          className="border border-gray-200 rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-primary"
        >
          <option value="DEPOSIT">Deposit</option>
          <option value="SPEND">Spend</option>
        </select>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div className="flex space-x-2">
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary"
          required
        />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="CAD">CAD</option>
          <option value="JPY">JPY</option>
          <option value="AUD">AUD</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={type === "SPEND" && Number(amount) > userBalance}
        className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {mutation.isPending
          ? "Processing..."
          : type === "DEPOSIT"
          ? "Add Funds"
          : "Spend"}
      </button>
    </form>
  )
}
