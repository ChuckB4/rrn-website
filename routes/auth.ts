import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { Role } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logEvent } from '../services/eventService';

const router = Router();

// Phase 4.1 `as any` sweep: `user` here is always the direct, unmodified
// result of prisma.user.findFirst/findUnique — Prisma already types
// role/campusId/level/name/passwordHash correctly. Every `(user as any).x`
// cast in this file was unnecessary; removed throughout.

const LoginBodySchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string().min(1, 'password is required'),
}).refine((d) => d.username || d.email, { message: 'username or email is required' });

// RRN PWA login - accepts username or email + password
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = LoginBodySchema.parse(req.body);
    const identifier = (username || email || '').trim();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { email: { startsWith: identifier + '@' } },
          { email: { startsWith: identifier.toLowerCase() + '@' } },
        ]
      },
      include: { campus: { select: { name: true } } },
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.status === 'SUSPENDED') return res.status(403).json({ error: 'Account suspended' });
    if (user.status === 'INACTIVE') return res.status(403).json({ error: 'Account inactive' });
    if (user.status === 'PENDING') return res.status(403).json({ error: 'Account pending approval' });
    const token = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      campusId: user.campusId,
      level: user.level,
    });
    const refreshToken = signRefreshToken({ userId: user.id, tokenId: uuid() });
    res.json({
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: identifier,
        name: user.name || user.email,
        role: user.role,
        level: user.level,
        campus: user.campus?.name || 'All',
      }
    });
  } catch (e) { next(e); }
});

// --- Schemas ---
const LoginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  campusId: z.string().min(1, 'campusId is required'),
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.status === 'SUSPENDED') return res.status(403).json({ error: 'Account suspended' });
    if (user.status === 'INACTIVE') return res.status(403).json({ error: 'Account inactive' });
    if (user.status === 'PENDING') return res.status(403).json({ error: 'Account pending approval' });
    const token = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      campusId: user.campusId,
      level: user.level,
    });
    const refreshToken = signRefreshToken({ userId: user.id, tokenId: uuid() });
    await logEvent({ userId: user.id, campusId: user.campusId, eventType: 'LOGIN', metadata: { email } });
    res.json({ token, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) { next(e); }
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = RegisterSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        id: uuid(),
        email: data.email,
        name: data.name,
        passwordHash,
        role: Role.MEMBER,
        campusId: data.campusId,
      },
    });
    const token = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      campusId: user.campusId,
      level: user.level,
    });
    const refreshToken = signRefreshToken({ userId: user.id, tokenId: uuid() });
    res.status(201).json({ token, refreshToken, user: { id: user.id, email: user.email } });
  } catch (e) { next(e); }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });
    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (user.status === 'SUSPENDED') return res.status(403).json({ error: 'Account suspended' });
    if (user.status === 'INACTIVE') return res.status(403).json({ error: 'Account inactive' });
    if (user.status === 'PENDING') return res.status(403).json({ error: 'Account pending approval' });
    const token = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      campusId: user.campusId,
      level: user.level,
    });
    const newRefresh = signRefreshToken({ userId: user.id, tokenId: uuid() });
    res.json({ token, refreshToken: newRefresh });
  } catch (e) { next(e); }
});

// GET /api/auth/profile
router.get('/profile', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, role: true, level: true,
        campusId: true, status: true, joinedAt: true, lastLoginAt: true,
        campus: { select: { name: true, slug: true } },
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (e) { next(e); }
});

// POST /api/auth/logout
router.post('/logout', authenticate, async (_req: Request, res: Response) => {
  res.json({ ok: true });
});

export default router;
