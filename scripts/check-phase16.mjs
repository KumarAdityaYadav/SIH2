import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'scripts/e2e-validation.mjs',
  'PHASE-16-E2E-VALIDATION.md',
  'PHASE-16-TEST-MATRIX.json',
  'scripts/check-clinical-knowledge.mjs',
  'src/services/clinicalKnowledge.ts',
  'src/services/clinicalSafety.ts',
  'src/services/clinicalIntelligence.ts',
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const server = fs.readFileSync(path.join(root, 'server.ts'), 'utf8');
const routeChecks = [
  ['/api/auth/demo-login', server.includes("app.post('/api/auth/demo-login'")],
  ['/api/users/:userId/profile', server.includes("app.put('/api/users/:userId/profile'")],
  ['/api/screening/safety', server.includes("app.post('/api/screening/safety'")],
  ['/api/screening/knowledge', server.includes("app.post('/api/screening/knowledge'")],
  ['/api/screening/ml', server.includes("app.post('/api/screening/ml'")],
  ['/api/screening/intelligence', server.includes("app.post('/api/screening/intelligence'")],
  ['/api/users/:userId/screenings', server.includes("app.post('/api/users/:userId/screenings'")],
  ['/api/care-cases', server.includes("app.post('/api/care-cases'")],
  ['/api/consultations', server.includes("app.post('/api/consultations'")],
  ['/api/users/:userId/health-journey', server.includes("app.get('/api/users/:userId/health-journey'")],
  ['/api/users/:userId/privacy/export', server.includes("app.get('/api/users/:userId/privacy/export'")],
];

for (const file of required) console.log(`${missing.includes(file) ? 'FAIL' : 'PASS'}  file ${file}`);
for (const [route, ok] of routeChecks) console.log(`${ok ? 'PASS' : 'FAIL'}  route ${route}`);

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const scriptsOk = packageJson.scripts?.['validate:e2e'] === 'node scripts/e2e-validation.mjs' && packageJson.scripts?.['check:phase16'] === 'node scripts/check-phase16.mjs';
console.log(`${scriptsOk ? 'PASS' : 'FAIL'}  package scripts`);

if (missing.length || routeChecks.some(([, ok]) => !ok) || !scriptsOk) process.exit(1);
console.log('Phase 16 static validation passed. Run npm run validate:e2e with the app running for live validation.');
