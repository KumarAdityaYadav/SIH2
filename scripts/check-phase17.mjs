import fs from 'node:fs';
import path from 'node:path';

const required = [
  'src/services/clinicalSafety.ts',
  'src/services/clinicalKnowledge.ts',
  'src/services/clinicalIntelligence.ts',
  'src/services/mlScreening.ts',
  'server/security.ts',
  'server/auth.ts',
  'scripts/e2e-validation.mjs',
  'PHASE-16-E2E-VALIDATION.md',
];
const missing = required.filter((file) => !fs.existsSync(path.resolve(file)));
if (missing.length) {
  console.error(`Phase 17 structural check failed. Missing: ${missing.join(', ')}`);
  process.exit(1);
}
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const script of ['check:knowledge', 'check:phase16', 'validate:e2e', 'check:phase17', 'audit:medical-copy']) {
  if (!pkg.scripts?.[script]) {
    console.error(`Missing npm script: ${script}`);
    process.exit(1);
  }
}
const server = fs.readFileSync('server.ts', 'utf8');
const security = fs.readFileSync('server/security.ts', 'utf8');
const auth = fs.readFileSync('server/auth.ts', 'utf8');
const assertions = [
  ['API rate limit middleware', server.includes("app.use('/api', apiRateLimit)")],
  ['security headers middleware', server.includes('app.use(securityHeaders)')],
  ['HttpOnly session cookie', auth.includes('HttpOnly')],
  ['SameSite session cookie', auth.includes('SameSite=Lax')],
  ['AES-GCM encryption helper', security.includes("aes-256-gcm")],
  ['clinical intelligence endpoint', server.includes("app.post('/api/screening/intelligence'")],
];
const failed = assertions.filter(([, ok]) => !ok);
for (const [name, ok] of assertions) console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
if (failed.length) process.exit(1);
console.log('Phase 17 structural readiness check passed.');
