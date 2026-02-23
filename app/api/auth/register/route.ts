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
    console.log('=== Registration Request Started ===')
    
    const body = await request.json()
    const { name, email, password } = body
    console.log('Request body parsed:', { name, email, passwordLength: password?.length })

    // Validate required fields
    if (!name || !email || !password) {
      console.log('Validation failed: Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      console.log('Validation failed: Invalid email format')
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 8) {
      console.log('Validation failed: Password too short')
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    console.log('Validation passed, checking database connection...')
    
    // Test database connection first
    try {
      await prisma.$connect()
      console.log('Database connection successful')
    } catch (dbError) {
      console.error('Database connection failed:', dbError)
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: dbError instanceof Error ? dbError.message : 'Unknown error'
        },
        { status: 500 }
      )
    }

    console.log('Checking for existing user...')
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    console.log('Existing user check complete:', existingUser ? 'User exists' : 'User does not exist')

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    console.log('Hashing password...')
    // Hash password with bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('Password hashed successfully')

    console.log('Generating verification token...')
    // Generate verification token
    const verificationToken = generateToken()
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    console.log('Token generated')

    console.log('Creating user in database...')
    // Create user in database (not verified yet)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verified: false
      }
    })
    console.log('User created successfully:', user.id)

    console.log('Creating verification token in database...')
    // Create verification token in database
    await prisma.verificationToken.create({
      data: {
        email,
        token: verificationToken,
        expires: tokenExpiry
      }
    })
    console.log('Verification token created successfully')

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
        console.log('Attempting to send verification email...')
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

    console.log('=== Registration Request Completed Successfully ===')
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
    console.error('=== Registration Error ===')
    console.error('Error type:', typeof error)
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown')
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    console.error('Full error object:', JSON.stringify(error, null, 2))
    
    return NextResponse.json(
      { 
        error: 'Failed to register user',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.name : typeof error
      },
      { status: 500 }
    )
  } finally {
    // Disconnect from database
    await prisma.$disconnect()
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
