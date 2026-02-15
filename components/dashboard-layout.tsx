/**
 * Dashboard Layout Component
 * 
 * This component provides the main layout structure for all dashboard pages.
 * It includes:
 * - Authentication check (redirects to login if not authenticated)
 * - Responsive sidebar navigation (desktop) and mobile menu (mobile)
 * - User information display in header
 * - Logout functionality
 * - Chatbot integration
 * 
 * The layout uses localStorage for authentication state management.
 * In a production app, you would use a proper authentication service
 * (NextAuth.js, Auth0, Firebase Auth, etc.)
 */

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, CreditCard, PieChart, Settings, LogOut, Menu, DollarSign } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { Chatbot } from "@/components/chatbot"

// Props interface for the DashboardLayout component
interface DashboardLayoutProps {
  children: React.ReactNode // The page content to be rendered inside the layout
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // State management
  const [user, setUser] = useState<any>(null) // Current logged-in user data
  const [isClient, setIsClient] = useState(false) // Flag to prevent hydration errors
  const router = useRouter() // Next.js router for navigation
  const pathname = usePathname() // Current page path
  const { toast } = useToast() // Toast notification hook
  const isMobile = useMobile() // Hook to detect mobile devices
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // Mobile menu state

  /**
   * Effect: Authentication check and user data loading
   * Runs once on component mount to verify user is logged in
   */
  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in by verifying auth token and user data in localStorage
    const authToken = localStorage.getItem("authToken")
    const currentUser = localStorage.getItem("currentUser")

    // Redirect to login if not authenticated
    if (!authToken || !currentUser) {
      router.push("/login")
      return
    }

    // Parse and set user data from localStorage
    setUser(JSON.parse(currentUser))
  }, [router])

  /**
   * Handles user logout
   * Clears authentication data and redirects to login page
   */
  const handleLogout = () => {
    // Remove authentication data from localStorage
    localStorage.removeItem("authToken")
    localStorage.removeItem("currentUser")

    // Show success notification
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })

    // Redirect to login page
    router.push("/login")
  }

  // Navigation menu items configuration
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
    { name: "Budget", href: "/dashboard/budget", icon: DollarSign },
    { name: "Reports", href: "/dashboard/reports", icon: PieChart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  // Prevent rendering until client-side to avoid hydration errors
  if (!isClient) {
    return null // Prevent hydration errors
  }

  /**
   * Navigation Items Component
   * Renders the navigation menu items (used in both sidebar and mobile menu)
   */
  const NavItems = () => (
    <>
      <div className="px-3 py-2">
        {/* App branding */}
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">FinanceTracker</h2>
        <div className="space-y-1">
          {/* Map through navigation items and render buttons */}
          {navigation.map((item) => {
            const isActive = pathname === item.href // Check if current page matches nav item
            return (
              <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                {/* Highlight active page with secondary variant */}
                <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
      {/* Logout button at bottom of navigation */}
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
      {/* Header - sticky at top with user info and mobile menu button */}
      <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
        {/* Mobile menu button - only visible on mobile devices */}
        {isMobile && (
          <>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>

            {/* Mobile menu dialog - slides in from left */}
            <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DialogContent
                className="left-0 top-0 translate-x-0 translate-y-0 p-0 h-screen max-w-[250px]"
                side="left"
              >
                <div className="flex h-full flex-col">
                  <NavItems />
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
        {/* User information display - aligned to right */}
        <div className="ml-auto flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          )}
        </div>
      </header>
      {/* Main content area with sidebar (desktop) or without (mobile) */}
      <div className="flex flex-1">
        {/* Desktop sidebar - hidden on mobile */}
        {!isMobile && (
          <aside className="w-64 border-r bg-background">
            <div className="flex h-full flex-col">
              <NavItems />
            </div>
          </aside>
        )}
        {/* Main content area - renders the page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      {/* Floating chatbot component - available on all dashboard pages */}
      <Chatbot />
    </div>
  )
}

