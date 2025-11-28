# 🆓 Free Email Setup Guide (2 Minutes!)

## Step 1: Sign Up for Resend (FREE - No Credit Card!)

1. Go to: **https://resend.com**
2. Click "**Start Building**" or "**Sign Up**"
3. Sign up with your email or GitHub account
4. **No credit card required!** ✅
5. Free tier: **3,000 emails/month**

## Step 2: Get Your API Key

1. After signing up, you'll land on the Resend dashboard
2. Look for "**API Keys**" in the left sidebar menu
3. You should see a default API key already created
4. Click the **copy icon** next to it
5. Your API key starts with `re_` (like `re_123abc456def...`)

## Step 3: Add API Key to Your Project

Open your terminal in the project folder and run these commands:

```bash
# Navigate to project
cd /Users/arollin/Documents/projects/secret-santa

# Create .env.local file with your API key
cat > .env.local << 'EOF'
# Resend API Key (free at https://resend.com)
RESEND_API_KEY=re_PASTE_YOUR_KEY_HERE

# Test email address (works for free tier)
FROM_EMAIL=onboarding@resend.dev
EOF
```

**Important**: Replace `re_PASTE_YOUR_KEY_HERE` with the actual API key you copied!

## Alternative: Edit Manually

If the command above doesn't work, create the file manually:

1. Create a new file: `.env.local` in the project root
2. Add these two lines:

```
RESEND_API_KEY=re_PASTE_YOUR_KEY_HERE
FROM_EMAIL=onboarding@resend.dev
```

## Step 4: Restart the App

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 5: Test It!

1. Go to http://localhost:3000
2. Click "**Send All Assignments**"
3. Real emails will be sent! 📧
4. Check the terminal - you'll see:
   - ✅ "EMAIL sent to pikachu@reactsoftwareinc.com"
   - ✅ "Successfully sent to 6 participant(s)"

## What You Get (FREE!)

- ✅ 3,000 emails per month
- ✅ 100 emails per day
- ✅ No credit card needed
- ✅ No expiration
- ✅ Perfect for Secret Santa!

## Adding More Participants

To send emails to other people, edit `lib/participants.ts`:

```typescript
{
  id: 'genevieve',
  name: 'Genevieve',
  familyGroup: 'Rollin',
  email: 'genevieve@example.com',  // Add real email here
},
```

## Troubleshooting

**Problem**: "RESEND_API_KEY not configured"
- **Solution**: Make sure `.env.local` exists and has the right key

**Problem**: Email not sending
- **Solution**: 
  1. Check the API key is correct (starts with `re_`)
  2. Restart the dev server after adding `.env.local`
  3. Check the terminal logs for errors

**Problem**: Can't find API key on Resend
- **Solution**: 
  1. Go to https://resend.com
  2. Sign in
  3. Click "API Keys" in left menu
  4. Click "Create API Key" if needed

## Free SMS (Bonus!)

For free SMS, just add carrier info to participants:

```typescript
{
  id: 'augustus',
  name: 'Augustus',
  phone: '9784932081',
  carrier: 'verizon',  // This enables FREE SMS!
  email: 'pikachu@reactsoftwareinc.com',
},
```

Supported carriers: verizon, att, tmobile, sprint, us-cellular, boost, cricket, metropcs

SMS works through email-to-SMS gateways (100% free, no API keys needed!)

## Total Cost: $0/month! 🎉

Merry Christmas! 🎄

