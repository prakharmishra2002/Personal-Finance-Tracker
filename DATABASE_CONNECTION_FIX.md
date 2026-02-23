# Database Connection Fix for Vercel Deployment

## Problem
Registration fails with 500 error in production. The issue is database connectivity between Vercel and Supabase.

## Root Cause
Supabase requires different connection strings for:
1. **Connection Pooling** (port 6543) - For serverless environments like Vercel
2. **Direct Connection** (port 5432) - For migrations and local development

Vercel serverless functions need the pooled connection to avoid connection limits.

## Solution

### Step 1: Get Your Supabase Connection Strings

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on your project
3. Go to **Settings** → **Database**
4. Scroll down to **Connection string**
5. You'll see two options:

**Connection Pooling (Use this for Vercel):**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
```

**Direct Connection (Use this for migrations):**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Step 2: Update Your DATABASE_URL Format

Your current DATABASE_URL format is incorrect. It should use `:` not `.` after `postgres`.

**WRONG:**
```
postgresql://postgres:Vishu@finance-tracker123@db.susrrdtbytsrreqbmlhd.supabase.co:5432/postgres
```

**CORRECT (Connection Pooling - for Vercel):**
```
postgresql://postgres.susrrdtbytsrreqbmlhd:Vishu@finance-tracker123@db.susrrdtbytsrreqbmlhd.supabase.co:6543/postgres?pgbouncer=true
```

**CORRECT (Direct Connection - for migrations):**
```
postgresql://postgres.susrrdtbytsrreqbmlhd:Vishu@finance-tracker123@db.susrrdtbytsrreqbmlhd.supabase.co:5432/postgres
```

### Step 3: Update Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Update these variables:

```env
DATABASE_URL=postgresql://postgres.susrrdtbytsrreqbmlhd:Vishu@finance-tracker123@db.susrrdtbytsrreqbmlhd.supabase.co:6543/postgres?pgbouncer=true

DIRECT_URL=postgresql://postgres.susrrdtbytsrreqbmlhd:Vishu@finance-tracker123@db.susrrdtbytsrreqbmlhd.supabase.co:5432/postgres
```

**Important:** Make sure to:
- Use port **6543** for DATABASE_URL (connection pooling)
- Use port **5432** for DIRECT_URL (direct connection)
- Add `?pgbouncer=true` to DATABASE_URL
- Replace `[PASSWORD]` with your actual password
- Replace `[PROJECT-REF]` with your actual project reference

### Step 4: Update Local .env File

Update your local `.env` file with the same format:

```env
DATABASE_URL="postgresql://postgres.susrrdtbytsrreqbmlhd:Vishu@finance-tracker123@db.susrrdtbytsrreqbmlhd.supabase.co:6543/postgres?pgbouncer=true"

DIRECT_URL="postgresql://postgres.susrrdtbytsrreqbmlhd:Vishu@finance-tracker123@db.susrrdtbytsrreqbmlhd.supabase.co:5432/postgres"
```

### Step 5: Commit and Push Changes

The code has been updated with:
- Enhanced database connection handling in `lib/prisma.ts`
- Connection pooling support in `prisma/schema.prisma`
- Detailed logging in `app/api/auth/register/route.ts`

Commit and push these changes:

```bash
git add .
git commit -m "Fix database connection for Vercel deployment"
git push origin main
```

### Step 6: Verify Deployment

1. Wait for Vercel to redeploy (automatic after push)
2. Try to register a new user
3. Check Vercel Function Logs:
   - Go to your Vercel project
   - Click on **Deployments**
   - Click on the latest deployment
   - Click on **Functions**
   - Click on `/api/auth/register`
   - View the logs to see detailed error messages

## What Changed in the Code

### 1. `lib/prisma.ts`
- Added explicit datasource configuration
- Better connection handling for Vercel

### 2. `prisma/schema.prisma`
- Added `directUrl` for migrations
- Supports both pooled and direct connections

### 3. `app/api/auth/register/route.ts`
- Added comprehensive logging at each step
- Tests database connection before queries
- Properly disconnects after request
- Better error messages

## Debugging Steps

If it still doesn't work after these changes:

1. **Check Vercel Logs:**
   - Look for the detailed console.log messages
   - Find where exactly it fails (connection, query, etc.)

2. **Verify Supabase:**
   - Make sure your Supabase project is active
   - Check if you can connect from Supabase SQL Editor
   - Verify your password is correct

3. **Test Connection String:**
   - Copy your DATABASE_URL from Vercel
   - Try connecting with a PostgreSQL client (like pgAdmin or DBeaver)
   - This will confirm if the connection string is valid

4. **Check Supabase Logs:**
   - Go to Supabase Dashboard → Logs
   - Look for connection attempts from Vercel

## Common Issues

### Issue 1: "Connection timeout"
**Solution:** Use connection pooling (port 6543) instead of direct connection (port 5432)

### Issue 2: "Too many connections"
**Solution:** Add `?pgbouncer=true` to your DATABASE_URL

### Issue 3: "Authentication failed"
**Solution:** Check your password format - special characters might need URL encoding

### Issue 4: "Database does not exist"
**Solution:** Make sure you're using the correct database name (usually `postgres` for Supabase)

## Next Steps

After fixing the connection:
1. Test registration with a real email
2. Check if verification email is sent
3. Test login after email verification
4. Test dashboard data fetching

## Need More Help?

If you're still seeing errors:
1. Share the Vercel Function Logs for `/api/auth/register`
2. Confirm your DATABASE_URL format (hide the password)
3. Check if you can connect to Supabase from your local machine
