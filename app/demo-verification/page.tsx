"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default function DemoVerificationPage() {
  const [sentEmails, setSentEmails] = useState<any[]>([])
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)

  useEffect(() => {
    // Load sent verification emails from localStorage
    const loadEmails = () => {
      const emails = JSON.parse(localStorage.getItem("sentVerificationEmails") || "[]")
      setSentEmails(emails)
    }

    loadEmails()

    // Set up interval to refresh emails
    const interval = setInterval(loadEmails, 2000)

    return () => clearInterval(interval)
  }, [])

  const getVerificationLink = (token: string) => {
    return `${window.location.origin}/verify-email?token=${token}`
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Email Verification Demo</CardTitle>
            <CardDescription>
              <div className="space-y-2 mt-2">
                <div className="text-amber-500 font-medium flex items-center">
                  <AlertTriangle className="mr-1 h-4 w-4" />
                  This is a demo without a real email server
                </div>
                <div>
                  Since this is a client-side demo without a backend server, no actual emails are sent. Instead, use
                  this page to simulate receiving and clicking verification links.
                </div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Sent Verification Emails</h3>
                <div className="text-sm text-muted-foreground mb-4">Select an email to view the verification link:</div>

                {sentEmails.length === 0 ? (
                  <div className="text-center p-4 border rounded-md">
                    <div className="text-muted-foreground">No verification emails have been sent yet.</div>
                    <div className="text-sm mt-2">
                      <Link href="/register" className="text-primary hover:underline">
                        Register a new account
                      </Link>{" "}
                      to send a verification email.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sentEmails.map((email, index) => (
                      <div
                        key={index}
                        className={`p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors ${
                          selectedEmail === email.email ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => setSelectedEmail(email.email)}
                      >
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{email.email}</div>
                            <div className="text-xs text-muted-foreground">
                              Sent: {new Date(email.sentAt).toLocaleString()}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedEmail(email.email)
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedEmail && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-medium mb-2">Verification Link</h3>

                  {sentEmails.find((e) => e.email === selectedEmail) && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Input
                          readOnly
                          value={getVerificationLink(sentEmails.find((e) => e.email === selectedEmail).token)}
                          className="font-mono text-xs"
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              getVerificationLink(sentEmails.find((e) => e.email === selectedEmail).token),
                            )
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                      <div className="text-center mt-4">
                        <Link
                          href={getVerificationLink(sentEmails.find((e) => e.email === selectedEmail).token)}
                          passHref
                        >
                          <Button>Open Verification Link</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Register New Account</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

