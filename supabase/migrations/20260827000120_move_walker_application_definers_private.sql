-- Keep privileged application transitions out of the exposed API schema.
-- Public RPC wrappers remain callable by signed-in users but execute with invoker rights only.

create or replace function private.submit_walker_application(
  p_first_name text,
  p_last_name text,
  p_phone text,
  p_city text,
  p_experience text,
  p_motivation text
)
returns uuid
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text := auth.email();
  v_application_id uuid;
begin
  if v_user_id is null or v_email is null then
    raise exception 'Authentication required';
  end if;

  if coalesce(trim(p_first_name), '') = ''
    or coalesce(trim(p_last_name), '') = ''
    or coalesce(trim(p_city), '') = ''
    or coalesce(trim(p_experience), '') = ''
    or coalesce(trim(p_motivation), '') = '' then
    raise exception 'Incomplete application';
  end if;

  if exists (
    select 1
    from public.walker_profiles
    where user_id = v_user_id and verified = true
  ) then
    raise exception 'Walker profile is already approved';
  end if;

  update public.profiles
  set first_name = trim(p_first_name),
      last_name = trim(p_last_name),
      phone = nullif(trim(p_phone), ''),
      city = trim(p_city)
  where id = v_user_id;

  if not found then
    raise exception 'Application profile not found';
  end if;

  insert into public.walker_profiles (user_id, verified)
  values (v_user_id, false)
  on conflict (user_id) do nothing;

  insert into public.walker_applications (
    user_id, first_name, last_name, email, phone, city, experience, motivation, status
  ) values (
    v_user_id, trim(p_first_name), trim(p_last_name), v_email, nullif(trim(p_phone), ''),
    trim(p_city), trim(p_experience), trim(p_motivation), 'pending'
  )
  on conflict (user_id) where status = 'pending'
  do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    email = excluded.email,
    phone = excluded.phone,
    city = excluded.city,
    experience = excluded.experience,
    motivation = excluded.motivation,
    rejection_reason = null,
    reviewed_by = null,
    reviewed_at = null
  returning id into v_application_id;

  insert into public.notifications (user_id, title, message, type, link)
  select
    ur.user_id,
    'Nouvelle candidature Accompagnateur',
    trim(p_first_name) || ' ' || trim(p_last_name) || ' a soumis un dossier à examiner.',
    'admin',
    '/admin'
  from public.user_roles ur
  where ur.role = 'admin';

  return v_application_id;
end;
$$;

create or replace function private.review_walker_application(
  p_application_id uuid,
  p_decision text,
  p_rejection_reason text default null
)
returns public.walker_applications
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_reviewer_id uuid := auth.uid();
  v_application public.walker_applications%rowtype;
  v_reviewed public.walker_applications%rowtype;
begin
  if v_reviewer_id is null or not private.has_role(v_reviewer_id, 'admin'::app_role) then
    raise exception 'Administrator role required';
  end if;

  if p_decision not in ('approved', 'rejected') then
    raise exception 'Unsupported application decision';
  end if;

  if p_decision = 'rejected' and coalesce(trim(p_rejection_reason), '') = '' then
    raise exception 'A rejection reason is required';
  end if;

  select * into v_application
  from public.walker_applications
  where id = p_application_id
  for update;

  if not found then
    raise exception 'Application not found';
  end if;

  if v_application.status <> 'pending' then
    raise exception 'Application has already been reviewed';
  end if;

  update public.walker_applications
  set status = p_decision,
      reviewed_by = v_reviewer_id,
      reviewed_at = now(),
      rejection_reason = case when p_decision = 'rejected' then trim(p_rejection_reason) else null end
  where id = p_application_id
  returning * into v_reviewed;

  if p_decision = 'approved' then
    insert into public.walker_profiles (user_id, verified)
    values (v_application.user_id, true)
    on conflict (user_id) do update set verified = true;

    update public.profiles
    set user_type = case when user_type = 'owner'::public.user_type then 'both'::public.user_type else 'walker'::public.user_type end
    where id = v_application.user_id;

    insert into public.notifications (user_id, title, message, type, link)
    values (
      v_application.user_id,
      'Candidature Accompagnateur approuvée',
      'Votre profil a été validé. Vous pouvez maintenant consulter les demandes compatibles avec vos informations.',
      'system',
      '/walker/dashboard'
    );
  else
    update public.walker_profiles
    set verified = false
    where user_id = v_application.user_id;

    insert into public.notifications (user_id, title, message, type, link)
    values (
      v_application.user_id,
      'Candidature Accompagnateur refusée',
      'Votre dossier n’a pas été approuvé. Motif : ' || trim(p_rejection_reason),
      'system',
      '/walker/register'
    );
  end if;

  return v_reviewed;
end;
$$;

create or replace function public.submit_walker_application(
  p_first_name text,
  p_last_name text,
  p_phone text,
  p_city text,
  p_experience text,
  p_motivation text
)
returns uuid
language sql
security invoker
set search_path = ''
as $$
  select private.submit_walker_application(
    p_first_name, p_last_name, p_phone, p_city, p_experience, p_motivation
  );
$$;

create or replace function public.review_walker_application(
  p_application_id uuid,
  p_decision text,
  p_rejection_reason text default null
)
returns public.walker_applications
language sql
security invoker
set search_path = ''
as $$
  select private.review_walker_application(p_application_id, p_decision, p_rejection_reason);
$$;

revoke all on function private.submit_walker_application(text, text, text, text, text, text) from public, anon;
revoke all on function private.review_walker_application(uuid, text, text) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.submit_walker_application(text, text, text, text, text, text) to authenticated;
grant execute on function private.review_walker_application(uuid, text, text) to authenticated;

revoke all on function public.submit_walker_application(text, text, text, text, text, text) from public, anon;
revoke all on function public.review_walker_application(uuid, text, text) from public, anon;
grant execute on function public.submit_walker_application(text, text, text, text, text, text) to authenticated;
grant execute on function public.review_walker_application(uuid, text, text) to authenticated;
