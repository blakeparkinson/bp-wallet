import BalanceSummary from "@/components/BalanceSummary"
import TransactionList from "@/components/TransactionList"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"

const USER_ID = "u_123"

export default function Home() {
  const { data: balances, isLoading: balancesLoading } = useQuery({
    queryKey: ["balances", USER_ID],
    queryFn: async () => {
      const res = await axios.get(`/api/balances`)
      return res.data
    },
  })

  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState("")

  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ["transactions", search, categoryId],
    queryFn: async () => {
      const res = await axios.get(`/api/transactions`, {
        params: {
          search: search || undefined,
          categoryId: categoryId || undefined,
        },
      })
      return res.data
    },
  })

  return (
    <div className="space-y-8 p-6">
      <BalanceSummary balances={balances} isLoading={balancesLoading} />
      <TransactionList
        transactions={transactions}
        balances={balances}
        search={search}
        setSearch={setSearch}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        isLoading={txLoading}
      />
    </div>
  )
}
