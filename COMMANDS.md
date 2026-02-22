# 🎯 Quick Command Reference

Essential commands for the Personal Finance Tracker project.

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Setup database
npm run db:setup
```

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## 🗄️ Database

```bash
# Setup database (first time)
npm run db:setup

# View database in browser
npm run db:studio

# Create new migration
npm run db:migrate

# Generate Prisma Client
npm run db:generate

# Reset database (⚠️ deletes all data)
npm run db:reset
```

## 🔧 Git

```bash
# Initialize repository
git init

# Check status
git status

# Add all files
git add .

# Commit changes
git commit -m "Your message"

# Add remote
git remote add origin https://github.com/username/repo.git

# Push to GitHub
git push -u origin main

# Pull latest changes
git pull

# Create new branch
git checkout -b feature-name

# Switch branch
git checkout main
```

## 🧪 Testing

```bash
# Check TypeScript errors
npm run build

# View database
npm run db:studio

# Test registration
# 1. npm run dev
# 2. Go to http://localhost:3000/register
# 3. Fill form and submit
# 4. Click verification link

# Test transactions
# 1. Login to dashboard
# 2. Click "Add Transaction"
# 3. Fill details and submit
# 4. Verify in database: npm run db:studio
```

## 🌐 Deployment

```bash
# Build for production
npm run build

# Test production build locally
npm run start

# Deploy to Vercel (after connecting GitHub)
# Just push to main branch - auto deploys!
git push
```

## 🔍 Troubleshooting

```bash
# Kill process on port 3000
npx kill-port 3000

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Reset database
npm run db:reset
npm run db:setup

# Check database connection
# Open .env and verify DATABASE_URL

# Generate Prisma Client
npm run db:generate
```

## 📧 Email Setup

```bash
# 1. Enable 2-Step Verification
# Visit: https://myaccount.google.com/security

# 2. Create App Password
# Visit: https://myaccount.google.com/apppasswords

# 3. Update .env
# EMAIL_USER="your-email@gmail.com"
# EMAIL_PASSWORD="your-app-password"

# 4. Restart server
# Ctrl+C to stop
npm run dev
```

## 🔐 Environment Variables

```bash
# Required
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="random-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional (for email)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

## 📊 Useful Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# List installed packages
npm list --depth=0

# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Install specific package
npm install package-name

# Uninstall package
npm uninstall package-name
```

## 🎯 Quick Start (New Setup)

```bash
# 1. Clone and install
git clone https://github.com/username/repo.git
cd repo
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values

# 3. Setup database
npm run db:setup

# 4. Start development
npm run dev
```

## 🚀 Quick Deploy

```bash
# 1. Commit changes
git add .
git commit -m "Update: description"

# 2. Push to GitHub
git push

# 3. Vercel auto-deploys!
# (if connected to GitHub)
```

## 📝 Common Workflows

### Adding a New Feature

```bash
# 1. Create feature branch
git checkout -b feature-name

# 2. Make changes
# ... code ...

# 3. Test locally
npm run dev

# 4. Commit changes
git add .
git commit -m "Add: feature description"

# 5. Push to GitHub
git push -u origin feature-name

# 6. Create Pull Request on GitHub
```

### Updating Database Schema

```bash
# 1. Edit prisma/schema.prisma
# ... make changes ...

# 2. Create migration
npm run db:migrate

# 3. Generate client
npm run db:generate

# 4. Test changes
npm run dev
```

### Fixing Production Issues

```bash
# 1. Pull latest code
git pull

# 2. Install dependencies
npm install

# 3. Reset database if needed
npm run db:reset
npm run db:setup

# 4. Test locally
npm run dev

# 5. If fixed, push
git add .
git commit -m "Fix: issue description"
git push
```

## 🎉 Success Commands

```bash
# Everything working?
npm run dev
# Visit: http://localhost:3000

# Database connected?
npm run db:studio
# Visit: http://localhost:5555

# Ready to push?
git status
git add .
git commit -m "Initial commit"
git push
```

---

**Quick Reference:** Bookmark this page for easy access to all commands!
