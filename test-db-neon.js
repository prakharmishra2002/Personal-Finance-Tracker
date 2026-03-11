/**
 * Test Database Connection
 * Verifies your Neon configuration with pgbouncer and direct connection
 */

const { PrismaClient } = require('@prisma/client')

async function testConnection() {
    console.log('🔍 Testing Neon database connection...\n')

    // Test Pooled Connection
    console.log('1. Testing Pooled Connection (DATABASE_URL)...')
    console.log(`   URL: ${process.env.DATABASE_URL?.split('@')[1] || 'Not set'}`)

    const prismaPooled = new PrismaClient({
        datasources: { db: { url: process.env.DATABASE_URL } }
    })

    try {
        await prismaPooled.$connect()
        console.log('✅ Pooled connection successful!')
        const result = await prismaPooled.$queryRaw`SELECT 1 as test`
        console.log('✅ Pooled query successful:', result)
    } catch (err) {
        console.error('❌ Pooled connection failed!')
        console.error('Error:', err.message)
    } finally {
        await prismaPooled.$disconnect()
    }

    console.log('\n-------------------\n')

    // Test Direct Connection
    console.log('2. Testing Direct Connection (DIRECT_URL)...')
    console.log(`   URL: ${process.env.DIRECT_URL?.split('@')[1] || 'Not set'}`)

    const prismaDirect = new PrismaClient({
        datasources: { db: { url: process.env.DIRECT_URL } }
    })

    try {
        await prismaDirect.$connect()
        console.log('✅ Direct connection successful!')
        const result = await prismaDirect.$queryRaw`SELECT 1 as test`
        console.log('✅ Direct query successful:', result)
    } catch (err) {
        console.error('❌ Direct connection failed!')
        console.error('Error:', err.message)
    } finally {
        await prismaDirect.$disconnect()
    }
}

testConnection()
