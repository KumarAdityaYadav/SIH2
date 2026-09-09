-- StreeSure Phase 8 production database schema (PostgreSQL / Supabase)
create extension if not exists pgcrypto;

create table if not exists users (
  id text primary key,
  full_name text not null,
  email text not null unique,
  phone text,
  role text not null default 'USER' check (role in ('USER','ASHA','DOCTOR','NGO','ADMIN')),
  preferred_language text not null default 'en',
  age integer,
  location text,
  emergency_contact text,
  created_at timestamptz not null default now(),
  health_profile_completed boolean not null default false,
  password_hash text
);

create table if not exists health_profiles (
  user_id text primary key references users(id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists screenings (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  result jsonb not null
);
create index if not exists screenings_user_created_idx on screenings(user_id, created_at desc);

create table if not exists care_cases (
  id uuid primary key default gen_random_uuid(),
  beneficiary_user_id text not null references users(id) on delete cascade,
  created_by_user_id text not null references users(id),
  assigned_asha_id text references users(id),
  assigned_doctor_id text references users(id),
  status text not null,
  consent_given boolean not null default false,
  priority text not null default 'MEDIUM',
  reason text not null,
  notes text,
  screening_id uuid references screenings(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists care_cases_asha_idx on care_cases(assigned_asha_id, status);
create index if not exists care_cases_doctor_idx on care_cases(assigned_doctor_id, status);

create table if not exists consultations (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  doctor_id text not null references users(id),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists hardware_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references users(id) on delete cascade,
  session_id text,
  received_at timestamptz not null default now(),
  measurement jsonb not null
);
create index if not exists hardware_user_received_idx on hardware_measurements(user_id, received_at desc);

create table if not exists consents (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references users(id) on delete cascade,
  purpose text not null,
  granted boolean not null,
  version text not null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id text references users(id) on delete set null,
  action text not null,
  resource text not null,
  resource_id text,
  request_id text,
  created_at timestamptz not null default now()
);
create index if not exists audit_created_idx on audit_logs(created_at desc);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists sessions_expiry_idx on sessions(expires_at);
