# 🚀 Quick Fix Guide - Database Connection Error

## Problem
Registration fails with 500 error because of database connectivity issue.

## Root Cause
Wrong DATABASE_URL format - using direct connection instead of connection pooling.

---

## ⚡ Quick Fix (3 Steps)

### Step 1: Update DATABASE_URL in Vercel

Go to: **Vercel Dashboard → Settings → Environment Variables**

**Change DATABASE_URL from:**
```
postgresql://postgres:Vishu@finance-tracker123@db.susrrdtbytsrreqbmlhd.supabase.co:5432/postgres
```

**To:**
```
postgresql://postgres.susrrdtbytsrreqbmlhd:Vishu@finance-tracker123@db.susrrdtbytsrreqbmlhd.supabase.co:6543/postgres?pgbouncer=true
```

**Key changes:**
- Username: `postgres.susrrdtbytsrreqbmlhd` (add project ref)
- Port: `6543` (was `5432`)
- Add: `?pgbouncer=true`

### Step 2: Add DIRECT_URL in Vercel

**Add new variable:**

**Name:** `DIRECT_URL`

**Value:**
```
postgresql://postgres.susrrdtbytsrreqbmlhd:Vishu@finance-tracker123@db.susrrdtbytsrreqbmlhd.supabase.co:5432/postgres
```

### Step 3: Commit and Push

```bash
git add .
git commit -m "Fix database connection for Vercel"
git push origin main
```

Wait for Vercel to redeploy (automatic).

---

## ✅ Test

1. Go to your app
2. Try to register
3. Should work now!

---

## 🔍 Check Logs

If still not working:

**Vercel Dashboard → Deployments → Latest → Functions → `/api/auth/register`**

Look for:
- "Database connection successful" ✅
- "User created successfully" ✅

---

## 📚 More Details

- **Full troubleshooting:** `RUNTIME_ERROR_FIX.md`
- **Complete guide:** `DATABASE_CONNECTION_FIX.md`

---

**That's it! Your app should work after these changes. 🎉**
