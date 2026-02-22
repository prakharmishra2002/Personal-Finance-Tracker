/**
 * Registration Page Component
 * 
 * Handles user registration with real database integration
 * Features:
 * - Form validation
 * - Password strength requirements
 * - Email format validation
 * - Password hashing (server-side)
 * - Email verification flow
 * - Real-time error feedback
 */

"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { PasswordInput } from "@/components/password-input"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear errors when user types
    if (name === "email") setEmailError("")
    if (name === "password" || name === "confirmPassword") setPasswordError("")
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    // Validate email format
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address")
      return false
    }

    // Validate password length
    if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return false
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords don't match")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Call registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Registration successful
      setVerificationSent(true)
      
      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      })

    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Verification sent screen
  if (verificationSent) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <h1 className="text-2xl font-semibold tracking-tight">Check Your Email</h1>
            <p className="text-sm text-muted-foreground">
              We've sent a verification link to <strong>{formData.email}</strong>
            </p>
            <div className="mt-4 p-4 bg-muted rounded-md text-sm">
              <p className="font-medium mb-2">📧 Next Steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-left">
                <li>Check your email inbox for <strong>{formData.email}</strong></li>
                <li>Click the verification link in the email</li>
                <li>You'll be automatically logged in</li>
                <li>If you don't see the email, check your spam folder</li>
              </ol>
              <p className="mt-3 text-xs text-muted-foreground">
                The verification link will expire in 24 hours.
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => setVerificationSent(false)}>
            Back to registration
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your information below to create your account</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
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
                    className={emailError ? "border-red-500" : ""}
                  />
                  {emailError && (
                    <div className="flex items-center text-sm text-red-500">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {emailError}
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    id="password"
                    name="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {passwordError && (
                    <div className="flex items-center text-sm text-red-500">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {passwordError}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

