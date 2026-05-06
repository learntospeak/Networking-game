-- Run this in the Supabase SQL editor for the Networking Game project.
-- It lets mobile/desktop terminal admin error logs sync to one shared table.

create table if not exists public.admin_error_logs (
  id uuid primary key default gen_random_uuid(),
  report_id text not null unique,
  kind text not null default 'error',
  admin_description text not null,
  page_url text,
  track_mode text,
  scenario_title text,
  current_task text,
  current_cwd text,
  last_command text,
  last_terminal_output text,
  viewport_size text,
  user_agent text,
  source_command text,
  auth_method text,
  profile_label text,
  user_id uuid null,
  stored_from text not null default 'terminal',
  client_timestamp timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_error_logs enable row level security;

create or replace function public.set_admin_error_logs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_admin_error_logs_updated_at on public.admin_error_logs;
create trigger set_admin_error_logs_updated_at
before update on public.admin_error_logs
for each row
execute function public.set_admin_error_logs_updated_at();

drop policy if exists "Anyone can insert terminal error logs" on public.admin_error_logs;
create policy "Anyone can insert terminal error logs"
on public.admin_error_logs
for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can read terminal error logs" on public.admin_error_logs;
create policy "Admins can read terminal error logs"
on public.admin_error_logs
for select
to authenticated
using (
  coalesce((auth.jwt() -> 'app_metadata' ->> 'admin')::boolean, false)
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  or coalesce((auth.jwt() -> 'user_metadata' ->> 'admin')::boolean, false)
  or coalesce((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, false)
);

drop policy if exists "Admins can update terminal error logs" on public.admin_error_logs;
create policy "Admins can update terminal error logs"
on public.admin_error_logs
for update
to authenticated
using (
  coalesce((auth.jwt() -> 'app_metadata' ->> 'admin')::boolean, false)
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  or coalesce((auth.jwt() -> 'user_metadata' ->> 'admin')::boolean, false)
  or coalesce((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, false)
)
with check (
  coalesce((auth.jwt() -> 'app_metadata' ->> 'admin')::boolean, false)
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  or coalesce((auth.jwt() -> 'user_metadata' ->> 'admin')::boolean, false)
  or coalesce((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, false)
);
