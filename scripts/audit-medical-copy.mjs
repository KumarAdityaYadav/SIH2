import fs from 'node:fs';
import path from 'node:path';

const roots = ['src', 'server.ts', 'README.md'];
const files = [];
function walk(p) {
  if (!fs.existsSync(p)) return;
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    for (const child of fs.readdirSync(p)) walk(path.join(p, child));
  } else if (/\.(ts|tsx|md)$/.test(p)) files.push(p);
}
for (const root of roots) walk(root);

const forbidden = [
  /\bclinically proven\b/i,
  /\bclinical gold-standard\b/i,
  /\brestores? (?:natural )?(?:ovulation|metabolic rhythm)\b/i,
  /\bguarantee(?:s|d)?\b.{0,80}\baccuracy\b/i,
  /\bdiagnos(?:e|es|ed|ing|tic)\b.{0,30}\bAI\b/i,
  /\bdoctor recommended for PCOS\b/i,
];
const findings = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const pattern of forbidden) {
    if (pattern.test(text)) findings.push(`${file}: ${pattern}`);
  }
}
if (findings.length) {
  console.error('Potentially overstrong medical copy found:');
  for (const item of findings) console.error(`- ${item}`);
  process.exit(1);
}
console.log(`Medical-copy audit passed across ${files.length} source/document files.`);
