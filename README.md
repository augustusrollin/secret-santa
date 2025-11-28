# 🎅✨ Secret Santa 2025 ✨🎁

A festive, Christmas-themed Secret Santa web application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **🎄 Beautiful Christmas Theme**: Festive colors, animations, and decorations
- **🎁 Individual Reveal Mode**: Each participant can reveal their Secret Santa assignment privately
- **📧 SMS/Email Blast Mode**: Host can send all assignments via SMS and email without showing them on screen
- **🔒 Secure & Private**: Assignments are generated once and never fully exposed to the client
- **✨ Smart Pairing Algorithm**: Ensures fair assignments with configurable constraints

## Project Structure

```
secret-santa/
├── app/
│   ├── api/
│   │   ├── my-recipient/route.ts    # Individual reveal API
│   │   └── send-assignments/route.ts # Blast mode API
│   ├── globals.css                   # Global styles with Tailwind
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main page component
├── lib/
│   ├── participants.ts               # Participant data and types
│   ├── pairing.ts                    # Secret Santa pairing algorithm
│   ├── storage.ts                    # Assignment storage
│   └── notifications.ts              # SMS/Email notification logic
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── .env.example                      # Environment variables template
```

## Getting Started

### Quick Start (No API Keys Needed!)

```bash
# 1. Install dependencies
npm install

# 2. Run the app
npm run dev

# 3. Open http://localhost:3000
```

**That's it!** The app works perfectly without any API keys or configuration. 🎉

See [SIMPLE_SETUP.md](SIMPLE_SETUP.md) for the complete simple guide.

### Optional: Real Email/SMS

The app runs in demo mode by default (fully functional, no setup needed).

If you want real email/SMS later, see [FREE_SETUP_GUIDE.md](FREE_SETUP_GUIDE.md).

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Individual Reveal Mode

1. Navigate to the "Reveal Your Secret Santa" section
2. Select your name from the dropdown
3. Click "Reveal My Secret Santa"
4. View your assignment and click "Hide Result" when done

### SMS/Email Blast Mode (Host Only)

1. Navigate to the "Send Assignments via SMS/Email" section
2. Click "Send All Assignments"
3. Confirm the action
4. All participants will receive their assignments via SMS and/or email

## Configuration

### Adding/Removing Participants

Edit `lib/participants.ts`:

```typescript
export const participants: Participant[] = [
  {
    id: 'participant-id',
    name: 'Display Name',
    familyGroup: 'Rollin', // or 'Cousins'
    phone: '1234567890',
    email: 'email@example.com',
  },
  // Add more participants...
];
```

### Configuring Forbidden Pairs

The pairing algorithm supports additional forbidden pairings (internal use only). Edit the API routes to add forbidden pairs:

```typescript
const assignment = generateSecretSantaAssignment({
  participants,
  forbiddenPairs: [
    ['giverId1', 'receiverId1'],
    ['giverId2', 'receiverId2'],
  ],
});
```

### Customizing the Budget Range

Edit `app/api/send-assignments/route.ts` to change the budget:

```typescript
const BUDGET_RANGE = '$25–$35'; // Change this value
```

Also update the display text in `app/page.tsx`.

### SMS/Email Integration (100% FREE!)

**🎉 NEW: This app now supports completely free email and SMS!**

See **[FREE_SETUP_GUIDE.md](FREE_SETUP_GUIDE.md)** for detailed instructions.

**Quick Summary:**

1. **FREE Email with Resend** (recommended):
   - Sign up at [resend.com](https://resend.com) - no credit card needed
   - 3,000 emails/month free
   - Add `RESEND_API_KEY` to `.env.local`

2. **FREE SMS via Email-to-SMS Gateway**:
   - No API key needed!
   - Just add carrier info to participants (e.g., `carrier: 'verizon'`)
   - Works with all major carriers
   - Completely free - unlimited messages

**Alternative Paid Options** (if you need them):

1. **SMS (Twilio)**: For more reliable SMS with delivery receipts
2. **Email (SendGrid)**: For higher volume email sending

## Deployment to Vercel (Future)

This project is structured to be easily deployed to Vercel:

1. Push this repository to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in the Vercel dashboard:
   - `SMS_PROVIDER_API_KEY`
   - `EMAIL_PROVIDER_API_KEY`
   - Any other provider-specific variables
4. Deploy!

Vercel will automatically detect Next.js and configure the build settings.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Google Fonts (Mountains of Christmas, Inter)

## Security & Privacy

- ✅ Assignments are generated once and reused for consistency
- ✅ Full assignment mapping is never sent to the client
- ✅ Individual reveal only shows one pairing at a time
- ✅ Blast mode sends notifications without displaying assignments
- ✅ Internal constraints (family groups, forbidden pairs) are never exposed in the UI

## License

This project is provided as-is for personal use.

## Credits

Made with ❤️ and Christmas magic for Secret Santa 2025! 🎄

