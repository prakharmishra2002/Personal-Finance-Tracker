"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmailService } from "@/services/email-service"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setVerifying(false)
      return
    }

    const verifyToken = async () => {
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
        localStorage.setItem("authToken", authToken)
        localStorage.setItem("currentUser", JSON.stringify(user))

        setVerified(true)
      }

      setVerifying(false)
    }

    verifyToken()
  }, [searchParams, router])

  const handleContinue = () => {
    router.push("/dashboard")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
          {verifying ? (
            <CardDescription className="text-center">Verifying your email address...</CardDescription>
          ) : verified ? (
            <CardDescription className="text-center text-green-500">
              Your email has been successfully verified!
            </CardDescription>
          ) : (
            <CardDescription className="text-center text-red-500">
              The verification link is invalid or has expired.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
          {verifying ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-center">Verifying your email...</p>
            </div>
          ) : verified ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <div className="text-center">
                <h2 className="text-xl font-semibold">Email Verified!</h2>
                <p className="text-muted-foreground mt-2">
                  Your email has been successfully verified and your account is now active.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-12 w-12 text-red-500" />
              <div className="text-center">
                <h2 className="text-xl font-semibold">Verification Failed</h2>
                <p className="text-muted-foreground mt-2">
                  The verification link is invalid or has expired. Please try registering again.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {verified ? (
            <Button onClick={handleContinue}>Continue to Dashboard</Button>
          ) : !verifying ? (
            <Link href="/register">
              <Button variant="outline">Back to Registration</Button>
            </Link>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  )
}

