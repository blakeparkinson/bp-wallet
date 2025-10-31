import { motion } from "framer-motion"

interface BalanceSummaryProps {
  balances: { id: string; name: string; annualBalance: number; remainingBalance: number }[]
  isLoading: boolean
}

export default function BalanceSummary({ balances, isLoading }: BalanceSummaryProps) {
  const totalRemaining = balances?.reduce((acc, b) => acc + b.remainingBalance, 0)
  if (isLoading) {
    return (
      <div className="relative bg-gradient-to-tr from-primary via-indigo-600 to-purple-700 text-white p-6 rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      </div>
    )
  }

  return (
      <div className="relative bg-gradient-to-tr from-primary via-indigo-600 to-purple-700 text-white p-6 rounded-3xl shadow-2xl overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />

      {/* Soft glowing pumpkins behind text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none"
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.05, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative flex gap-6">
          <div className="relative">
            <span className="text-5xl">🎃</span>
            <div className="absolute inset-0 blur-2xl bg-[#FFB347]/40 rounded-full" />
          </div>
          <div className="relative">
            <span className="text-5xl">🎃</span>
            <div className="absolute inset-0 blur-2xl bg-[#E53935]/30 rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* Card Content */}
      <div className="relative z-10 flex flex-col space-y-4">
        {/* Brand Row */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-8 bg-brandRed rounded-sm" />
          <span className="text-xs font-semibold tracking-wider uppercase opacity-80">
            Benepass
          </span>
        </div>

        {/* Total */}
        <div>
          <p className="text-sm uppercase tracking-widest opacity-80">
            Total Remaining
          </p>
          <p className="text-4xl font-bold">
            ${ (totalRemaining / 100).toLocaleString(undefined, { minimumFractionDigits: 2 }) }
          </p>
        </div>

        {/* ✅ Category balances with progress bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mt-3">
          {balances?.map((b) => {
            const used = b.annualBalance - b.remainingBalance
            const percentUsed = (used / b.annualBalance) * 100

            return (
              <div
                key={b.id}
                className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 flex flex-col shadow-sm"
              >
                <div className="flex justify-between text-xs opacity-90 mb-1">
                  <span className="font-medium">{b.name}</span>
                  <span>{percentUsed.toFixed(0)}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-1">
                  <motion.div
                    className="h-full bg-[#FFB347] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentUsed}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-xs opacity-90">
                  <span>Annual: ${ (b.annualBalance / 100).toFixed(2) }</span>
                  <span>Remaining: ${ (b.remainingBalance / 100).toFixed(2) }</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Card Number */}
        <div className="mt-2 text-xs opacity-70 tracking-[0.3em]">
          **** **** **** 1234
        </div>
      </div>
    </div>
  )
}
