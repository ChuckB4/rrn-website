import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logEvent } from '../services/eventService';

// ─────────────────────────────────────────────
// COMMUNITY EVENTS — Phase 3 dynamic-content proof of concept.
// Public read of approved+public future events (no auth), authenticated
// create (goes into a moderation queue, approved:false), role-gated
// approve/reject, campus-scoped like the rest of this codebase. Same
// shape as routes/testimonies.ts, the established precedent for public
// content here. Deliberately does NOT include RSVP/capacity/staffing/
// recurrence — that's the separate, pre-existing internal Events feature
// in the PWA (local-only, untouched by this file).
// ─────────────────────────────────────────────
export const communityEventsRouter = Router();

// Deliberately shaped DTO for the public endpoint — never blindly
// serializes the Prisma row. No createdBy/approvedBy/campusId/internal
// timestamps; campus is exposed by name only, not by id.
const publicSelect = {
  id: true,
  title: true,
  description: true,
  eventType: true,
  eventDate: true,
  endDate: true,
  location: true,
  address: true,
  host: true,
  flyerUrl: true,
  campus: { select: { name: true } },
} as const;

// GET /api/community-events/public — no auth. Only approved + isPublic
// + not-yet-happened events.
communityEventsRouter.get('/public', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await prisma.communityEvent.findMany({
      where: { approved: true, isPublic: true, eventDate: { gte: new Date() } },
      select: publicSelect,
      orderBy: { eventDate: 'asc' },
      take: 50,
    });
    res.json(events);
  } catch (err) { next(err); }
});

// GET /api/community-events — authenticated. Campus-scoped like testimonies.ts;
// ?filter=mine|pending|all
communityEventsRouter.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const campusId = req.user!.role === 'HQ_ADMIN' ? undefined : req.user!.campusId;
    const filter = req.query.filter as string | undefined;

    let where: any = {};
    if (campusId) where.campusId = campusId;

    if (filter === 'mine') {
      where.createdBy = req.user!.userId;
    } else if (filter === 'pending') {
      where.approved = false;
    }
    // 'all' or default: everything the campus scope allows

    const events = await prisma.communityEvent.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true } },
        campus: { select: { id: true, name: true } },
      },
      orderBy: { eventDate: 'asc' },
      take: 200,
    });

    res.json(events);
  } catch (err) { next(err); }
});

// POST /api/community-events — HQ_ADMIN / CAMPUS_LEADER only. Public-facing
// ministry content is created by authorized staff, not self-serve by any
// member (owner decision, docs/EvidenceLog.md Phase 3 Gate 3). Always
// created unapproved.
communityEventsRouter.post('/', authenticate, requireRole('HQ_ADMIN', 'CAMPUS_LEADER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, eventType, eventDate, endDate, location, address, host, flyerUrl, isPublic } = req.body;
    if (!title?.trim()) throw new AppError(400, 'title is required');
    if (!eventDate) throw new AppError(400, 'eventDate is required');
    const parsedStart = new Date(eventDate);
    if (isNaN(parsedStart.getTime())) throw new AppError(400, 'eventDate is not a valid date');
    let parsedEnd: Date | null = null;
    if (endDate) {
      parsedEnd = new Date(endDate);
      if (isNaN(parsedEnd.getTime())) throw new AppError(400, 'endDate is not a valid date');
      if (parsedEnd.getTime() < parsedStart.getTime()) throw new AppError(400, 'endDate cannot be before eventDate');
    }

    const event = await prisma.communityEvent.create({
      data: {
        id: uuid(),
        createdBy: req.user!.userId,
        campusId: req.user!.campusId,
        title,
        description,
        eventType,
        eventDate: parsedStart,
        endDate: parsedEnd,
        location,
        address,
        host,
        flyerUrl,
        isPublic: isPublic || false,
        approved: false,
      },
    });

    await logEvent({
      userId: req.user!.userId,
      campusId: req.user!.campusId,
      eventType: 'COMMUNITY_EVENT_SUBMIT',
      metadata: { communityEventId: event.id, isPublic: event.isPublic },
    });

    res.status(201).json(event);
  } catch (err) { next(err); }
});

// PATCH /api/community-events/:id/approve — HQ_ADMIN / CAMPUS_LEADER only,
// a CAMPUS_LEADER may only approve their own campus's events, and the
// creator may never approve their own submission (separation of duties,
// owner decision, docs/EvidenceLog.md Phase 3 Gate 3 — applies to
// HQ_ADMIN too, no override for this POC).
communityEventsRouter.patch('/:id/approve', authenticate, requireRole('HQ_ADMIN', 'CAMPUS_LEADER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.communityEvent.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError(404, 'Event not found');
    if (req.user!.role !== 'HQ_ADMIN' && existing.campusId !== req.user!.campusId) {
      throw new AppError(403, 'Cross-campus access denied');
    }
    if (existing.createdBy === req.user!.userId) {
      throw new AppError(403, 'You cannot approve an event you created');
    }

    const event = await prisma.communityEvent.update({
      where: { id: req.params.id },
      data: { approved: true, approvedBy: req.user!.userId },
    });
    res.json(event);
  } catch (err) { next(err); }
});

// PATCH /api/community-events/:id/reject — HQ_ADMIN / CAMPUS_LEADER only,
// same campus-ownership rule as approve.
communityEventsRouter.patch('/:id/reject', authenticate, requireRole('HQ_ADMIN', 'CAMPUS_LEADER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.communityEvent.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError(404, 'Event not found');
    if (req.user!.role !== 'HQ_ADMIN' && existing.campusId !== req.user!.campusId) {
      throw new AppError(403, 'Cross-campus access denied');
    }

    const event = await prisma.communityEvent.update({
      where: { id: req.params.id },
      data: { approved: false, approvedBy: null },
    });
    res.json(event);
  } catch (err) { next(err); }
});

// PATCH /api/community-events/:id/unpublish — HQ_ADMIN / CAMPUS_LEADER only,
// same campus-ownership rule. Operational safety valve (owner decision,
// docs/EvidenceLog.md Phase 3 Gate 3): an already-approved+public event can
// be pulled from the public website immediately (cancellation, bad info,
// location change) without fully rejecting it — sets isPublic:false only,
// leaves `approved` untouched so the moderation history stays intact.
communityEventsRouter.patch('/:id/unpublish', authenticate, requireRole('HQ_ADMIN', 'CAMPUS_LEADER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.communityEvent.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError(404, 'Event not found');
    if (req.user!.role !== 'HQ_ADMIN' && existing.campusId !== req.user!.campusId) {
      throw new AppError(403, 'Cross-campus access denied');
    }

    const event = await prisma.communityEvent.update({
      where: { id: req.params.id },
      data: { isPublic: false },
    });
    res.json(event);
  } catch (err) { next(err); }
});

export default communityEventsRouter;
