# StreeSure Phase 10 — Health Journey Intelligence

Phase 10 connects the data already collected by StreeSure into one longitudinal Health Journey.

## New API

`GET /api/users/:userId/health-journey`

The endpoint requires the authenticated user (or an authorized role) and aggregates:

- latest screening result
- screening risk trend
- saved health profile
- Smart Kit/hardware measurements
- care coordination cases
- consultations
- consent count
- a unified, date-sorted timeline

## Frontend

`HealthJourneyView` now loads this endpoint instead of showing hard-coded demo milestones. It displays:

- journey statistics
- latest screening
- historical screening score trend
- Smart Kit events
- care/consultation events
- quick actions back into screening, tracker and doctor care

## Safety

The journey is a longitudinal record and decision-support interface. It does not diagnose PCOS and does not turn a historical score into a diagnosis.

## Local test

Start StreeSure locally:

```bash
npm install
npm run dev
```

Then sign in and open **Health Journey**. The page should request `/api/users/<your-id>/health-journey` and render saved records.
