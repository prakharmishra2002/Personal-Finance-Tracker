# 🚀 Setup Guide

Complete setup instructions for the Personal Finance Tracker.

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- PostgreSQL database (Supabase recommended)
- Gmail account (optional, for email verification)

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/personal-finance-tracker.git
cd personal-finance-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and update the following:

#### Required Configuration

**DATABASE_URL** - PostgreSQL connection string

For Supabase (recommended):
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (URI mode)
5. Replace `[YOUR-PASSWORD]` with your database password

```env
DATABASE_URL="postgresql://postgres.abc123:your_password@db.your-project.supabase.co:5432/postgres"
```

**NEXTAUTH_SECRET** - Random secret key

Generate a secure random string:
```bash
openssl rand -base64 32
```

```env
NEXTAUTH_SECRET="your-generated-secret-here"
```

**NEXTAUTH_URL** - Application URL

```env
# Development
NEXTAUTH_URL="http://localhost:3000"

# Production
NEXTAUTH_URL="https://your-domain.com"
```

#### Optional Configuration (Email)

The app works without email configuration in development mode. Verification links will appear on screen.

For production with real emails:

1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Create App Password: https://myaccount.google.com/apppasswords
3. Update `.env`:

```env
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-16-char-app-password"
```

### 4. Setup Database

Run the database setup script:

```bash
npm run db:setup
```

This will:
- Generate Prisma Client
- Run database migrations
- Create all necessary tables

### 5. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## ✅ Verification

### Test Database Connection

Open Prisma Studio to view your database:

```bash
npm run db:studio
```

Visit: http://localhost:5555

You should see 5 tables:
- User
- Transaction
- Budget
- UserSettings
- VerificationToken

### Test Registration

1. Go to http://localhost:3000/register
2. Fill in the registration form
3. Click "Create account"
4. In development mode, you'll see the verification link on screen
5. Click the link to verify your email
6. You'll be automatically logged in

### Test Transactions

1. After logging in, you'll see the dashboard
2. Click "Add Transaction"
3. Fill in transaction details
4. Click "Add"
5. Transaction appears immediately
6. Refresh the page - data persists (stored in database)

## 🗄️ Database Management

### View Database

```bash
npm run db:studio
```

### Create Migration

```bash
npm run db:migrate
```

### Reset Database (⚠️ Deletes all data)

```bash
npm run db:reset
```

### Generate Prisma Client

```bash
npm run db:generate
```

## 📧 Email Setup (Production)

### Step 1: Enable 2-Step Verification

1. Go to: https://myaccount.google.com/security
2. Find "2-Step Verification"
3. Click "Get Started"
4. Follow the setup process

### Step 2: Create App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in if prompted
3. Select app: "Mail"
4. Select device: "Other (Custom name)"
5. Enter: "Finance Tracker"
6. Click "Generate"
7. Copy the 16-character password
8. Remove spaces: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

### Step 3: Update Environment

Add to `.env`:

```env
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="abcdefghijklmnop"
```

### Step 4: Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 5: Test Email

1. Register a new user with a real email
2. Check your inbox for verification email
3. Click the verification link
4. You'll be logged in automatically

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `EMAIL_USER` (optional)
   - `EMAIL_PASSWORD` (optional)
6. Click "Deploy"

### Environment Variables for Production

Make sure to set these in your deployment platform:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

## 🆘 Troubleshooting

### Database Connection Issues

**Error:** "Can't reach database server"

**Solutions:**
1. Check `DATABASE_URL` in `.env`
2. Verify database is running
3. Check firewall settings
4. Ensure correct password in connection string

### Email Not Sending

**Error:** "Failed to send verification email"

**Solutions:**
1. App works in development mode without email
2. Verification link appears on screen
3. For production, configure Gmail (see Email Setup)
4. Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
5. Verify 2-Step Verification is enabled
6. Try generating a new app password

### Port Already in Use

**Error:** "Port 3000 is already in use"

**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Prisma Client Not Found

**Error:** "Cannot find module '@prisma/client'"

**Solution:**
```bash
npm run db:generate
```

### Migration Failed

**Error:** "Migration failed"

**Solution:**
```bash
# Reset database and try again
npm run db:reset
npm run db:setup
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🎉 Success!

If everything is working:
- ✅ Database connected
- ✅ Server running on http://localhost:3000
- ✅ Can register users
- ✅ Can verify emails
- ✅ Can add/delete transactions
- ✅ Data persists in database

You're ready to start using the Finance Tracker!

## 📞 Support

For issues:
1. Check this setup guide
2. Review error messages in console
3. Verify `.env` configuration
4. Check database connection
5. Open an issue on GitHub

Happy tracking! 💰📊
