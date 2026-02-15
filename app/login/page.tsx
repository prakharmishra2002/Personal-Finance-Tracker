/**
 * Login Page Component
 * 
 * This page handles user authentication and login.
 * 
 * Features:
 * - Email and password input fields
 * - Form validation
 * - Authentication using localStorage (demo only)
 * - Loading state during login
 * - Error handling with toast notifications
 * - Redirect to dashboard on successful login
 * - Link to registration page
 * 
 * Security Note: This is a demo implementation using localStorage.
 * In production, you should:
 * - Use secure authentication (JWT, OAuth, etc.)
 * - Hash passwords (bcrypt, argon2)
 * - Implement HTTPS
 * - Add CSRF protection
 * - Use secure session management
 * - Implement rate limiting
 */

"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { PasswordInput } from "@/components/password-input"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  // Form state management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false) // Loading state for submit button
  const router = useRouter() // Next.js router for navigation
  const { toast } = useToast() // Toast notification hook

  /**
   * Handles input field changes
   * Updates form state as user types
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  /**
   * Handles form submission and authentication
   * 
   * Process:
   * 1. Retrieve users from localStorage
   * 2. Find user with matching email and password
   * 3. Create auth token and store in localStorage
   * 4. Redirect to dashboard on success
   * 5. Show error message on failure
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Get users from localStorage (in production, this would be an API call)
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Find user with matching email and password
    // In production, password comparison would be done server-side with hashed passwords
    const user = users.find((u: any) => u.email === formData.email && u.password === formData.password)

    if (user) {
      // Authentication successful
      // Create auth token (in production, use JWT or similar)
      const token = btoa(`${user.id}:${Date.now()}`)
      localStorage.setItem("authToken", token)
      localStorage.setItem("currentUser", JSON.stringify(user))

      // Show success notification
      toast({
        title: "Login successful!",
        description: "You have successfully logged in.",
      })

      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } else {
      // Authentication failed
      console.error("Login failed: Invalid credentials")
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
        duration: 5000, // Show for 5 seconds
      })
      setLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        {/* Page header with title and description */}
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
        </div>
        {/* Login form card */}
        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                {/* Email input field */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {/* Password input field with show/hide toggle */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              {/* Submit button with loading state */}
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        {/* Link to registration page */}
        <p className="px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline underline-offset-4 hover:text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

