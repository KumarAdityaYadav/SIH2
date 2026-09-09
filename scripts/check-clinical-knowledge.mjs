// Lightweight source/structure check for Phase 15.
import fs from 'node:fs';

const required = [
  'src/services/clinicalKnowledge.ts',
  'src/services/clinicalIntelligence.ts',
  'server.ts',
  'PHASE-15-CLINICAL-KNOWLEDGE.md',
];
for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);
}
const knowledge = fs.readFileSync('src/services/clinicalKnowledge.ts', 'utf8');
for (const token of ['adult-two-of-three', 'adolescent-two-features', 'amh-not-single-test', 'exclusionNeeded']) {
  if (!knowledge.includes(token)) throw new Error(`Missing clinical guardrail: ${token}`);
}
const server = fs.readFileSync('server.ts', 'utf8');
if (!server.includes("/api/screening/knowledge")) throw new Error('Knowledge API route missing');
console.log('Phase 15 clinical knowledge structure check passed.');
