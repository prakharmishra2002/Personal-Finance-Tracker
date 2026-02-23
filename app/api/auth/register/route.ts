/**
 * User Registration API Route
 * 
 * POST /api/auth/register
 * Creates a new user account with email verification
 * 
 * Features:
 * - Email validation
 * - Password hashing with bcrypt
 * - Duplicate email check
 * - Verification token generation
 * - Database storage
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import bcrypt from 'bcryptjs'

// Force dynamic rendering - don't try to build this at build time
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/auth/register
 * Register a new user
 * 
 * Body:
 * {
 *   name: string
 *   email: string
 *   password: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password with bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = generateToken()
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user in database (not verified yet)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verified: false
      }
    })

    // Create verification token in database
    await prisma.verificationToken.create({
      data: {
        email,
        token: verificationToken,
        expires: tokenExpiry
      }
    })

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`
    
    // Check if email is configured
    const isEmailConfigured = process.env.EMAIL_USER && 
                              process.env.EMAIL_PASSWORD && 
                              process.env.EMAIL_USER !== 'your-email@gmail.com'
    
    console.log('Email configured:', isEmailConfigured)
    
    if (isEmailConfigured) {
      // Try to send real email
      try {
        await sendVerificationEmail(email, verificationUrl, name)
        console.log('Verification email sent successfully')
      } catch (emailError) {
        console.error('Failed to send email, but continuing in development mode:', emailError)
        // Don't delete user - just continue in development mode
      }
    } else {
      console.log('Email not configured - development mode')
      console.log('Verification URL:', verificationUrl)
    }

    return NextResponse.json({
      success: true,
      message: isEmailConfigured 
        ? 'Registration successful. Please check your email to verify your account.'
        : 'Registration successful. Check the verification link below.',
      userId: user.id,
      // Include verification URL if email not configured or failed
      ...(!isEmailConfigured ? { verificationUrl } : {})
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown')
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    
    return NextResponse.json(
      { 
        error: 'Failed to register user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Generate a random verification token
 */
function generateToken(): string {
  return Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}
