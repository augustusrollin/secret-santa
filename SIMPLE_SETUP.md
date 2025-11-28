# 🎅 Secret Santa - Simple Setup (No API Keys Needed!)

## Quick Start - Ready in 30 Seconds! ⚡

```bash
# 1. Install dependencies
npm install

# 2. Run the app
npm run dev

# 3. Open in browser
# Go to http://localhost:3000
```

**That's it!** No API keys, no configuration, no sign-ups needed! 🎉

---

## How It Works

The app runs in **demo mode** by default:
- ✅ Individual reveal works perfectly
- ✅ "Send All Assignments" shows success messages
- ✅ Detailed logs in terminal show what would be sent
- ✅ Reset button generates new random assignments
- ✅ Beautiful Christmas theme
- ✅ **Zero configuration needed**

---

## What You Can Do

### 1. Individual Reveal Mode
- Select a name from the dropdown
- Click "Reveal My Secret Santa"
- See who they're buying for
- Click "Hide Result" before the next person

### 2. Send All Assignments
- Click the "Send All Assignments" button
- See success message: "✅ Assignments sent successfully to 6 participant(s)!"
- Check the terminal/console for detailed logs showing each assignment

### 3. Reset & Try Again
- Click "Reset & Generate New Assignments"
- Get completely new random pairings
- Test different scenarios

---

## Terminal Output

When you click "Send All Assignments", you'll see beautiful logs like this:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 EMAIL (SIMULATED - Get free API key at resend.com)
To: pikachu@reactsoftwareinc.com
Subject: 🎅 Your Secret Santa Assignment 2025
Message: Hi Augustus! Your Secret Santa recipient is Ethan. Budget is $25–$35. Merry Christmas! 🎄
ℹ️  Sign up at https://resend.com for 3,000 free emails/month!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎄 Secret Santa Assignments Sent! 🎄
Successfully sent to 6 participant(s)
```

---

## Customize Participants

Edit `lib/participants.ts` to add your own people:

```typescript
export const participants: Participant[] = [
  {
    id: 'john',
    name: 'John',
    familyGroup: 'Rollin',
    email: 'john@example.com',
  },
  {
    id: 'jane',
    name: 'Jane',
    familyGroup: 'Cousins',
    email: 'jane@example.com',
  },
  // Add more participants...
];
```

**Important**: Keep family groups balanced (equal numbers in 'Rollin' and 'Cousins')

---

## Optional: Real Email/SMS (Only if you want!)

If you want to send **real** emails/SMS later, see [FREE_SETUP_GUIDE.md](FREE_SETUP_GUIDE.md).

But **you don't need this** for the app to work! The demo mode is perfect for most use cases.

---

## Deploy to Vercel (Free!)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Secret Santa app"
git push

# 2. Go to vercel.com and import your repo
# 3. Click Deploy
# Done! No environment variables needed for demo mode
```

---

## Summary

✅ **No API keys required**
✅ **No sign-ups needed**  
✅ **No configuration files**  
✅ **Works perfectly out of the box**  
✅ **Beautiful Christmas theme**  
✅ **100% functional in demo mode**

Just `npm install` and `npm run dev` - that's all! 🎄

Merry Christmas! 🎅

