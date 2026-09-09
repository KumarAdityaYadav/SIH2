# StreeSure Phase 17 — Production & Jury Readiness

## Objective
Prepare the Phase 16 build for a defensible SIH/demo submission by tightening security checks, removing overstrong medical marketing language, and documenting the remaining verification gates.

## Completed in this phase
- Added `scripts/check-phase17.mjs` for structural/security readiness checks.
- Added `scripts/audit-medical-copy.mjs` to catch a small set of overstrong clinical/AI claims.
- Added npm scripts:
  - `npm run check:phase17`
  - `npm run audit:medical-copy`
- Reviewed and softened high-risk wellness/supplement claims in seeded content, landing copy, knowledge content, progress tracking, and demo clinician copy.
- Preserved non-diagnostic wording for screening, hardware, AI and clinician handoff.
- Corrected the outdated `SIH 2024` README wording to `SIH`.

## Security posture
Current application controls include:
- API rate limiting.
- Security response headers.
- HttpOnly + SameSite session cookies.
- Secure cookie flag in production.
- Server-side password hashing using scrypt.
- AES-256-GCM helper for encrypted JSON at rest when `STREESURE_ENCRYPTION_KEY` is configured.
- Role/access checks on protected health-data routes.
- Request IDs and audit logging without intentionally storing health values in audit logs.

## Medical-safety posture
StreeSure should be described as:
> A non-diagnostic screening, education and care-navigation platform.

Do not claim:
- clinical diagnosis by AI;
- guaranteed accuracy;
- clinical validation of the current hardware concept;
- that a supplement/herbal product treats or cures PCOS;
- that an internal ML metric is clinical accuracy.

The current ML evidence remains exploratory: strong internal discrimination, lower external generalization, and a need for prospective clinical validation.

## Verification status
### Passed in this environment
- Phase 17 structural readiness check.
- Medical-copy audit across source/document files.
- Existing Phase 15/16 structural checks are included in the release.

### Not verified in this environment
- TypeScript lint/build, because `node_modules` is not installed in the current runtime.
- Live HTTP E2E, because the application server/dependencies are not running in the current runtime.
- Production deployment configuration.
- Real clinical/prospective validation.

These are explicitly not represented as passed tests.

## Local release gate
From the project root:

```bash
npm install
npm run check:phase17
npm run audit:medical-copy
npm run check
npm run dev
```

In a second terminal:

```bash
npm run smoke
npm run validate:e2e
```

For production, configure secrets server-side (never commit them), including `GEMINI_API_KEY`, database credentials if using the hosted provider, and `STREESURE_ENCRYPTION_KEY`.

## Jury-safe one-line positioning
> StreeSure combines multilingual health education, non-diagnostic symptom screening, explainable risk support, privacy-aware care navigation, and ASHA/doctor coordination — with the current prototype explicitly positioned for further clinical and hardware validation.
