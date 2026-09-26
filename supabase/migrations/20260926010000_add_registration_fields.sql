-- Registration fields from the register page design, plus the 'owner' role.
-- Requires 20260926000000_add_user_roles.sql. Safe to run more than once.

-- House owners register themselves, so they get their own role.
-- 'admin' stays a platform role that can only be granted in the SQL Editor.
alter type public.app_role add value if not exists 'owner';

-- Personal information (step 1) and house owner details (step 3).
-- Nullable because users who signed up before this migration don't have them;
-- the register form requires them for new signups.
alter table public.profiles
  add column if not exists gender text check (gender in ('male', 'female', 'other')),
  add column if not exists date_of_birth date,
  add column if not exists phone_number text,
  add column if not exists emergency_contact text,
  add column if not exists address text;

-- Copy the register form fields from signup metadata into the profile.
-- The role is limited to 'customer' or 'owner' so nobody can sign up as admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  is_owner boolean := meta ->> 'role' = 'owner';
begin
  insert into public.profiles (
    id, full_name, role, gender, date_of_birth,
    phone_number, emergency_contact, address
  )
  values (
    new.id,
    nullif(meta ->> 'full_name', ''),
    case when is_owner then 'owner' else 'customer' end::public.app_role,
    nullif(meta ->> 'gender', ''),
    nullif(meta ->> 'date_of_birth', '')::date,
    nullif(meta ->> 'phone_number', ''),
    nullif(meta ->> 'emergency_contact', ''),
    case when is_owner then nullif(meta ->> 'address', '') end
  );
  return new;
end;
$$;
