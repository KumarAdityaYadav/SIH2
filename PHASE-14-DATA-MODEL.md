# StreeSure Phase 14 — Dataset & Model Improvement

## Goal
Create a reproducible, leakage-aware research pipeline without silently replacing the existing production screening artifact.

## Decisions
- The 684-row questionnaire dataset is the training source for the candidate model.
- Hormones, ultrasound/follicle variables, cyst/diagnosis fields, and other target-proxy variables are excluded from the accessible-input model.
- The 2,000-row extended dataset is never randomly split by row when evaluating patient-level generalization; `Patient File No.` is treated as the grouping identifier.
- The candidate threshold is selected from out-of-fold predictions with a screening-oriented recall constraint rather than assuming 0.50.
- The current `ml/model.json` remains the deployed/local production artifact until independent/prospective validation supports promotion.
- External datasets are evaluation evidence, not merged into training merely to improve headline metrics.

## Reproduce locally

```bash
npm run audit:data
npm run train:model:candidate
npm run evaluate:model
```

Set `STREESURE_684_DATA`, `STREESURE_CLINICAL_DATA`, and `STREESURE_EXTENDED_DATA` if the datasets are stored elsewhere.

## Clinical interpretation
Internal AUC is not clinical accuracy. External performance can fall because datasets differ in population, collection process, feature definitions, missingness, and label quality. The app therefore presents screening support, not diagnosis.
