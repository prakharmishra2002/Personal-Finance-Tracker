/**
 * Transactions API Route
 * 
 * Handles CRUD operations for transactions
 * 
 * GET    /api/transactions - Get all transactions for the current user
 * POST   /api/transactions - Create a new transaction
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/transactions
 * Retrieves all transactions for a user
 * 
 * Query params:
 * - userId: string (required for now, will be from session later)
 * - category: string (optional filter)
 * - startDate: string (optional filter)
 * - endDate: string (optional filter)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Build filter conditions
    const where: any = { userId }
    
    const category = searchParams.get('category')
    if (category && category !== 'all') {
      where.category = category
    }

    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    // Fetch transactions from database
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/transactions
 * Creates a new transaction
 * 
 * Body:
 * {
 *   userId: string
 *   date: string (ISO date)
 *   description: string
 *   amount: number
 *   category: string
 *   currency: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, date, description, amount, category, currency } = body

    // Validate required fields
    if (!userId || !date || !description || amount === undefined || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create transaction in database
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        date: new Date(date),
        description,
        amount: parseFloat(amount),
        category,
        currency: currency || 'USD'
      }
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}
