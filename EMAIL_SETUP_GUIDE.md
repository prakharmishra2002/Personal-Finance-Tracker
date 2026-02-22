# 📧 Gmail Email Setup Guide

## 🎯 Overview

Your Finance Tracker now sends **real verification emails** using Gmail SMTP. Follow this guide to set up your Gmail account for sending emails.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Enable 2-Step Verification

1. Go to: **https://myaccount.google.com/security**
2. Scroll down to "How you sign in to Google"
3. Click **"2-Step Verification"**
4. Click **"Get Started"**
5. Follow the prompts to set up 2-Step Verification
   - Enter your password
   - Add your phone number
   - Verify with code sent to your phone
6. Click **"Turn On"**

✅ 2-Step Verification is now enabled!

---

### Step 2: Create App Password

1. Go to: **https://myaccount.google.com/apppasswords**
   - Or: Google Account → Security → 2-Step Verification → App passwords
2. You may need to sign in again
3. Under "Select app", choose **"Mail"**
4. Under "Select device", choose **"Other (Custom name)"**
5. Type: `Finance Tracker`
6. Click **"Generate"**
7. You'll see a 16-character password like: `abcd efgh ijkl mnop`
8. **Copy this password** (you won't see it again!)

✅ App password created!

---

### Step 3: Update Your .env File

1. Open your `.env` file in the project root
2. Find these lines:
```env
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-16-char-app-password"
```

3. Replace with your actual values:
```env
EMAIL_USER="youremail@gmail.com"
EMAIL_PASSWORD="abcdefghijklmnop"
```

**Important:**
- Remove spaces from the app password
- Use your full Gmail address
- Keep the quotes around the values

Example:
```env
EMAIL_USER="john.doe@gmail.com"
EMAIL_PASSWORD="abcdefghijklmnop"
```

4. Save the file

✅ Configuration complete!

---

### Step 4: Test It!

1. Start your app:
```bash
npm run dev
```

2. Go to: http://localhost:3000/register

3. Register with a real email address

4. Check your email inbox!

You should receive a beautiful verification email with a link.

✅ Email sending works!

---

## 🔒 Security Notes

### Why App Password?

- **More secure** than using your actual Gmail password
- **Limited access** - only for sending emails
- **Revocable** - can be deleted anytime without changing your Gmail password
- **Required** - Gmail doesn't allow regular passwords for third-party apps

### Keep Your Credentials Safe

- ✅ Never commit `.env` file to Git
- ✅ `.env` is already in `.gitignore`
- ✅ Use different app passwords for different apps
- ✅ Revoke app passwords you're not using

### Revoke App Password

If you need to revoke:
1. Go to: https://myaccount.google.com/apppasswords
2. Find "Finance Tracker"
3. Click "Remove"

---

## 📧 Email Features

### Verification Email

When users register, they receive:
- ✅ Beautiful HTML email with your branding
- ✅ Clear call-to-action button
- ✅ Verification link (expires in 24 hours)
- ✅ Plain text fallback for email clients
- ✅ Professional design

### Email Template

The email includes:
- Welcome message with user's name
- Verification button (prominent)
- Backup link (copy-paste)
- Expiry notice (24 hours)
- Footer with branding

---

## 🛠️ Troubleshooting

### "Invalid login" or "Authentication failed"

**Problem:** Gmail is rejecting your credentials

**Solutions:**
1. Check 2-Step Verification is enabled
2. Verify app password is correct (no spaces)
3. Make sure you're using app password, not Gmail password
4. Try generating a new app password

### "Less secure app access"

**Problem:** Old Gmail security setting

**Solution:**
- This setting is deprecated
- Use App Passwords instead (Step 2)
- 2-Step Verification is required

### Email not received

**Check:**
1. Spam/Junk folder
2. Email address is correct
3. Gmail account has sending limits (500 emails/day for free accounts)
4. Check console for errors: `npm run dev` and look for email errors

### "ECONNREFUSED" error

**Problem:** Can't connect to Gmail SMTP

**Solutions:**
1. Check your internet connection
2. Verify firewall isn't blocking port 587
3. Try port 465 (see Advanced Configuration)

### Rate Limiting

Gmail free accounts have limits:
- **500 emails per day**
- **100 emails per hour** (approximately)

For production with high volume:
- Use SendGrid, AWS SES, or Mailgun
- These services have higher limits
- More reliable delivery

---

## 🎨 Customize Email Template

The email template is in `lib/email.ts`

### Change Colors

Find this line:
```typescript
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Replace with your brand colors:
```typescript
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

### Change Button Color

Find:
```typescript
background: #667eea;
```

Replace with your color:
```typescript
background: #your-button-color;
```

### Change Text

Edit the HTML content in `sendVerificationEmail` function:
```typescript
<h1>Welcome to Finance Tracker!</h1>
```

---

## 📊 Email Service Comparison

### Gmail (Current Setup)
- ✅ Free
- ✅ Easy setup
- ✅ 500 emails/day
- ❌ Not ideal for production
- ❌ Lower deliverability

### SendGrid (Recommended for Production)
- ✅ 100 emails/day free
- ✅ Better deliverability
- ✅ Email analytics
- ✅ Professional
- 💰 Paid plans available

### AWS SES
- ✅ Very cheap ($0.10 per 1000 emails)
- ✅ Highly scalable
- ✅ Reliable
- ❌ More complex setup
- ❌ Requires AWS account

### Mailgun
- ✅ 5,000 emails/month free
- ✅ Good deliverability
- ✅ Easy API
- 💰 Paid plans available

---

## 🚀 Upgrade to SendGrid (Optional)

For production, consider SendGrid:

### 1. Sign Up
- Go to: https://sendgrid.com
- Create free account
- Verify your email

### 2. Get API Key
- Dashboard → Settings → API Keys
- Create API Key
- Copy the key

### 3. Install SendGrid
```bash
npm install @sendgrid/mail
```

### 4. Update .env
```env
SENDGRID_API_KEY=your_api_key_here
```

### 5. Update lib/email.ts
```typescript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendVerificationEmail(to: string, url: string, name: string) {
  await sgMail.send({
    to,
    from: 'noreply@yourdomain.com', // Must be verified in SendGrid
    subject: 'Verify Your Email',
    html: // your HTML template
  })
}
```

---

## ✅ Checklist

Before going live:

- [ ] 2-Step Verification enabled on Gmail
- [ ] App password created
- [ ] .env file updated with credentials
- [ ] Tested email sending locally
- [ ] Checked spam folder
- [ ] Email template customized (optional)
- [ ] .env file NOT committed to Git
- [ ] Consider upgrading to SendGrid for production

---

## 🎉 You're Ready!

Your email system is configured and ready to send verification emails!

Test it:
```bash
npm run dev
```

Visit: http://localhost:3000/register

Register with your email and check your inbox!

---

## 📖 Additional Resources

- Gmail App Passwords: https://support.google.com/accounts/answer/185833
- Nodemailer Docs: https://nodemailer.com/
- SendGrid Docs: https://docs.sendgrid.com/
- Email Best Practices: https://sendgrid.com/blog/email-best-practices/

---

## 🆘 Need Help?

If you're stuck:
1. Check the troubleshooting section above
2. Verify your .env file is correct
3. Check console for error messages
4. Make sure 2-Step Verification is enabled
5. Try generating a new app password

Happy emailing! 📧✨
