"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DashboardAnalyticsProps {
  transactions: any[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export default function DashboardAnalytics({
  transactions,
  selectedCategory,
  onCategoryChange,
}: DashboardAnalyticsProps) {
  // Categories for filtering
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Food", label: "Food & Groceries" },
    { value: "Housing", label: "Housing & Rent" },
    { value: "Transportation", label: "Transportation" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Utilities", label: "Utilities" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Shopping", label: "Shopping" },
    { value: "Travel", label: "Travel" },
    { value: "Education", label: "Education" },
    { value: "Other", label: "Other" },
  ]

  // Prepare data for spending by category chart
  const getSpendingByCategoryData = () => {
    // Only include expenses (negative amounts)
    const expenses = transactions.filter((t) => t.amount < 0)

    // Filter by category if needed
    const filteredExpenses =
      selectedCategory !== "all" ? expenses.filter((t) => t.category === selectedCategory) : expenses

    // Group by category and sum amounts
    const categoryMap = new Map()

    filteredExpenses.forEach((transaction) => {
      const category = transaction.category
      const amount = Math.abs(transaction.amount)

      if (categoryMap.has(category)) {
        categoryMap.set(category, categoryMap.get(category) + amount)
      } else {
        categoryMap.set(category, amount)
      }
    })

    // Convert to array of objects for chart
    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      name: category,
      value: amount,
    }))
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Get data for chart
  const spendingByCategoryData = getSpendingByCategoryData()

  // Calculate total spending
  const totalSpending = spendingByCategoryData.reduce((total, item) => total + item.value, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Breakdown of your expenses by category.</CardDescription>
          </div>
          <div className="w-full sm:w-[180px]">
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] overflow-auto">
          {spendingByCategoryData.length > 0 ? (
            <div className="space-y-4">
              {spendingByCategoryData.map((item, index) => {
                const percentage = Math.round((item.value / totalSpending) * 100)
                return (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span>
                        {formatCurrency(item.value)} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">No data available for the selected category.</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

