# 🔴 Runtime Error Fix - "Failed to register user"

## ✅ Build Succeeded, But Registration Failing

Your deployment built successfully, but you're getting "Failed to register user" error. This means **environment variables are not configured in Vercel**.

---

## 🚨 Immediate Fix

### Step 1: Add Environment Variables in Vercel

**Go to Vercel Dashboard:**
1. Visit: https://vercel.com/dashboard
2. Select your project: `personal-finance-tracker`
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in left sidebar

### Step 2: Add These Variables

Click **"Add New"** for each variable:

#### 1. DATABASE_URL (REQUIRED)

**Name:** `DATABASE_URL`

**Value:** Your Supabase connection string

**How to get it:**
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click Settings (⚙️) → Database
4. Scroll to "Connection string"
5. Click "URI" tab
6. Copy the string
7. **IMPORTANT:** Replace `[YOUR-PASSWORD]` with your actual database password

**Example:**
```
postgresql://postgres.susrrdtbytsrreqbmlhd:Vishu@finance-tracker123@db.susrrdtbytsrreqbmlhd.supabase.co:5432/postgres
```

**Your actual value (based on your .env):**
```
postgresql://postgres:Vishu@finance-tracker123@db.susrrdtbytsrreqbmlhd.supabase.co:5432/postgres
```

**Environments:** Select all three:
- ✅ Production
- ✅ Preview
- ✅ Development

Click **"Save"**

---

#### 2. NEXTAUTH_SECRET (REQUIRED)

**Name:** `NEXTAUTH_SECRET`

**Value:** Generate a random secret

**Generate it:**

**Option 1 - Using Command Line:**
```bash
openssl rand -base64 32
```

**Option 2 - Use this random one:**
```
dGhpc2lzYXJhbmRvbXNlY3JldGtleWZvcmF1dGhlbnRpY2F0aW9uMTIzNDU2Nzg5MA==
```

**Environments:** Select all three:
- ✅ Production
- ✅ Preview
- ✅ Development

Click **"Save"**

---

#### 3. NEXTAUTH_URL (REQUIRED)

**Name:** `NEXTAUTH_URL`

**Value:** Your Vercel app URL

**Find your URL:**
1. Go to Vercel Dashboard → Your Project
2. Look at the top - you'll see your deployment URL
3. It looks like: `https://personal-finance-tracker-84iaaf10y-prakhar-mishras-projects.vercel.app`

**Example:**
```
https://personal-finance-tracker-84iaaf10y-prakhar-mishras-projects.vercel.app
```

**Environments:** Select all three:
- ✅ Production
- ✅ Preview
- ✅ Development

Click **"Save"**

---

#### 4. EMAIL_USER (OPTIONAL)

**Name:** `EMAIL_USER`

**Value:** Your Gmail address

**Example:**
```
prakharmishra040@gmail.com
```

**Note:** Without this, verification links appear on screen (development mode)

**Environments:** Select all three if adding

Click **"Save"**

---

#### 5. EMAIL_PASSWORD (OPTIONAL)

**Name:** `EMAIL_PASSWORD`

**Value:** Your Gmail App Password (16 characters, no spaces)

**How to get:**
1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to: https://myaccount.google.com/apppasswords
4. Create app password for "Mail"
5. Copy the 16-character password
6. Remove spaces: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

**Example:**
```
abcdefghijklmnop
```

**Environments:** Select all three if adding

Click **"Save"**

---

### Step 3: Redeploy

After adding all environment variables:

**Option 1 - Automatic (Recommended):**
1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **three dots (...)** on the right
4. Click **"Redeploy"**
5. Confirm

**Option 2 - Push a commit:**
```bash
git commit --allow-empty -m "Trigger redeploy with environment variables"
git push
```

---

## ⏱️ Wait for Redeployment

1. Watch the deployment progress in Vercel
2. Should take 1-2 minutes
3. Wait for "Ready" status

---

## ✅ Test Again

Once redeployment is complete:

1. **Visit your app:** `https://your-app.vercel.app`
2. **Click "Sign up"**
3. **Fill in the form:**
   - Name: Test User
   - Email: your-email@gmail.com
   - Password: TestPassword123
   - Confirm Password: TestPassword123
4. **Click "Create account"**
5. **Should work now!**

---

## 🎯 Quick Checklist

Before testing:
- [ ] DATABASE_URL added in Vercel
- [ ] NEXTAUTH_SECRET added in Vercel
- [ ] NEXTAUTH_URL added in Vercel
- [ ] All variables saved
- [ ] Redeployed
- [ ] Deployment shows "Ready"

---

## 🐛 Still Getting Error?

### Check Environment Variables

1. Go to Vercel → Settings → Environment Variables
2. Verify all three required variables are there:
   - DATABASE_URL
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL
3. Check for typos in variable names (case-sensitive!)

### Check DATABASE_URL Format

Your DATABASE_URL should look like:
```
postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres
```

**Common mistakes:**
- ❌ Still has `[YOUR-PASSWORD]` placeholder
- ❌ Has spaces in the URL
- ❌ Missing `postgresql://` at the start
- ❌ Wrong password

**Your correct format:**
```
postgresql://postgres:Vishu@finance-tracker123@db.susrrdtbytsrreqbmlhd.supabase.co:5432/postgres
```

### Check Supabase Database

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Make sure it's running (green status)
4. Check "Table Editor" - tables should exist

### View Error Logs

1. Go to Vercel → Your Project
2. Click **"Deployments"**
3. Click on the latest deployment
4. Click **"Functions"** tab
5. Look for errors in the logs

---

## 📊 Expected Behavior After Fix

### With Email Configured:
- ✅ Registration succeeds
- ✅ Shows "Check your email" message
- ✅ Email sent to your inbox
- ✅ Click link in email
- ✅ Auto-login to dashboard

### Without Email (Development Mode):
- ✅ Registration succeeds
- ✅ Shows "Development Mode" warning
- ✅ Verification link appears on screen
- ✅ Click the link
- ✅ Auto-login to dashboard

---

## 🎉 Success Indicators

When it works, you'll see:
1. ✅ "Registration successful" message
2. ✅ Either email sent OR verification link on screen
3. ✅ Can click verification link
4. ✅ Redirected to dashboard
5. ✅ Dashboard shows $0.00 (correct!)

---

## 💡 Pro Tips

1. **Always redeploy after adding environment variables**
2. **Check variable names are exact (case-sensitive)**
3. **No spaces in DATABASE_URL**
4. **Use the URI format from Supabase, not Session mode**
5. **Make sure Supabase project is active**

---

## 📞 Quick Support

**Most common issue:** DATABASE_URL not set or incorrect

**Quick fix:**
1. Vercel → Settings → Environment Variables
2. Add DATABASE_URL with your Supabase connection string
3. Redeploy
4. Test again

---

## ✅ Final Checklist

- [ ] Added DATABASE_URL in Vercel
- [ ] Added NEXTAUTH_SECRET in Vercel
- [ ] Added NEXTAUTH_URL in Vercel
- [ ] Saved all variables
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Redeployed
- [ ] Waited for "Ready" status
- [ ] Tested registration
- [ ] Registration works!

---

**After adding environment variables and redeploying, your app should work perfectly! 🚀**
