import { motion } from "framer-motion"
import MarkEligibleButton from "./MarkEligibleButton"
import TransactionDetail from "./TransactionDetail"
import { useState } from "react"

interface Transaction {
  id: string
  date: string
  merchant?: { name: string }
  amount: number
  status: string
}

interface Balance {
  id: string
  name: string
}

interface TransactionListProps {
  transactions: Transaction[]
  balances: Balance[]
  search: string
  setSearch: (search: string) => void
  categoryId: string
  setCategoryId: (categoryId: string) => void
  isLoading: boolean
}

export default function TransactionList({
  transactions,
  balances,
  search,
  setSearch,
  categoryId,
  setCategoryId,
  isLoading,
}: TransactionListProps) {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  return (
    <div className="space-y-4">

      {/* Filters */}
      <div className="flex gap-3">
        <input
          className="flex-1 border rounded-md px-3 py-2"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-md px-3 py-2"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All Categories</option>
          {balances?.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="border p-4 rounded-lg shadow-card bg-orange-50 text-orange-700 font-bold"
              animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatType: "loop", delay: i * 0.2 }}
            >
              👻 Spooky Transaction Loading… 👻
            </motion.div>
          ))}
        </div>
      ) : transactions?.length === 0 ? (
        <p className="text-gray-500">No transactions found</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => setSelectedTx(tx)}
              className="flex justify-between items-center border p-4 rounded-lg shadow-card hover:bg-gray-50 cursor-pointer"
            >
              <div>
                <p className="font-medium">{tx.merchant?.name}</p>
                <p className="text-sm text-gray-600">
                  ${(tx.amount / 100).toFixed(2)} • {tx.status}
                </p>
              </div>
              {tx.status.toLowerCase() !== "eligible" && (
                <div
                onClick={(e) => e.stopPropagation()} 
              >
                <MarkEligibleButton transactionId={tx.id} status={tx.status} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

<TransactionDetail transaction={selectedTx} onClose={() => setSelectedTx(null)} />
</div>
  )
}
