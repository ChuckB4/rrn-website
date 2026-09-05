import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole, requireCampusAccess } from '../middleware/auth';
import { getCampusHousingOccupancy } from '../services/housingService';
import { logAudit } from '../services/auditService';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Donations route to a single global GiveSendGo link (see CLAUDE.md's
// "Prohibited legacy references") — no per-campus donation config anymore.
const CampusCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  city: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

// ─── GET /api/campuses ────────────────────────
// HQ_ADMIN: all campuses. Others: their own campus only.
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user!.role === 'HQ_ADMIN';

    const campuses = await prisma.campus.findMany({
      where: isAdmin ? {} : { id: req.user!.campusId },
      include: {
        _count: { select: { users: true, meetings: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(campuses);
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/campuses/public ─────────────────
// Public, unauthenticated -- the self-registration form needs real campus
// ids to submit against (RegisterSchema.campusId is a foreign key, not a
// free-text name); this was missing entirely, which is why self-registration
// fell back to a fabricated localStorage-only account (2026-09-02 finding).
// Campus names/ids aren't sensitive -- they're already shown as plaintext
// options in the public registration UI. Registered before the `/:campusId`
// param route below, or Express would treat "public" as a campusId.
router.get('/public', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const campuses = await prisma.campus.findMany({
      where: { lifecycleStage: 'ACTIVE' },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
    res.json(campuses);
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/campuses/:campusId ──────────────
router.get('/:campusId', authenticate, requireCampusAccess, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const campus = await prisma.campus.findUnique({
      where: { id: req.params.campusId },
      include: {
        _count: { select: { users: true, meetings: true, donations: true } },
      },
    });

    if (!campus) throw new AppError(404, 'Campus not found');
    res.json(campus);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/campuses ───────────────────────
router.post('/', authenticate, requireRole('HQ_ADMIN', 'AMBASSADOR'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = CampusCreateSchema.parse(req.body);

    // New campuses belong to the creating user's own Organization — the
    // only tenant-aware default that makes sense before real platform
    // administration exists (EngineeringSpecification.md §9 step 3, not yet
    // built). There is exactly one Organization today, so this always
    // resolves to it; the lookup is written to be correct once more exist.
    const creatorCampus = await prisma.campus.findUnique({
      where: { id: req.user!.campusId },
      select: { organizationId: true },
    });
    if (!creatorCampus) throw new AppError(404, 'Creating user\'s campus not found');

    const campus = await prisma.campus.create({
      data: {
        id: uuid(),
        ...data,
        organizationId: creatorCampus.organizationId,
        lifecycleStage: 'PLANNING',
      },
    });

    await logAudit({
      actorId: req.user!.userId,
      action: 'campus.created',
      targetType: 'Campus',
      targetId: campus.id,
      campusId: campus.id,
      diff: data,
      ipAddress: req.ip,
    });

    res.status(201).json(campus);
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/campuses/:campusId ────────────
router.patch('/:campusId', authenticate, requireRole('HQ_ADMIN', 'CAMPUS_LEADER'), requireCampusAccess, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const campus = await prisma.campus.update({
      where: { id: req.params.campusId },
      data: req.body,
    });

    await logAudit({
      actorId: req.user!.userId,
      action: 'campus.updated',
      targetType: 'Campus',
      targetId: campus.id,
      campusId: campus.id,
      diff: req.body,
      ipAddress: req.ip,
    });

    res.json(campus);
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/campuses/:campusId/donation-link ─
// Every campus routes to the same GiveSendGo campaign.
router.get('/:campusId/donation-link', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const campus = await prisma.campus.findUnique({ where: { id: req.params.campusId } });
    if (!campus) throw new AppError(404, 'Campus not found');

    res.json({
      campusId: campus.id,
      campusName: campus.name,
      donationUrl: process.env.GIVESENDGO_URL || 'https://www.givesendgo.com/help-build-refined-recovery-network',
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/campuses/:campusId/stats ────────
router.get('/:campusId/stats', authenticate, requireCampusAccess, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { campusId } = req.params;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [memberCount, attendanceCount, donationSum, housingOccupied, openJobs] = await Promise.all([
      prisma.user.count({ where: { campusId, status: 'ACTIVE' } }),
      prisma.attendance.count({
        where: { meeting: { campusId }, checkinTime: { gte: thirtyDaysAgo } },
      }),
      prisma.donation.aggregate({
        where: { campusId, verificationStatus: 'VERIFIED' },
        _sum: { amount: true },
      }),
      getCampusHousingOccupancy(campusId),
      prisma.job.count({ where: { campusId, isActive: true } }),
    ]);

    res.json({
      members: memberCount,
      attendanceLast30Days: attendanceCount,
      totalDonations: donationSum._sum.amount || 0,
      housingOccupied: housingOccupied.occupied,
      openJobs,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
