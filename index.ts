import 'dotenv/config';
import './lib/validateEnv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { createServer } from 'http';
import { v4 as uuid } from 'uuid';
import { prisma } from './lib/prisma';
import { authenticate } from './middleware/auth';
import { logger } from './lib/logger';
import { initSentry, Sentry } from './lib/sentry';
import { errorHandler } from './middleware/errorHandler';
import { initWebSocket } from './lib/websocket';
import { startScoringCron, startSustainabilityCron, startDigestCron, startLifecycleCron } from './jobs/scoringCron';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import campusRoutes from './routes/campuses';
import meetingRoutes from './routes/meetings';
import attendanceRoutes from './routes/attendance';
import donationRoutes from './routes/donations';
import workforceRoutes from './routes/workforce';
import housingRoutes from './routes/housing';
import testimonyRoutes from './routes/testimonies';
import communityEventsRoutes from './routes/community-events';
import { sessionDecisionsRouter } from './routes/session-decisions';
import { employerCandidatesRouter } from './routes/employer-candidates';
import { employerPacketRouter } from './routes/employer-packet';
import { employerOutreachRouter, outreachRouter } from './routes/employer-outreach';
import { employerAiRouter } from './routes/employer-ai';
import { sessionTasksRouter } from './routes/session-tasks';
import { sessionNotesRouter } from './routes/session-notes';
import { sessionAttendanceRouter } from './routes/session-attendance';
import analyticsRoutes from './routes/analytics';
import eventsRoutes from './routes/events';
import workflowRoutes from './routes/workflows';
import meetingPrepRoutes from './routes/meetingPrep';
import mediaRoutes from './routes/media';
import scoringRoutes from './routes/scoring';
import announcementRoutes from './routes/announcements';
import aiRoutes from './routes/ai';
import { aiChatRouter } from './routes/ai-chat';
import expansionRoutes from './routes/expansion';
import notificationRoutes from './routes/notifications';
import taskRoutes from './routes/tasks';
import grantRoutes from './routes/grants';
import pipelineRoutes from './routes/pipeline';
import missionRoutes from './routes/missions';
import repairsRoutes from './routes/repairs';
import memberRoutes from './routes/members';
import auditRoutes from './routes/audit';
import progressRoutes from './routes/progress';

initSentry();

const app = express();
app.set('trust proxy', 1);
const httpServer = createServer(app);

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(cors({ origin: '*' }));
app.use(helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: false }));
app.use(pinoHttp({
  logger,
  genReqId: (req) => (req.headers['x-request-id'] as string) || uuid(),
  autoLogging: { ignore: (req) => req.url === '/health' || req.url === '/api/health' },
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
}));

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'degraded' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/campuses', campusRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/workforce', workforceRoutes);
app.use('/api/housing', housingRoutes);
app.use('/api/testimonies', testimonyRoutes);
app.use('/api/community-events', communityEventsRoutes);
app.use('/api/session-decisions', sessionDecisionsRouter);
app.use('/api/employer-candidates', employerCandidatesRouter);
app.use('/api/employer-candidates', employerPacketRouter);
app.use('/api/employer-candidates', employerOutreachRouter);
app.use('/api/outreach', outreachRouter);
app.use('/api/employer-candidates', employerAiRouter);
app.use('/api/session-tasks', sessionTasksRouter);
app.use('/api/session-notes', sessionNotesRouter);
app.use('/api/session-attendance', sessionAttendanceRouter);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/meeting-prep', meetingPrepRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/scoring', scoringRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ai', aiChatRouter);
app.use('/api/expansion', expansionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/grants', grantRoutes);
app.use('/api/pipeline', pipelineRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/repairs', repairsRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/progress', progressRoutes);
app.get('/api/dashboard', authenticate, async (_req, res, next) => {
  try {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const [totalMembers, activeMembers, bedCapacity, occupiedBeds, monthDonations] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.bed.count({ where: { isActive: true } }),
      prisma.housingAssignment.count({ where: { status: 'ACTIVE' } }),
      prisma.donation.aggregate({ where: { verificationStatus: 'VERIFIED', createdAt: { gte: monthStart } }, _sum: { amount: true } }),
    ]);
    res.json({
      members: { active: activeMembers, total: totalMembers },
      housing: { total_capacity: bedCapacity, occupied: occupiedBeds },
      financial: { month_donations: Number(monthDonations._sum?.amount || 0) },
    });
  } catch (err) { next(err); }
});

app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);

initWebSocket(httpServer);

const PORT = parseInt(process.env.PORT || '4000');

async function main() {
  try {
    await prisma.$connect();
    logger.info('Database connected');
    httpServer.listen(PORT, () => {
      logger.info({ port: PORT }, 'RRN API v5 started');
    });
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_CRONS === 'true') {
      startScoringCron();
      startSustainabilityCron();
      startDigestCron();
      startLifecycleCron();
      logger.info('Background cron jobs started');
    }
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

main();

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  httpServer.close(() => process.exit(0));
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled rejection');
});



app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));
// Phase 4.4: removed the duplicate, unreachable `/health` handler that used
// to live here — Express dispatches to the first-registered match, so this
// second one never ran; the real DB-checking `/health` above index.ts:72 was
// always the live one. See docs/BackendAudit.md.

app.get('/api/members', (req: any, res, next) => { req.url='/api/users'; app._router.handle(req,res,next); });
app.get('/api/admin/campuses', (req: any, res, next) => { req.url='/api/campuses'; app._router.handle(req,res,next); });
app.get('/api/lms/progress', (_req, res) => res.json({ progress: {} }));
app.get('/api/testimonies/featured', (_req, res) => res.json([]));
app.get('/api/sync/pull', (_req, res) => res.json({ events: [] }));

// old /api/members -> /api/users rewrite shim removed -- superseded by real members.ts route
app.use('/api/admin/campuses', (req: any, res: any, next: any) => { req.url = req.url.replace('/api/admin/campuses', '/api/campuses'); next(); });
app.use('/api/workforce/employers', (req: any, res: any, next: any) => { req.url = req.url.replace('/api/workforce/employers', '/api/workforce'); next(); });

app.get('/api/workforce/employers', (req: any, res: any, next: any) => { req.url = '/api/workforce'; app._router.handle(req, res, next); });
