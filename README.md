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
- PostgreSQL database (we recommend [Neon](https://neon.tech) - free tier, optimized for Vercel)
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

**Option A: Neon (Recommended for Vercel/Production)**

1. Go to [neon.tech](https://neon.tech) and create an account.
2. Create a new project.
3. In the Dashboard, select **Prisma** from the connection string dropdown.
4. Copy the URL and update `DATABASE_URL` and `DIRECT_URL` in your `.env` file.

**Option B: Supabase**

1. Go to [supabase.com](https://supabase.com) and create project.
2. Get the connection string.
3. Update `.env` with your Supabase credentials.

### 4. Setup Database Tables

```bash
npx prisma generate
npx prisma db push
```

This will:
- Generate Prisma Client
- Create/Sync all database tables
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
│   ├── prisma.ts         # Prisma client (Optimized for Serverless)
│   ├── email.ts          # Email service
│   └── utils.ts          # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
└── services/
    └── email-service.ts  # Email verification service
```

## 🔐 Security Features

- ✅ **Password Encryption** - bcrypt with 10 rounds
- ✅ **Email Verification** - Required before login
- ✅ **SQL Injection Prevention** - Prisma ORM
- ✅ **XSS Protection** - React escaping
- ✅ **Secure Tokens** - Cryptographically random
- ✅ **Session Management** - Secure token storage

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema to database
npx prisma studio        # Open Prisma Studio (database viewer)
```

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub.
2. Import repository to Vercel.
3. Add Environment Variables:
   - `DATABASE_URL` (Use Neon connection string)
   - `DIRECT_URL` (Use Neon connection string)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (Your production URL)
   - `EMAIL_USER` & `EMAIL_PASSWORD` (Optional)
4. Deploy!

## 🧪 Testing

### Test Registration
1. Go to http://localhost:3000/register
2. Fill in form with real email
3. Click "Create account"
4. Check email or screen for verification link

### Verify Database
```bash
npx prisma studio
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ for better financial management
