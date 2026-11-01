// ============================================================================
//  RRN INTAKE API — Railway backend endpoint for form submissions (JavaScript)
//  Receives intake data from website forms, saves to database, sends welcome email
// ============================================================================
//
//  SETUP (one-time):
//    1. Copy this file to your Railway backend: src/routes/intake.js
//    2. Add Prisma model to prisma/schema.prisma (see rrn_intake_api.ts for schema)
//    3. Run migration: npx prisma migrate dev --name add_intake
//    4. In src/index.js, add:
//       const intakeRouter = require("./routes/intake");
//       app.use("/api/intake", intakeRouter);
//    5. Set environment variables in Railway (DATABASE_URL, RESEND_API_KEY, etc.)
//    6. Deploy: railway up
//
// ============================================================================

const { PrismaClient } = require("@prisma/client");
const { handleIntakeFollowup } = require("./rrn_followup_email");
const express = require("express");

const router = express.Router();
const prisma = new PrismaClient();

// Validate email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/intake
router.post("/", async (req, res) => {
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

    // Send welcome email (fire-and-forget)
    handleIntakeFollowup({
      program,
      full_name: full_name || "",
      email,
      phone: phone || "",
      area: area || "",
      message: message || "",
      email_optin: email_optin === true,
      ads_optin: ads_optin === true,
    }).catch((err) => console.error("[RRN intake] email failed:", err));

    console.log(`[RRN intake] saved: ${program} from ${email}`);
    res.json({ ok: true, id: intake.id });
  } catch (err) {
    console.error("[RRN intake] error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// GET /api/intake/health (for monitoring)
router.get("/health", (req, res) => {
  res.json({ ok: true, service: "intake", timestamp: new Date().toISOString() });
});

module.exports = router;
