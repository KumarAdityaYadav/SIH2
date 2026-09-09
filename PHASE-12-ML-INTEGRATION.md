# Phase 12 — Real PCOS ML inference

StreeSure now contains a real, versioned Logistic Regression inference artifact trained from the uploaded 684-row PCOS dataset.

## Model
- Version: `streesure-pcos-v1`
- Inputs: accessible questionnaire/profile features only
- Training target: PCOS
- Threshold: 0.36 (selected on out-of-fold F1 optimization)
- Internal 5-fold CV: ROC-AUC 0.940, PR-AUC 0.979
- These are research-prototype internal metrics, not clinical validation.

## Runtime
The model is embedded as `ml/model.json` and inference is deterministic in `src/services/mlScreening.ts`. `calculateScreeningResult()` attaches the ML probability/version to each result. The existing rule-based engine remains in place and is not replaced by the ML score.

The server also exposes authenticated `POST /api/screening/ml` for explicit model inference.

## Important data limitation
Some training features are not directly collected by the current questionnaire. In particular, skin darkening is represented as `0` at inference time unless a future questionnaire field is added. This is intentional rather than inventing a value.

## Safety
The model is a screening-support signal only. It must not be presented as a diagnosis, and clinical evaluation remains necessary for diagnosis.
