-- Role-based access: every auth user gets a profile with a role (customer | admin).
-- Safe to run more than once.

-- Role type
do $$
begin
  create type public.app_role as enum ('customer', 'admin');
exception
  when duplicate_object then null;
end;
$$;

-- One profile row per auth user
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

grant select, update on public.profiles to authenticated;

-- Create a 'customer' profile when someone signs up.
-- Only full_name is copied from metadata; the role is never taken from
-- user_metadata because users can edit it with supabase.auth.updateUser().
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper for policies. security definer bypasses RLS on profiles,
-- which avoids infinite recursion when profiles policies call it.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- Profiles: users read their own profile, admins read all.
drop policy if exists "Read own profile or admin" on public.profiles;
create policy "Read own profile or admin" on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id or public.is_admin());

-- Profiles: only admins can update (including changing roles).
drop policy if exists "Admins update profiles" on public.profiles;
create policy "Admins update profiles" on public.profiles
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Houses: public read stays as-is; only admins can write.
grant insert, update, delete on public.houses to authenticated;

drop policy if exists "Admins manage houses" on public.houses;
create policy "Admins manage houses" on public.houses
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Backfill profiles for users who signed up before this migration.
insert into public.profiles (id, full_name)
select id, raw_user_meta_data ->> 'full_name'
from auth.users
on conflict (id) do nothing;

-- Promote your first admin manually in the SQL Editor:
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'you@example.com');
