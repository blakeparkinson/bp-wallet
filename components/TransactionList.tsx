interface Transaction {
  id: string
  description: string
  amount: number          // always stored in USD (ledger)
  originalAmount: number  // user-input amount before conversion
  originalCurrency: string
  date: string
}

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const transactionsWithBalance: (Transaction & { runningBalance: number })[] = sortedTransactions.reduce(
    (acc, tx) => {
      const previousBalance = acc.length > 0 ? acc[acc.length - 1].runningBalance : 0
      acc.push({ ...tx, runningBalance: previousBalance + tx.amount })
      return acc
    },
    [] as (Transaction & { runningBalance: number })[]  
  )


  return (
    <div className="space-y-3 max-w-md mx-auto">
      {transactionsWithBalance.map((tx) => (
        <div
          key={tx.id}
          className={`p-4 rounded-xl flex justify-between items-center shadow-card border ${
            tx.amount >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex flex-col">
            <span className="font-medium">{tx.description}</span>
            <span className="text-xs text-text-secondary">
              {new Date(tx.date).toLocaleDateString()}
            </span>
            {/* Show the original amount and currency if not USD */}
            {tx.originalCurrency !== "USD" && (
              <span className="text-xs text-gray-500">
                ({tx.originalCurrency} {tx.originalAmount.toFixed(2)})
              </span>
            )}
          </div>

          <div className="flex flex-col items-end">
            <span
              className={`font-semibold ${
                tx.amount >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {tx.amount >= 0 ? "+" : "-"}${Math.abs(tx.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            {/* Optional: show running balance */}
            <span className="text-xs text-gray-500">
              Bal: ${tx.runningBalance.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
