# 🎯 GET POOLER URL FROM SUPABASE - Step by Step

## ✅ Confirmed: IPv4 is NOT enabled
## ✅ Solution: Use Connection Pooler

---

## 📋 Follow These Exact Steps

### Step 1: Open Supabase Dashboard

Go to: https://supabase.com/dashboard

### Step 2: Click Your Project

Click on: **finance-tracker**

### Step 3: Go to Database Settings

1. Click **Settings** (⚙️ icon in left sidebar)
2. Click **Database**

### Step 4: Scroll to Connection String

Scroll down until you see a section called **"Connection string"**

### Step 5: Click "Connection Pooling" Tab

You'll see TWO tabs:
- "Direct Connection" ❌ (Don't use this)
- **"Connection Pooling"** ✅ (Click this one!)

### Step 6: Select Mode

You'll see a dropdown that says **"Mode"**

Select: **Transaction**

(If Transaction doesn't work later, we'll try Session)

### Step 7: Copy the URL

You'll see a connection string that looks like:

```
postgresql://postgres.[SOMETHING]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**Click the COPY button** (📋 icon) to copy it.

**IMPORTANT:** Don't try to type it manually - use the copy button!

### Step 8: Paste It Here

Once you copy it, paste it in a reply to me. It will look something like:

```
postgresql://postgres.abcd1234:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**Don't worry about the password placeholder** - I'll help you replace it.

---

## 🔍 What to Look For

The pooler URL should have:
- ✅ `pooler.supabase.com` in the host (NOT `db.susrrdtbytsrreqbmlhd.supabase.co`)
- ✅ Port `6543` (NOT `5432`)
- ✅ `aws-0-ap-south-1` (your region)
- ✅ `[YOUR-PASSWORD]` placeholder

---

## ❌ Common Mistakes

**DON'T use:**
```
postgresql://postgres:password@db.susrrdtbytsrreqbmlhd.supabase.co:5432/postgres
```
This is the direct connection - it won't work on Vercel!

**DO use:**
```
postgresql://postgres.XXXXX:password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```
This is the pooler - it will work on Vercel!

---

## 📸 Visual Guide

```
Supabase Dashboard
  └─ Projects
      └─ finance-tracker ← Click here
          └─ Left Sidebar
              └─ Settings (⚙️) ← Click here
                  └─ Database ← Click here
                      └─ Scroll down ↓
                          └─ "Connection string" section
                              └─ Tabs:
                                  ├─ Direct Connection ❌
                                  └─ Connection Pooling ✅ ← Click here!
                                      └─ Mode: Transaction ← Select this
                                      └─ Copy button 📋 ← Click this!
```

---

## 🎯 After You Copy It

Reply with the URL you copied, and I'll:
1. Replace the password with the correct format
2. Update your `.env` file
3. Test it locally
4. Update Vercel
5. Deploy

---

## 💡 Why We Need This

- IPv4 is not enabled on your Supabase project
- Vercel needs IPv4 to connect
- The connection pooler provides IPv4 access
- That's why we MUST use the pooler URL

---

**Go to Supabase now and copy that pooler URL! 🚀**

**Paste it here when you have it!**
