# 🎅 Secret Santa - FREE Setup Guide

This guide shows you how to set up email and SMS notifications **completely free** - no credit card required!

## ✅ What You'll Get
- **FREE Email**: Up to 3,000 emails/month using Resend
- **FREE SMS**: Unlimited SMS using email-to-SMS gateways
- **No Credit Card**: No payment info needed
- **No API Fees**: Everything is completely free

---

## 📧 Step 1: Free Email with Resend

### Why Resend?
- **3,000 emails/month FREE** (no credit card needed)
- 100 emails/day
- Easy to use
- Works great with Next.js

### Setup Instructions

1. **Sign up at Resend** (2 minutes)
   - Go to https://resend.com
   - Click "Sign Up"
   - Use your email (no credit card needed!)

2. **Get your API key**
   - After signing up, go to the dashboard
   - Click "API Keys" in the sidebar
   - Copy your API key (starts with `re_`)

3. **Add to your project**
   Create a `.env.local` file in your project root:
   ```bash
   RESEND_API_KEY=re_your_api_key_here
   FROM_EMAIL=onboarding@resend.dev
   ```

4. **Test it!**
   - Start your dev server: `npm run dev`
   - Go to http://localhost:3000
   - Click "Send All Assignments"
   - Check the terminal for success messages

---

## 📱 Step 2: Free SMS with Email-to-SMS Gateways

### How it Works
Every mobile carrier provides a free email-to-SMS gateway. When you send an email to `phonenumber@carrier.com`, the carrier converts it to an SMS for free!

### Supported Carriers
- **Verizon**: `@vtext.com`
- **AT&T**: `@txt.att.net`
- **T-Mobile**: `@tmomail.net`
- **Sprint**: `@messaging.sprintpcs.com`
- **US Cellular**: `@email.uscc.net`
- **Boost Mobile**: `@sms.myboostmobile.com`
- **Cricket**: `@sms.cricketwireless.net`
- **MetroPCS**: `@mymetropcs.com`

### Setup Instructions

1. **Find out each person's carrier**
   Ask each participant which carrier they use (Verizon, AT&T, T-Mobile, etc.)

2. **Add carrier info to participants**
   Edit `lib/participants.ts`:
   ```typescript
   export const participants: Participant[] = [
     {
       id: 'augustus',
       name: 'Augustus',
       familyGroup: 'Rollin',
       phone: '9784932081',
       carrier: 'verizon',  // Add this line!
       email: 'pikachu@reactsoftwareinc.com',
     },
     {
       id: 'genevieve',
       name: 'Genevieve',
       familyGroup: 'Rollin',
       phone: '5551234567',
       carrier: 'att',      // Add carrier for each person
       email: 'genevieve@example.com',
     },
     // ... other participants
   ];
   ```

3. **That's it!**
   - No API keys needed
   - No configuration required
   - Just add the carrier field
   - SMS will be sent via email gateway (completely free!)

### Important Notes
- ✅ Completely free - no API costs
- ✅ Works with Resend email (also free!)
- ⚠️ Messages are limited to 160 characters (standard SMS)
- ⚠️ Delivery may take 1-2 minutes (vs instant with paid SMS)
- ⚠️ Recipient must have data/texting enabled

---

## 🧪 Testing Your Setup

### Test Email (Resend)
1. Make sure `RESEND_API_KEY` is in `.env.local`
2. Add your email to a test participant in `lib/participants.ts`
3. Run `npm run dev`
4. Click "Send All Assignments"
5. Check your email inbox!

### Test SMS (Email-to-SMS Gateway)
1. Add your phone number and carrier to a participant
2. Example for Verizon: `phone: '5551234567', carrier: 'verizon'`
3. Click "Send All Assignments"
4. Check your phone for a text message!

### Development Mode (No Setup Needed)
If you don't configure anything, the app will simulate sending in development mode:
- Console logs show what would be sent
- "Sent successfully to 6 participant(s)" message appears
- Perfect for testing the flow without real sending

---

## 💰 Cost Comparison

| Method | Setup Time | Monthly Cost | Messages/Month |
|--------|-----------|--------------|----------------|
| **Resend (Email)** | 2 min | $0 | 3,000 |
| **Email-to-SMS** | 5 min | $0 | Unlimited |
| Twilio SMS | 10 min | ~$10 | ~1,000 |
| SendGrid Email | 10 min | ~$15 | 40,000 |

**Winner**: Resend + Email-to-SMS = **$0/month** 🎉

---

## 🎯 Quick Start (Complete Free Setup)

```bash
# 1. Create .env.local file
cat > .env.local << EOF
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=onboarding@resend.dev
EOF

# 2. Edit lib/participants.ts and add carrier info
# (see examples above)

# 3. Start the app
npm run dev

# 4. Test it at http://localhost:3000
```

---

## 🆘 Troubleshooting

### Email Not Sending?
- ✅ Check that `RESEND_API_KEY` is in `.env.local`
- ✅ Verify the API key starts with `re_`
- ✅ Make sure you're using `FROM_EMAIL=onboarding@resend.dev` for testing
- ✅ Check the terminal for error messages

### SMS Not Sending?
- ✅ Verify carrier name is correct (lowercase: 'verizon', 'att', etc.)
- ✅ Phone number should be 10 digits (no dashes or spaces needed)
- ✅ Make sure the recipient has texting enabled
- ✅ Email-to-SMS can take 1-2 minutes to arrive
- ✅ Check the terminal - it should say "SMS sent via email gateway"

### Still Not Working?
- Check the browser console for errors
- Check the terminal/server logs
- The app will log detailed information about what's happening
- In development mode, it shows simulated sends even without API keys

---

## 🚀 Deploy to Vercel (Also Free!)

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables:
   - `RESEND_API_KEY`
   - `FROM_EMAIL`
5. Deploy!

Vercel free tier:
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- Perfect for this app

---

## 📚 More Info

- Resend Documentation: https://resend.com/docs
- Email-to-SMS Gateways: Built into every carrier (no docs needed!)
- Vercel Documentation: https://vercel.com/docs

---

## 🎄 Summary

You can run this Secret Santa app **100% free**:
- ✅ Resend for email (3,000/month free)
- ✅ Email-to-SMS for texts (unlimited free)
- ✅ Vercel for hosting (free tier)
- ✅ No credit card required anywhere

Total cost: **$0/month** 🎉

Merry Christmas! 🎅

