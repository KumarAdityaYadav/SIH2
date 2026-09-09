# StreeSure Phase 11 — Clinical Intelligence & Explainability

This phase adds a transparent, non-diagnostic intelligence layer around an existing screening result.

## What it does
- Separates evidence from supporting context.
- Reports screening data completeness.
- Flags contextual factors that may affect interpretation.
- Displays an ML signal only when the result already contains one.
- Keeps next-step guidance tied to the existing screening result.
- Explicitly states that screening support is not a diagnosis.

## API
`POST /api/screening/intelligence`

The endpoint requires an authenticated session and only allows the result owner, a doctor, or an admin to request an explanation.

## Safety boundary
This layer does not diagnose, rule out, or claim clinical certainty. It is intended to make the existing screening process more transparent for users and reviewers.
