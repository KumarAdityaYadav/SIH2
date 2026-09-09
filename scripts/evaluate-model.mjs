// Phase 13 evaluation helper. Run after installing Python dependencies if you want
// to reproduce the external evaluation. It intentionally does not copy datasets
// into the repository.
import { spawnSync } from 'node:child_process';
const r = spawnSync('python', ['scripts/evaluate_model.py'], { stdio: 'inherit' });
process.exit(r.status ?? 1);
