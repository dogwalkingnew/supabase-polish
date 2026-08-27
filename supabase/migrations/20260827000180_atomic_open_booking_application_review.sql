-- Select or reject an application to an open booking as one protected transaction.
-- The exposed RPC is an invoker wrapper; the privileged implementation is private.

create or replace function private.review_open_booking_application(
  p_application_id uuid,
  p_decision text
)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_owner_id uuid := auth.uid();
  v_application public.booking_applications%rowtype;
  v_booking public.bookings%rowtype;
  v_application_status text;
  v_booking_status public.booking_status;
begin
  if v_owner_id is null then
    raise exception 'Authentication required';
  end if;

  if p_decision not in ('accept', 'reject') then
    raise exception 'Unsupported application decision';
  end if;

  select * into v_application
  from public.booking_applications
  where id = p_application_id
  for update;

  if not found then
    raise exception 'Booking application not found';
  end if;

  select * into v_booking
  from public.bookings
  where id = v_application.booking_id
  for update;

  if not found then
    raise exception 'Booking not found';
  end if;

  if v_booking.owner_id <> v_owner_id then
    raise exception 'Only the booking owner can review applications';
  end if;

  if v_application.status <> 'pending' then
    raise exception 'Booking application has already been reviewed';
  end if;

  if p_decision = 'accept' then
    if v_booking.walker_id is not null
      or v_booking.status <> 'pending'::public.booking_status then
      raise exception 'Booking no longer accepts applications';
    end if;

    if not exists (
      select 1
      from public.walker_profiles wp
      where wp.user_id = v_application.walker_id
        and wp.verified = true
    ) then
      raise exception 'Approved walker profile required';
    end if;

    update public.bookings
    set walker_id = v_application.walker_id,
        status = 'confirmed'::public.booking_status,
        updated_at = now()
    where id = v_booking.id
      and walker_id is null
      and status = 'pending'::public.booking_status;

    if not found then
      raise exception 'Booking state changed';
    end if;

    update public.booking_applications
    set status = 'accepted'
    where id = v_application.id
      and status = 'pending';

    update public.booking_applications
    set status = 'rejected'
    where booking_id = v_booking.id
      and id <> v_application.id
      and status = 'pending';

    insert into public.notifications (user_id, title, message, type, link)
    values (
      v_application.walker_id,
      'Candidature retenue',
      'Le Propriétaire a retenu votre candidature. Consultez la réservation pour confirmer les modalités de mission.',
      'booking',
      '/bookings/' || v_booking.id::text
    );

    insert into public.notifications (user_id, title, message, type, link)
    select
      ba.walker_id,
      'Candidature non retenue',
      'Le Propriétaire a retenu un autre Accompagnateur pour cette demande.',
      'booking',
      '/bookings/' || v_booking.id::text
    from public.booking_applications ba
    where ba.booking_id = v_booking.id
      and ba.id <> v_application.id
      and ba.status = 'rejected';

    v_application_status := 'accepted';
    v_booking_status := 'confirmed'::public.booking_status;
  else
    update public.booking_applications
    set status = 'rejected'
    where id = v_application.id
      and status = 'pending';

    if not found then
      raise exception 'Booking application state changed';
    end if;

    insert into public.notifications (user_id, title, message, type, link)
    values (
      v_application.walker_id,
      'Candidature non retenue',
      'Le Propriétaire n’a pas retenu votre candidature pour cette demande.',
      'booking',
      '/bookings/' || v_booking.id::text
    );

    v_application_status := 'rejected';
    v_booking_status := v_booking.status;
  end if;

  return jsonb_build_object(
    'booking_id', v_booking.id,
    'booking_status', v_booking_status::text,
    'application_status', v_application_status
  );
end;
$$;

create or replace function public.review_open_booking_application(
  p_application_id uuid,
  p_decision text
)
returns jsonb
language sql
security invoker
set search_path = ''
as $$
  select private.review_open_booking_application(p_application_id, p_decision);
$$;

revoke all on function private.review_open_booking_application(uuid, text) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.review_open_booking_application(uuid, text) to authenticated;

revoke all on function public.review_open_booking_application(uuid, text) from public, anon;
grant execute on function public.review_open_booking_application(uuid, text) to authenticated;
