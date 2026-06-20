// ============================================================================
//  RRN AUTOMATED FOLLOW-UP EMAIL  —  drop-in module for the Railway backend
//  Sends a welcome/follow-up email when someone signs up, IF they opted in.
//  Provider: Resend (free tier ~3,000 emails/mo). No SDK needed — uses fetch.
// ============================================================================
//
//  ONE-TIME SETUP (10 min):
//   1. Make a free account at https://resend.com
//   2. Add & verify your domain joinrrn.com (Resend shows the DNS records to add).
//   3. Create an API key. In Railway → your service → Variables, add:
//          RESEND_API_KEY = re_xxxxxxxxxxxxxxxxxxxx
//          MAIL_FROM      = Refined Recovery Network <hello@joinrrn.com>
//          ADMIN_EMAIL    = info@joinrrn.com
//   4. Put this file next to your server file and require it (see bottom).
//
//  Node 18+ has global fetch built in (Railway uses Node 18/20), so nothing to install.
// ============================================================================

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const MAIL_FROM = process.env.MAIL_FROM || "Refined Recovery Network <hello@joinrrn.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@joinrrn.com";

// Friendly label for each program (extend as needed)
const PROGRAM_LABEL = {
  intake: "Recovery Intake",
  volunteer: "Volunteer",
  provider: "Service Provider",
  prayer: "Prayer Request",
  partner: "Ministry Partner",
  contact: "Contact",
};

function esc(s){ return String(s||"").replace(/[<>&]/g, c => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;" }[c])); }

// ---- the welcome / follow-up email body (faith-based, peer recovery voice) ----
function welcomeHtml(intake){
  const name = esc((intake.full_name||"").split(" ")[0] || "friend");
  const prog = PROGRAM_LABEL[intake.program] || "Refined Recovery Network";
  return `
  <div style="font-family:Georgia,'Times New Roman',serif;max-width:560px;margin:0 auto;color:#1a2433;">
    <div style="background:#0f1b2d;padding:26px 28px;border-radius:14px 14px 0 0;">
      <div style="color:#c8913a;font-size:22px;letter-spacing:.5px;">Refined Recovery Network</div>
      <div style="color:#9fb0c4;font-size:13px;margin-top:4px;">Christ-centered. Peer-led. Built on hope.</div>
    </div>
    <div style="background:#ffffff;border:1px solid #e6e9ef;border-top:none;padding:28px;border-radius:0 0 14px 14px;line-height:1.6;font-size:15px;">
      <p>${name === "friend" ? "Hello friend," : "Hello " + name + ","}</p>
      <p>Thank you for reaching out to Refined Recovery Network. We received your <b>${esc(prog)}</b> request, and a real person from our team will follow up with you personally — usually within one business day.</p>
      <p>You are not a case number here. You are a person God is reaching toward, and we are honored to walk alongside you.</p>
      <p style="border-left:3px solid #c8913a;padding:8px 0 8px 16px;font-style:italic;color:#3a4654;">
        &ldquo;Come unto me, all ye that labour and are heavy laden, and I will give you rest.&rdquo;
        <span style="display:block;font-style:normal;font-weight:700;color:#c8913a;font-size:12px;margin-top:6px;">— Matthew 11:28</span>
      </p>
      <p>While you wait, you are always welcome to listen to Refined Radio and explore our free recovery tools at
        <a href="https://joinrrn.com" style="color:#c8913a;">joinrrn.com</a>.</p>
      <p>In His name,<br><b>The Refined Recovery Network Team</b></p>
      <hr style="border:none;border-top:1px solid #eee;margin:22px 0;">
      <p style="font-size:11px;color:#8a93a0;">You are receiving this because you asked us to contact you when you signed up at joinrrn.com.
      To stop receiving email from us, reply with &ldquo;unsubscribe&rdquo; and we will remove you.</p>
    </div>
  </div>`;
}

// ---- low-level send via Resend ----
async function sendEmail(to, subject, html){
  if(!RESEND_API_KEY){ console.warn("[RRN mail] RESEND_API_KEY not set — skipping send to", to); return false; }
  try{
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": "Bearer " + RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ from: MAIL_FROM, to: [to], subject, html })
    });
    if(!r.ok){ console.error("[RRN mail] send failed", r.status, await r.text()); return false; }
    return true;
  }catch(e){ console.error("[RRN mail] error", e); return false; }
}

// ============================================================================
//  PUBLIC: call this from your /api/intake route AFTER you save the record.
//  Respects consent: only emails the person if they ticked email_optin.
//  Always notifies the admin so nothing is missed.
// ============================================================================
async function handleIntakeFollowup(intake){
  // 1) admin notification (internal — always)
  const summary = Object.entries({
    Program: PROGRAM_LABEL[intake.program] || intake.program,
    Name: intake.full_name, Email: intake.email, Phone: intake.phone,
    Area: intake.area, Message: intake.message,
    "Email opt-in": intake.email_optin ? "YES" : "no",
    "Advertising opt-in": intake.ads_optin ? "YES" : "no",
  }).filter(([,v]) => v).map(([k,v]) => `<tr><td style="padding:4px 12px 4px 0;color:#667;"><b>${esc(k)}</b></td><td style="padding:4px 0;">${esc(v)}</td></tr>`).join("");
  sendEmail(ADMIN_EMAIL, `New ${PROGRAM_LABEL[intake.program]||"signup"}: ${intake.full_name||intake.email||"someone"}`,
    `<div style="font-family:Arial,sans-serif"><h3>New signup on joinrrn.com</h3><table>${summary}</table></div>`);

  // 2) welcome email to the person — ONLY if they opted into email correspondence
  if(intake.email_optin && intake.email){
    await sendEmail(intake.email, "Welcome to Refined Recovery Network — we received your request", welcomeHtml(intake));
  }

  // 3) advertising/marketing list — add only if they opted into ads.
  //    (Wire this to your mailing list / Resend Audience when ready.)
  //    if(intake.ads_optin && intake.email){ /* addToMarketingList(intake.email) */ }
}

module.exports = { handleIntakeFollowup, sendEmail };

// ============================================================================
//  HOW TO WIRE INTO YOUR EXISTING /api/intake ROUTE
//  (paste the marked lines into your route handler):
//
//    const { handleIntakeFollowup } = require("./rrn_followup_email");
//
//    app.post("/api/intake", async (req, res) => {
//      const b = req.body || {};
//      // ... your existing INSERT, now also storing the two opt-in flags ...
//      // await db.query(
//      //   "INSERT INTO intake (program, full_name, email, phone, area, message, consent, email_optin, ads_optin) " +
//      //   "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
//      //   [b.program,b.full_name,b.email,b.phone,b.area,b.message,b.consent,b.email_optin===true,b.ads_optin===true]
//      // );
//      handleIntakeFollowup(b).catch(console.error);   // <-- ADD THIS (fire-and-forget)
//      res.json({ ok: true });
//    });
//
//  ONE-TIME DB MIGRATION (run once in Railway's Postgres):
//    ALTER TABLE intake ADD COLUMN IF NOT EXISTS email_optin BOOLEAN DEFAULT false;
//    ALTER TABLE intake ADD COLUMN IF NOT EXISTS ads_optin   BOOLEAN DEFAULT false;
// ============================================================================
