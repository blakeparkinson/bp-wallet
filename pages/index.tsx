import BalanceSummary from "@/components/BalanceSummary"
import TransactionForm from "@/components/TransactionForm"
import TransactionList from "@/components/TransactionList"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const USER_ID = "cmh990d030000ri57nbm2en51" // replace with actual user/session ID

export default function Home() {
   // Shared transactions query
   const { data: transactions, isLoading, isError, refetch } = useQuery({
    queryKey: ["transactions", USER_ID],
    queryFn: async () => {
      const resp = await axios.get(`/api/transactions?userId=${USER_ID}`)
      return resp.data
    },
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error loading transactions.</p>
  return (
    <div className="space-y-8 p-6">
      <BalanceSummary transactions={transactions} />
      <TransactionForm userId={USER_ID} />
      <TransactionList transactions={transactions} />
    </div>
  )
}
