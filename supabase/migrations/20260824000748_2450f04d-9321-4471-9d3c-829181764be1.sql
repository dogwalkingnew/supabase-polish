-- Retirer l'exécution publique par défaut sur toutes les fonctions SECURITY DEFINER
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.update_walker_rating() from public, anon, authenticated;
revoke execute on function public.set_booking_validation_code() from public, anon, authenticated;
revoke execute on function public.mark_pending_release() from public, anon, authenticated;
revoke execute on function public.auto_release_escrow() from public, anon, authenticated;
revoke execute on function public.refresh_trust_scores() from public, anon, authenticated;
revoke execute on function public.generate_validation_code() from public, anon, authenticated;
revoke execute on function public.generate_referral_code() from public, anon, authenticated;
revoke execute on function public.update_updated_at_column() from public, anon, authenticated;

revoke execute on function public.validate_booking_code(uuid, text) from public, anon;
revoke execute on function public.trigger_sos_release(uuid, text) from public, anon;
revoke execute on function public.get_booking_contact(uuid) from public, anon;
revoke execute on function public.accept_booking_application(uuid) from public, anon;

-- Seules ces 4 fonctions restent appelables par les membres connectés
grant execute on function public.validate_booking_code(uuid, text) to authenticated;
grant execute on function public.trigger_sos_release(uuid, text) to authenticated;
grant execute on function public.get_booking_contact(uuid) to authenticated;
grant execute on function public.accept_booking_application(uuid) to authenticated;