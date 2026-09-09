# StreeSure Phase 16 — End-to-End Validation

Phase 16 adds an executable end-to-end validation harness for the complete StreeSure beneficiary journey. It does not deploy the application or change the production database provider.

## Journey validated

1. Health/API availability
2. Demo authentication and session resolution
3. Health profile persistence
4. Clinical safety assessment
5. Clinical knowledge assessment and guideline provenance
6. ML screening signal
7. Clinical intelligence / explainability
8. Screening persistence
9. Care-coordination consent
10. Beneficiary → care case creation
11. Health Journey aggregation
12. ASHA assignment
13. Doctor assignment
14. Consultation record creation
15. Privacy export

## Commands

```bash
npm run check:phase16
```

Static route/file contract validation.

```bash
npm run validate:e2e
```

Live end-to-end validation. Start the app first with `npm run dev`.

The E2E script uses the existing development demo profiles and intentionally does not delete their records after testing, because the local development store is part of the current prototype. Run it against a disposable local data file when you need a clean demonstration environment.

## Safety boundary

The test verifies that ML, clinical safety, clinical knowledge, and clinical intelligence remain separate layers. It does not claim diagnostic accuracy or clinical validation.

## Expected result

A successful run prints PASS for every journey step and exits with code 0. Any missing endpoint, authentication failure, persistence failure, schema mismatch, or role-flow failure exits with code 1.
