import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, requireRole } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { logAudit } from '../services/auditService';

const router = Router();

// Gate 3.4 finding: this route previously used raw $queryRaw SQL with no
// validation at all — an empty body created a grant literally named "Grant"
// with amount 0, negative amounts were stored as-is, and duplicates were
// unblocked. Rewritten against the real Prisma `Grant` model with the same
// validation pattern donations already uses. Per the fix-scope decision:
// field validation only — no AI/dedup/workflow logic added here.
const GRANT_STATUSES = ['applied', 'under_review', 'awarded', 'rejected', 'expired'] as const;

const GrantCreateSchema = z.object({
  grantName: z.string().min(2, 'grantName is required'),
  agency: z.string().optional(),
  amount: z.number().min(0, 'amount must be a non-negative number').optional(),
  type: z.string().optional(),
  status: z.enum(GRANT_STATUSES).optional(),
  notes: z.string().optional(),
  deadline: z.string().datetime().optional(),
  awardExpected: z.string().datetime().optional(),
});

const GrantUpdateSchema = z.object({
  status: z.enum(GRANT_STATUSES).optional(),
  notes: z.string().optional(),
});

function toResponse(g: Awaited<ReturnType<typeof prisma.grant.create>>) {
  return {
    id: g.id, grantId: g.id, grantName: g.name, agency: g.source,
    amount: g.amount !== null ? String(g.amount) : null, type: g.type, status: g.status,
    appliedAt: g.createdAt, deadline: g.expiresDate, awardExpected: g.awardedDate,
    notes: g.notes, autoData: {}, createdAt: g.createdAt, updatedAt: g.updatedAt,
  };
}

router.get('/', authenticate, requireRole('HQ_ADMIN', 'CAMPUS_LEADER', 'AMBASSADOR'), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const grants = await prisma.grant.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(grants.map(toResponse));
  } catch (err) { next(err); }
});

router.post('/', authenticate, requireRole('HQ_ADMIN', 'CAMPUS_LEADER', 'AMBASSADOR'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = GrantCreateSchema.parse(req.body);

    const grant = await prisma.grant.create({
      data: {
        name: data.grantName,
        source: data.agency,
        amount: data.amount,
        type: data.type || 'Federal',
        status: data.status || 'applied',
        notes: data.notes,
        expiresDate: data.deadline ? new Date(data.deadline) : undefined,
        awardedDate: data.awardExpected ? new Date(data.awardExpected) : undefined,
      },
    });

    await logAudit({
      actorId: req.user!.userId,
      action: 'grant.created',
      targetType: 'Grant',
      targetId: grant.id,
      diff: { name: grant.name, amount: grant.amount, status: grant.status },
      ipAddress: req.ip,
    });

    res.status(201).json(toResponse(grant));
  } catch (err) { next(err); }
});

router.patch('/:id', authenticate, requireRole('HQ_ADMIN', 'CAMPUS_LEADER', 'AMBASSADOR'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = GrantUpdateSchema.parse(req.body);
    const existing = await prisma.grant.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError(404, 'Grant not found');

    const grant = await prisma.grant.update({
      where: { id: req.params.id },
      data: { status: data.status, notes: data.notes },
    });

    await logAudit({
      actorId: req.user!.userId,
      action: 'grant.updated',
      targetType: 'Grant',
      targetId: grant.id,
      diff: { fromStatus: existing.status, toStatus: grant.status, notes: data.notes },
      ipAddress: req.ip,
    });

    res.json({ ok: true, grant: toResponse(grant) });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, requireRole('HQ_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.grant.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError(404, 'Grant not found');

    await prisma.grant.delete({ where: { id: req.params.id } });

    await logAudit({
      actorId: req.user!.userId,
      action: 'grant.deleted',
      targetType: 'Grant',
      targetId: req.params.id,
      diff: { name: existing.name, amount: existing.amount, status: existing.status },
      ipAddress: req.ip,
    });

    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
