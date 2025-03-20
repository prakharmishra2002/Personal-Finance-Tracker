"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PieChart, LineChart, BarChart, Wallet, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import TransactionList from "@/components/transaction-list"
import AddTransactionDialog from "@/components/add-transaction-dialog"
import CurrencyConverter from "@/components/currency-converter"
import DashboardAnalytics from "@/components/dashboard-analytics"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const router = useRouter()
  const { toast } = useToast()

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
    } else {
      // Set sample transactions for demo
      const sampleTransactions = [
        {
          id: "1",
          date: "2025-03-15",
          description: "Grocery Shopping",
          amount: -120.5,
          category: "Food",
          currency: "USD",
        },
        {
          id: "2",
          date: "2025-03-14",
          description: "Salary",
          amount: 3500.0,
          category: "Income",
          currency: "USD",
        },
        {
          id: "3",
          date: "2025-03-12",
          description: "Electric Bill",
          amount: -85.2,
          category: "Utilities",
          currency: "USD",
        },
        {
          id: "4",
          date: "2025-03-10",
          description: "Restaurant",
          amount: -65.3,
          category: "Dining",
          currency: "USD",
        },
        {
          id: "5",
          date: "2025-03-05",
          description: "Freelance Work",
          amount: 750.0,
          category: "Income",
          currency: "USD",
        },
      ]
      setTransactions(sampleTransactions)
      localStorage.setItem(`transactions_${JSON.parse(currentUser).id}`, JSON.stringify(sampleTransactions))
    }
  }, [router])

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

  const deleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id)
    setTransactions(updatedTransactions)
    localStorage.setItem(`transactions_${user.id}`, JSON.stringify(updatedTransactions))

    toast({
      title: "Transaction deleted",
      description: "Your transaction has been successfully deleted.",
    })
  }

  // Calculate financial summary
  const calculateSummary = () => {
    if (!transactions.length) return { income: 0, expenses: 0, balance: 0 }

    const income = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)

    const expenses = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)

    return {
      income,
      expenses,
      balance: income - expenses,
    }
  }

  const summary = calculateSummary()

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowAddTransaction(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="currency">Currency Converter</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold animate-in fade-in-50 duration-500">
                  ${summary.balance.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Current balance across all accounts</p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Income</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500 animate-in fade-in-50 duration-500">
                  ${summary.income.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Total income this month</p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500 animate-in fade-in-50 duration-500">
                  ${summary.expenses.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Total expenses this month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionList transactions={transactions.slice(0, 5)} onDelete={deleteTransaction} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {transactions.filter((t) => t.amount < 0).length > 0 ? (
                  <DashboardAnalytics
                    transactions={transactions}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                ) : (
                  <div className="flex h-[200px] items-center justify-center">
                    <PieChart className="h-16 w-16 text-muted-foreground/70" />
                    <div className="ml-4">
                      <p className="text-sm text-muted-foreground">No expense data available yet</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>A complete history of your financial transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={transactions} onDelete={deleteTransaction} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trends</CardTitle>
              <CardDescription>View your spending patterns over time.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="flex h-[300px] items-center justify-center">
                <LineChart className="h-16 w-16 text-muted-foreground/70" />
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">
                    Monthly spending trends will appear here with real data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="flex h-[200px] items-center justify-center">
                  <BarChart className="h-16 w-16 text-muted-foreground/70" />
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Income vs expenses chart will appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Budget Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Food & Groceries</div>
                      <div className="text-muted-foreground">65%</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-[65%] rounded-full bg-primary"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Entertainment</div>
                      <div className="text-muted-foreground">40%</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-[40%] rounded-full bg-primary"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Transportation</div>
                      <div className="text-muted-foreground">80%</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-[80%] rounded-full bg-primary"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="currency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Currency Converter</CardTitle>
              <CardDescription>Convert between different currencies using real-time exchange rates.</CardDescription>
            </CardHeader>
            <CardContent>
              <CurrencyConverter />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddTransactionDialog open={showAddTransaction} onOpenChange={setShowAddTransaction} onAdd={addTransaction} />
    </DashboardLayout>
  )
}

