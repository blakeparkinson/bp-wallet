import type { Meta, StoryObj } from "@storybook/react"
import TransactionList from "@/components/TransactionList"

const meta: Meta<typeof TransactionList> = {
  title: "Finance/TransactionList",
  component: TransactionList,
}

export default meta
type Story = StoryObj<typeof TransactionList>

export const Default: Story = {
  args: {
    transactions: [
      {
        id: "1",
        description: "Coffee",
        amount: -4.75,
        originalAmount: -4.75,
        originalCurrency: "USD",
        date: new Date().toISOString(),
      },
      {
        id: "2",
        description: "Salary",
        amount: 2500,
        originalAmount: 2300,
        originalCurrency: "EUR",
        date: new Date().toISOString(),
      },
      {
        id: "3",
        description: "Groceries",
        amount: -60,
        originalAmount: -100,
        originalCurrency: "CAD",
        date: new Date().toISOString(),
      },
    ],
  },
}

export const Empty: Story = {
  args: {
    transactions: [],
  },
}
