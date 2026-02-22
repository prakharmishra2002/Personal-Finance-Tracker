/**
 * Database Setup Script
 * 
 * This script helps you set up the database quickly
 * Run with: node scripts/setup-database.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Finance Tracker Database Setup (PostgreSQL)\n');

// Check if .env exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from .env.example...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env file created!');
  console.log('⚠️  Please update DATABASE_URL in .env with your PostgreSQL credentials\n');
  console.log('Options:');
  console.log('1. Supabase (Recommended): https://supabase.com');
  console.log('2. Neon (Serverless): https://neon.tech');
  console.log('3. Railway: https://railway.app');
  console.log('4. Local: postgresql://postgres:password@localhost:5432/finance_tracker\n');
  process.exit(0);
}

console.log('✅ .env file found\n');

// Check if Prisma is installed
try {
  console.log('📦 Checking Prisma installation...');
  execSync('npx prisma --version', { stdio: 'ignore' });
  console.log('✅ Prisma is installed\n');
} catch (error) {
  console.log('❌ Prisma not found. Installing...');
  execSync('npm install prisma @prisma/client', { stdio: 'inherit' });
  console.log('✅ Prisma installed\n');
}

// Generate Prisma Client
try {
  console.log('🔧 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated\n');
} catch (error) {
  console.log('❌ Failed to generate Prisma Client');
  process.exit(1);
}

// Run migrations
try {
  console.log('🗄️  Running database migrations...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  console.log('✅ Database migrations complete\n');
} catch (error) {
  console.log('❌ Failed to run migrations');
  console.log('Please check your DATABASE_URL in .env file');
  process.exit(1);
}

console.log('🎉 Database setup complete!\n');
console.log('Next steps:');
console.log('1. Run "npx prisma studio" to view your database');
console.log('2. Start your dev server with "npm run dev"');
console.log('3. Check MIGRATION_GUIDE.md for updating your code\n');
