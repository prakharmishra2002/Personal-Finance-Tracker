"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Download, Filter } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import TransactionList from "@/components/transaction-list"
import AddTransactionDialog from "@/components/add-transaction-dialog"
import { useToast } from "@/hooks/use-toast"

export default function TransactionsPage() {
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [filters, setFilters] = useState({
    category: "all",
    dateRange: "all",
    type: "all",
    search: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  // Set up categories for filtering
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

  // Date range options for filtering
  const dateRanges = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ]

  // Transaction type options for filtering
  const transactionTypes = [
    { value: "all", label: "All Types" },
    { value: "income", label: "Income" },
    { value: "expense", label: "Expenses" },
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
  }, [router])

  // Add a new transaction
  const addTransaction = (transaction: any) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    }

    const updatedTransactions = [newTransaction, ...transactions]
    setTransactions(updatedTransactions)
    localStorage.setItem(`transactions_${user.id}`, JSON.stringify(updatedTransactions))

    toast({
      title: "Transaction added",
      description: "Your transaction has been successfully added.",
    })
  }

  // Delete a transaction
  const deleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id)
    setTransactions(updatedTransactions)
    localStorage.setItem(`transactions_${user.id}`, JSON.stringify(updatedTransactions))

    toast({
      title: "Transaction deleted",
      description: "Your transaction has been successfully deleted.",
    })
  }

  // Handle filter changes
  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }))
  }

  // Filter transactions based on selected filters
  const getFilteredTransactions = () => {
    return transactions.filter((transaction) => {
      // Filter by category
      if (filters.category !== "all" && transaction.category !== filters.category) {
        return false
      }

      // Filter by transaction type (income or expense)
      if (filters.type === "income" && transaction.amount <= 0) {
        return false
      }
      if (filters.type === "expense" && transaction.amount > 0) {
        return false
      }

      // Filter by date range
      if (filters.dateRange !== "all") {
        const transactionDate = new Date(transaction.date)
        const today = new Date()

        if (filters.dateRange === "today") {
          if (transactionDate.toDateString() !== today.toDateString()) {
            return false
          }
        } else if (filters.dateRange === "week") {
          const weekStart = new Date(today)
          weekStart.setDate(today.getDate() - today.getDay())
          if (transactionDate < weekStart) {
            return false
          }
        } else if (filters.dateRange === "month") {
          if (
            transactionDate.getMonth() !== today.getMonth() ||
            transactionDate.getFullYear() !== today.getFullYear()
          ) {
            return false
          }
        } else if (filters.dateRange === "quarter") {
          const currentQuarter = Math.floor(today.getMonth() / 3)
          const transactionQuarter = Math.floor(transactionDate.getMonth() / 3)

          if (transactionQuarter !== currentQuarter || transactionDate.getFullYear() !== today.getFullYear()) {
            return false
          }
        } else if (filters.dateRange === "year") {
          if (transactionDate.getFullYear() !== today.getFullYear()) {
            return false
          }
        }
      }

      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        return (
          transaction.description.toLowerCase().includes(searchTerm) ||
          transaction.category.toLowerCase().includes(searchTerm)
        )
      }

      return true
    })
  }

  // Export transactions as CSV
  const exportTransactions = () => {
    const filteredTransactions = getFilteredTransactions()

    // Create CSV content
    let csvContent = "Date,Description,Category,Amount,Currency\n"

    filteredTransactions.forEach((t) => {
      csvContent += `${t.date},${t.description},${t.category},${t.amount},${t.currency}\n`
    })

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `transactions_export_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export complete",
      description: "Your transactions have been exported to CSV.",
    })
  }

  const filteredTransactions = isClient ? getFilteredTransactions() : []

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Transactions</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={exportTransactions} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={() => setShowAddTransaction(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mt-4 sm:mt-6">
        <CardHeader>
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Filter className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Filters
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Filter your transactions by category, date range, and type.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
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

            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
                <SelectTrigger id="dateRange">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {transactionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search transactions..."
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions list */}
      <Card className="mt-4 sm:mt-6">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Transaction History</CardTitle>
          <CardDescription className="text-xs sm:text-sm">{filteredTransactions.length} transactions found</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} />
        </CardContent>
      </Card>

      {/* Add transaction dialog */}
      <AddTransactionDialog open={showAddTransaction} onOpenChange={setShowAddTransaction} onAdd={addTransaction} />
    </DashboardLayout>
  )
}

