
interface BalanceSummaryProps {
  transactions: { amount: number }[]
}

export default function BalanceSummary({ transactions }: BalanceSummaryProps) {
  const total = transactions.reduce((acc, tx) => acc + tx.amount, 0)
  const count = transactions.length
  const avg = count > 0 ? total / count : 0

  return (
    <div className="relative bg-gradient-to-tr from-primary via-indigo-600 to-purple-700 text-white p-6 rounded-3xl shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.03]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_60%)]"></div>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>

      <div className="relative flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-10 h-8 bg-brandRed rounded-sm"></div>
          <div className="text-xs font-semibold tracking-wider uppercase opacity-80">Benepass</div>
        </div>

        <div>
          <p className="text-sm uppercase tracking-widest opacity-80">Total Balance</p>
          <p className="text-4xl font-bold">
            ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex justify-between text-sm opacity-90">
          <span>{count} transactions</span>
          Avg: ${avg ? avg.toFixed(2) : "0.00"}
          </div>

        <div className="mt-6 text-xs opacity-70 tracking-[0.3em]">**** **** **** 1234</div>
      </div>
    </div>
  )
}
