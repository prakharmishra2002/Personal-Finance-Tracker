// Email validation regex pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Simulated verification tokens storage
// In a real app, this would be stored in a database
type VerificationRecord = {
  email: string
  token: string
  expires: number
  userData: any
}

// In-memory storage for verification tokens (simulating a database)
const verificationTokens: VerificationRecord[] = []

export const EmailService = {
  /**
   * Validates an email format
   */
  validateEmail: (email: string): boolean => {
    return EMAIL_REGEX.test(email)
  },

  /**
   * Creates a verification token for a user
   */
  createVerificationToken: (email: string, userData: any): string => {
    // Generate a random token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Set expiration to 24 hours from now
    const expires = Date.now() + 24 * 60 * 60 * 1000

    // Remove any existing tokens for this email
    const existingIndex = verificationTokens.findIndex((record) => record.email === email)
    if (existingIndex !== -1) {
      verificationTokens.splice(existingIndex, 1)
    }

    // Store the new token
    verificationTokens.push({
      email,
      token,
      expires,
      userData,
    })

    // Save to localStorage for persistence across page refreshes
    localStorage.setItem("verificationTokens", JSON.stringify(verificationTokens))

    return token
  },

  /**
   * Verifies a token and returns the associated user data if valid
   */
  verifyToken: (token: string): { valid: boolean; userData?: any } => {
    // Load the latest tokens from localStorage
    const storedTokens = localStorage.getItem("verificationTokens")
    if (storedTokens) {
      const parsedTokens: VerificationRecord[] = JSON.parse(storedTokens)

      // Find the token record
      const record = parsedTokens.find((r) => r.token === token)

      if (record && record.expires > Date.now()) {
        // Token is valid and not expired
        return { valid: true, userData: record.userData }
      }
    }

    return { valid: false }
  },

  /**
   * Simulates sending a verification email
   * In a real app, this would use an email service
   */
  sendVerificationEmail: (email: string, token: string): Promise<boolean> => {
    // Simulate email sending delay - reduced from 1500ms to 500ms
    return new Promise((resolve) => {
      console.log(`Sending verification email to ${email} with token ${token}`)

      // In a real app, you would send an actual email here
      // For this demo, we'll just simulate success after a short delay
      setTimeout(() => {
        // Store the "sent" email in localStorage for demo purposes
        const sentEmails = JSON.parse(localStorage.getItem("sentVerificationEmails") || "[]")
        sentEmails.push({
          email,
          token,
          sentAt: new Date().toISOString(),
        })
        localStorage.setItem("sentVerificationEmails", JSON.stringify(sentEmails))

        resolve(true)
      }, 500) // Reduced from 1500ms to 500ms for immediate feedback
    })
  },
}

