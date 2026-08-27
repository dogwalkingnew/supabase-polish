-- An assigned, validated walker decides a direct booking exactly once.

create or replace function private.respond_to_direct_booking(
  p_booking_id uuid,
  p_decision text
)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_user_id uuid := auth.uid();
  v_booking public.bookings%rowtype;
  v_new_status text;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_decision not in ('accept', 'decline') then
    raise exception 'Unsupported booking decision';
  end if;

  if not exists (
    select 1
    from public.walker_profiles wp
    where wp.user_id = v_user_id and wp.verified = true
  ) then
    raise exception 'Verified walker profile required';
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

  if v_booking.status <> 'pending' then
    raise exception 'Booking has already been decided';
  end if;

  v_new_status := case when p_decision = 'accept' then 'confirmed' else 'cancelled' end;

  update public.bookings
  set status = v_new_status,
      updated_at = now()
  where id = p_booking_id
    and walker_id = v_user_id
    and status = 'pending';

  if not found then
    raise exception 'Booking state changed';
  end if;

  insert into public.notifications (user_id, title, message, type, link)
  values (
    v_booking.owner_id,
    case when p_decision = 'accept' then 'Demande confirmée' else 'Demande non disponible' end,
    case
      when p_decision = 'accept' then 'L’Accompagnateur a confirmé le créneau. Consultez la réservation pour les modalités à finaliser ensemble.'
      else 'L’Accompagnateur ne peut pas répondre favorablement à cette demande. Vous pouvez consulter d’autres profils.'
    end,
    'booking',
    '/bookings/' || p_booking_id::text
  );

  return jsonb_build_object('status', v_new_status);
end;
$$;

create or replace function public.respond_to_direct_booking(
  p_booking_id uuid,
  p_decision text
)
returns jsonb
language sql
security invoker
set search_path = ''
as $$
  select private.respond_to_direct_booking(p_booking_id, p_decision);
$$;

revoke all on function private.respond_to_direct_booking(uuid, text) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.respond_to_direct_booking(uuid, text) to authenticated;
revoke all on function public.respond_to_direct_booking(uuid, text) from public, anon;
grant execute on function public.respond_to_direct_booking(uuid, text) to authenticated;
