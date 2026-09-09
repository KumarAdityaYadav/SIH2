# Phase 14 — Dataset & Model Improvement Report

## Completed
- Audited all three supplied PCOS datasets.
- Removed 8 exact duplicate rows (16 duplicate-row occurrences) from the 684-row training source before candidate training.
- Excluded target-proxy/clinical-only fields from the accessible-input model.
- Kept the 2,000-row extended dataset patient-grouped for evaluation; it contains 530 unique patient IDs and many patients have multiple rows.
- Trained a class-balanced Logistic Regression candidate with imputation + standardization.
- Selected the candidate threshold from out-of-fold predictions subject to a recall >= 0.90 constraint.
- Generated reproducible audit, training, and evaluation scripts.

## Candidate internal validation
- 676 unique training rows after exact-duplicate removal.
- ROC-AUC: ~0.9405
- PR-AUC: ~0.9800
- Brier score: ~0.0929
- Threshold: 0.405
- Precision: ~0.957
- Recall: ~0.905
- F1: ~0.930

## External evaluation
The candidate was evaluated without retraining on the separate 541-row clinical dataset and on the extended dataset at patient level. Feature mapping is approximate for fields not present in the questionnaire dataset (for example, body hair is represented by the available hair-growth field), so these are exploratory validation results rather than clinical validation.

## Promotion decision
`ml/model.json` was intentionally NOT replaced. The candidate is stored as `ml/model-candidate-v2.json` with status `candidate_not_promoted`.

A model should only be promoted after independent validation on a clinically curated cohort, prospective evaluation, calibration assessment, subgroup analysis, and clinical review of false-negative/false-positive cases.

## Reproduce
```bash
npm run audit:data
npm run train:model:candidate
python scripts/evaluate-phase14.py
```

Data paths can be overridden with `STREESURE_684_DATA`, `STREESURE_CLINICAL_DATA`, and `STREESURE_EXTENDED_DATA`.
