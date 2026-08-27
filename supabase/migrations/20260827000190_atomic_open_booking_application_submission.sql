-- A validated walker can apply once to an open booking through one atomic transition.
-- Preserve the historical public RPC return type (uuid) while moving the privileged logic private.

create or replace function private.apply_to_open_booking(
  p_booking_id uuid,
  p_message text
)
returns uuid
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_walker_id uuid := auth.uid();
  v_booking public.bookings%rowtype;
  v_existing public.booking_applications%rowtype;
  v_application public.booking_applications%rowtype;
  v_message text := nullif(trim(coalesce(p_message, '')), '');
begin
  if v_walker_id is null then
    raise exception 'Authentication required';
  end if;

  if char_length(coalesce(v_message, '')) < 5 or char_length(v_message) > 1000 then
    raise exception 'Application message must contain between 5 and 1000 characters';
  end if;

  if not exists (
    select 1
    from public.walker_profiles wp
    where wp.user_id = v_walker_id
      and wp.verified = true
  ) then
    raise exception 'Approved walker profile required';
  end if;

  select * into v_booking
  from public.bookings
  where id = p_booking_id
  for update;

  if not found then
    raise exception 'Booking not found';
  end if;

  if v_booking.owner_id = v_walker_id then
    raise exception 'Booking owner cannot apply to their own request';
  end if;

  if v_booking.scheduled_date < current_date then
    raise exception 'Open request date has passed';
  end if;

  if v_booking.walker_id is not null
    or v_booking.status <> 'pending'::public.booking_status then
    raise exception 'Booking no longer accepts applications';
  end if;

  select * into v_existing
  from public.booking_applications
  where booking_id = p_booking_id
    and walker_id = v_walker_id
  for update;

  if found then
    if v_existing.status = 'pending' then
      return v_existing.id;
    end if;
    raise exception 'This booking application has already been reviewed';
  end if;

  insert into public.booking_applications (booking_id, walker_id, message, status)
  values (p_booking_id, v_walker_id, v_message, 'pending')
  returning * into v_application;

  insert into public.notifications (user_id, title, message, type, link)
  values (
    v_booking.owner_id,
    'Nouvelle candidature',
    'Un Accompagnateur a candidaté à votre annonce. Consultez la demande pour prendre une décision.',
    'booking_application',
    '/bookings/' || p_booking_id::text
  );

  return v_application.id;
end;
$$;

create or replace function public.apply_to_open_booking(
  _booking_id uuid,
  _message text
)
returns uuid
language sql
security invoker
set search_path = ''
as $$
  select private.apply_to_open_booking(_booking_id, _message);
$$;

revoke all on function private.apply_to_open_booking(uuid, text) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.apply_to_open_booking(uuid, text) to authenticated;

revoke all on function public.apply_to_open_booking(uuid, text) from public, anon;
grant execute on function public.apply_to_open_booking(uuid, text) to authenticated;
