import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole, requireSelfOrLeader } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logEvent } from '../services/eventService';

const router = Router();

const JobSchema = z.object({
  employerName: z.string().min(2),
  title: z.string().min(2),
  description: z.string().optional(),
  location: z.string().optional(),
  payRange: z.string().optional(),
  requirements: z.string().optional(),
  closesAt: z.string().datetime().optional(),
});

// ─── GET /api/workforce/jobs ──────────────────
router.get('/jobs', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const campusId = req.user!.role === 'HQ_ADMIN'
      ? (req.query.campusId as string | undefined)
      : req.user!.campusId;

    const jobs = await prisma.job.findMany({
      where: { ...(campusId ? { campusId } : {}), isActive: true },
      include: {
        campus: { select: { name: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/workforce/jobs ─────────────────
router.post('/jobs', authenticate, requireRole('HQ_ADMIN', 'CAMPUS_LEADER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = JobSchema.parse(req.body);
    const campusId = req.user!.role === 'HQ_ADMIN'
      ? (req.body.campusId || req.user!.campusId)
      : req.user!.campusId;

    const job = await prisma.job.create({
      data: {
        id: uuid(),
        campusId,
        ...data,
        closesAt: data.closesAt ? new Date(data.closesAt) : undefined,
      },
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/workforce/jobs/:jobId/apply ────
router.post('/jobs/:jobId/apply', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.jobId } });
    if (!job || !job.isActive) throw new AppError(404, 'Job not found or no longer active');

    const existing = await prisma.jobApplication.findUnique({
      where: { jobId_userId: { jobId: req.params.jobId, userId: req.user!.userId } },
    });
    if (existing) throw new AppError(409, 'You have already applied for this position');

    const application = await prisma.jobApplication.create({
      data: {
        id: uuid(),
        jobId: req.params.jobId,
        userId: req.user!.userId,
        coverNote: req.body.coverNote,
        status: 'SUBMITTED',
      },
    });

    await logEvent({
      userId: req.user!.userId,
      campusId: req.user!.campusId,
      eventType: 'JOB_APPLY',
      metadata: { jobId: req.params.jobId, employerName: job.employerName, title: job.title },
      ipAddress: req.ip,
    });

    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/workforce/applications/:id/status ─
router.patch('/applications/:id/status', authenticate, requireRole('HQ_ADMIN', 'CAMPUS_LEADER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['UNDER_REVIEW', 'APPROVED', 'HIRED', 'REJECTED'];
    if (!validStatuses.includes(status)) throw new AppError(400, `status must be one of: ${validStatuses.join(', ')}`);

    const app = await prisma.jobApplication.findUnique({
      where: { id: req.params.id },
      include: { job: true },
    });
    if (!app) throw new AppError(404, 'Application not found');

    if (req.user!.role !== 'HQ_ADMIN' && app.job.campusId !== req.user!.campusId) {
      throw new AppError(403, 'Cross-campus access denied');
    }

    const updated = await prisma.jobApplication.update({
      where: { id: req.params.id },
      data: { status, notes, reviewedBy: req.user!.userId, reviewedAt: new Date() },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/workforce/resume ───────────────
// Expects { fileUrl, fileKey, fileName } after client uploads to S3/R2
router.post('/resume', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fileUrl, fileKey, fileName } = req.body;
    if (!fileUrl || !fileKey) throw new AppError(400, 'fileUrl and fileKey required');

    // Deactivate old resumes
    await prisma.resume.updateMany({
      where: { userId: req.user!.userId },
      data: { isActive: false },
    });

    const resume = await prisma.resume.create({
      data: {
        id: uuid(),
        userId: req.user!.userId,
        fileUrl,
        fileKey,
        fileName,
        isActive: true,
      },
    });

    await logEvent({
      userId: req.user!.userId,
      campusId: req.user!.campusId,
      eventType: 'RESUME_UPLOAD',
      metadata: { fileName },
      ipAddress: req.ip,
    });

    res.status(201).json(resume);
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/workforce/certifications/:userId ─
router.get('/certifications/:userId', authenticate, requireSelfOrLeader, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const certs = await prisma.certification.findMany({
      where: { userId: req.params.userId },
      orderBy: { issuedAt: 'desc' },
    });
    res.json(certs);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/workforce/certifications ───────
router.post('/certifications', authenticate, requireRole('HQ_ADMIN', 'CAMPUS_LEADER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, name, type, expiresAt } = req.body;

    const cert = await prisma.certification.create({
      data: {
        id: uuid(),
        userId,
        name,
        type,
        issuedBy: req.user!.userId,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      },
    });

    await logEvent({
      userId,
      campusId: req.user!.campusId,
      eventType: 'CERTIFICATION_EARNED',
      metadata: { certName: name, certType: type, issuedBy: req.user!.userId },
    });

    res.status(201).json(cert);
  } catch (err) {
    next(err);
  }
});

export default router;

// ─── GET /api/workforce/resume ────────────────
router.get('/resume', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(resume || null);
  } catch (err) { next(err); }
});

// ─── PUT /api/workforce/resume ────────────────
router.put('/resume', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.resume.findFirst({ where: { userId: req.user!.userId } });
    const data = { ...req.body, userId: req.user!.userId };
    const resume = existing
      ? await prisma.resume.update({ where: { id: existing.id }, data })
      : await prisma.resume.create({ data: { id: uuid(), ...data } });
    res.json(resume);
  } catch (err) { next(err); }
});

// ─── GET /api/workforce/my-applications ───────
router.get('/my-applications', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apps = await prisma.jobApplication.findMany({
      where: { userId: req.user!.userId },
      include: { job: { select: { id: true, title: true, employerName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(apps);
  } catch (err) { next(err); }
});
