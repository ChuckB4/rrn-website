// ============================================================================
//  RRN INTAKE API — Railway backend endpoint for form submissions
//  Receives intake data from website forms, saves to database, sends welcome email
// ============================================================================
//
//  SETUP (one-time):
//    1. Copy this file to your Railway backend: src/routes/intake.ts
//    2. Add these lines to your Prisma schema (prisma/schema.prisma):
//
//       model Intake {
//         id            String   @id @default(cuid())
//         program       String
//         full_name     String?
//         email         String
//         phone         String?
//         area          String?
//         message       String?
//         email_optin   Boolean  @default(false)
//         ads_optin     Boolean  @default(false)
//         payload       Json?
//         created_at    DateTime @default(now())
//         updated_at    DateTime @updatedAt
//
//         @@index([email])
//         @@index([program])
//         @@index([created_at])
//       }
//
//    3. Run migration: npx prisma migrate dev --name add_intake
//    4. In src/index.ts, add:
//       import intakeRouter from "./routes/intake";
//       app.use("/api/intake", intakeRouter);
//    5. Set environment variables in Railway:
//       DATABASE_URL (Postgres connection — usually auto-set by Railway)
//       RESEND_API_KEY (from https://resend.com)
//       MAIL_FROM = Refined Recovery Network <hello@joinrrn.com>
//       ADMIN_EMAIL = info@joinrrn.com
//    6. Deploy: railway up
//
// ============================================================================

import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { handleIntakeFollowup } from "./rrn_followup_email";

const router = Router();
const prisma = new PrismaClient();

// Validate email
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/intake
router.post("/", async (req: Request, res: Response) => {
  try {
    const { program, full_name, email, phone, area, message, email_optin, ads_optin, payload } = req.body || {};

    // Validate required fields
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ ok: false, error: "Valid email required" });
    }

    if (!program) {
      return res.status(400).json({ ok: false, error: "Program name required" });
    }

    // Save to database
    const intake = await prisma.intake.create({
      data: {
        program,
        full_name: full_name || null,
        email,
        phone: phone || null,
        area: area || null,
        message: message || null,
        email_optin: email_optin === true,
        ads_optin: ads_optin === true,
        payload: payload || {},
      },
    });

    // Send welcome email (fire-and-forget, don't wait for it)
    handleIntakeFollowup({
      program,
      full_name: full_name || "",
      email,
      phone: phone || "",
      area: area || "",
      message: message || "",
      email_optin: email_optin === true,
      ads_optin: ads_optin === true,
    }).catch((err: any) => console.error("[RRN intake] email failed:", err));

    console.log(`[RRN intake] saved: ${program} from ${email}`);
    res.json({ ok: true, id: intake.id });
  } catch (err) {
    console.error("[RRN intake] error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// GET /api/intake/health (for monitoring)
router.get("/health", (req: Request, res: Response) => {
  res.json({ ok: true, service: "intake", timestamp: new Date().toISOString() });
});

export default router;

// ============================================================================
//  INTEGRATION: Wire into index.ts
//
//    import intakeRouter from "./routes/intake";
//    import { handleIntakeFollowup } from "./routes/rrn_followup_email";
//    app.use("/api/intake", intakeRouter);
//
//  TEST LOCALLY:
//    curl -X POST http://localhost:3000/api/intake \
//      -H "Content-Type: application/json" \
//      -d '{
//        "program": "demo_request",
//        "full_name": "John Doe",
//        "email": "john@example.com",
//        "phone": "(225) 555-0100",
//        "area": "Louisiana",
//        "message": "Test message",
//        "email_optin": true,
//        "ads_optin": false,
//        "payload": { "role": "Person seeking recovery" }
//      }'
//
// ============================================================================
