# StreeSure Phase 15 — Clinical Knowledge Layer

Phase 15 adds a versioned, provenance-aware clinical knowledge layer for PCOS screening explanations.

## What it does

- Separates guideline facts from ML predictions and rule-based screening scores.
- Applies age-aware guardrails for adults vs adolescents.
- Makes the 2023 International PCOS Guideline the explicit provenance source.
- Does not diagnose PCOS, prescribe treatment, or replace clinician assessment.
- Exposes the knowledge assessment through `POST /api/screening/knowledge`.
- Adds the same knowledge context to `/api/screening/intelligence`.

## Core guardrails

### Adults

The software can explain that the international guideline uses two of three diagnostic domains after exclusion of other causes: ovulatory dysfunction, clinical/biochemical hyperandrogenism, and polycystic ovarian morphology (with AMH as an alternative for defining morphology in adults).

### Adolescents

The software does not use ultrasound morphology or AMH as the diagnostic basis. It treats the adolescent framework as requiring both ovulatory dysfunction and clinical/biochemical hyperandrogenism after exclusion of mimicking disorders.

### ML separation

The ML probability is always labelled as a screening signal. It cannot establish a diagnostic criterion and cannot override clinical safety flags.

## Source

2023 International Evidence-based Guideline for PCOS, International PCOS Network / Monash University / collaborating professional societies.

Source URL: https://www.monash.edu/medicine/mchri/pcos/guideline
