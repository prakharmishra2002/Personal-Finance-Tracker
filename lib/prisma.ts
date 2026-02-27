/**
 * Prisma Client Instance
 * 
 * This file creates and exports a singleton instance of Prisma Client.
 * Configured for Vercel serverless environment with connection pooling.
 */

import { PrismaClient } from '@prisma/client'

// Declare global type for Prisma Client
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Create Prisma Client instance with optimized settings for Vercel
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Add connection pool settings for serverless
  ...(process.env.NODE_ENV === 'production' && {
    datasources: {
      db: {
        url: process.env.DATABASE_URL + '?connection_limit=1&pool_timeout=0'
      }
    }
  })
})

// In development, store the instance globally to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

// Export types for use in API routes
export type { User, Transaction, Budget, UserSettings } from '@prisma/client'
