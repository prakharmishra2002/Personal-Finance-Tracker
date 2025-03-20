"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

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
  // Chart colors
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088fe",
    "#00c49f",
    "#ffbb28",
    "#ff8042",
    "#a4de6c",
    "#d0ed57",
  ]

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
        <div className="h-[300px]">
          {spendingByCategoryData.length > 0 ? (
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingByCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {spendingByCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltip>
                              <ChartTooltipContent>
                                <div className="font-medium">{payload[0].name}</div>
                                <div>{formatCurrency(payload[0].value as number)}</div>
                              </ChartTooltipContent>
                            </ChartTooltip>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Chart>
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

