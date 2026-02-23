# 🚀 Vercel Deployment Guide

## ⚠️ Fix Deployment Error

If you're seeing a deployment error, follow these steps:

### 1. Update Your Code

The `package.json` has been updated with:
- `postinstall` script to generate Prisma Client
- Updated `build` script to include Prisma generation

**Commit and push the changes:**

```bash
git add package.json
git commit -m "Fix: Add Prisma generation to build process"
git push
```

### 2. Configure Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

**Required:**

```env
DATABASE_URL=your_supabase_connection_string
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=https://your-app.vercel.app
```

**Optional (for email):**

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

#### How to Add Environment Variables:

1. Go to your Vercel dashboard
2. Select your project
3. Click "Settings"
4. Click "Environment Variables"
5. Add each variable:
   - Name: `DATABASE_URL`
   - Value: Your Supabase connection string
   - Environment: Production, Preview, Development (select all)
   - Click "Save"
6. Repeat for all variables

### 3. Redeploy

After adding environment variables:

1. Go to "Deployments" tab
2. Click the three dots (...) on the failed deployment
3. Click "Redeploy"

Or push a new commit:

```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

## 📋 Complete Setup Checklist

### Before Deployment

- [ ] Code pushed to GitHub
- [ ] Database created on Supabase
- [ ] Database connection string ready
- [ ] `package.json` updated with Prisma scripts

### In Vercel Dashboard

- [ ] Project connected to GitHub
- [ ] Environment variables added:
  - [ ] `DATABASE_URL`
  - [ ] `NEXTAUTH_SECRET`
  - [ ] `NEXTAUTH_URL`
  - [ ] `EMAIL_USER` (optional)
  - [ ] `EMAIL_PASSWORD` (optional)
- [ ] Deployment triggered

### After Deployment

- [ ] Visit your app URL
- [ ] Test registration
- [ ] Test login
- [ ] Test transactions
- [ ] Check database in Supabase

---

## 🔧 Environment Variables Details

### DATABASE_URL

Your Supabase PostgreSQL connection string.

**Format:**
```
postgresql://postgres.PROJECT_REF:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
```

**Where to find:**
1. Go to Supabase dashboard
2. Select your project
3. Settings → Database
4. Connection string → URI
5. Replace `[YOUR-PASSWORD]` with your database password

**Example:**
```
postgresql://postgres.abc123:MyPassword123@db.abc123.supabase.co:5432/postgres
```

### NEXTAUTH_SECRET

A random secret key for authentication.

**Generate:**
```bash
openssl rand -base64 32
```

Or use any random string generator.

**Example:**
```
dGhpc2lzYXJhbmRvbXNlY3JldGtleWZvcmF1dGhlbnRpY2F0aW9u
```

### NEXTAUTH_URL

Your deployed application URL.

**Format:**
```
https://your-app-name.vercel.app
```

**Find it:**
- After first deployment, Vercel assigns a URL
- Use that URL for `NEXTAUTH_URL`
- Or use your custom domain if configured

**Example:**
```
https://personal-finance-tracker-84iaaf10y.vercel.app
```

### EMAIL_USER & EMAIL_PASSWORD (Optional)

Gmail credentials for sending verification emails.

**EMAIL_USER:**
```
your-email@gmail.com
```

**EMAIL_PASSWORD:**
Your Gmail App Password (16 characters, no spaces)

**How to get:**
1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Create App Password: https://myaccount.google.com/apppasswords
3. Copy the 16-character password

**Example:**
```
EMAIL_USER=myapp@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**Note:** Without email configuration, the app works in development mode (verification links shown on screen).

---

## 🐛 Troubleshooting

### Build Failed: "Cannot find module '@prisma/client'"

**Solution:** The `postinstall` script should fix this. If not:

1. Make sure `package.json` has:
```json
"postinstall": "prisma generate"
```

2. Commit and push:
```bash
git add package.json
git commit -m "Add postinstall script"
git push
```

### Build Failed: "Database connection error"

**Solution:** Check your `DATABASE_URL` environment variable:

1. Go to Vercel → Settings → Environment Variables
2. Verify `DATABASE_URL` is correct
3. Make sure you replaced `[YOUR-PASSWORD]` with actual password
4. Redeploy

### Runtime Error: "Invalid environment variables"

**Solution:** Add missing environment variables:

1. Check which variables are missing in the error
2. Add them in Vercel → Settings → Environment Variables
3. Redeploy

### Email Not Sending in Production

**Solution:** This is expected if email variables are not set.

**Options:**
1. Add `EMAIL_USER` and `EMAIL_PASSWORD` environment variables
2. Or leave them out - app works in development mode (links shown on screen)

### Database Tables Not Created

**Solution:** Run migrations manually:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login:
```bash
vercel login
```

3. Link project:
```bash
vercel link
```

4. Run migration:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

Or use Supabase SQL Editor to run migrations manually.

---

## ✅ Successful Deployment Checklist

After deployment succeeds:

- [ ] App loads at your Vercel URL
- [ ] Can access homepage
- [ ] Can register new user
- [ ] Verification link works (email or on-screen)
- [ ] Can login
- [ ] Dashboard loads
- [ ] Can add transactions
- [ ] Transactions persist (check database)
- [ ] No console errors

---

## 🎯 Quick Fix Commands

If deployment fails, try these:

```bash
# 1. Update package.json (already done)
git add package.json
git commit -m "Fix: Add Prisma generation to build"
git push

# 2. Trigger redeploy
git commit --allow-empty -m "Trigger redeploy"
git push

# 3. Check logs in Vercel dashboard
# Go to Deployments → Click failed deployment → View logs
```

---

## 📞 Still Having Issues?

1. **Check Vercel Logs:**
   - Go to Deployments
   - Click on failed deployment
   - Read the error message

2. **Common Issues:**
   - Missing environment variables
   - Wrong DATABASE_URL format
   - Prisma Client not generated
   - Database not accessible

3. **Verify Environment Variables:**
   - All required variables are set
   - No typos in variable names
   - Values are correct (no placeholders)

4. **Test Locally:**
   ```bash
   npm run build
   ```
   If it fails locally, fix the error before deploying.

---

## 🎉 Success!

Once deployment succeeds:

1. Visit your app: `https://your-app.vercel.app`
2. Test all features
3. Share your app!

**Your Finance Tracker is now live! 🚀**

---

## 📖 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Supabase Documentation](https://supabase.com/docs)

---

**Need more help?** Check the error logs in Vercel dashboard for specific error messages.
