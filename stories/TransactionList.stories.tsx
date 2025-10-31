import type { Meta, StoryObj } from "@storybook/react"
import TransactionList from "@/components/TransactionList"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const meta: Meta<typeof TransactionList> = {
  title: "Finance/TransactionList",
  component: TransactionList,
  decorators: [
    (Story) => {
      const queryClient = new QueryClient()
      return (
        <QueryClientProvider client={queryClient}>
          <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
            <Story />
          </div>
        </QueryClientProvider>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof TransactionList>

// ✅ Default (realistic mock data)
export const Default: Story = {
  args: {
    transactions: [
      {
        id: "t_1",
        amount: 5000,
        date: new Date().toISOString(),
        status: "PENDING",
        merchant: { name: "Planet Fitness" },
      },
      {
        id: "t_2",
        amount: 2500,
        date: new Date().toISOString(),
        status: "ELIGIBLE",
        merchant: { name: "Metro Transit" },
      },
      {
        id: "t_3",
        amount: 8000,
        date: new Date().toISOString(),
        status: "PENDING",
        merchant: { name: "IKEA" },
      },
    ],
    balances: [
      { id: "c_wellness", name: "Wellness" },
      { id: "c_commuter", name: "Commuter" },
      { id: "c_wfh", name: "Work From Home" },
    ],
    search: "",
    setSearch: () => {},
    categoryId: "",
    setCategoryId: () => {},
    isLoading: false,
  },
}

// 🕸️ Empty State
export const Empty: Story = {
  args: {
    transactions: [],
    balances: [],
    search: "",
    setSearch: () => {},
    categoryId: "",
    setCategoryId: () => {},
    isLoading: false,
  },
}

// ⏳ Loading State
export const Loading: Story = {
  args: {
    transactions: [],
    balances: [],
    search: "",
    setSearch: () => {},
    categoryId: "",
    setCategoryId: () => {},
    isLoading: true,
  },
}
