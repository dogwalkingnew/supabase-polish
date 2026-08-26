-- =========================================================
-- DOGWALKING — SCHÉMA COMPLET
-- =========================================================

-- 1. ENUMS
create type public.app_role as enum ('admin', 'moderator', 'user');
create type public.user_type as enum ('owner', 'walker', 'both');
create type public.booking_status as enum ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
create type public.dog_size as enum ('small', 'medium', 'large', 'giant');
create type public.service_type as enum ('promenade', 'garde', 'visite', 'veterinaire');
create type public.key_handover_protocol_type as enum ('in_person', 'lockbox', 'neighbor', 'already_provided');
create type public.review_type_enum as enum ('owner_to_walker', 'walker_to_owner');

-- 2. TABLES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  address text,
  city text,
  postal_code text,
  user_type user_type default 'owner',
  bio text,
  wallet_balance numeric(12,2) not null default 0,
  wallet_currency text not null default 'EUR',
  stripe_account_id text,
  stripe_onboarding_complete boolean default false,
  stripe_charges_enabled boolean default false,
  stripe_payouts_enabled boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  unique (user_id, role)
);

create table public.dogs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  breed text,
  age integer,
  size dog_size default 'medium',
  weight numeric(5,2),
  photo_url text,
  special_needs text,
  vaccinations_up_to_date boolean default true,
  is_neutered boolean default false,
  temperament text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.walker_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  hourly_rate numeric(10,2) default 15.00,
  experience_years integer default 0,
  max_dogs integer default 3,
  service_radius_km integer default 5,
  services service_type[] default '{promenade}',
  available_days text[] default '{Monday,Tuesday,Wednesday,Thursday,Friday}',
  available_hours_start time default '08:00',
  available_hours_end time default '20:00',
  latitude numeric(10,8),
  longitude numeric(11,8),
  verified boolean default false,
  rating numeric(3,2) default 0,
  total_reviews integer default 0,
  total_walks integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  walker_id uuid references auth.users(id) on delete set null,
  dog_id uuid references public.dogs(id) on delete cascade not null,
  service_type service_type not null default 'promenade',
  status booking_status default 'pending',
  scheduled_date date not null,
  scheduled_time time not null,
  duration_minutes integer default 60,
  price numeric(10,2),
  address text,
  city text,
  latitude numeric(10,8),
  longitude numeric(11,8),
  notes text,
  owner_confirmed boolean default false,
  walker_confirmed boolean default false,
  cancelled_by uuid references auth.users(id),
  cancellation_reason text,
  validation_code text,
  validation_code_used_at timestamptz,
  funds_released_at timestamptz,
  funds_release_method text check (funds_release_method in ('code','sos_owner','auto_timeout','admin')),
  sos_triggered_at timestamptz,
  sos_reason text,
  started_at timestamptz,
  start_proof_id uuid,
  start_proof_url text,
  end_proof_url text,
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  platform_fee_amount numeric(10,2),
  walker_amount numeric(10,2),
  payment_status text default 'pending',
  key_handover_protocol public.key_handover_protocol_type,
  key_handover_details text,
  key_handover_returned_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade not null unique,
  reviewer_id uuid references auth.users(id) on delete cascade not null,
  reviewed_id uuid references auth.users(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  review_type public.review_type_enum default 'owner_to_walker',
  created_at timestamptz default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users(id) on delete cascade not null,
  receiver_id uuid references auth.users(id) on delete cascade not null,
  booking_id uuid references public.bookings(id) on delete set null,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text default 'info',
  read boolean default false,
  link text,
  created_at timestamptz default now()
);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references auth.users(id) on delete cascade not null,
  referred_id uuid references auth.users(id) on delete cascade,
  referral_code text unique not null,
  status text default 'pending',
  reward_amount numeric(10,2) default 10.00,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create table public.walker_earnings (
  id uuid primary key default gen_random_uuid(),
  walker_id uuid references auth.users(id) on delete cascade not null,
  booking_id uuid references public.bookings(id) on delete set null,
  amount numeric(10,2) not null,
  commission numeric(10,2) default 0,
  net_amount numeric(10,2) not null,
  status text default 'pending',
  paid_at timestamptz,
  created_at timestamptz default now()
);

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  walker_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique (user_id, walker_id)
);

create table public.walker_documents (
  id uuid primary key default gen_random_uuid(),
  walker_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null,
  file_url text,
  verification_status text default 'pending',
  rejection_reason text,
  submitted_at timestamptz default now(),
  verified_at timestamptz,
  verified_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (walker_id, document_type)
);

create table public.walker_badges (
  id uuid primary key default gen_random_uuid(),
  walker_id uuid not null references auth.users(id) on delete cascade,
  badge_type text not null,
  badge_name text not null,
  badge_description text,
  earned_at timestamptz default now(),
  created_at timestamptz default now(),
  unique (walker_id, badge_type)
);

create table public.walk_proofs (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  walker_id uuid not null,
  photo_url text not null,
  photo_type text not null default 'during',
  caption text,
  location_lat numeric,
  location_lng numeric,
  status text not null default 'pending',
  uploaded_at timestamptz not null default now(),
  validated_at timestamptz,
  validated_by uuid
);

create table public.disputes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  reporter_id uuid not null,
  reported_id uuid not null,
  type text not null,
  reason text not null,
  description text,
  evidence_urls text[],
  status text not null default 'open',
  admin_notes text,
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.incident_reports (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  reporter_id uuid not null,
  type text not null,
  description text,
  reported_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  resolution_notes text,
  status text not null default 'pending'
);

create table public.walker_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  city text,
  experience text,
  motivation text,
  status text not null default 'pending',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.booking_applications (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  walker_id uuid not null references auth.users(id) on delete cascade,
  message text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (booking_id, walker_id)
);

create table public.walker_training_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  completed boolean not null default false,
  score integer,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, module_id)
);

create table public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(12,2) not null,
  type text not null,
  booking_id uuid references public.bookings(id) on delete set null,
  description text,
  stripe_pi_id text,
  created_at timestamptz not null default now()
);

-- 3. GRANTS
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
grant select, insert, update, delete on public.dogs to authenticated;
grant all on public.dogs to service_role;
grant select, insert, update, delete on public.walker_profiles to authenticated;
grant all on public.walker_profiles to service_role;
grant select, insert, update, delete on public.bookings to authenticated;
grant all on public.bookings to service_role;
grant select, insert, update, delete on public.reviews to authenticated;
grant all on public.reviews to service_role;
grant select, insert, update, delete on public.messages to authenticated;
grant all on public.messages to service_role;
grant select, insert, update, delete on public.notifications to authenticated;
grant all on public.notifications to service_role;
grant select, insert, update, delete on public.referrals to authenticated;
grant all on public.referrals to service_role;
grant select, insert, update, delete on public.walker_earnings to authenticated;
grant all on public.walker_earnings to service_role;
grant select, insert, update, delete on public.favorites to authenticated;
grant all on public.favorites to service_role;
grant select, insert, update, delete on public.walker_documents to authenticated;
grant all on public.walker_documents to service_role;
grant select, insert, update, delete on public.walker_badges to authenticated;
grant all on public.walker_badges to service_role;
grant select, insert, update, delete on public.walk_proofs to authenticated;
grant all on public.walk_proofs to service_role;
grant select, insert, update, delete on public.disputes to authenticated;
grant all on public.disputes to service_role;
grant select, insert, update, delete on public.incident_reports to authenticated;
grant all on public.incident_reports to service_role;
grant select, insert, update, delete on public.walker_applications to authenticated;
grant insert on public.walker_applications to anon;
grant all on public.walker_applications to service_role;
grant select, insert, update, delete on public.booking_applications to authenticated;
grant all on public.booking_applications to service_role;
grant select, insert, update, delete on public.walker_training_progress to authenticated;
grant all on public.walker_training_progress to service_role;
grant select on public.wallet_transactions to authenticated;
grant all on public.wallet_transactions to service_role;

-- 4. RLS ON
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.dogs enable row level security;
alter table public.walker_profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.referrals enable row level security;
alter table public.walker_earnings enable row level security;
alter table public.favorites enable row level security;
alter table public.walker_documents enable row level security;
alter table public.walker_badges enable row level security;
alter table public.walk_proofs enable row level security;
alter table public.disputes enable row level security;
alter table public.incident_reports enable row level security;
alter table public.walker_applications enable row level security;
alter table public.booking_applications enable row level security;
alter table public.walker_training_progress enable row level security;
alter table public.wallet_transactions enable row level security;

-- 5. ROLE HELPER
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- 6. POLICIES
create policy "Users can view own full profile" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "Booking participants can view profiles" on public.profiles
  for select to authenticated using (
    exists (select 1 from public.bookings b
      where (b.owner_id = auth.uid() and b.walker_id = profiles.id)
         or (b.walker_id = auth.uid() and b.owner_id = profiles.id))
  );
create policy "Walker profiles are viewable by members" on public.profiles
  for select to authenticated using (
    exists (select 1 from public.walker_profiles wp where wp.user_id = profiles.id)
  );
create policy "Users can update their own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "Admins can manage profiles" on public.profiles
  for all to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Users can view their own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "Admins can manage all roles" on public.user_roles
  for all to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Dogs are viewable by authenticated users" on public.dogs
  for select to authenticated using (true);
create policy "Owners can manage their own dogs" on public.dogs
  for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Walker profiles are viewable by authenticated users" on public.walker_profiles
  for select to authenticated using (true);
create policy "Walkers can manage their own profile" on public.walker_profiles
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can view their own bookings" on public.bookings
  for select to authenticated using (auth.uid() = owner_id or auth.uid() = walker_id);
create policy "Walkers can view open missions" on public.bookings
  for select to authenticated using (walker_id is null and status = 'pending');
create policy "Admins can view all bookings" on public.bookings
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Owners can create bookings" on public.bookings
  for insert to authenticated with check (auth.uid() = owner_id);
create policy "Booking participants can update" on public.bookings
  for update to authenticated using (auth.uid() = owner_id or auth.uid() = walker_id);
create policy "Walkers can claim open missions" on public.bookings
  for update to authenticated using (walker_id is null and status = 'pending');

create policy "Reviews are viewable by authenticated users" on public.reviews
  for select to authenticated using (true);
create policy "Users can create reviews for their bookings" on public.reviews
  for insert to authenticated with check (auth.uid() = reviewer_id);

create policy "Users can view their own messages" on public.messages
  for select to authenticated using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can send messages" on public.messages
  for insert to authenticated with check (auth.uid() = sender_id);
create policy "Receivers can update messages" on public.messages
  for update to authenticated using (auth.uid() = receiver_id);

create policy "Users can view their own notifications" on public.notifications
  for select to authenticated using (auth.uid() = user_id);
create policy "Users can update their own notifications" on public.notifications
  for update to authenticated using (auth.uid() = user_id);
create policy "Users can delete their own notifications" on public.notifications
  for delete to authenticated using (auth.uid() = user_id);
create policy "Notify self or booking counterparty" on public.notifications
  for insert to authenticated with check (
    auth.uid() = user_id
    or exists (
      select 1 from public.bookings b
      where (b.owner_id = auth.uid() and b.walker_id = notifications.user_id)
         or (b.walker_id = auth.uid() and b.owner_id = notifications.user_id)
    )
    or exists (
      select 1 from public.booking_applications ba
      join public.bookings b2 on b2.id = ba.booking_id
      where (b2.owner_id = auth.uid() and ba.walker_id = notifications.user_id)
         or (ba.walker_id = auth.uid() and b2.owner_id = notifications.user_id)
    )
  );

create policy "Users can view their own referrals" on public.referrals
  for select to authenticated using (auth.uid() = referrer_id or auth.uid() = referred_id);
create policy "Users can create referrals" on public.referrals
  for insert to authenticated with check (auth.uid() = referrer_id);

create policy "Walkers can view their own earnings" on public.walker_earnings
  for select to authenticated using (auth.uid() = walker_id);
create policy "Admins manage earnings" on public.walker_earnings
  for all to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Users can manage their own favorites" on public.favorites
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Walkers can view their own documents" on public.walker_documents
  for select to authenticated using (auth.uid() = walker_id);
create policy "Walkers can insert their own documents" on public.walker_documents
  for insert to authenticated with check (auth.uid() = walker_id);
create policy "Walkers can update their own documents" on public.walker_documents
  for update to authenticated using (auth.uid() = walker_id);
create policy "Admins can manage all documents" on public.walker_documents
  for all to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Badges are viewable by authenticated users" on public.walker_badges
  for select to authenticated using (true);
create policy "Admins can manage badges" on public.walker_badges
  for all to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Walkers can insert their proofs" on public.walk_proofs
  for insert to authenticated with check (auth.uid() = walker_id);
create policy "Booking participants can view proofs" on public.walk_proofs
  for select to authenticated using (
    exists (select 1 from public.bookings b
      where b.id = walk_proofs.booking_id
        and (b.owner_id = auth.uid() or b.walker_id = auth.uid()))
  );
create policy "Owners can update proofs to validate" on public.walk_proofs
  for update to authenticated using (
    exists (select 1 from public.bookings b
      where b.id = walk_proofs.booking_id and b.owner_id = auth.uid())
  );
create policy "Admins can manage proofs" on public.walk_proofs
  for all to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Users can create disputes" on public.disputes
  for insert to authenticated with check (auth.uid() = reporter_id);
create policy "Participants can view their disputes" on public.disputes
  for select to authenticated using (auth.uid() = reporter_id or auth.uid() = reported_id);
create policy "Admins can manage all disputes" on public.disputes
  for all to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Users can report incidents" on public.incident_reports
  for insert to authenticated with check (auth.uid() = reporter_id);
create policy "Participants can view incidents" on public.incident_reports
  for select to authenticated using (
    exists (select 1 from public.bookings b
      where b.id = incident_reports.booking_id
        and (b.owner_id = auth.uid() or b.walker_id = auth.uid()))
  );
create policy "Admins can manage incidents" on public.incident_reports
  for all to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "anyone_can_apply" on public.walker_applications
  for insert to anon, authenticated with check (true);
create policy "owner_can_read_own_application" on public.walker_applications
  for select to authenticated using (user_id = auth.uid());
create policy "admins_manage_applications" on public.walker_applications
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "walker_can_apply" on public.booking_applications
  for insert to authenticated with check (walker_id = auth.uid());
create policy "walker_reads_own_apps" on public.booking_applications
  for select to authenticated using (walker_id = auth.uid());
create policy "owner_reads_apps_to_his_bookings" on public.booking_applications
  for select to authenticated using (
    exists (select 1 from public.bookings b where b.id = booking_id and b.owner_id = auth.uid())
  );
create policy "owner_updates_apps" on public.booking_applications
  for update to authenticated using (
    exists (select 1 from public.bookings b where b.id = booking_id and b.owner_id = auth.uid())
  );

create policy "walker_reads_own_progress" on public.walker_training_progress
  for select to authenticated using (user_id = auth.uid());
create policy "walker_upserts_own_progress" on public.walker_training_progress
  for insert to authenticated with check (user_id = auth.uid());
create policy "walker_updates_own_progress" on public.walker_training_progress
  for update to authenticated using (user_id = auth.uid());
create policy "admins_read_training" on public.walker_training_progress
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "users_read_own_wallet" on public.wallet_transactions
  for select to authenticated using (user_id = auth.uid());
create policy "admins_manage_wallet" on public.wallet_transactions
  for all to authenticated using (public.has_role(auth.uid(), 'admin'));

-- 7. FUNCTIONS & TRIGGERS
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at_column();
create trigger update_dogs_updated_at before update on public.dogs
  for each row execute function public.update_updated_at_column();
create trigger update_walker_profiles_updated_at before update on public.walker_profiles
  for each row execute function public.update_updated_at_column();
create trigger update_bookings_updated_at before update on public.bookings
  for each row execute function public.update_updated_at_column();
create trigger update_walker_documents_updated_at before update on public.walker_documents
  for each row execute function public.update_updated_at_column();
create trigger update_disputes_updated_at before update on public.disputes
  for each row execute function public.update_updated_at_column();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, first_name, last_name, user_type)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    coalesce((new.raw_user_meta_data ->> 'user_type')::public.user_type, 'owner')
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.update_walker_rating()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.walker_profiles
  set
    rating = (
      select round(avg(r.rating)::numeric, 2)
      from public.reviews r
      join public.bookings b on r.booking_id = b.id
      where b.walker_id = new.reviewed_id
    ),
    total_reviews = (
      select count(*)
      from public.reviews r
      join public.bookings b on r.booking_id = b.id
      where b.walker_id = new.reviewed_id
    )
  where user_id = new.reviewed_id;
  return new;
end;
$$;

create trigger on_review_created
  after insert on public.reviews
  for each row execute function public.update_walker_rating();

create or replace function public.generate_referral_code()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.referral_code is null then
    new.referral_code = upper(substring(md5(random()::text) from 1 for 8));
  end if;
  return new;
end;
$$;

create trigger set_referral_code
  before insert on public.referrals
  for each row execute function public.generate_referral_code();

-- Code de validation "GO"
create or replace function public.generate_validation_code()
returns text language plpgsql set search_path = public as $$
begin
  return lpad((floor(random() * 1000000))::int::text, 6, '0');
end;
$$;

create or replace function public.set_booking_validation_code()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status in ('confirmed', 'in_progress') and new.validation_code is null then
    new.validation_code := public.generate_validation_code();
  end if;
  return new;
end;
$$;

create trigger trg_set_validation_code
  before insert or update of status on public.bookings
  for each row execute function public.set_booking_validation_code();

create or replace function public.mark_pending_release()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.end_proof_url is not null and old.end_proof_url is null
     and new.funds_released_at is null then
    new.payment_status := 'pending_release';
  end if;
  return new;
end;
$$;

create trigger bookings_pending_release_trigger
  before update on public.bookings
  for each row execute function public.mark_pending_release();

create or replace function public.validate_booking_code(_booking_id uuid, _code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  _booking public.bookings;
  _user_id uuid := auth.uid();
begin
  if _user_id is null then
    return jsonb_build_object('success', false, 'error', 'not_authenticated');
  end if;

  select * into _booking from public.bookings where id = _booking_id;
  if not found then
    return jsonb_build_object('success', false, 'error', 'booking_not_found');
  end if;

  if _booking.walker_id is distinct from _user_id then
    return jsonb_build_object('success', false, 'error', 'not_authorized');
  end if;

  if _booking.validation_code is null then
    return jsonb_build_object('success', false, 'error', 'no_code_generated');
  end if;

  if _booking.validation_code_used_at is not null then
    return jsonb_build_object('success', false, 'error', 'code_already_used');
  end if;

  if _booking.validation_code <> _code then
    return jsonb_build_object('success', false, 'error', 'invalid_code');
  end if;

  update public.bookings
  set status = 'completed',
      validation_code_used_at = now(),
      funds_released_at = now(),
      funds_release_method = 'code',
      payment_status = 'released',
      updated_at = now()
  where id = _booking_id;

  return jsonb_build_object('success', true, 'booking_id', _booking_id);
end;
$$;

create or replace function public.trigger_sos_release(_booking_id uuid, _reason text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  _booking public.bookings;
  _user_id uuid := auth.uid();
begin
  if _user_id is null then
    return jsonb_build_object('success', false, 'error', 'not_authenticated');
  end if;

  select * into _booking from public.bookings where id = _booking_id;
  if not found then
    return jsonb_build_object('success', false, 'error', 'booking_not_found');
  end if;

  if _booking.owner_id is distinct from _user_id then
    return jsonb_build_object('success', false, 'error', 'not_authorized');
  end if;

  if _booking.funds_released_at is not null then
    return jsonb_build_object('success', false, 'error', 'funds_already_released');
  end if;

  update public.bookings
  set status = 'completed',
      sos_triggered_at = now(),
      sos_reason = _reason,
      funds_released_at = now(),
      funds_release_method = 'sos_owner',
      payment_status = 'released',
      updated_at = now()
  where id = _booking_id;

  return jsonb_build_object('success', true, 'booking_id', _booking_id);
end;
$$;

-- Coordonnées partagées entre participants d'une réservation confirmée
create or replace function public.get_booking_contact(_booking_id uuid)
returns jsonb language plpgsql security definer stable set search_path = public as $$
declare
  _booking public.bookings;
  _user_id uuid := auth.uid();
  _other uuid;
  _p public.profiles;
begin
  if _user_id is null then
    return jsonb_build_object('error', 'not_authenticated');
  end if;

  select * into _booking from public.bookings where id = _booking_id;
  if not found then
    return jsonb_build_object('error', 'booking_not_found');
  end if;

  if _user_id = _booking.owner_id then
    _other := _booking.walker_id;
  elsif _user_id = _booking.walker_id then
    _other := _booking.owner_id;
  else
    return jsonb_build_object('error', 'not_authorized');
  end if;

  if _other is null then
    return jsonb_build_object('error', 'no_counterparty');
  end if;

  if _booking.status not in ('confirmed', 'in_progress', 'completed') then
    return jsonb_build_object('error', 'booking_not_confirmed');
  end if;

  select * into _p from public.profiles where id = _other;

  return jsonb_build_object(
    'first_name', _p.first_name,
    'last_name', _p.last_name,
    'phone', _p.phone,
    'email', _p.email,
    'avatar_url', _p.avatar_url,
    'address', case when _user_id = _booking.walker_id then _booking.address else null end,
    'city', _booking.city
  );
end;
$$;

-- Acceptation d'une candidature à une mission
create or replace function public.accept_booking_application(application_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  _app public.booking_applications;
  _booking public.bookings;
  _user_id uuid := auth.uid();
begin
  if _user_id is null then
    return jsonb_build_object('success', false, 'error', 'not_authenticated');
  end if;

  select * into _app from public.booking_applications where id = application_id;
  if not found then
    return jsonb_build_object('success', false, 'error', 'application_not_found');
  end if;

  select * into _booking from public.bookings where id = _app.booking_id;
  if not found or _booking.owner_id is distinct from _user_id then
    return jsonb_build_object('success', false, 'error', 'not_authorized');
  end if;

  update public.bookings
  set walker_id = _app.walker_id,
      status = 'confirmed',
      updated_at = now()
  where id = _app.booking_id;

  update public.booking_applications
  set status = 'accepted' where id = application_id;

  update public.booking_applications
  set status = 'rejected'
  where booking_id = _app.booking_id and id <> application_id;

  insert into public.notifications (user_id, title, message, type, link)
  values (
    _app.walker_id,
    'Mission acceptée',
    'Le propriétaire a accepté votre candidature.',
    'booking',
    '/walker/dashboard'
  );

  return jsonb_build_object('success', true, 'booking_id', _app.booking_id);
end;
$$;

create or replace function public.auto_release_escrow()
returns integer language plpgsql security definer set search_path = public as $$
declare
  v_count integer := 0;
  v_booking record;
begin
  for v_booking in
    select id, walker_id, walker_amount
    from public.bookings
    where status = 'completed'
      and payment_status in ('held', 'pending_release')
      and funds_released_at is null
      and updated_at < now() - interval '72 hours'
  loop
    update public.bookings
    set payment_status = 'released',
        funds_released_at = now(),
        funds_release_method = 'auto_timeout',
        updated_at = now()
    where id = v_booking.id;

    insert into public.notifications (user_id, title, message, type, link)
    values (
      v_booking.walker_id,
      'Fonds libérés',
      'Le paiement de ' || coalesce(v_booking.walker_amount::text, '?') || ' € vient d''être libéré sur votre compte.',
      'payment',
      '/walker/dashboard'
    );

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

create or replace function public.refresh_trust_scores()
returns integer language plpgsql security definer set search_path = public as $$
declare
  v_count integer := 0;
begin
  update public.walker_profiles wp
  set rating = coalesce(sub.avg_rating, 0),
      total_reviews = sub.review_count,
      total_walks = sub.walk_count,
      updated_at = now()
  from (
    select b.walker_id,
           round(avg(r.rating)::numeric, 2) as avg_rating,
           count(distinct r.id) as review_count,
           count(distinct b.id) as walk_count
    from public.bookings b
    left join public.reviews r on r.booking_id = b.id
    where b.status = 'completed' and b.walker_id is not null
    group by b.walker_id
  ) sub
  where wp.user_id = sub.walker_id;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

grant execute on function public.validate_booking_code(uuid, text) to authenticated;
grant execute on function public.trigger_sos_release(uuid, text) to authenticated;
grant execute on function public.get_booking_contact(uuid) to authenticated;
grant execute on function public.accept_booking_application(uuid) to authenticated;

-- 8. INDEX
create index idx_bookings_owner on public.bookings (owner_id);
create index idx_bookings_walker on public.bookings (walker_id);
create index idx_bookings_status on public.bookings (status);
create index idx_bookings_open_missions on public.bookings (status) where walker_id is null;
create index idx_bookings_validation_code on public.bookings (validation_code) where validation_code is not null;
create index idx_bookings_stripe_pi on public.bookings (stripe_payment_intent_id);
create index idx_messages_pair on public.messages (sender_id, receiver_id, created_at desc);
create index idx_notifications_user on public.notifications (user_id, created_at desc);
create index idx_dogs_owner on public.dogs (owner_id);
create index idx_walk_proofs_booking on public.walk_proofs (booking_id);
create index idx_booking_applications_booking on public.booking_applications (booking_id);
create index idx_walker_applications_status on public.walker_applications (status, created_at desc);
create index idx_training_user on public.walker_training_progress (user_id);
create index idx_wallet_tx_user on public.wallet_transactions (user_id, created_at desc);

-- 9. REALTIME
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.bookings;

-- 10. STORAGE POLICIES (buckets créés séparément)
create policy "Dog photos are publicly viewable" on storage.objects
  for select using (bucket_id = 'dog-photos');
create policy "Users can upload their dog photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'dog-photos' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users can update their dog photos" on storage.objects
  for update to authenticated using (bucket_id = 'dog-photos' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users can delete their dog photos" on storage.objects
  for delete to authenticated using (bucket_id = 'dog-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Avatars are publicly viewable" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "Users can upload their avatar" on storage.objects
  for insert to authenticated with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users can update their avatar" on storage.objects
  for update to authenticated using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users can delete their avatar" on storage.objects
  for delete to authenticated using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Walkers can view their own documents files" on storage.objects
  for select to authenticated using (bucket_id = 'walker-documents' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Walkers can upload their documents files" on storage.objects
  for insert to authenticated with check (bucket_id = 'walker-documents' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Walkers can update their documents files" on storage.objects
  for update to authenticated using (bucket_id = 'walker-documents' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Admins can view all walker documents files" on storage.objects
  for select to authenticated using (bucket_id = 'walker-documents' and public.has_role(auth.uid(), 'admin'));

create policy "Walk proof owners can view files" on storage.objects
  for select to authenticated using (bucket_id = 'walk-proofs' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Walkers can upload walk proof files" on storage.objects
  for insert to authenticated with check (bucket_id = 'walk-proofs' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Admins can view all walk proof files" on storage.objects
  for select to authenticated using (bucket_id = 'walk-proofs' and public.has_role(auth.uid(), 'admin'));