"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"

// Budget item interface
interface Budget {
  id: string
  category: string
  amount: number
  spent: number
  period: string
  currency: string
}

export default function BudgetPage() {
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [showAddBudget, setShowAddBudget] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    period: "monthly",
    currency: "USD",
  })
  const router = useRouter()
  const { toast } = useToast()

  // Categories for budgets
  const categories = [
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

  // Budget periods
  const periods = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
  ]

  // Currencies
  const currencies = [
    { value: "USD", label: "US Dollar (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "British Pound (GBP)" },
    { value: "JPY", label: "Japanese Yen (JPY)" },
    { value: "CAD", label: "Canadian Dollar (CAD)" },
    { value: "AUD", label: "Australian Dollar (AUD)" },
    { value: "CNY", label: "Chinese Yuan (CNY)" },
    { value: "INR", label: "Indian Rupee (INR)" },
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

    // Load budgets from localStorage
    const savedBudgets = localStorage.getItem(`budgets_${JSON.parse(currentUser).id}`)
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets))
    } else {
      // Set sample budgets for demo
      const sampleBudgets = [
        {
          id: "1",
          category: "Food",
          amount: 500,
          spent: 325.75,
          period: "monthly",
          currency: "USD",
        },
        {
          id: "2",
          category: "Transportation",
          amount: 200,
          spent: 160.5,
          period: "monthly",
          currency: "USD",
        },
        {
          id: "3",
          category: "Entertainment",
          amount: 150,
          spent: 87.25,
          period: "monthly",
          currency: "USD",
        },
        {
          id: "4",
          category: "Utilities",
          amount: 300,
          spent: 240.0,
          period: "monthly",
          currency: "USD",
        },
      ]
      setBudgets(sampleBudgets)
      localStorage.setItem(`budgets_${JSON.parse(currentUser).id}`, JSON.stringify(sampleBudgets))
    }

    // Load transactions to calculate spending
    const savedTransactions = localStorage.getItem(`transactions_${JSON.parse(currentUser).id}`)
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }, [router])

  // Calculate spending for each budget category based on transactions
  useEffect(() => {
    if (!transactions.length || !budgets.length) return

    // Get current date info for period calculations
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Create a copy of budgets to update
    const updatedBudgets = budgets.map((budget) => {
      // Filter transactions by category
      const categoryTransactions = transactions.filter(
        (t) => t.category === budget.category && t.amount < 0, // Only expenses
      )

      // Filter transactions by period
      const periodTransactions = categoryTransactions.filter((t) => {
        const transactionDate = new Date(t.date)

        if (budget.period === "monthly") {
          // Current month
          return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
        } else if (budget.period === "weekly") {
          // Current week (last 7 days for simplicity)
          const weekAgo = new Date()
          weekAgo.setDate(now.getDate() - 7)
          return transactionDate >= weekAgo
        } else if (budget.period === "quarterly") {
          // Current quarter
          const quarterStart = new Date(currentYear, Math.floor(currentMonth / 3) * 3, 1)
          return transactionDate >= quarterStart
        } else if (budget.period === "yearly") {
          // Current year
          return transactionDate.getFullYear() === currentYear
        }

        return false
      })

      // Calculate total spent
      const spent = periodTransactions.reduce((total, t) => total + Math.abs(t.amount), 0)

      return {
        ...budget,
        spent,
      }
    })

    setBudgets(updatedBudgets)
    localStorage.setItem(`budgets_${user?.id}`, JSON.stringify(updatedBudgets))
  }, [transactions, user])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Add or update a budget
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingBudget) {
      // Update existing budget
      const updatedBudgets = budgets.map((budget) =>
        budget.id === editingBudget.id
          ? {
              ...budget,
              category: formData.category,
              amount: Number.parseFloat(formData.amount),
              period: formData.period,
              currency: formData.currency,
            }
          : budget,
      )

      setBudgets(updatedBudgets)
      localStorage.setItem(`budgets_${user.id}`, JSON.stringify(updatedBudgets))

      toast({
        title: "Budget updated",
        description: "Your budget has been successfully updated.",
      })
    } else {
      // Add new budget
      // Check if budget for this category and period already exists
      const existingBudget = budgets.find((b) => b.category === formData.category && b.period === formData.period)

      if (existingBudget) {
        toast({
          title: "Budget already exists",
          description: `A ${formData.period} budget for ${formData.category} already exists.`,
          variant: "destructive",
        })
        return
      }

      const newBudget: Budget = {
        id: Date.now().toString(),
        category: formData.category,
        amount: Number.parseFloat(formData.amount),
        spent: 0, // Start with zero spent
        period: formData.period,
        currency: formData.currency,
      }

      const updatedBudgets = [...budgets, newBudget]
      setBudgets(updatedBudgets)
      localStorage.setItem(`budgets_${user.id}`, JSON.stringify(updatedBudgets))

      toast({
        title: "Budget created",
        description: "Your new budget has been successfully created.",
      })
    }

    // Reset form and close dialog
    setFormData({
      category: "",
      amount: "",
      period: "monthly",
      currency: "USD",
    })
    setEditingBudget(null)
    setShowAddBudget(false)
  }

  // Edit a budget
  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period,
      currency: budget.currency,
    })
    setShowAddBudget(true)
  }

  // Delete a budget
  const handleDelete = (id: string) => {
    const updatedBudgets = budgets.filter((budget) => budget.id !== id)
    setBudgets(updatedBudgets)
    localStorage.setItem(`budgets_${user.id}`, JSON.stringify(updatedBudgets))

    toast({
      title: "Budget deleted",
      description: "Your budget has been successfully deleted.",
    })
  }

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  // Calculate progress percentage
  const calculateProgress = (spent: number, amount: number) => {
    if (amount <= 0) return 0
    const progress = (spent / amount) * 100
    return Math.min(progress, 100) // Cap at 100%
  }

  // Get progress color based on percentage
  const getProgressColor = (spent: number, amount: number) => {
    const percentage = calculateProgress(spent, amount)

    if (percentage >= 90) {
      return "bg-red-500" // Over or near budget
    } else if (percentage >= 75) {
      return "bg-yellow-500" // Approaching budget limit
    } else {
      return "bg-green-500" // Well within budget
    }
  }

  // Get status text based on percentage
  const getStatusText = (spent: number, amount: number) => {
    const percentage = calculateProgress(spent, amount)

    if (percentage >= 100) {
      return "Over Budget"
    } else if (percentage >= 90) {
      return "Near Limit"
    } else if (percentage >= 75) {
      return "Approaching"
    } else {
      return "On Track"
    }
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Budget Management</h2>
        <Button
          onClick={() => {
            setEditingBudget(null)
            setFormData({
              category: "",
              amount: "",
              period: "monthly",
              currency: "USD",
            })
            setShowAddBudget(true)
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Budget
        </Button>
      </div>

      {/* Budget overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 sm:mt-6">
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Budgeted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold animate-in fade-in-50 duration-500">
              {formatCurrency(
                budgets.reduce((total, budget) => total + budget.amount, 0),
                "USD",
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across {budgets.length} budget categories</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold animate-in fade-in-50 duration-500">
              {formatCurrency(
                budgets.reduce((total, budget) => total + budget.spent, 0),
                "USD",
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(
                (budgets.reduce((total, budget) => total + budget.spent, 0) /
                  budgets.reduce((total, budget) => total + budget.amount, 0)) *
                  100,
              )}
              % of total budget
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold animate-in fade-in-50 duration-500">
              {formatCurrency(
                budgets.reduce((total, budget) => total + budget.amount, 0) -
                  budgets.reduce((total, budget) => total + budget.spent, 0),
                "USD",
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Available to spend this period</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Budget Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold animate-in fade-in-50 duration-500">
              {budgets.filter((b) => calculateProgress(b.spent, b.amount) >= 90).length > 0
                ? "Attention Needed"
                : "Good Standing"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {budgets.filter((b) => calculateProgress(b.spent, b.amount) >= 90).length} categories need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget list */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-4 sm:mt-6">
        {budgets.map((budget) => (
          <Card
            key={budget.id}
            className={calculateProgress(budget.spent, budget.amount) >= 100 ? "border-red-500" : ""}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-medium">{budget.category}</CardTitle>
                <div className="flex space-x-1 sm:space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(budget)} className="h-8 w-8">
                    <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(budget.id)} className="h-8 w-8">
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
              <CardDescription className="text-xs sm:text-sm">{budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-2 text-xs sm:text-sm">
                <span>
                  {formatCurrency(budget.spent, budget.currency)} of {formatCurrency(budget.amount, budget.currency)}
                </span>
                <span
                  className={
                    calculateProgress(budget.spent, budget.amount) >= 90
                      ? "text-red-500 font-medium flex items-center"
                      : "text-muted-foreground"
                  }
                >
                  {calculateProgress(budget.spent, budget.amount) >= 90 && <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />}
                  {getStatusText(budget.spent, budget.amount)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${getProgressColor(budget.spent, budget.amount)}`}
                  style={{ width: `${calculateProgress(budget.spent, budget.amount)}%` }}
                ></div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {Math.round(calculateProgress(budget.spent, budget.amount))}% used
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Budget Dialog */}
      <Dialog open={showAddBudget} onOpenChange={setShowAddBudget}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingBudget ? "Edit Budget" : "Create New Budget"}</DialogTitle>
              <DialogDescription>
                {editingBudget ? "Update your budget settings below." : "Set up a new budget to track your spending."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  disabled={!!editingBudget} // Can't change category when editing
                  required
                >
                  <SelectTrigger id="category">
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

              <div className="grid gap-2">
                <Label htmlFor="amount">Budget Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="period">Budget Period</Label>
                <Select
                  value={formData.period}
                  onValueChange={(value) => handleSelectChange("period", value)}
                  disabled={!!editingBudget} // Can't change period when editing
                  required
                >
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleSelectChange("currency", value)}
                  required
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{editingBudget ? "Update Budget" : "Create Budget"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Empty state */}
      {budgets.length === 0 && (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-muted p-3">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No Budgets Found</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              You haven't created any budgets yet. Create your first budget to start tracking your spending.
            </p>
            <Button className="mt-4" onClick={() => setShowAddBudget(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Your First Budget
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}

