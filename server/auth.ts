import 'dotenv/config';
import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { database } from './database';

const COOKIE = 'streesure_session';
const SESSION_DAYS = Number(process.env.SESSION_DAYS || 7);

function hashToken(token: string) { return crypto.createHash('sha256').update(token).digest('hex'); }
function parseCookies(header: string | undefined) {
  const out: Record<string,string> = {};
  for (const part of (header || '').split(';')) { const i = part.indexOf('='); if (i > 0) out[part.slice(0,i).trim()] = decodeURIComponent(part.slice(i+1).trim()); }
  return out;
}
export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}
export function verifyPassword(password: string, encoded: string) {
  const [scheme, salt, hash] = encoded.split('$');
  if (scheme !== 'scrypt' || !salt || !hash) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(hash, 'hex'));
}
export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000).toISOString();
  await Promise.resolve(database.createSession(userId, hashToken(token), expiresAt));
  return { token, expiresAt };
}
export async function destroySession(token: string) { await Promise.resolve(database.deleteSession(hashToken(token))); }
export async function resolveSession(req: Request) {
  const token = parseCookies(req.headers.cookie)[COOKIE];
  if (!token) return null;
  const session = await Promise.resolve(database.getSession(hashToken(token)));
  if (!session) return null;
  const user = await Promise.resolve(database.getUser(session.userId));
  return user ? { session, user } : null;
}
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = await resolveSession(req);
  if (!auth) return res.status(401).json({ error: 'Authentication required' });
  (req as any).auth = auth;
  next();
}

export function requireUserAccess(paramName = 'userId') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const auth = (req as any).auth || await resolveSession(req);
    if (!auth) return res.status(401).json({ error: 'Authentication required' });
    const target = String(req.params[paramName] || '');
    const staff = ['ASHA','DOCTOR','NGO','ADMIN'].includes(auth.user.role);
    if (target !== auth.user.id && !staff) return res.status(403).json({ error: 'You can only access your own health data' });
    (req as any).auth = auth;
    next();
  };
}

export function requireRole(...roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const auth = (req as any).auth || await resolveSession(req);
    if (!auth) return res.status(401).json({ error: 'Authentication required' });
    if (!roles.includes(auth.user.role)) return res.status(403).json({ error: 'Insufficient permissions' });
    (req as any).auth = auth;
    next();
  };
}
export function sessionCookie(token: string, expiresAt: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Expires=${new Date(expiresAt).toUTCString()}${secure}`;
}
export function clearSessionCookie() { return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`; }
export const sessionCookieName = COOKIE;
