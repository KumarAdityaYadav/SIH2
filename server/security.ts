import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX || 120);
const buckets = new Map<string, { count: number; resetAt: number }>();

export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = req.header('x-request-id')?.slice(0, 100) || crypto.randomUUID();
  res.setHeader('x-request-id', id);
  (req as Request & { requestId?: string }).requestId = id;
  next();
}

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Note: Do not set X-Frame-Options: DENY as the app is displayed in an iframe preview within Google AI Studio
  next();
}

export function apiRateLimit(req: Request, res: Response, next: NextFunction) {
  const now = Date.now();
  const key = req.ip || 'unknown';
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }
  if (current.count >= MAX_REQUESTS) {
    res.setHeader('Retry-After', Math.ceil((current.resetAt - now) / 1000));
    return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
  }
  current.count += 1;
  next();
}

export function auditSafe(value: unknown): string {
  return typeof value === 'string' ? value.slice(0, 200) : '';
}

export function createEncryptionKey(): Buffer | null {
  const raw = process.env.STREESURE_ENCRYPTION_KEY;
  if (!raw) return null;
  const normalized = raw.length === 64 && /^[0-9a-f]+$/i.test(raw) ? Buffer.from(raw, 'hex') : crypto.createHash('sha256').update(raw).digest();
  return normalized.length === 32 ? normalized : null;
}

export function encryptJson(value: unknown, key: Buffer): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plaintext = Buffer.from(JSON.stringify(value), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1.${iv.toString('base64url')}.${tag.toString('base64url')}.${ciphertext.toString('base64url')}`;
}

export function decryptJson<T>(encoded: string, key: Buffer): T {
  const [, ivPart, tagPart, dataPart] = encoded.split('.');
  if (!ivPart || !tagPart || !dataPart) throw new Error('Invalid encrypted value');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivPart, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagPart, 'base64url'));
  const plaintext = Buffer.concat([decipher.update(Buffer.from(dataPart, 'base64url')), decipher.final()]);
  return JSON.parse(plaintext.toString('utf8')) as T;
}
