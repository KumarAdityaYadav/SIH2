const base = process.env.STREESURE_BASE_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, options);
  const text = await response.text();
  let body = {};
  try { body = text ? JSON.parse(text) : {}; } catch {}
  return { response, body };
}

const checks = [];
const health = await request('/api/health');
checks.push(['health', health.response.ok && health.body.status === 'ok']);

const status = await request('/api/system/status');
checks.push(['system status', status.response.ok && Boolean(status.body.database)]);

const unauthorized = await request('/api/users/usr_smoke_profile/profile');
checks.push(['protected profile', unauthorized.response.status === 401]);

const demo = await request('/api/auth/demo-login', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ userKey: 'user' }),
});
checks.push(['demo login', demo.response.ok && Boolean(demo.body.user)]);

for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);

if (checks.some(([, ok]) => !ok)) {
  console.error(`Smoke test failed against ${base}. Start the app with npm run dev first.`);
  process.exit(1);
}
console.log(`Smoke test passed against ${base}`);
