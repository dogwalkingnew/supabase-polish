-- Store only private object paths and couple the required start proof to the mission transition.

create or replace function private.record_walk_proof_and_transition(
  p_booking_id uuid,
  p_storage_path text,
  p_photo_type text,
  p_caption text default null,
  p_location_lat double precision default null,
  p_location_lng double precision default null
)
returns uuid
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_user_id uuid := auth.uid();
  v_booking public.bookings%rowtype;
  v_proof_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_photo_type not in ('start', 'end') then
    raise exception 'Unsupported mission proof type';
  end if;

  if coalesce(trim(p_storage_path), '') = ''
    or trim(p_storage_path) !~ ('^' || v_user_id::text || '/' || p_booking_id::text || '/') then
    raise exception 'Invalid proof storage path';
  end if;

  select * into v_booking
  from public.bookings
  where id = p_booking_id
  for update;

  if not found then
    raise exception 'Booking not found';
  end if;

  if v_booking.walker_id <> v_user_id then
    raise exception 'Walker is not assigned to this booking';
  end if;

  if p_photo_type = 'start' and v_booking.status <> 'confirmed' then
    raise exception 'Booking is not ready to start';
  end if;

  if p_photo_type = 'end' and v_booking.status <> 'in_progress' then
    raise exception 'Booking is not in progress';
  end if;

  insert into public.walk_proofs (
    booking_id, walker_id, photo_url, photo_type, caption, location_lat, location_lng
  ) values (
    p_booking_id, v_user_id, trim(p_storage_path), p_photo_type,
    nullif(trim(p_caption), ''), p_location_lat, p_location_lng
  )
  returning id into v_proof_id;

  if p_photo_type = 'start' then
    update public.bookings
    set status = 'in_progress',
        updated_at = now()
    where id = p_booking_id
      and walker_id = v_user_id
      and status = 'confirmed';

    if not found then
      raise exception 'Booking state changed';
    end if;
  end if;

  insert into public.notifications (user_id, title, message, type, link)
  values (
    v_booking.owner_id,
    case when p_photo_type = 'start' then 'Promenade démarrée' else 'Preuve de fin de mission reçue' end,
    case
      when p_photo_type = 'start' then 'L’Accompagnateur a confirmé la prise en charge de votre animal.'
      else 'L’Accompagnateur a ajouté une preuve de fin de mission.'
    end,
    'booking',
    '/bookings/' || p_booking_id::text
  );

  return v_proof_id;
end;
$$;

create or replace function public.record_walk_proof_and_transition(
  p_booking_id uuid,
  p_storage_path text,
  p_photo_type text,
  p_caption text default null,
  p_location_lat double precision default null,
  p_location_lng double precision default null
)
returns uuid
language sql
security invoker
set search_path = ''
as $$
  select private.record_walk_proof_and_transition(
    p_booking_id, p_storage_path, p_photo_type, p_caption, p_location_lat, p_location_lng
  );
$$;

drop policy if exists "Walkers can insert their proofs" on public.walk_proofs;
create policy "Assigned walkers can add in-progress proof photos"
on public.walk_proofs
for insert
to authenticated
with check (
  walker_id = (select auth.uid())
  and photo_type = 'during'
  and exists (
    select 1
    from public.bookings b
    where b.id = booking_id
      and b.walker_id = (select auth.uid())
      and b.status = 'in_progress'
  )
);

revoke all on function private.record_walk_proof_and_transition(uuid, text, text, text, double precision, double precision) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.record_walk_proof_and_transition(uuid, text, text, text, double precision, double precision) to authenticated;
revoke all on function public.record_walk_proof_and_transition(uuid, text, text, text, double precision, double precision) from public, anon;
grant execute on function public.record_walk_proof_and_transition(uuid, text, text, text, double precision, double precision) to authenticated;
