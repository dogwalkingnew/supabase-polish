-- Preserve existing Walker application access rules while allowing PostgreSQL to evaluate auth.email() once per query.

alter policy "authenticated_users_can_apply_for_themselves"
on public.walker_applications
with check (
  user_id = (select auth.uid())
  and email = (select auth.email())
);

alter policy "owner_can_read_own_application"
on public.walker_applications
using (
  user_id = (select auth.uid())
  or email = (select auth.email())
);
