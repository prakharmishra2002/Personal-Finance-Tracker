/**
 * Transaction List Component
 * 
 * Displays a table of financial transactions with the following features:
 * - Formatted dates and currency amounts
 * - Visual indicators for income (green arrow up) and expenses (red arrow down)
 * - Delete functionality with confirmation dialog
 * - Empty state when no transactions exist
 * - Fully responsive layout (card view on mobile, table on desktop)
 * 
 * @param transactions - Array of transaction objects to display
 * @param onDelete - Callback function to handle transaction deletion
 */

"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react"

// Transaction type definition
interface Transaction {
  id: string          // Unique identifier
  date: string        // ISO date string
  description: string // Transaction description
  amount: number      // Amount (positive for income, negative for expenses)
  category: string    // Category name
  currency: string    // Currency code (USD, EUR, etc.)
}

// Component props interface
interface TransactionListProps {
  transactions: Transaction[]           // Array of transactions to display
  onDelete: (id: string) => void       // Callback when transaction is deleted
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  // State to track which transaction is being deleted (for confirmation dialog)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  /**
   * Formats a date string into a readable format
   * Example: "2025-03-15" -> "Mar 15, 2025"
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  /**
   * Formats a number as currency with the specified currency code
   * Uses Intl.NumberFormat for proper currency formatting
   * Always displays positive amounts (absolute value)
   */
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(Math.abs(amount))
  }

  /**
   * Handles the delete confirmation
   * Calls the onDelete callback and closes the dialog
   */
  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  // Empty state - shown when there are no transactions
  if (transactions.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No transactions found</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table view - hidden on mobile */}
      <div className="hidden md:block w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[100px]">Date</TableHead>
              <TableHead className="min-w-[150px]">Description</TableHead>
              <TableHead className="min-w-[120px]">Category</TableHead>
              <TableHead className="text-right min-w-[100px]">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    {transaction.amount > 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className={transaction.amount > 0 ? "text-green-500" : "text-red-500"}>
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setDeleteId(transaction.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card view - visible only on mobile */}
      <div className="md:hidden space-y-3">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {/* Transaction description */}
                  <div className="font-medium text-sm truncate">{transaction.description}</div>
                  
                  {/* Date and category */}
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{formatDate(transaction.date)}</span>
                    <span>•</span>
                    <span className="truncate">{transaction.category}</span>
                  </div>
                  
                  {/* Amount with icon */}
                  <div className="flex items-center gap-1 mt-2">
                    {transaction.amount > 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500 flex-shrink-0" />
                    )}
                    <span className={`font-semibold text-sm ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                  </div>
                </div>
                
                {/* Actions button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setDeleteId(transaction.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
