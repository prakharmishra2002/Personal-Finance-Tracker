/**
 * Single Transaction API Route
 * 
 * Handles operations on a specific transaction
 * 
 * GET    /api/transactions/[id] - Get a specific transaction
 * PUT    /api/transactions/[id] - Update a transaction
 * DELETE /api/transactions/[id] - Delete a transaction
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering - don't try to build this at build time
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/transactions/[id]
 * Retrieves a specific transaction
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const transaction = await prisma.transaction.findUnique({
      where: { id }
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/transactions/[id]
 * Updates a transaction
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { date, description, amount, category, currency } = body

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(description && { description }),
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(category && { category }),
        ...(currency && { currency })
      }
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/transactions/[id]
 * Deletes a transaction
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.transaction.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
}
