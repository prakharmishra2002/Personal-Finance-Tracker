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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
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

    // Save user to localStorage
    localStorage.setItem("users", JSON.stringify([...existingUsers, user]))

    // Create auth token
    const token = btoa(`${user.id}:${Date.now()}`)
    localStorage.setItem("authToken", token)
    localStorage.setItem("currentUser", JSON.stringify(user))

    toast({
      title: "Account created!",
      description: "You have successfully registered.",
    })

    // Redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
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
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
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

