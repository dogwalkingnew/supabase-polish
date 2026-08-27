-- Allow an owner to read only storage objects already linked to one of their bookings.
-- This is required for signed URLs while keeping the walk-proofs bucket private.

create policy "Booking owners can view related walk proofs"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'walk-proofs'
  and exists (
    select 1
    from public.walk_proofs wp
    join public.bookings b on b.id = wp.booking_id
    where wp.photo_url = name
      and b.owner_id = (select auth.uid())
  )
);
