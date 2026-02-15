"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, FileText, PieChart, BarChart, LineChart } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"

export default function ReportsPage() {
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [budgets, setBudgets] = useState<any[]>([])
  const [timeframe, setTimeframe] = useState("month")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const router = useRouter()
  const { toast } = useToast()

  // Time frame options
  const timeframes = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
    { value: "all", label: "All Time" },
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
    { value: "Income", label: "Income" },
    { value: "Salary", label: "Salary" },
    { value: "Investment", label: "Investment" },
    { value: "Other", label: "Other" },
  ]

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const authToken = localStorage.getItem("authToken")
    const currentUser = localStorage.getItem("currentUser")

    if (!authToken || !currentUser) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(currentUser))

    // Load transactions from localStorage
    const savedTransactions = localStorage.getItem(`transactions_${JSON.parse(currentUser).id}`)
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }

    // Load budgets from localStorage
    const savedBudgets = localStorage.getItem(`budgets_${JSON.parse(currentUser).id}`)
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets))
    }
  }, [router])

  // Filter transactions based on selected timeframe
  const getFilteredTransactions = () => {
    if (!transactions.length) return []

    // Filter by timeframe
    const now = new Date()
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date)

      if (timeframe === "week") {
        // Last 7 days
        const weekAgo = new Date()
        weekAgo.setDate(now.getDate() - 7)
        return transactionDate >= weekAgo
      } else if (timeframe === "month") {
        // Current month
        return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()
      } else if (timeframe === "quarter") {
        // Current quarter
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        return transactionDate >= quarterStart
      } else if (timeframe === "year") {
        // Current year
        return transactionDate.getFullYear() === now.getFullYear()
      }

      // All time
      return true
    })

    // Filter by category if needed
    if (categoryFilter !== "all") {
      return filtered.filter((t) => t.category === categoryFilter)
    }

    return filtered
  }

  // Prepare data for spending by category chart
  const getSpendingByCategoryData = () => {
    const filteredTransactions = getFilteredTransactions()

    // Only include expenses (negative amounts)
    const expenses = filteredTransactions.filter((t) => t.amount < 0)

    // Group by category and sum amounts
    const categoryMap = new Map()

    expenses.forEach((transaction) => {
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

  // Prepare data for income vs expenses chart
  const getIncomeVsExpensesData = () => {
    const filteredTransactions = getFilteredTransactions()

    // Group by month and calculate income and expenses
    const monthMap = new Map()

    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`
      const amount = transaction.amount

      if (!monthMap.has(monthYear)) {
        monthMap.set(monthYear, {
          month: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          income: 0,
          expenses: 0,
        })
      }

      const monthData = monthMap.get(monthYear)

      if (amount > 0) {
        monthData.income += amount
      } else {
        monthData.expenses += Math.abs(amount)
      }
    })

    // Convert to array and sort by date
    return Array.from(monthMap.values()).sort((a, b) => {
      const dateA = new Date(a.month)
      const dateB = new Date(b.month)
      return dateA.getTime() - dateB.getTime()
    })
  }

  // Prepare data for spending trends chart
  const getSpendingTrendsData = () => {
    const filteredTransactions = getFilteredTransactions()

    // Only include expenses (negative amounts)
    const expenses = filteredTransactions.filter((t) => t.amount < 0)

    // Group by day and sum amounts
    const dayMap = new Map()

    expenses.forEach((transaction) => {
      const date = new Date(transaction.date)
      const dayStr = date.toISOString().split("T")[0]
      const amount = Math.abs(transaction.amount)

      if (dayMap.has(dayStr)) {
        dayMap.set(dayStr, dayMap.get(dayStr) + amount)
      } else {
        dayMap.set(dayStr, amount)
      }
    })

    // Convert to array of objects for chart
    const data = Array.from(dayMap.entries()).map(([day, amount]) => ({
      date: day,
      amount: amount,
    }))

    // Sort by date
    return data.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
  }

  // Prepare data for budget vs actual chart
  const getBudgetVsActualData = () => {
    if (!budgets.length) return []

    const filteredTransactions = getFilteredTransactions()

    return budgets.map((budget) => {
      // Filter transactions by category
      const categoryTransactions = filteredTransactions.filter(
        (t) => t.category === budget.category && t.amount < 0, // Only expenses
      )

      // Calculate total spent
      const spent = categoryTransactions.reduce((total, t) => total + Math.abs(t.amount), 0)

      return {
        name: budget.category,
        budget: budget.amount,
        actual: spent,
        remaining: Math.max(0, budget.amount - spent),
      }
    })
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Calculate summary statistics
  const getSummaryStats = () => {
    const filteredTransactions = getFilteredTransactions()

    const income = filteredTransactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)

    const expenses = filteredTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const balance = income - expenses

    const largestExpense =
      filteredTransactions.filter((t) => t.amount < 0).sort((a, b) => a.amount - b.amount)[0] || null

    const largestIncome =
      filteredTransactions.filter((t) => t.amount > 0).sort((a, b) => b.amount - a.amount)[0] || null

    return {
      income,
      expenses,
      balance,
      transactionCount: filteredTransactions.length,
      largestExpense,
      largestIncome,
    }
  }

  // Generate and download PDF report
  const downloadReport = () => {
    // In a real app, this would generate a PDF
    toast({
      title: "Report download started",
      description: "Your financial report is being generated and will download shortly.",
    })

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Report downloaded",
        description: "Your financial report has been downloaded successfully.",
      })
    }, 2000)
  }

  // Get data for charts
  const spendingByCategoryData = isClient ? getSpendingByCategoryData() : []
  const incomeVsExpensesData = isClient ? getIncomeVsExpensesData() : []
  const spendingTrendsData = isClient ? getSpendingTrendsData() : []
  const budgetVsActualData = isClient ? getBudgetVsActualData() : []
  const summaryStats = isClient
    ? getSummaryStats()
    : { income: 0, expenses: 0, balance: 0, transactionCount: 0, largestExpense: null, largestIncome: null }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Financial Reports</h2>
        <Button variant="outline" onClick={downloadReport} className="w-full sm:w-auto text-xs sm:text-sm">
          <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Download Report
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
        <div className="space-y-2 flex-1">
          <Label htmlFor="timeframe" className="text-xs sm:text-sm">Time Period</Label>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger id="timeframe" className="text-xs sm:text-sm">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 flex-1">
          <Label htmlFor="category" className="text-xs sm:text-sm">Category Filter</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category" className="text-xs sm:text-sm">
              <SelectValue placeholder="Select category" />
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

      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 sm:mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-500">{formatCurrency(summaryStats.income)}</div>
            <p className="text-xs text-muted-foreground mt-1">For the selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-red-500">{formatCurrency(summaryStats.expenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">For the selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-xl sm:text-2xl font-bold ${summaryStats.balance >= 0 ? "text-green-500" : "text-red-500"}`}>
              {formatCurrency(summaryStats.balance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Income minus expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{summaryStats.transactionCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Total transactions in period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="spending" className="mt-4 sm:mt-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="spending" className="text-xs sm:text-sm py-2">
            <span className="hidden sm:inline">Spending by Category</span>
            <span className="sm:hidden">Spending</span>
          </TabsTrigger>
          <TabsTrigger value="income" className="text-xs sm:text-sm py-2">
            <span className="hidden sm:inline">Income vs Expenses</span>
            <span className="sm:hidden">Income</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-xs sm:text-sm py-2">
            <span className="hidden sm:inline">Spending Trends</span>
            <span className="sm:hidden">Trends</span>
          </TabsTrigger>
          <TabsTrigger value="budget" className="text-xs sm:text-sm py-2">
            <span className="hidden sm:inline">Budget vs Actual</span>
            <span className="sm:hidden">Budget</span>
          </TabsTrigger>
        </TabsList>

        {/* Spending by Category Chart */}
        <TabsContent value="spending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg">
                <PieChart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Spending by Category
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Breakdown of your expenses by category for the selected period.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-auto">
                {spendingByCategoryData.length > 0 ? (
                  <div className="space-y-4">
                    {spendingByCategoryData.map((item) => {
                      const totalSpending = spendingByCategoryData.reduce((sum, i) => sum + i.value, 0)
                      const percentage = Math.round((item.value / totalSpending) * 100)

                      return (
                        <div key={item.name} className="space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
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
                    <div className="text-center p-4">
                      <PieChart className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 text-base sm:text-lg font-medium">No Data Available</h3>
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                        There are no expenses in the selected period to display.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Income vs Expenses Chart */}
        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5" /> Income vs Expenses
              </CardTitle>
              <CardDescription>Comparison of your income and expenses over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-auto">
                {incomeVsExpensesData.length > 0 ? (
                  <div className="space-y-6">
                    {incomeVsExpensesData.map((item) => (
                      <div key={item.month} className="space-y-4">
                        <h3 className="font-medium">{item.month}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-green-500">Income</span>
                            <span>{formatCurrency(item.income)}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-green-500"
                              style={{
                                width: `${Math.min(100, (item.income / Math.max(item.income, item.expenses)) * 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-red-500">Expenses</span>
                            <span>{formatCurrency(item.expenses)}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-red-500"
                              style={{
                                width: `${Math.min(100, (item.expenses / Math.max(item.income, item.expenses)) * 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between text-sm font-medium">
                            <span>Balance</span>
                            <span className={item.income - item.expenses >= 0 ? "text-green-500" : "text-red-500"}>
                              {formatCurrency(item.income - item.expenses)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <BarChart className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No Data Available</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        There are no transactions in the selected period to display.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spending Trends Chart */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="mr-2 h-5 w-5" /> Spending Trends
              </CardTitle>
              <CardDescription>Your spending patterns over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-auto">
                {spendingTrendsData.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-medium border-b pb-2">
                      <span>Date</span>
                      <span>Amount</span>
                    </div>
                    {spendingTrendsData.map((item) => {
                      const date = new Date(item.date)
                      const formattedDate = date.toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })

                      // Find max amount for scaling
                      const maxAmount = Math.max(...spendingTrendsData.map((d) => d.amount))
                      const percentage = (item.amount / maxAmount) * 100

                      return (
                        <div key={item.date} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{formattedDate}</span>
                            <span>{formatCurrency(item.amount)}</span>
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
                      <LineChart className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No Data Available</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        There are no expenses in the selected period to display.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget vs Actual Chart */}
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5" /> Budget vs Actual
              </CardTitle>
              <CardDescription>Comparison of your budgeted amounts versus actual spending.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-auto">
                {budgetVsActualData.length > 0 ? (
                  <div className="space-y-6">
                    {budgetVsActualData.map((item) => {
                      const percentSpent = Math.min(100, (item.actual / item.budget) * 100)
                      const percentRemaining = Math.max(0, 100 - percentSpent)

                      return (
                        <div key={item.name} className="space-y-4">
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Budget</span>
                              <span>{formatCurrency(item.budget)}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div className="h-full w-full rounded-full bg-primary/30"></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Actual</span>
                              <span>{formatCurrency(item.actual)}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full ${percentSpent > 90 ? "bg-red-500" : "bg-primary"}`}
                                style={{ width: `${percentSpent}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Remaining</span>
                              <span>{formatCurrency(item.remaining)}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-green-500"
                                style={{ width: `${percentRemaining}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <BarChart className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No Data Available</h3>
                      <p className="mt-2 text-sm text-muted-foreground">There are no budgets set up to display.</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Financial Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" /> Financial Insights
          </CardTitle>
          <CardDescription>Key insights from your financial data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summaryStats.transactionCount > 0 ? (
              <>
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Income Summary</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your total income for this period is {formatCurrency(summaryStats.income)}.
                    {summaryStats.largestIncome && (
                      <>
                        {" "}
                        Your largest income was {formatCurrency(summaryStats.largestIncome.amount)}
                        from {summaryStats.largestIncome.description} on{" "}
                        {new Date(summaryStats.largestIncome.date).toLocaleDateString()}.
                      </>
                    )}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Expense Summary</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your total expenses for this period are {formatCurrency(summaryStats.expenses)}.
                    {summaryStats.largestExpense && (
                      <>
                        {" "}
                        Your largest expense was {formatCurrency(Math.abs(summaryStats.largestExpense.amount))}
                        for {summaryStats.largestExpense.description} on{" "}
                        {new Date(summaryStats.largestExpense.date).toLocaleDateString()}.
                      </>
                    )}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Savings Rate</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {summaryStats.income > 0 ? (
                      <>
                        Your savings rate for this period is{" "}
                        {Math.round((summaryStats.balance / summaryStats.income) * 100)}%.
                        {summaryStats.balance >= 0
                          ? ` You're saving money, which is great for your financial health!`
                          : ` You're spending more than you earn. Consider reviewing your budget.`}
                      </>
                    ) : (
                      <>No income recorded for this period, so a savings rate cannot be calculated.</>
                    )}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Recommendations</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                    {summaryStats.balance < 0 && (
                      <li>
                        Your expenses exceed your income. Consider reducing spending or finding additional income
                        sources.
                      </li>
                    )}
                    {spendingByCategoryData.length > 0 && (
                      <li>
                        Your highest spending category is {spendingByCategoryData[0].name}. Review if there are
                        opportunities to reduce expenses in this area.
                      </li>
                    )}
                    {summaryStats.income > 0 && summaryStats.balance / summaryStats.income < 0.2 && (
                      <li>
                        Your savings rate is below 20%. Financial experts recommend saving at least 20% of your income.
                      </li>
                    )}
                    {budgets.length === 0 && (
                      <li>
                        You don't have any budgets set up. Creating budgets can help you manage your spending better.
                      </li>
                    )}
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No Data Available</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  There are no transactions in the selected period to generate insights.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

