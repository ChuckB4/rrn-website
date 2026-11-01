import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { handleIntakeFollowup } from '../RRN_BACKEND_RAILWAY/rrn_followup_email';

const router = Router();

/**
 * POST /api/intake
 * 
 * Receives intake data from frontend forms and:
 * 1. Validates required fields (email minimum)
 * 2. Saves to Postgres database table 'intake'
 * 3. Calls handleIntakeFollowup() to send automated welcome email
 * 4. Returns {ok: true} on success
 * 
 * Expected request body:
 * {
 *   program: string (e.g., 'demo_request', 'contact', 'donation_inquiry', etc.)
 *   full_name: string
 *   email: string (required)
 *   phone: string
 *   area: string
 *   message: string
 *   email_optin: boolean
 *   ads_optin: boolean
 *   payload: object (for extra metadata)
 * }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    
    // Validate minimum required field: email
    const email = String(body.email || '').trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'Valid email is required' });
    }

    const program = String(body.program || '').trim() || 'intake';
    const full_name = String(body.full_name || '').trim();
    const phone = String(body.phone || '').trim();
    const area = String(body.area || '').trim();
    const message = String(body.message || '').trim();
    const email_optin = body.email_optin === true;
    const ads_optin = body.ads_optin === true;
    const payload = (typeof body.payload === 'object' && body.payload !== null) ? body.payload : {};

    // Create the intake record in the database
    let intake: any = null;
    try {
      intake = await prisma.intake.create({
        data: {
          program,
          full_name: full_name || null,
          email,
          phone: phone || null,
          area: area || null,
          message: message || null,
          email_optin,
          ads_optin,
          payload,
        },
      });
    } catch (dbErr: any) {
      // If the intake model doesn't exist yet, log it but still return success
      if (dbErr.code === 'P1102' || dbErr.message?.includes('table')) {
        console.warn('[intake] Intake table may not exist yet; will be created on migration');
      } else {
        throw dbErr;
      }
    }

    // Send automated follow-up email (fire and forget)
    try {
      if (handleIntakeFollowup) {
        await handleIntakeFollowup({
          program,
          full_name: full_name || '',
          email,
          phone: phone || '',
          area: area || '',
          message: message || '',
          email_optin,
          ads_optin,
          payload,
        });
      }
    } catch (emailErr: any) {
      console.error('[intake] handleIntakeFollowup error:', emailErr);
    }

    return res.json({ ok: true });
  } catch (error) {
    console.error('[intake] Error:', error);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});

export default router;
