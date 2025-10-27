import type { Meta, StoryObj } from "@storybook/react"
import TransactionForm from "@/components/TransactionForm"

const meta: Meta<typeof TransactionForm> = {
  title: "Finance/TransactionForm",
  component: TransactionForm,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof TransactionForm>

export const Default: Story = {
  args: {
    userId: "user-123",
  },
}

export const LoadingState: Story = {
  render: () => (
    <div className="opacity-50 pointer-events-none">
      <TransactionForm userId="user-123" />
      <p className="text-center text-sm text-gray-500 mt-2">Submitting...</p>
    </div>
  ),
}
