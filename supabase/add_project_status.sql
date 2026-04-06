-- Ajouter le statut aux projets
alter table public.projects
add column status text not null default 'terminé'
check (status in ('terminé', 'en cours'));
