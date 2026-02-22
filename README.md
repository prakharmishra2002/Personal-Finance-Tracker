# 💰 Personal Finance Tracker

A modern, full-stack personal finance management application built with Next.js, TypeScript, PostgreSQL, and Prisma ORM.

![Finance Tracker](Finance%20Tracker%20Image.png)

## ✨ Features

- 🔐 **Secure Authentication** - Email verification with bcrypt password encryption
- 💳 **Transaction Management** - Track income and expenses with categories
- 📊 **Financial Analytics** - Visual charts and spending insights
- 💰 **Budget Tracking** - Set and monitor budget limits
- 💱 **Currency Converter** - Real-time exchange rates
- 🤖 **AI Chatbot** - Financial assistance and insights
- 📱 **Responsive Design** - Works on all devices
- 🗄️ **PostgreSQL Database** - Secure and scalable data storage

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (we recommend [Supabase](https://supabase.com) - free tier)
- Gmail account (for email verification)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/personal-finance-tracker.git
cd personal-finance-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

**Option A: Supabase (Recommended - Free)**

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Get connection string from Settings → Database → Connection string (URI)
4. Copy `.env.example` to `.env`
5. Update `DATABASE_URL` in `.env` with your Supabase connection string

**Option B: Local PostgreSQL**

1. Install PostgreSQL locally
2. Create database: `createdb finance_tracker`
3. Update `DATABASE_URL` in `.env`

### 4. Setup Database Tables

```bash
npm run db:setup
```

This will:
- Generate Prisma Client
- Create all database tables
- Set up relationships

### 5. Configure Email (Optional for Development)

The app works in development mode without email configuration. For production:

1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Create App Password: https://myaccount.google.com/apppasswords
3. Update `.env`:
```env
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-16-char-app-password"
```

**Development Mode:** Without email config, verification links appear on screen.

### 6. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   └── transactions/  # Transaction CRUD operations
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── verify-email/     # Email verification page
├── components/
│   ├── ui/               # Reusable UI components
│   ├── dashboard-layout.tsx
│   ├── transaction-list.tsx
│   └── ...
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── email.ts          # Email service
│   └── utils.ts          # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
└── services/
    └── email-service.ts  # Email verification service
```

## 🗄️ Database Schema

### User
- id, email, name, password (hashed)
- verified status
- Relations: transactions, budgets, settings

### Transaction
- id, userId, date, description
- amount, category, currency
- Indexed by userId, date, category

### Budget
- id, userId, category, amount
- period (weekly/monthly/yearly)
- Unique constraint on userId + category + period

### UserSettings
- User preferences and notification settings

### VerificationToken
- Email verification tokens
- 24-hour expiry

## 🔐 Security Features

- ✅ **Password Encryption** - bcrypt with 10 rounds
- ✅ **Email Verification** - Required before login
- ✅ **SQL Injection Prevention** - Prisma ORM
- ✅ **XSS Protection** - React escaping
- ✅ **Secure Tokens** - Cryptographically random
- ✅ **Session Management** - Secure token storage

## 📧 Email Configuration

### Development Mode (Default)
- No email setup required
- Verification links shown on screen
- Perfect for testing

### Production Mode
1. Enable Gmail 2-Step Verification
2. Create App Password
3. Update `.env` with credentials
4. Restart server

**Detailed Guide:** See "Email Setup" section below

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:setup         # Initial database setup
npm run db:studio        # Open Prisma Studio (database viewer)
npm run db:migrate       # Create new migration
npm run db:generate      # Generate Prisma Client
npm run db:reset         # Reset database (deletes all data!)

# Utilities
npm run db:check         # Check database connection
```

## 🎨 Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Custom with bcrypt
- **Email:** Nodemailer (Gmail SMTP)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React

## 📊 Features in Detail

### Authentication
- Email/password registration
- Email verification required
- Secure password hashing
- Session management
- Auto-login after verification

### Transaction Management
- Add income/expenses
- Categorize transactions
- Filter by category and date
- Delete transactions
- Real-time updates

### Dashboard
- Financial overview (balance, income, expenses)
- Recent transactions
- Spending by category (pie chart)
- Monthly trends
- Budget progress

### Currency Converter
- Real-time exchange rates
- Multiple currencies supported
- Easy conversion interface

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `DATABASE_URL`
   - `EMAIL_USER` (optional)
   - `EMAIL_PASSWORD` (optional)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
5. Deploy!

### Environment Variables

```env
# Required
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Optional (for email)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

## 📖 Email Setup Guide

### Step 1: Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow setup process

### Step 2: Create App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" → "Other (Custom name)"
3. Type: `Finance Tracker`
4. Click "Generate"
5. Copy 16-character password (remove spaces)

### Step 3: Update .env
```env
EMAIL_USER="youremail@gmail.com"
EMAIL_PASSWORD="abcdefghijklmnop"
```

### Step 4: Restart Server
```bash
npm run dev
```

## 🧪 Testing

### Test Registration
1. Go to http://localhost:3000/register
2. Fill in form with real email
3. Click "Create account"
4. Check email or screen for verification link
5. Click verification link
6. Auto-login to dashboard

### Test Transactions
1. Click "Add Transaction"
2. Fill in details
3. Click "Add"
4. Transaction appears immediately
5. Refresh page - data persists

### Verify Database
```bash
npm run db:studio
```
- View all tables
- Check user verification status
- See transactions in real-time

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### "Can't reach database server"
- Check `DATABASE_URL` in `.env`
- Verify database is running
- Test connection: `npm run db:check`

### "Failed to send verification email"
- App works in development mode without email
- For production, configure Gmail (see Email Setup)
- Check console for verification link

### "Invalid email or password"
- Email is case-sensitive
- Make sure account is verified
- Check password carefully

### Port already in use
```bash
npx kill-port 3000
npm run dev
```

## 📞 Support

For issues and questions:
- Check existing documentation
- Review error messages in console
- Verify `.env` configuration
- Check database connection

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database hosted on [Supabase](https://supabase.com)
- Icons from [Lucide](https://lucide.dev/)

---

Made with ❤️ for better financial management
