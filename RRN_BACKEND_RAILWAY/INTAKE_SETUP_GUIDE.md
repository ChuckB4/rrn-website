# RRN Intake System Setup Guide

## Overview

The RRN website now has a complete intake pipeline:
- **Frontend** (`index.html`): `rrnIntake()` function captures all form submissions
- **Backend** (`rrn_intake_api.js` or `.ts`): Express endpoint receives data, saves to Postgres, sends automated welcome emails
- **Email** (`rrn_followup_email.js`): Automated welcome/admin notifications via Resend

All forms on the website (CALEB beta, contact, donations, court partnerships, housing, etc.) now route through this unified system.

---

## Step 1: Update Your Prisma Schema

Add this model to your `prisma/schema.prisma`:

```prisma
model Intake {
  id            String   @id @default(cuid())
  program       String
  full_name     String?
  email         String
  phone         String?
  area          String?
  message       String?
  email_optin   Boolean  @default(false)
  ads_optin     Boolean  @default(false)
  payload       Json?
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt

  @@index([email])
  @@index([program])
  @@index([created_at])
}
```

Then run the migration:

```bash
cd your-railway-backend-folder
npx prisma migrate dev --name add_intake
```

---

## Step 2: Add Routes to Your Express Server

In your `src/index.ts` (or `src/index.js`), add:

**For TypeScript:**
```typescript
import intakeRouter from "./routes/intake";
app.use("/api/intake", intakeRouter);
```

**For JavaScript:**
```javascript
const intakeRouter = require("./routes/intake");
app.use("/api/intake", intakeRouter);
```

---

## Step 3: Copy the Backend Files

Copy these files to your Railway backend:

- `rrn_intake_api.ts` → `src/routes/intake.ts` (or use `.js` version)
- `rrn_followup_email.js` → `src/routes/rrn_followup_email.js` (already exists if you set it up)

---

## Step 4: Set Environment Variables in Railway

In your Railway service's **Variables** tab, set:

```
DATABASE_URL = (auto-set by Railway if you're using Postgres add-on)
RESEND_API_KEY = re_xxxxxxxxxxxxxxxxxxxx (from https://resend.com)
MAIL_FROM = Refined Recovery Network <hello@joinrrn.com>
ADMIN_EMAIL = info@joinrrn.com
```

### One-time Resend Setup

1. Create a free account at https://resend.com
2. Add & verify your domain `joinrrn.com` (Resend shows DNS records to add)
3. Create an API key and copy it to `RESEND_API_KEY` above

---

## Step 5: Deploy to Railway

```bash
cd your-railway-backend-folder
railway up
```

---

## Step 6: Update Frontend Railway URL

In `index.html`, find the `rrnIntake` function (around line 4170) and update the fetch URL:

Replace:
```javascript
fetch('https://your-railway-backend.up.railway.app/api/intake', {
```

With your actual Railway backend URL (you can find it in Railway console):
```javascript
fetch('https://your-actual-backend-name.up.railway.app/api/intake', {
```

Or set it dynamically based on environment:
```javascript
const INTAKE_URL = process.env.INTAKE_API_URL || 'https://your-backend.up.railway.app/api/intake';
fetch(INTAKE_URL, {
```

---

## Testing

### Test the Backend Endpoint

```bash
curl -X POST https://your-backend.up.railway.app/api/intake \
  -H "Content-Type: application/json" \
  -d '{
    "program": "demo_request",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "(225) 555-0100",
    "area": "Louisiana",
    "message": "Test message",
    "email_optin": true,
    "ads_optin": false,
    "payload": { "role": "Person seeking recovery" }
  }'
```

Expected response:
```json
{ "ok": true, "id": "clk3z9q4x0000..." }
```

### Test from Frontend

1. Go to https://joinrrn.com/
2. Scroll to "CALEB AI Companion" section
3. Click "Get Free Access — Meet CALEB" button
4. Fill out the beta form and submit
5. Check browser console (F12 → Console tab) for any errors
6. Check Railway logs for the intake record being saved

---

## Intake Programs

Forms send with these `program` values:

| Program | Source | Form |
|---------|--------|------|
| `demo_request` | CALEB Beta Form | submitBeta() |
| `contact` | Main Contact Form | submitContact() |
| `donation_inquiry` | Donate Form | submitDonate() |
| `investor` | Investor Form | submitInv() |
| `court_partnership` | Court Partnership | submitCourt() |
| `refined_place_application` | Housing/Refined Place | submitRefinedPlace() |
| `nehemiah_provider` | Nehemiah Provider | submitNehemiahProvider() |
| `nehemiah_job` | Nehemiah Job Request | submitNehemiahJob() |
| `radio_listener` | Radio Listener Email | rrSubmitEmail() |
| `radio_email` | Radio Station Email | radEmailSubmit() |
| `recovery_app_waitlist` | Recovery App Waitlist | radWaitlistSubmit() |

---

## Email Opt-in / Opt-out

- Forms respect `email_optin` and `ads_optin` flags
- Welcome emails only send if `email_optin === true`
- Admin emails always send (internal notification)
- Users can reply "unsubscribe" to opt out

---

## Troubleshooting

### Forms submit but no data shows up

1. Check Railway logs: `railway logs`
2. Verify `RESEND_API_KEY` is set in Railway variables
3. Confirm `DATABASE_URL` is connected to Postgres
4. Check browser console (F12) for fetch errors

### Welcome emails not sending

1. Verify `RESEND_API_KEY` in Railway environment
2. Check if domain is verified in Resend dashboard
3. Look at Railway logs for `[RRN mail]` messages

### Database connection fails

1. Make sure Postgres add-on is attached to your Railway service
2. Run: `npx prisma generate` locally
3. Run: `npx prisma migrate deploy` to apply all migrations

---

## Content Policy Notes

⚠️ This system NEVER mentions:
- ESM or Eagle Summit Ministries
- Jeff Walters
- Fiscal sponsor or 501(c)(3) status for RRN or any organization

All references use: **Refined Recovery Network** (canonical name)

---

## Next Steps

1. Complete the setup steps above
2. Deploy to Railway
3. Update the frontend `rrnIntake()` URL
4. Test all forms on the live site
5. Monitor intake records in Railway Postgres

Questions? Check the logs: `railway logs --follow`
