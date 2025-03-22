"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { PasswordInput } from "@/components/password-input"
import { EmailService } from "@/services/email-service"
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
  const [verificationSent, setVerificationSent] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Check for verification token in URL
  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      verifyEmail(token)
    }
  }, [searchParams])

  const verifyEmail = async (token: string) => {
    setLoading(true)

    // Verify the token
    const result = EmailService.verifyToken(token)

    if (result.valid && result.userData) {
      // Token is valid, complete registration
      const user = result.userData

      // Get existing users or initialize empty array
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")

      // Save user to localStorage
      localStorage.setItem("users", JSON.stringify([...existingUsers, user]))

      // Create auth token
      const authToken = btoa(`${user.id}:${Date.now()}`)
      localStorage.setItem("authToken", token)
      localStorage.setItem("currentUser", JSON.stringify(user))

      toast({
        title: "Email verified!",
        description: "Your account has been successfully created.",
      })

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } else {
      toast({
        title: "Verification failed",
        description: "The verification link is invalid or has expired.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear email error when user types
    if (name === "email") {
      setEmailError("")
    }
  }

  const validateForm = () => {
    // Validate email format
    if (!EmailService.validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address")
      return false
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate form
    if (!validateForm()) {
      setLoading(false)
      return
    }

    // Get existing users or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")

    // Check if email already exists
    if (existingUsers.some((u: any) => u.email === formData.email)) {
      toast({
        title: "Email already exists",
        description: "Please use a different email address or login.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    // Create user object
    const user = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password, // In a real app, you would hash this password
      createdAt: new Date().toISOString(),
      verified: false,
    }

    // Create verification token
    const token = EmailService.createVerificationToken(formData.email, user)

    // Send verification email
    try {
      await EmailService.sendVerificationEmail(formData.email, token)

      setVerificationSent(true)
      toast({
        title: "Verification email sent",
        description: "Please check your email to complete registration.",
      })
    } catch (error) {
      toast({
        title: "Failed to send verification email",
        description: "Please try again later.",
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  // Update the verification sent screen to provide clearer instructions
  // If verification email has been sent, show confirmation screen
  if (verificationSent) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <h1 className="text-2xl font-semibold tracking-tight">Verification Email Sent</h1>
            <p className="text-sm text-muted-foreground">
              We've simulated sending a verification link to <strong>{formData.email}</strong>
            </p>
            <div className="mt-4 p-4 bg-muted rounded-md text-sm">
              <p className="font-medium mb-2">📝 Demo Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-left">
                <li>In a real app, you would check your email inbox</li>
                <li>
                  For this demo, visit the{" "}
                  <Link href="/demo-verification" className="text-primary hover:underline">
                    verification demo page
                  </Link>
                </li>
                <li>Find your email in the list and click the verification link</li>
              </ol>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setVerificationSent(false)}>
              Back to registration
            </Button>
            <Button asChild>
              <Link href="/demo-verification">Go to Demo Verification</Link>
            </Button>
          </div>
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

