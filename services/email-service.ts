/**
 * Email Service Module
 * 
 * This module provides email-related functionality for user registration and verification.
 * In this demo application, it simulates email sending using localStorage.
 * 
 * In a production application, you would:
 * - Use a real email service (SendGrid, AWS SES, Mailgun, etc.)
 * - Store verification tokens in a database
 * - Implement proper security measures
 * - Add rate limiting and spam protection
 */

// Email validation regex pattern - validates standard email format
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Type definition for verification record structure
type VerificationRecord = {
  email: string      // User's email address
  token: string      // Unique verification token
  expires: number    // Expiration timestamp (milliseconds since epoch)
  userData: any      // User data to be saved after verification
}

// In-memory storage for verification tokens (simulating a database)
// In production, this would be stored in a database like PostgreSQL, MongoDB, etc.
const verificationTokens: VerificationRecord[] = []

export const EmailService = {
  /**
   * Validates an email format using regex
   * 
   * @param email - Email address to validate
   * @returns true if email format is valid, false otherwise
   */
  validateEmail: (email: string): boolean => {
    return EMAIL_REGEX.test(email)
  },

  /**
   * Creates a verification token for a user
   * 
   * This function generates a random token and stores it with an expiration time.
   * The token is used to verify the user's email address during registration.
   * 
   * @param email - User's email address
   * @param userData - User data to be saved after verification
   * @returns Generated verification token string
   */
  createVerificationToken: (email: string, userData: any): string => {
    // Generate a random token using Math.random() and base-36 encoding
    // In production, use a cryptographically secure method like crypto.randomBytes()
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Set expiration to 24 hours from now
    const expires = Date.now() + 24 * 60 * 60 * 1000

    // Remove any existing tokens for this email to prevent duplicates
    const existingIndex = verificationTokens.findIndex((record) => record.email === email)
    if (existingIndex !== -1) {
      verificationTokens.splice(existingIndex, 1)
    }

    // Store the new token in memory
    verificationTokens.push({
      email,
      token,
      expires,
      userData,
    })

    // Save to localStorage for persistence across page refreshes
    // In production, this would be saved to a database
    localStorage.setItem("verificationTokens", JSON.stringify(verificationTokens))

    return token
  },

  /**
   * Verifies a token and returns the associated user data if valid
   * 
   * This function checks if a token exists, is not expired, and returns
   * the associated user data if valid.
   * 
   * @param token - Verification token to check
   * @returns Object with valid flag and optional userData
   */
  verifyToken: (token: string): { valid: boolean; userData?: any } => {
    // Load the latest tokens from localStorage
    const storedTokens = localStorage.getItem("verificationTokens")
    if (storedTokens) {
      const parsedTokens: VerificationRecord[] = JSON.parse(storedTokens)

      // Find the token record
      const record = parsedTokens.find((r) => r.token === token)

      // Check if token exists and is not expired
      if (record && record.expires > Date.now()) {
        // Token is valid and not expired
        return { valid: true, userData: record.userData }
      }
    }

    // Token is invalid or expired
    return { valid: false }
  },

  /**
   * Simulates sending a verification email
   * 
   * In this demo, we simulate email sending by storing the "sent" email
   * in localStorage. In a production app, this would use a real email service.
   * 
   * Example production implementation:
   * - Use SendGrid, AWS SES, or similar service
   * - Create HTML email template
   * - Include verification link with token
   * - Handle delivery failures and retries
   * 
   * @param email - Recipient email address
   * @param token - Verification token to include in email
   * @returns Promise that resolves to true when "email is sent"
   */
  sendVerificationEmail: (email: string, token: string): Promise<boolean> => {
    // Simulate email sending delay (500ms for quick feedback)
    return new Promise((resolve) => {
      console.log(`Sending verification email to ${email} with token ${token}`)

      // In a real app, you would send an actual email here using an email service
      // Example with SendGrid:
      // await sgMail.send({
      //   to: email,
      //   from: 'noreply@financetracker.com',
      //   subject: 'Verify your email',
      //   html: `<a href="${baseUrl}/verify-email?token=${token}">Click here to verify</a>`
      // })

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

