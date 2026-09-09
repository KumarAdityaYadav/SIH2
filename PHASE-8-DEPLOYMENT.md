# StreeSure Phase 8 — Production Database & Server Authentication

## Production setup

1. Create a Supabase project (PostgreSQL).
2. Run `server/schema.sql` in the SQL editor.
3. Set these server-only environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STREESURE_ENCRYPTION_KEY`
   - `NODE_ENV=production`
4. Never expose `SUPABASE_SERVICE_ROLE_KEY` or `STREESURE_ENCRYPTION_KEY` through `VITE_*` variables or frontend code.
5. Start the Express server; `/api/system/status` should report `supabase-postgres`.

## Authentication

Password login/signup use an HttpOnly session cookie. The client may cache a user object for UI convenience, but authorization is performed on the server.

OTP remains a prototype flow until a real SMS/OTP provider is connected. Do not use the simulated OTP for real users.

## Database fallback

If Supabase variables are absent, StreeSure intentionally uses the existing encrypted local development store. This is useful for offline development but must not be used for real patient records.

## Security checklist before real deployment

- Use HTTPS only.
- Rotate service-role and encryption secrets through a secret manager.
- Enable database backups and recovery testing.
- Add production identity verification / staff provisioning before granting ASHA, DOCTOR, NGO or ADMIN roles.
- Add PostgreSQL Row Level Security if any direct client database access is introduced.
- Complete clinical validation, privacy review, penetration testing and applicable regulatory assessment before handling real patient data.
