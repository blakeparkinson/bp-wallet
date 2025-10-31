import { motion, AnimatePresence } from "framer-motion"
import MarkEligibleButton from "./MarkEligibleButton"

interface TransactionDetailProps {
  transaction: {
    id: string
    amount: number
    status: string
    date?: string
    merchant?: { name: string }
    benefitCategory?: { name: string }
  } | null
  onClose: () => void
}

export default function TransactionDetail({ transaction, onClose }: TransactionDetailProps) {
  if (!transaction) return null

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key="modal"
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {transaction.merchant?.name || "Unknown Merchant"}
            </h2>
            <p className="text-sm text-gray-500">
              {transaction.benefitCategory?.name} •{" "}
              {new Date(transaction.date || "").toLocaleDateString()}
            </p>

            <p className="text-3xl font-bold text-primary">
              ${(transaction.amount / 100).toFixed(2)}
            </p>

            <div className="mt-4">
              <span className="text-sm font-medium text-gray-600">Status:</span>{" "}
              <span
                className={`font-semibold ${
                  transaction.status === "ELIGIBLE"
                    ? "text-green-600"
                    : "text-gray-800"
                }`}
              >
                {transaction.status}
              </span>
            </div>

            <div className="mt-6">
              {transaction.status !== "ELIGIBLE" && (
                <MarkEligibleButton
                  transactionId={transaction.id}
                  status={transaction.status}
                />
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
