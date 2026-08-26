-- ============================================================
-- LOT FINAL — Tables manquantes pour finalisation à 100%
-- À exécuter dans l'éditeur SQL de Lovable Cloud (Supabase)
-- ============================================================

-- 1. Candidatures Accompagnateurs (formulaire /walker/register)
create table if not exists public.walker_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  city text,
  experience text,
  motivation text,
  status text not null default 'pending', -- pending | accepted | rejected
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.walker_applications enable row level security;

-- Tout le monde peut postuler
drop policy if exists "anyone_can_apply" on public.walker_applications;
create policy "anyone_can_apply"
on public.walker_applications for insert
to anon, authenticated
with check (true);

-- Le candidat voit sa propre candidature
drop policy if exists "owner_can_read_own_application" on public.walker_applications;
create policy "owner_can_read_own_application"
on public.walker_applications for select
to authenticated
using (user_id = auth.uid() or email = (select email from auth.users where id = auth.uid()));

-- Admins peuvent tout voir/modifier (suppose has_role + app_role en place)
drop policy if exists "admins_manage_applications" on public.walker_applications;
create policy "admins_manage_applications"
on public.walker_applications for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- 2. Candidatures sur annonces libres (postulations Missions Libres)
create table if not exists public.booking_applications (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  walker_id uuid not null references auth.users(id) on delete cascade,
  message text,
  status text not null default 'pending', -- pending | accepted | rejected
  created_at timestamptz not null default now(),
  unique (booking_id, walker_id)
);

alter table public.booking_applications enable row level security;

-- Walker peut postuler
drop policy if exists "walker_can_apply" on public.booking_applications;
create policy "walker_can_apply"
on public.booking_applications for insert
to authenticated
with check (walker_id = auth.uid());

-- Walker voit ses candidatures
drop policy if exists "walker_reads_own_apps" on public.booking_applications;
create policy "walker_reads_own_apps"
on public.booking_applications for select
to authenticated
using (walker_id = auth.uid());

-- Owner voit candidatures sur ses annonces
drop policy if exists "owner_reads_apps_to_his_bookings" on public.booking_applications;
create policy "owner_reads_apps_to_his_bookings"
on public.booking_applications for select
to authenticated
using (exists (select 1 from public.bookings b where b.id = booking_id and b.owner_id = auth.uid()));

-- Owner accepte/refuse
drop policy if exists "owner_updates_apps" on public.booking_applications;
create policy "owner_updates_apps"
on public.booking_applications for update
to authenticated
using (exists (select 1 from public.bookings b where b.id = booking_id and b.owner_id = auth.uid()));

-- 3. Index utiles
create index if not exists idx_bookings_walker_null on public.bookings (status) where walker_id is null;
create index if not exists idx_walker_applications_status on public.walker_applications (status, created_at desc);
create index if not exists idx_booking_applications_booking on public.booking_applications (booking_id);
