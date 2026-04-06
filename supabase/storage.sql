-- ============================================
-- SUPABASE STORAGE - À exécuter dans SQL Editor
-- ============================================

-- Créer le bucket "avatars" (public)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Politique : lecture publique
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

-- Politique : upload/update/delete pour les admins connectés
create policy "avatars_admin_upload" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "avatars_admin_update" on storage.objects
  for update using (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "avatars_admin_delete" on storage.objects
  for delete using (bucket_id = 'avatars' and auth.role() = 'authenticated');
