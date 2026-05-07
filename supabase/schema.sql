-- Discipline Tracker — Supabase schema.
-- Run this in the Supabase SQL editor for your project, then drop your
-- VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY into .env.

create extension if not exists "pgcrypto";

create table if not exists public.completions (
  user_id     uuid        not null,
  date        date        not null,
  task_id     text        not null,
  done        boolean     not null default true,
  updated_at  timestamptz not null default now(),
  primary key (user_id, date, task_id)
);

create index if not exists completions_user_date_idx
  on public.completions (user_id, date);

-- Anonymous-but-stable user_id from localStorage means we don't need Supabase Auth
-- for v1. Lock the table to inserts/updates keyed on the caller's user_id.
alter table public.completions enable row level security;

-- Wide-open policy so the anon key can read/write its own rows.
-- Tighten later by switching to Supabase Auth + auth.uid() = user_id.
drop policy if exists "anon_rw_own_completions" on public.completions;
create policy "anon_rw_own_completions"
  on public.completions
  for all
  using (true)
  with check (true);
