-- Keep the product decision on public avatar/dog-photo reads unchanged.
-- Restrict every state-changing or private-object policy to authenticated users.

drop policy if exists "Avatars are publicly viewable" on storage.objects;
drop policy if exists "Dog photos are publicly viewable" on storage.objects;

drop policy if exists "Users can delete their avatar" on storage.objects;
create policy "Authenticated users can delete their avatar"
on storage.objects for delete to authenticated
using (
  bucket_id = 'avatars'
  and (auth.uid())::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can update their avatar" on storage.objects;
drop policy if exists "Users can upload their avatar" on storage.objects;

drop policy if exists "Users can delete their dog photos" on storage.objects;
create policy "Authenticated users can delete their dog photos"
on storage.objects for delete to authenticated
using (
  bucket_id = 'dog-photos'
  and (auth.uid())::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can update their dog photos" on storage.objects;
drop policy if exists "Users can upload their dog photos" on storage.objects;

drop policy if exists "Admins can view all walk proofs" on storage.objects;
create policy "Authenticated admins can view all walk proofs"
on storage.objects for select to authenticated
using (
  bucket_id = 'walk-proofs'
  and private.has_role(auth.uid(), 'admin'::public.app_role)
);

drop policy if exists "Booking owners can view related walk proofs" on storage.objects;
create policy "Authenticated booking owners can view related walk proofs"
on storage.objects for select to authenticated
using (
  bucket_id = 'walk-proofs'
  and exists (
    select 1
    from public.walk_proofs wp
    join public.bookings b on b.id = wp.booking_id
    where wp.photo_url = objects.name
      and b.owner_id = (select auth.uid())
  )
);

drop policy if exists "Walk proof owners can view" on storage.objects;
create policy "Authenticated walk proof owners can view"
on storage.objects for select to authenticated
using (
  bucket_id = 'walk-proofs'
  and (auth.uid())::text = (storage.foldername(name))[1]
);

drop policy if exists "Walkers can upload walk proofs" on storage.objects;
create policy "Authenticated walkers can upload walk proofs"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'walk-proofs'
  and (auth.uid())::text = (storage.foldername(name))[1]
);

drop policy if exists "Admins can view all walker documents" on storage.objects;
create policy "Authenticated admins can view all walker documents"
on storage.objects for select to authenticated
using (
  bucket_id = 'walker-documents'
  and private.has_role(auth.uid(), 'admin'::public.app_role)
);

drop policy if exists "Walkers can update their documents" on storage.objects;
create policy "Authenticated walkers can update their documents"
on storage.objects for update to authenticated
using (
  bucket_id = 'walker-documents'
  and (auth.uid())::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'walker-documents'
  and (auth.uid())::text = (storage.foldername(name))[1]
);

drop policy if exists "Walkers can upload their documents" on storage.objects;
create policy "Authenticated walkers can upload their documents"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'walker-documents'
  and (auth.uid())::text = (storage.foldername(name))[1]
);

drop policy if exists "Walkers can view their own documents" on storage.objects;
create policy "Authenticated walkers can view their own documents"
on storage.objects for select to authenticated
using (
  bucket_id = 'walker-documents'
  and (auth.uid())::text = (storage.foldername(name))[1]
);
