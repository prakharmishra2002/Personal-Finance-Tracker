/**
 * Test Database Connection
 * Run this to verify your DATABASE_URL is correct
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

async function testConnection() {
  console.log('🔍 Testing database connection...\n')
  
  try {
    // Test connection
    console.log('1. Connecting to database...')
    await prisma.$connect()
    console.log('✅ Connected successfully!\n')
    
    // Test query
    console.log('2. Running test query...')
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query successful:', result)
    console.log('')
    
    // Check if tables exist
    console.log('3. Checking tables...')
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    console.log('✅ Tables found:', tables.length)
    tables.forEach(t => console.log('   -', t.table_name))
    console.log('')
    
    // Count users
    console.log('4. Counting users...')
    const userCount = await prisma.user.count()
    console.log('✅ Users in database:', userCount)
    console.log('')
    
    console.log('🎉 All tests passed! Database connection is working.\n')
    
  } catch (error) {
    console.error('❌ Database connection failed!\n')
    console.error('Error:', error.message)
    console.error('\nPossible issues:')
    console.error('1. DATABASE_URL format is incorrect')
    console.error('2. Database is not accessible')
    console.error('3. Firewall blocking connection')
    console.error('4. Wrong password or credentials')
    console.error('\nYour DATABASE_URL should look like:')
    console.error('postgresql://postgres.PROJECT:PASSWORD@db.PROJECT.supabase.co:6543/postgres?pgbouncer=true')
    console.error('')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
