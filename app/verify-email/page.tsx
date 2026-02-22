/**
 * Email Verification Page
 * 
 * Handles email verification with real database integration
 * Features:
 * - Token validation
 * - Expiry check
 * - Auto-login after verification
 * - Error handling
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setVerifying(false)
      setErrorMessage("No verification token provided")
      return
    }

    const verifyToken = async () => {
      try {
        // Call verification API
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed')
        }

        // Verification successful - store user data and token
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("currentUser", JSON.stringify(data.user))

        setVerified(true)

        // Auto-redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)

      } catch (error: any) {
        setErrorMessage(error.message || 'Verification failed')
      } finally {
        setVerifying(false)
      }
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
            <CardDescription className="text-center text-green-600">
              Your email has been successfully verified!
            </CardDescription>
          ) : (
            <CardDescription className="text-center text-red-600">
              {errorMessage || "Verification failed"}
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
                  Your email has been successfully verified. Redirecting to dashboard...
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-12 w-12 text-red-500" />
              <div className="text-center">
                <h2 className="text-xl font-semibold">Verification Failed</h2>
                <p className="text-muted-foreground mt-2">
                  {errorMessage || "The verification link is invalid or has expired."}
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

