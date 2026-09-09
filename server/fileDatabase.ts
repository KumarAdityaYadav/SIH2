import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createEncryptionKey, decryptJson, encryptJson } from './security';

export interface DbUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  preferredLanguage: string;
  age?: number;
  location?: string;
  emergencyContact?: string;
  createdAt: string;
  healthProfileCompleted?: boolean;
  passwordHash?: string;
}

export interface DbHealthProfile {
  userId: string;
  profile: Record<string, unknown>;
  updatedAt: string;
}

export interface DbCareCase {
  id: string;
  beneficiaryUserId: string;
  createdByUserId: string;
  assignedAshaId?: string;
  assignedDoctorId?: string;
  status: 'NEW' | 'ASHA_ASSIGNED' | 'DOCTOR_REFERRED' | 'IN_REVIEW' | 'RESOLVED';
  consentGiven: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  reason: string;
  notes?: string;
  screeningId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbConsultation {
  id: string;
  userId: string;
  doctorId: string;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DbScreening {
  id: string;
  userId: string;
  createdAt: string;
  result: Record<string, unknown>;
}

export interface DbConsent {
  id: string;
  userId: string;
  purpose: string;
  granted: boolean;
  version: string;
  createdAt: string;
  revokedAt?: string;
}

export interface DbAuditLog {
  id: string;
  actorUserId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  requestId?: string;
  createdAt: string;
}

interface DatabaseShape {
  users: DbUser[];
  healthProfiles: DbHealthProfile[];
  screenings: DbScreening[];
  careCases: DbCareCase[];
  consultations: DbConsultation[];
  hardwareMeasurements: Record<string, unknown>[];
  consents: DbConsent[];
  auditLogs: DbAuditLog[];
  sessions: { id: string; userId: string; tokenHash: string; expiresAt: string; createdAt: string }[];
}

const dataDir = path.join(process.cwd(), 'server', 'data');
const dbFile = path.join(dataDir, 'streesure-db.json');

const EMPTY_DB: DatabaseShape = { users: [], healthProfiles: [], screenings: [], careCases: [], consultations: [], hardwareMeasurements: [], consents: [], auditLogs: [], sessions: [] };
const encryptionKey = createEncryptionKey();

function protect(value: Record<string, unknown>): Record<string, unknown> {
  return encryptionKey ? { __encrypted: encryptJson(value, encryptionKey) } : value;
}

function unprotect<T extends Record<string, unknown>>(value: T): T {
  if (encryptionKey && typeof value.__encrypted === 'string') return decryptJson<T>(value.__encrypted, encryptionKey);
  return value;
}

function ensureDb(): void {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify(EMPTY_DB, null, 2), 'utf8');
  }
}

function readDb(): DatabaseShape {
  ensureDb();
  try {
    const raw = fs.readFileSync(dbFile, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      healthProfiles: Array.isArray(parsed.healthProfiles) ? parsed.healthProfiles : [],
      screenings: Array.isArray(parsed.screenings) ? parsed.screenings : [],
      careCases: Array.isArray(parsed.careCases) ? parsed.careCases : [],
      consultations: Array.isArray(parsed.consultations) ? parsed.consultations : [],
      hardwareMeasurements: Array.isArray(parsed.hardwareMeasurements) ? parsed.hardwareMeasurements : [],
      consents: Array.isArray(parsed.consents) ? parsed.consents : [],
      auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    };
  } catch {
    return { ...EMPTY_DB, users: [], healthProfiles: [], screenings: [], careCases: [], consultations: [], hardwareMeasurements: [], consents: [], auditLogs: [], sessions: [] };
  }
}

function writeDb(db: DatabaseShape): void {
  ensureDb();
  const tempFile = `${dbFile}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tempFile, dbFile);
}

export const database = {
  findUserByEmailOrPhone(identifier: string) {
    const normalized = String(identifier).trim().toLowerCase().replace(/\s+/g, '');
    return readDb().users.find((user) => user.email.toLowerCase() === normalized || user.phone.replace(/\s+/g, '').toLowerCase() === normalized) ?? null;
  },

  setUserPasswordHash(userId: string, passwordHash: string) {
    const db = readDb();
    const index = db.users.findIndex((u) => u.id === userId);
    if (index < 0) return null;
    db.users[index] = { ...db.users[index], passwordHash };
    writeDb(db);
    return db.users[index];
  },

  getUser(userId: string) {
    return readDb().users.find((user) => user.id === userId) ?? null;
  },

  upsertUser(user: DbUser) {
    const db = readDb();
    const index = db.users.findIndex((item) => item.id === user.id);
    if (index >= 0) db.users[index] = { ...db.users[index], ...user };
    else db.users.push(user);
    writeDb(db);
    return db.users.find((item) => item.id === user.id)!;
  },

  getHealthProfile(userId: string) {
    const record = readDb().healthProfiles.find((profile) => profile.userId === userId) ?? null;
    return record ? { ...record, profile: unprotect(record.profile) } : null;
  },

  upsertHealthProfile(userId: string, profile: Record<string, unknown>) {
    const db = readDb();
    const updatedAt = new Date().toISOString();
    const index = db.healthProfiles.findIndex((item) => item.userId === userId);
    const record = { userId, profile: protect(profile), updatedAt };
    if (index >= 0) db.healthProfiles[index] = record;
    else db.healthProfiles.push(record);
    db.users = db.users.map((user) =>
      user.id === userId ? { ...user, healthProfileCompleted: true } : user
    );
    writeDb(db);
    return { ...record, profile: unprotect(record.profile) };
  },

  addScreening(userId: string, result: Record<string, unknown>) {
    const db = readDb();
    const record: DbScreening = {
      id: `scr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId,
      createdAt: new Date().toISOString(),
      result: protect(result),
    };
    db.screenings.unshift(record);
    db.screenings = db.screenings.slice(0, 1000);
    writeDb(db);
    return record;
  },

  getScreenings(userId: string) {
    return readDb().screenings.filter((screening) => screening.userId === userId).map((screening) => ({ ...screening, result: unprotect(screening.result) }));
  },

  createCareCase(input: Omit<DbCareCase, 'id' | 'createdAt' | 'updatedAt'>) {
    const db = readDb();
    const now = new Date().toISOString();
    const record: DbCareCase = { ...input, id: `case_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, createdAt: now, updatedAt: now };
    db.careCases.unshift(record);
    writeDb(db);
    return record;
  },

  getCareCases(filters: { status?: string; ashaId?: string; doctorId?: string; beneficiaryUserId?: string } = {}) {
    return readDb().careCases.filter((item) =>
      (!filters.status || item.status === filters.status) &&
      (!filters.ashaId || item.assignedAshaId === filters.ashaId) &&
      (!filters.doctorId || item.assignedDoctorId === filters.doctorId) &&
      (!filters.beneficiaryUserId || item.beneficiaryUserId === filters.beneficiaryUserId)
    );
  },

  updateCareCase(caseId: string, patch: Partial<DbCareCase>) {
    const db = readDb();
    const index = db.careCases.findIndex((item) => item.id === caseId);
    if (index < 0) return null;
    db.careCases[index] = { ...db.careCases[index], ...patch, id: caseId, updatedAt: new Date().toISOString() };
    writeDb(db);
    return db.careCases[index];
  },

  createConsultation(userId: string, doctorId: string, payload: Record<string, unknown>) {
    const db = readDb();
    const now = new Date().toISOString();
    const record: DbConsultation = { id: String(payload.id || `cns_${Date.now()}`), userId, doctorId, payload, createdAt: now, updatedAt: now };
    db.consultations = [record, ...db.consultations.filter((item) => item.id !== record.id)];
    writeDb(db);
    return record;
  },

  getConsultations(filters: { userId?: string; doctorId?: string } = {}) {
    return readDb().consultations.filter((item) =>
      (!filters.userId || item.userId === filters.userId) && (!filters.doctorId || item.doctorId === filters.doctorId)
    );
  },


  addHardwareMeasurements(userId: string, measurements: Record<string, unknown>[], sessionId?: string) {
    const db = readDb();
    const now = new Date().toISOString();
    const records = measurements.map((measurement) => ({
      id: `hwm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId,
      sessionId: sessionId || measurement.sessionId || null,
      receivedAt: now,
      measurement: protect(measurement),
    }));
    db.hardwareMeasurements = [...records, ...db.hardwareMeasurements].slice(0, 5000);
    writeDb(db);
    return records;
  },

  getHardwareMeasurements(userId: string) {
    return readDb().hardwareMeasurements.filter((item) => item.userId === userId).map((item) => ({ ...item, measurement: unprotect(item.measurement as Record<string, unknown>) }));
  },

  recordConsent(userId: string, purpose: string, granted: boolean, version = '2026-09-01') {
    const db = readDb();
    const now = new Date().toISOString();
    const record: DbConsent = { id: `cons_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, userId, purpose, granted, version, createdAt: now, ...(granted ? {} : { revokedAt: now }) };
    db.consents.unshift(record);
    writeDb(db);
    return record;
  },

  getConsents(userId: string) {
    return readDb().consents.filter((item) => item.userId === userId);
  },

  addAuditLog(input: Omit<DbAuditLog, 'id' | 'createdAt'>) {
    const db = readDb();
    const record: DbAuditLog = { ...input, id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString() };
    db.auditLogs.unshift(record);
    db.auditLogs = db.auditLogs.slice(0, 10000);
    writeDb(db);
    return record;
  },

  createSession(userId: string, tokenHash: string, expiresAt: string) {
    const db = readDb();
    const record = { id: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, userId, tokenHash, expiresAt, createdAt: new Date().toISOString() };
    db.sessions = db.sessions.filter((s) => s.expiresAt > new Date().toISOString() && s.userId !== userId);
    db.sessions.push(record);
    writeDb(db);
    return record;
  },

  getSession(tokenHash: string) {
    const db = readDb();
    const session = db.sessions.find((s) => s.tokenHash === tokenHash);
    if (!session) return null;
    if (session.expiresAt <= new Date().toISOString()) { db.sessions = db.sessions.filter((s) => s.id !== session.id); writeDb(db); return null; }
    return session;
  },

  deleteSession(tokenHash: string) {
    const db = readDb();
    db.sessions = db.sessions.filter((s) => s.tokenHash !== tokenHash);
    writeDb(db);
  },

  getAuditLogs(userId?: string) {
    return readDb().auditLogs.filter((item) => !userId || item.actorUserId === userId);
  },

  deleteUserData(userId: string) {
    const db = readDb();
    db.healthProfiles = db.healthProfiles.filter((item) => item.userId !== userId);
    db.screenings = db.screenings.filter((item) => item.userId !== userId);
    db.hardwareMeasurements = db.hardwareMeasurements.filter((item) => item.userId !== userId);
    db.careCases = db.careCases.filter((item) => item.beneficiaryUserId !== userId && item.createdByUserId !== userId && item.assignedAshaId !== userId && item.assignedDoctorId !== userId);
    db.consultations = db.consultations.filter((item) => item.userId !== userId && item.doctorId !== userId);
    db.consents = db.consents.filter((item) => item.userId !== userId);
    db.users = db.users.filter((item) => item.id !== userId);
    db.sessions = db.sessions.filter((item) => item.userId !== userId);
    writeDb(db);
  },

  updateConsultation(id: string, patch: Record<string, unknown>) {
    const db = readDb();
    const index = db.consultations.findIndex((item) => item.id === id);
    if (index < 0) return null;
    db.consultations[index] = { ...db.consultations[index], payload: { ...db.consultations[index].payload, ...patch }, updatedAt: new Date().toISOString() };
    writeDb(db);
    return db.consultations[index];
  },

};
