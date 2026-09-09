# Phase 13 — Model Evaluation & Clinical-Safety Layer

## Scope

This phase adds a conservative safety gate around the StreeSure PCOS screening model and documents an external-dataset evaluation. The model remains a screening-support tool, not a diagnostic system.

## Evaluation performed

### Training/internal validation artifact
The packaged model (`ml/model.json`) reports 5-fold internal validation on the 684-row PCOS dataset:

- ROC-AUC: 0.9401
- PR-AUC: 0.9788
- F1-optimized threshold: 0.36
- Precision at threshold: 0.9078
- Recall at threshold: 0.9635

These are retrospective internal results and must not be described as clinical accuracy.

### External clinical dataset — 541 rows
The model was evaluated without retraining on the 541-row clinical dataset (`PCOS_data_without_infertility.xlsx`). Some model features are not present in that dataset (for example family PCOS history and hormonal-acne distinction), so the evaluation uses conservative zero/derived mappings and is therefore **exploratory external validation**, not a publication-grade validation study.

- ROC-AUC: **0.8113**
- PR-AUC: **0.7072**
- Accuracy at the 0.36 threshold: **0.7893**
- Precision: **0.7368**
- Recall: **0.5537**
- F1: **0.6323**

The gap between internal and external performance is exactly why the internal 0.94 AUC should not be presented as general clinical performance.

### 2,000-row extended dataset
The extended dataset contains 2,000 rows but only **530 unique Patient File Nos.** It therefore contains repeated/augmented patient records. Random row-level splitting would risk patient leakage.

Using the already-trained model as an external evaluation (no retraining):

- Row-level ROC-AUC: **0.8150**
- Row-level PR-AUC: **0.6933**
- Patient-aggregated ROC-AUC (mean probability per patient): **0.8129**
- Patient-aggregated PR-AUC: **0.7095**

This is also exploratory because feature mappings are approximate and the extended dataset appears related to the clinical dataset.

## Safety changes

`src/services/clinicalSafety.ts` now:

1. Validates required screening fields before allowing the ML signal to be used.
2. Suppresses the ML signal when required inputs are missing/invalid instead of silently filling them with defaults.
3. Flags prolonged menstrual gaps, heavy/prolonged bleeding, and relevant contextual factors for clinical review.
4. Prevents the ML signal from overriding a clinical-review guardrail.
5. Separates software safety guardrails from emergency triage.

The server exposes `POST /api/screening/safety` for the same assessment.

## What StreeSure must NOT claim

- The model diagnoses PCOS.
- The model rules out PCOS.
- The internal AUC is clinical accuracy.
- The model is validated for every age group or population.
- The model is a substitute for clinician assessment, laboratory testing, ultrasound, or other clinically indicated evaluation.

## Next validation work

Before any real-world clinical use, the model needs a prospectively collected, representative, independently adjudicated dataset; a locked evaluation protocol; calibration analysis; subgroup analysis; missing-data analysis; threshold selection based on the intended screening objective; and appropriate clinical/regulatory review.
