-- Table: timeline (parcours)
create table public.timeline (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('experience', 'formation')),
  title text not null,
  organization text not null,
  location text,
  date_start text not null,
  date_end text default 'Présent',
  description text,
  order_index integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.timeline enable row level security;

create policy "timeline_public_read" on public.timeline
  for select using (true);

create policy "timeline_admin_write" on public.timeline
  for all using (auth.role() = 'authenticated');

-- Données initiales
insert into public.timeline (type, title, organization, location, date_start, date_end, description, order_index) values
  ('experience', 'Développeur Full-Stack Freelance', 'Indépendant', 'Bénin', '2024', 'Présent', 'Conception et déploiement de plateformes web modernes (Laravel/React). Réalisations : Avor (E-commerce & PWA), FusionOffice (Gestion de documents), Adjornou (Tontines).', 1),
  ('formation', 'Génie Informatique et Télécommunications', 'École Polytechnique d''Abomey-Calavi (EPAC)', 'Abomey-Calavi, Bénin', '2021', 'Présent', 'Cycle d''ingénieur en cours. Spécialisation en développement logiciel, systèmes embarqués et télécommunications.', 2);
