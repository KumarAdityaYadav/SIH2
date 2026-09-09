const base = process.env.STREESURE_BASE_URL || 'http://localhost:3000';

function cookieFrom(response) {
  const raw = response.headers.get('set-cookie');
  if (!raw) return '';
  const first = raw.split(';')[0];
  return first;
}

async function request(path, options = {}, cookie = '') {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has('content-type')) headers.set('content-type', 'application/json');
  if (cookie) headers.set('cookie', cookie);
  const response = await fetch(`${base}${path}`, { ...options, headers });
  const text = await response.text();
  let body = {};
  try { body = text ? JSON.parse(text) : {}; } catch {}
  return { response, body, cookie: cookieFrom(response) || cookie };
}

const checks = [];
function check(name, ok, detail = '') {
  checks.push({ name, ok: Boolean(ok), detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}

const health = await request('/api/health');
check('health endpoint', health.response.ok && health.body.status === 'ok');

const demo = await request('/api/auth/demo-login', {
  method: 'POST', body: JSON.stringify({ userKey: 'user' }),
});
check('user demo login', demo.response.ok && demo.body.user?.role === 'USER');
const userCookie = demo.cookie;
const userId = demo.body.user?.id;

if (!userCookie || !userId) {
  console.error(`Cannot continue: no authenticated user session from ${base}.`);
  process.exit(1);
}

const session = await request('/api/auth/session', {}, userCookie);
check('session resolves', session.response.ok && session.body.authenticated === true && session.body.user?.id === userId);

const profilePayload = {
  age: 24,
  heightCm: 160,
  weightKg: 68,
  bmi: 26.56,
  familyHistoryPcos: true,
  familyHistoryDiabetes: false,
  knownDiabetes: false,
  knownThyroid: false,
  currentHormonalMeds: false,
};
const profile = await request(`/api/users/${userId}/profile`, {
  method: 'PUT', body: JSON.stringify(profilePayload),
}, userCookie);
check('health profile save', profile.response.ok && profile.body.profile?.age === 24);

const answers = {
  basicProfile: profilePayload,
  cycleRegularity: 'infrequent_over_35',
  increasedFacialHair: 'moderate_to_severe',
  increasedBodyHair: 'mild',
  persistentAcne: 'mild_occasional',
  scalpHairThinning: 'none',
  unexplainedWeightGain: 'moderate',
  familyPcosHistory: true,
  familyDiabetesHistory: false,
  elevatedBloodSugarHistory: false,
  knownThyroidDisorder: false,
  currentHormonalMeds: false,
  highStressRecentEvents: false,
  majorHealthChanges: false,
  heavyProlongedBleeding: false,
  recentPatternChange: false,
  previousPelvicUltrasound: 'not_done',
  periodSkippingFrequency: 'sometimes',
};

const safety = await request('/api/screening/safety', {
  method: 'POST', body: JSON.stringify({ answers }),
}, userCookie);
check('clinical safety', safety.response.ok && ['routine', 'prompt_clinical_review', 'urgent_care_guidance'].includes(safety.body.priority));

const knowledge = await request('/api/screening/knowledge', {
  method: 'POST', body: JSON.stringify({ answers }),
}, userCookie);
check('clinical knowledge', knowledge.response.ok && knowledge.body.provenance?.version === '2023 International PCOS Guideline' && Array.isArray(knowledge.body.relevantClaims));

const ml = await request('/api/screening/ml', {
  method: 'POST', body: JSON.stringify({ userId, answers }),
}, userCookie);
check('ML screening signal', ml.response.ok && typeof ml.body.probability === 'number' && typeof ml.body.modelVersion === 'string');

const screeningId = `scr_e2e_${Date.now()}`;
const screeningResult = {
  id: screeningId,
  userId,
  level: 'ORANGE',
  levelTitle: 'Preliminary screening signal',
  score: 62,
  answers,
  pointBreakdown: {
    menstrualPatternScore: 26,
    clinicalSymptomsScore: 14,
    metabolicContextScore: 0,
    supportingContextScore: 5,
  },
  completenessPercentage: 100,
  missingCriticalInfo: [],
  recommendedNextSteps: ['Consider discussing the reported cycle and symptom pattern with a qualified healthcare professional.'],
  ...(typeof ml.body.probability === 'number' ? {
    mlRiskProbability: ml.body.probability,
    mlRiskLabel: 'Model screening signal — not a diagnosis',
    modelVersion: ml.body.modelVersion,
    mlThreshold: ml.body.threshold,
  } : {}),
  safetyAssessment: safety.body,
};

const intelligence = await request('/api/screening/intelligence', {
  method: 'POST', body: JSON.stringify({ screeningResult }),
}, userCookie);
check('clinical intelligence', intelligence.response.ok && intelligence.body.clinicalKnowledge?.provenance?.version === '2023 International PCOS Guideline');

const saved = await request(`/api/users/${userId}/screenings`, {
  method: 'POST', body: JSON.stringify(screeningResult),
}, userCookie);
check('screening persistence', saved.response.ok && saved.body.screening?.id === screeningId);

const consent = await request(`/api/users/${userId}/consents`, {
  method: 'POST', body: JSON.stringify({ purpose: 'care_coordination', granted: true, version: '2026-09-01' }),
}, userCookie);
check('care coordination consent', consent.response.ok && consent.body.consent?.granted === true);

const care = await request('/api/care-cases', {
  method: 'POST', body: JSON.stringify({
    beneficiaryUserId: userId,
    createdByUserId: userId,
    consentGiven: true,
    priority: 'MEDIUM',
    reason: 'E2E validation of beneficiary to care coordination flow',
    screeningId,
  }),
}, userCookie);
const caseId = care.body.careCase?.id;
check('care case creation', care.response.ok && Boolean(caseId));

const journey = await request(`/api/users/${userId}/health-journey`, {}, userCookie);
check('health journey aggregation', journey.response.ok && journey.body.user?.id === userId && Array.isArray(journey.body.timeline));

const ashaLogin = await request('/api/auth/demo-login', {
  method: 'POST', body: JSON.stringify({ userKey: 'asha' }),
});
check('ASHA demo login', ashaLogin.response.ok && ashaLogin.body.user?.role === 'ASHA');
if (caseId && ashaLogin.cookie) {
  const assigned = await request(`/api/care-cases/${caseId}`, {
    method: 'PATCH', body: JSON.stringify({ assignedAshaId: ashaLogin.body.user.id, status: 'ASHA_ASSIGNED' }),
  }, ashaLogin.cookie);
  check('ASHA case assignment', assigned.response.ok && assigned.body.careCase?.assignedAshaId === ashaLogin.body.user.id);
}

const doctorLogin = await request('/api/auth/demo-login', {
  method: 'POST', body: JSON.stringify({ userKey: 'doctor' }),
});
check('doctor demo login', doctorLogin.response.ok && doctorLogin.body.user?.role === 'DOCTOR');
if (caseId && doctorLogin.cookie) {
  const assignedDoctor = await request(`/api/care-cases/${caseId}`, {
    method: 'PATCH', body: JSON.stringify({ assignedDoctorId: doctorLogin.body.user.id, status: 'DOCTOR_ASSIGNED' }),
  }, doctorLogin.cookie);
  check('doctor case assignment', assignedDoctor.response.ok && assignedDoctor.body.careCase?.assignedDoctorId === doctorLogin.body.user.id);

  const consultation = await request('/api/consultations', {
    method: 'POST', body: JSON.stringify({
      userId,
      doctorId: doctorLogin.body.user.id,
      careCaseId: caseId,
      status: 'REQUESTED',
      reason: 'E2E validation consultation record',
    }),
  }, doctorLogin.cookie);
  check('consultation creation', consultation.response.ok && Boolean(consultation.body.consultation?.id));
}

const exported = await request(`/api/users/${userId}/privacy/export`, {}, userCookie);
check('privacy export', exported.response.ok && exported.body.user?.id === userId && Array.isArray(exported.body.screenings));

const failed = checks.filter((item) => !item.ok);
console.log(`\nPhase 16 E2E: ${checks.length - failed.length}/${checks.length} checks passed.`);
if (failed.length) {
  console.error('Failed checks:', failed.map((item) => item.name).join(', '));
  process.exit(1);
}
console.log(`End-to-end validation passed against ${base}.`);
