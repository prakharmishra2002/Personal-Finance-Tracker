/**
 * User Login API Route
 * 
 * POST /api/auth/login
 * Authenticates user with email and password
 * 
 * Features:
 * - Email validation
 * - Password verification with bcrypt
 * - Email verification check
 * - Secure session token generation
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

/**
 * POST /api/auth/login
 * Authenticate user and create session
 * 
 * Body:
 * {
 *   email: string
 *   password: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if email is verified
    if (!user.verified) {
      return NextResponse.json(
        { error: 'Please verify your email before logging in' },
        { status: 403 }
      )
    }

    // Generate session token (in production, use JWT or similar)
    const sessionToken = generateSessionToken(user.id)

    // Return user data (excluding password)
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        createdAt: user.createdAt
      },
      token: sessionToken
    }, { status: 200 })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}

/**
 * Generate a session token
 * In production, use JWT with proper signing
 */
function generateSessionToken(userId: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2)
  return Buffer.from(`${userId}:${timestamp}:${random}`).toString('base64')
}
