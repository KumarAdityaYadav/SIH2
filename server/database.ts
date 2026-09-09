import 'dotenv/config';
import { database as fileDatabase } from './fileDatabase';

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const useSupabase = Boolean(supabaseUrl && supabaseKey);

async function sb(path: string, init: RequestInit = {}) {
  if (!supabaseUrl || !supabaseKey) throw new Error('Supabase is not configured');
  const headers = new Headers(init.headers);
  headers.set('apikey', supabaseKey);
  headers.set('Authorization', `Bearer ${supabaseKey}`);
  headers.set('Content-Type', 'application/json');
  headers.set('Prefer', init.method === 'POST' ? 'return=representation' : 'return=representation');
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, { ...init, headers });
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
  const text = await response.text();
  return text ? JSON.parse(text) : [];
}

// Phase 8 provider: Supabase/Postgres when configured; local encrypted file only for development.
// API handlers remain provider-neutral so migration does not change the UI contract.
const supabase = {
  async findUserByEmailOrPhone(identifier: string) { const normalized=String(identifier).trim().toLowerCase().replace(/\s+/g,''); const rows=await sb(`users?or=(email.eq.${encodeURIComponent(normalized)},phone.eq.${encodeURIComponent(normalized)})&limit=1`); return rows[0]??null; },
  async setUserPasswordHash(userId:string,passwordHash:string){const rows=await sb(`users?id=eq.${encodeURIComponent(userId)}`,{method:'PATCH',body:JSON.stringify({password_hash:passwordHash})});return rows[0]??null;},
  async getUser(userId: string) { const rows = await sb(`users?id=eq.${encodeURIComponent(userId)}&limit=1`); if (!rows[0]) return null; return {...rows[0], fullName:rows[0].full_name, preferredLanguage:rows[0].preferred_language, emergencyContact:rows[0].emergency_contact, healthProfileCompleted:rows[0].health_profile_completed, createdAt:rows[0].created_at, passwordHash:rows[0].password_hash ?? undefined}; },
  async upsertUser(user: any) { const dbUser={id:user.id,full_name:user.fullName,email:user.email,phone:user.phone,role:user.role,preferred_language:user.preferredLanguage,age:user.age??null,location:user.location??null,emergency_contact:user.emergencyContact??null,created_at:user.createdAt??new Date().toISOString(),health_profile_completed:user.healthProfileCompleted??false,password_hash:user.passwordHash??null}; const rows = await sb('users', { method: 'POST', body: JSON.stringify(dbUser), headers: { Prefer: 'resolution=merge-duplicates,return=representation' } }); return rows[0]; },
  async getHealthProfile(userId: string) { const rows = await sb(`health_profiles?user_id=eq.${encodeURIComponent(userId)}&limit=1`); if (!rows[0]) return null; return { ...rows[0], userId: rows[0].user_id, updatedAt: rows[0].updated_at, profile: rows[0].profile }; },
  async upsertHealthProfile(userId: string, profile: any) { const record = { user_id: userId, profile, updated_at: new Date().toISOString() }; const rows = await sb('health_profiles', { method: 'POST', body: JSON.stringify(record), headers: { Prefer: 'resolution=merge-duplicates,return=representation' } }); return { userId, profile: rows[0]?.profile ?? profile, updatedAt: rows[0]?.updated_at ?? record.updated_at }; },
  async addScreening(userId: string, result: any) { const record = { user_id: userId, created_at: new Date().toISOString(), result }; const rows = await sb('screenings', { method: 'POST', body: JSON.stringify(record) }); return { id: rows[0].id, userId, createdAt: rows[0].created_at, result: rows[0].result }; },
  async getScreenings(userId: string) { const rows = await sb(`screenings?user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc`); return rows.map((r:any) => ({ id:r.id,userId:r.user_id,createdAt:r.created_at,result:r.result })); },
  async createCareCase(input: any) { const row = { ...input, beneficiary_user_id: input.beneficiaryUserId, created_by_user_id: input.createdByUserId, assigned_asha_id: input.assignedAshaId ?? null, assigned_doctor_id: input.assignedDoctorId ?? null, consent_given: input.consentGiven, screening_id: input.screeningId ?? null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }; delete row.beneficiaryUserId; delete row.createdByUserId; delete row.assignedAshaId; delete row.assignedDoctorId; delete row.consentGiven; delete row.screeningId; const rows = await sb('care_cases', {method:'POST',body:JSON.stringify(row)}); return mapCase(rows[0]); },
  async getCareCases(filters:any={}) { const rows = await sb('care_cases?order=created_at.desc'); return rows.map(mapCase).filter((x:any)=>(!filters.status||x.status===filters.status)&&(!filters.ashaId||x.assignedAshaId===filters.ashaId)&&(!filters.doctorId||x.assignedDoctorId===filters.doctorId)&&(!filters.beneficiaryUserId||x.beneficiaryUserId===filters.beneficiaryUserId)); },
  async updateCareCase(id:string, patch:any) { const body:any={updated_at:new Date().toISOString()}; if('status'in patch)body.status=patch.status;if('assignedAshaId'in patch)body.assigned_asha_id=patch.assignedAshaId;if('assignedDoctorId'in patch)body.assigned_doctor_id=patch.assignedDoctorId;if('priority'in patch)body.priority=patch.priority;if('notes'in patch)body.notes=patch.notes; const rows=await sb(`care_cases?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify(body)});return rows[0]?mapCase(rows[0]):null;},
  async createConsultation(userId:string,doctorId:string,payload:any){const rows=await sb('consultations',{method:'POST',body:JSON.stringify({user_id:userId,doctor_id:doctorId,payload,created_at:new Date().toISOString(),updated_at:new Date().toISOString()})});return mapConsultation(rows[0]);},
  async getConsultations(filters:any={}){let q='consultations?order=created_at.desc';if(filters.userId)q+=`&user_id=eq.${encodeURIComponent(filters.userId)}`;if(filters.doctorId)q+=`&doctor_id=eq.${encodeURIComponent(filters.doctorId)}`;const rows=await sb(q);return rows.map(mapConsultation);},
  async updateConsultation(id:string,patch:any){const rows=await sb(`consultations?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify({payload:patch,updated_at:new Date().toISOString()})});return rows[0]?mapConsultation(rows[0]):null;},
  async addHardwareMeasurements(userId:string,measurements:any[],sessionId?:string){const rows=await sb('hardware_measurements',{method:'POST',body:JSON.stringify(measurements.map(m=>({user_id:userId,session_id:sessionId||m.sessionId||null,received_at:new Date().toISOString(),measurement:m})))});return rows.map((r:any)=>({id:r.id,userId:r.user_id,sessionId:r.session_id,receivedAt:r.received_at,measurement:r.measurement}));},
  async getHardwareMeasurements(userId:string){const rows=await sb(`hardware_measurements?user_id=eq.${encodeURIComponent(userId)}&order=received_at.desc`);return rows.map((r:any)=>({id:r.id,userId:r.user_id,sessionId:r.session_id,receivedAt:r.received_at,measurement:r.measurement}));},
  async recordConsent(userId:string,purpose:string,granted:boolean,version='2026-09-01'){const rows=await sb('consents',{method:'POST',body:JSON.stringify({user_id:userId,purpose,granted,version,created_at:new Date().toISOString(),revoked_at:granted?null:new Date().toISOString()})});return mapConsent(rows[0]);},
  async getConsents(userId:string){const rows=await sb(`consents?user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc`);return rows.map(mapConsent);},
  async addAuditLog(input:any){const rows=await sb('audit_logs',{method:'POST',body:JSON.stringify({actor_user_id:input.actorUserId??null,action:input.action,resource:input.resource,resource_id:input.resourceId??null,request_id:input.requestId??null,created_at:new Date().toISOString()})});return mapAudit(rows[0]);},
  async getAuditLogs(userId?:string){const q=userId?`audit_logs?actor_user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc`:'audit_logs?order=created_at.desc';const rows=await sb(q);return rows.map(mapAudit);},
  async deleteUserData(userId:string){for(const table of ['health_profiles','screenings','hardware_measurements','care_cases','consultations','consents']){const col=table==='care_cases'?'beneficiary_user_id':table==='consultations'?'user_id':'user_id';await sb(`${table}?${col}=eq.${encodeURIComponent(userId)}`,{method:'DELETE'});}await sb(`users?id=eq.${encodeURIComponent(userId)}`,{method:'DELETE'});},
  async createSession(userId:string,tokenHash:string,expiresAt:string){const rows=await sb('sessions',{method:'POST',body:JSON.stringify({user_id:userId,token_hash:tokenHash,expires_at:expiresAt,created_at:new Date().toISOString()})});const r=rows[0];return {id:r.id,userId:r.user_id,tokenHash:r.token_hash,expiresAt:r.expires_at,createdAt:r.created_at};},
  async getSession(tokenHash:string){const rows=await sb(`sessions?token_hash=eq.${encodeURIComponent(tokenHash)}&limit=1`);if(!rows[0])return null;const r=rows[0];return {id:r.id,userId:r.user_id,tokenHash:r.token_hash,expiresAt:r.expires_at,createdAt:r.created_at};},
  async deleteSession(tokenHash:string){await sb(`sessions?token_hash=eq.${encodeURIComponent(tokenHash)}`,{method:'DELETE'});},
};
function mapCase(r:any){return {id:r.id,beneficiaryUserId:r.beneficiary_user_id,createdByUserId:r.created_by_user_id,assignedAshaId:r.assigned_asha_id??undefined,assignedDoctorId:r.assigned_doctor_id??undefined,status:r.status,consentGiven:r.consent_given,priority:r.priority,reason:r.reason,notes:r.notes??undefined,screeningId:r.screening_id??undefined,createdAt:r.created_at,updatedAt:r.updated_at};}
function mapConsultation(r:any){return {id:r.id,userId:r.user_id,doctorId:r.doctor_id,payload:r.payload,createdAt:r.created_at,updatedAt:r.updated_at};}
function mapConsent(r:any){return {id:r.id,userId:r.user_id,purpose:r.purpose,granted:r.granted,version:r.version,createdAt:r.created_at,revokedAt:r.revoked_at??undefined};}
function mapAudit(r:any){return {id:r.id,actorUserId:r.actor_user_id??undefined,action:r.action,resource:r.resource,resourceId:r.resource_id??undefined,requestId:r.request_id??undefined,createdAt:r.created_at};}


async function getHealthJourney(userId: string) {
  const [user, profile, screenings, hardwareMeasurements, careCases, consultations, consents] = await Promise.all([
    database.getUser(userId),
    database.getHealthProfile(userId),
    database.getScreenings(userId),
    database.getHardwareMeasurements(userId),
    database.getCareCases({ beneficiaryUserId: userId }),
    database.getConsultations({ userId }),
    database.getConsents(userId),
  ]);

  const screeningResults = screenings.map((item: any) => item.result ?? item).filter(Boolean);
  const latestScreening = screeningResults[0] ?? null;
  const latestHardware = hardwareMeasurements[0] ?? null;
  const completedConsultations = consultations.filter((item: any) => String(item.status ?? item.payload?.status ?? '').toUpperCase() === 'COMPLETED');
  const openCareCases = careCases.filter((item: any) => !['CLOSED', 'FOLLOW_UP_COMPLETED'].includes(String(item.status ?? '').toUpperCase()));

  const timeline: any[] = [];
  for (const item of screenings) {
    const result = item.result ?? {};
    timeline.push({
      id: `screening-${item.id}`,
      type: 'SCREENING',
      date: item.createdAt ?? result.date,
      title: 'PCOS screening completed',
      summary: result.levelTitle || `Screening level: ${result.level || 'recorded'}`,
      level: result.level ?? null,
      source: result.mlRiskProbability != null ? 'ML + clinical engine' : 'Clinical screening engine',
    });
  }
  for (const item of hardwareMeasurements.slice(0, 20)) {
    const m = item.measurement ?? item;
    timeline.push({
      id: `hardware-${item.id}`,
      type: 'HARDWARE',
      date: item.receivedAt ?? m.timestamp,
      title: `${m.parameter || 'Health'} measurement recorded`,
      summary: Number.isFinite(Number(m.value)) ? `${m.value} ${m.unit || ''}`.trim() : 'Measurement recorded',
      source: m.source || 'DEVICE',
      parameter: m.parameter || null,
    });
  }
  for (const item of careCases) {
    timeline.push({
      id: `case-${item.id}`,
      type: 'CARE_CASE',
      date: item.updatedAt ?? item.createdAt,
      title: 'Care coordination update',
      summary: item.reason || `Case status: ${item.status}`,
      status: item.status,
      priority: item.priority,
    });
  }
  for (const item of consultations) {
    const payload = item.payload ?? item;
    timeline.push({
      id: `consultation-${item.id}`,
      type: 'CONSULTATION',
      date: item.updatedAt ?? item.createdAt ?? payload.scheduledAt,
      title: 'Doctor consultation',
      summary: payload.doctorName ? `Consultation with ${payload.doctorName}` : 'Doctor consultation recorded',
      status: payload.status || null,
    });
  }
  timeline.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

  const categoryCounts = {
    screenings: screenings.length,
    hardwareMeasurements: hardwareMeasurements.length,
    careCases: careCases.length,
    consultations: consultations.length,
    completedConsultations: completedConsultations.length,
  };

  const riskTrend = screeningResults.slice(0, 8).map((result: any) => ({
    date: result.date || null,
    level: result.level || null,
    score: typeof result.overallScore === 'number' ? result.overallScore : null,
    mlProbability: typeof result.mlRiskProbability === 'number' ? result.mlRiskProbability : null,
  }));

  return {
    generatedAt: new Date().toISOString(),
    user: user ? { id: user.id, fullName: user.fullName, role: user.role, preferredLanguage: user.preferredLanguage } : null,
    profile: profile?.profile ?? null,
    latestScreening,
    latestHardwareMeasurement: latestHardware,
    stats: categoryCounts,
    openCareCases: openCareCases.length,
    consentCount: consents.length,
    riskTrend,
    timeline: timeline.slice(0, 50),
  };
}

export const database: any = useSupabase ? supabase : fileDatabase;
(database as any).getHealthJourney = getHealthJourney;
export const databaseProvider = useSupabase ? 'supabase-postgres' : 'local-development';
