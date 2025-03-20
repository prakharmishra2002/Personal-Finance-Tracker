"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, CreditCard, PieChart, Settings, LogOut, Menu, DollarSign } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const isMobile = useMobile()
  const [open, setOpen] = useState(false)

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
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("currentUser")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })

    router.push("/login")
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
    { name: "Budget", href: "/dashboard/budget", icon: DollarSign },
    { name: "Reports", href: "/dashboard/reports", icon: PieChart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  if (!isClient) {
    return null // Prevent hydration errors
  }

  const NavItems = () => (
    <>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">FinanceTracker</h2>
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href} onClick={() => setOpen(false)}>
                <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
        {isMobile && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <NavItems />
            </SheetContent>
          </Sheet>
        )}
        <div className="ml-auto flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          )}
        </div>
      </header>
      <div className="flex flex-1">
        {!isMobile && (
          <aside className="w-64 border-r bg-background">
            <div className="flex h-full flex-col">
              <NavItems />
            </div>
          </aside>
        )}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

