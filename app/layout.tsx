// Import necessary dependencies
import type React from "react" // Type definitions for React
import { Inter } from "next/font/google" // Google Fonts integration for Next.js
import { ThemeProvider } from "@/components/theme-provider" // Custom theme provider for dark/light mode
import { Toaster } from "@/components/ui/toaster" // Toast notification component
import "./globals.css" // Global CSS styles including Tailwind

// Configure Inter font from Google Fonts with Latin subset
const inter = Inter({ subsets: ["latin"] })

// Metadata for the application (used for SEO and browser tabs)
export const metadata = {
  title: "Personal Finance Tracker",
  description: "Track your finances, manage budgets, and convert currencies",
  generator: 'v0.dev' // Indicates this was generated with v0.dev
}

/**
 * Root Layout Component
 * 
 * This is the root layout that wraps all pages in the application.
 * It provides:
 * - HTML structure with language attribute
 * - Font configuration (Inter font family)
 * - Theme provider for dark/light mode support
 * - Toast notification system
 * - Global styles
 * 
 * @param children - The page content to be rendered
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning prevents warnings when theme is applied
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* ThemeProvider enables dark/light mode switching */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          {/* Toaster component for displaying toast notifications */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'