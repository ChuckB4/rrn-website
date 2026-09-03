import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { JsonWebTokenError } from 'jsonwebtoken';
import { captureError, setSentryUser } from '../lib/sentry';
import { logger } from '../lib/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Validation errors — expected client input errors, not reported to Sentry
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Application errors (4xx business/auth rejections) — also expected,
  // not reported to Sentry; only genuinely unexpected errors are.
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  // Malformed/expired/not-yet-valid JWTs (covers TokenExpiredError and
  // NotBeforeError too -- both extend JsonWebTokenError). Previously fell
  // through to the generic 500 below because it's neither a ZodError nor an
  // AppError; found via POST /api/auth/refresh with a bad token returning
  // 500 instead of 401 during the 2026-09-02 production auth outage triage.
  // A client-supplied bad token is an expected 4xx case, not a server fault.
  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Prisma unique constraint
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'A record with this value already exists',
        field: (err.meta?.target as string[])?.join(', '),
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Record not found' });
    }
  }

  // Default server error — the genuinely unexpected case. Phase 4.4: wired
  // to the previously-dead captureError/setSentryUser helpers so this path
  // reaches Sentry with request/user context when SENTRY_DSN is set (still
  // a no-op otherwise, same as the rest of lib/sentry.ts). Note this only
  // covers errors that reach this handler via next(err) — it does not (and
  // cannot) retroactively report errors elsewhere in the codebase that are
  // caught and handled locally without ever calling next().
  logger.error({ err, path: req.path, method: req.method }, 'Unhandled error');
  if (req.user) {
    setSentryUser(req.user.userId, req.user.role, req.user.campusId);
  }
  captureError(err, { path: req.path, method: req.method });
  return res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}
