/**
 * Email Verification API Route
 * 
 * POST /api/auth/verify-email
 * Verifies user email with token
 * 
 * Features:
 * - Token validation
 * - Expiry check
 * - User verification update
 * - Token cleanup
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering - don't try to build this at build time
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/auth/verify-email
 * Verify user email with token
 * 
 * Body:
 * {
 *   token: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    // Validate token
    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find verification token in database
    const verificationRecord = await prisma.verificationToken.findUnique({
      where: { token }
    })

    // Check if token exists
    if (!verificationRecord) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 404 }
      )
    }

    // Check if token has expired
    if (verificationRecord.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token }
      })

      return NextResponse.json(
        { error: 'Verification token has expired. Please register again.' },
        { status: 410 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationRecord.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (user.verified) {
      // Delete token
      await prisma.verificationToken.delete({
        where: { token }
      })

      return NextResponse.json({
        success: true,
        message: 'Email already verified',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          verified: user.verified
        }
      }, { status: 200 })
    }

    // Update user as verified
    const updatedUser = await prisma.user.update({
      where: { email: verificationRecord.email },
      data: { verified: true }
    })

    // Delete verification token (one-time use)
    await prisma.verificationToken.delete({
      where: { token }
    })

    // Generate session token for auto-login
    const sessionToken = generateSessionToken(updatedUser.id)

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        verified: updatedUser.verified,
        createdAt: updatedUser.createdAt
      },
      token: sessionToken
    }, { status: 200 })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify email' },
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
