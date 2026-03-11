import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET() {
    const prisma = new PrismaClient()

    try {
        await prisma.$connect()
        const result = await prisma.$queryRaw`SELECT 1 as test`
        await prisma.$disconnect()

        return NextResponse.json({
            success: true,
            message: "Database connection successful",
            result,
            env: {
                has_database_url: !!process.env.DATABASE_URL,
                has_direct_url: !!process.env.DIRECT_URL,
                database_url_contains_pgbouncer: process.env.DATABASE_URL?.includes('pgbouncer=true'),
                database_url_contains_pooler: process.env.DATABASE_URL?.includes('pooler')
            }
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Database connection failed",
            error: error.message,
            code: error.code,
            meta: error.meta,
            stack: error.stack,
            env: {
                has_database_url: !!process.env.DATABASE_URL,
                has_direct_url: !!process.env.DIRECT_URL,
                database_url_contains_pgbouncer: process.env.DATABASE_URL?.includes('pgbouncer=true'),
                database_url_contains_pooler: process.env.DATABASE_URL?.includes('pooler')
            }
        }, { status: 500 })
    }
}
