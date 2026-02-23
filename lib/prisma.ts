/**
 * Prisma Client Instance
 * 
 * This file creates and exports a singleton instance of Prisma Client.
 * In development, it prevents multiple instances from being created
 * due to hot reloading.
 * 
 * Usage:
 * import { prisma } from '@/lib/prisma'
 * const users = await prisma.user.findMany()
 */

import { PrismaClient } from '@prisma/client'

// Declare global type for Prisma Client
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Create Prisma Client instance with optimized settings for Vercel + Supabase
// In production, create a new instance
// In development, reuse the existing instance to prevent multiple connections
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// In development, store the instance globally to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

// Export types for use in API routes
export type { User, Transaction, Budget, UserSettings } from '@prisma/client'
