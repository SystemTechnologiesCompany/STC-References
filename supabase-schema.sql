-- STC References: minimal account and curated reference catalog schema.
-- Run this in the Supabase SQL editor after creating a project.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.references (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  url text not null,
  institution text not null default '',
  field text not null default '',
  language text not null default 'en' check (language in ('en', 'fr')),
  published boolean not null default false,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.references enable row level security;

create or replace function public.is_stc_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select
  using (id = (select auth.uid()));
drop policy if exists "Users read published references" on public.references;
create policy "Users read published references" on public.references for select
  using (published or public.is_stc_admin());
drop policy if exists "Admins add references" on public.references;
create policy "Admins add references" on public.references for insert
  with check (public.is_stc_admin() and created_by = (select auth.uid()));
drop policy if exists "Admins update references" on public.references;
create policy "Admins update references" on public.references for update
  using (public.is_stc_admin()) with check (public.is_stc_admin());
drop policy if exists "Admins remove references" on public.references;
create policy "Admins remove references" on public.references for delete
  using (public.is_stc_admin());

create or replace function public.handle_new_stc_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_stc_auth_user_created on auth.users;
create trigger on_stc_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_stc_user();

-- Promote the first trusted administrator manually after account creation:
-- update public.profiles set role = 'admin' where id = '<auth user UUID>';
-- Add audience routing and organization approvals for the discovery pathway.
alter table public.references
  add column if not exists audience text not null default 'student',
  add column if not exists organization_name text not null default '';

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'references_audience_check') then
    alter table public.references add constraint references_audience_check
      check (audience in ('student', 'research_independent', 'research_organization'));
  end if;
end $$;

create table if not exists public.researcher_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  organization_name text not null,
  organization_url text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.researcher_requests enable row level security;

drop policy if exists "Users read published references" on public.references;
drop policy if exists "Read references for eligible audience" on public.references;
create policy "Read references for eligible audience" on public.references for select using (
  public.is_stc_admin()
  or ((select auth.uid()) is not null and published and audience = 'student')
  or (published and audience = 'research_independent' and (select auth.uid()) is not null)
  or (
    published and audience = 'research_organization'
    and exists (
      select 1 from public.researcher_requests request
      where request.user_id = (select auth.uid())
        and request.status = 'approved'
        and request.organization_name = public.references.organization_name
    )
  )
);

drop policy if exists "Users read own researcher request" on public.researcher_requests;
drop policy if exists "Users read own or admins read researcher requests" on public.researcher_requests;
create policy "Users read own or admins read researcher requests" on public.researcher_requests for select
  using (user_id = (select auth.uid()) or public.is_stc_admin());
drop policy if exists "Users submit own researcher request" on public.researcher_requests;
create policy "Users submit own researcher request" on public.researcher_requests for insert
  with check (user_id = (select auth.uid()) and status = 'pending');
drop policy if exists "Users update own pending request" on public.researcher_requests;
create policy "Users update own pending request" on public.researcher_requests for update
  using (user_id = (select auth.uid()) and status in ('pending', 'rejected'))
  with check (user_id = (select auth.uid()) and status = 'pending');
drop policy if exists "Admins review researcher requests" on public.researcher_requests;
create policy "Admins review researcher requests" on public.researcher_requests for update
  using (public.is_stc_admin()) with check (public.is_stc_admin());

-- Signed-in users can report a reference without exposing reports to anonymous visitors.
create table if not exists public.reference_reports (
  id uuid primary key default gen_random_uuid(),
  reference_id uuid references public.references(id) on delete set null,
  reference_title text not null check (char_length(reference_title) between 1 and 180),
  reference_url text not null check (reference_url ~* '^https?://'),
  reference_audience text not null default 'student' check (reference_audience in ('student', 'research_independent', 'research_organization')),
  reference_field text not null default '',
  reference_description text not null default '',
  reference_institution text not null default '',
  reason text not null check (reason in ('broken_link', 'outdated', 'wrong_field', 'other')),
  details text not null default '' check (char_length(details) <= 500),
  status text not null default 'open' check (status in ('open', 'resolved', 'ignored')),
  reporter_id uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  review_note text not null default ''
);
alter table public.reference_reports
  add column if not exists reference_audience text not null default 'student' check (reference_audience in ('student', 'research_independent', 'research_organization')),
  add column if not exists reference_field text not null default '',
  add column if not exists reference_description text not null default '',
  add column if not exists reference_institution text not null default '';

alter table public.reference_reports enable row level security;
drop policy if exists "Visitors can report references" on public.reference_reports;
drop policy if exists "Signed-in users can report references" on public.reference_reports;
create policy "Signed-in users can report references" on public.reference_reports for insert to authenticated
  with check (
    status = 'open'
    and reporter_id = (select auth.uid())
  );
drop policy if exists "Admins review reference reports" on public.reference_reports;
create policy "Admins review reference reports" on public.reference_reports for select
  using (public.is_stc_admin());
drop policy if exists "Admins update reference reports" on public.reference_reports;
create policy "Admins update reference reports" on public.reference_reports for update
  using (public.is_stc_admin()) with check (public.is_stc_admin());

grant insert on public.reference_reports to authenticated;
grant select, update on public.reference_reports to authenticated;

-- Admin fixes for built-in Explore links are kept outside the static catalog.
create table if not exists public.reference_link_overrides (
  original_url text not null,
  target_audience text not null check (target_audience in ('student', 'research_independent', 'research_organization')),
  target_field text not null default '',
  replacement_url text not null check (replacement_url ~* '^https?://'),
  replacement_title text not null default '',
  replacement_description text not null default '',
  replacement_institution text not null default '',
  active boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid not null references auth.users(id),
  primary key (original_url, target_audience, target_field)
);

alter table public.reference_link_overrides enable row level security;
drop policy if exists "Visitors read active reference link fixes" on public.reference_link_overrides;
drop policy if exists "Signed-in users read active reference link fixes" on public.reference_link_overrides;
create policy "Signed-in users read active reference link fixes" on public.reference_link_overrides for select to authenticated
  using (active and (select auth.uid()) is not null);
drop policy if exists "Admins add reference link fixes" on public.reference_link_overrides;
create policy "Admins add reference link fixes" on public.reference_link_overrides for insert
  with check (public.is_stc_admin() and updated_by = (select auth.uid()));
drop policy if exists "Admins update reference link fixes" on public.reference_link_overrides;
create policy "Admins update reference link fixes" on public.reference_link_overrides for update
  using (public.is_stc_admin()) with check (public.is_stc_admin());
drop policy if exists "Admins remove reference link fixes" on public.reference_link_overrides;
create policy "Admins remove reference link fixes" on public.reference_link_overrides for delete
  using (public.is_stc_admin());

grant select on public.reference_link_overrides to anon, authenticated;
grant insert, update, delete on public.reference_link_overrides to authenticated;

-- Saved references belong to the signed-in account and sync across devices.
create table if not exists public.user_saved_references (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reference_id uuid references public.references(id) on delete set null,
  title text not null check (char_length(title) between 1 and 180),
  url text not null check (url ~* '^https?://'),
  description text not null default '',
  institution text not null default '',
  field text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, url)
);
alter table public.user_saved_references enable row level security;
drop policy if exists "Users read their saved references" on public.user_saved_references;
create policy "Users read their saved references" on public.user_saved_references for select to authenticated
  using (user_id = (select auth.uid()));
drop policy if exists "Users save their own references" on public.user_saved_references;
create policy "Users save their own references" on public.user_saved_references for insert to authenticated
  with check (user_id = (select auth.uid()));
drop policy if exists "Users remove their saved references" on public.user_saved_references;
create policy "Users remove their saved references" on public.user_saved_references for delete to authenticated
  using (user_id = (select auth.uid()));
revoke all on public.user_saved_references from anon;
grant select, insert, delete on public.user_saved_references to authenticated;
