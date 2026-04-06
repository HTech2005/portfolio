-- ============================================
-- PORTFOLIO SUPABASE SCHEMA
-- À exécuter dans l'éditeur SQL de Supabase
-- ============================================

-- Table: projects
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text not null check (category in ('web', 'mobile', 'desktop', 'design')),
  image_url text,
  live_url text,
  github_url text,
  technologies text[] default '{}',
  featured boolean default false,
  order_index integer default 0,
  created_at timestamp with time zone default now()
);

-- Table: skills
create table public.skills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  percentage integer not null check (percentage between 0 and 100),
  category text not null check (category in ('Langages & Systèmes', 'Web & Mobile', 'Données & Design')),
  order_index integer default 0,
  created_at timestamp with time zone default now()
);

-- Table: messages (formulaire de contact)
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- ============================================
-- RLS (Row Level Security)
-- ============================================

alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.messages enable row level security;

-- Projects: lecture publique, écriture admin seulement
create policy "projects_public_read" on public.projects
  for select using (true);

create policy "projects_admin_write" on public.projects
  for all using (auth.role() = 'authenticated');

-- Skills: lecture publique, écriture admin seulement
create policy "skills_public_read" on public.skills
  for select using (true);

create policy "skills_admin_write" on public.skills
  for all using (auth.role() = 'authenticated');

-- Messages: insertion publique, lecture admin seulement
create policy "messages_public_insert" on public.messages
  for insert with check (true);

create policy "messages_admin_read" on public.messages
  for select using (auth.role() = 'authenticated');

create policy "messages_admin_update" on public.messages
  for update using (auth.role() = 'authenticated');

create policy "messages_admin_delete" on public.messages
  for delete using (auth.role() = 'authenticated');

-- Table: profile
create table public.profile (
  id uuid default gen_random_uuid() primary key,
  name text not null default 'Harold MIKPONHOUE',
  title text not null default 'Développeur Full-Stack & UI/UX Designer',
  bio1 text,
  bio2 text,
  photo_url text,
  cv_photo_url text,
  email text,
  phone text,
  location text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  instagram_url text,
  updated_at timestamp with time zone default now()
);

alter table public.profile enable row level security;

create policy "profile_public_read" on public.profile
  for select using (true);

create policy "profile_admin_write" on public.profile
  for all using (auth.role() = 'authenticated');

-- ============================================
-- DONNÉES INITIALES
-- ============================================

insert into public.profile (name, title, bio1, bio2, photo_url, cv_photo_url, email, phone, location, github_url, linkedin_url) values (
  'Harold MIKPONHOUE',
  'Développeur Full-Stack & UI/UX Designer',
  'Élève ingénieur en Génie Informatique et Télécommunications, je suis passionné par la tech et animé par le désir constant d''explorer les innovations qui façonnent le monde numérique de demain.',
  'Mon parcours me permet de combiner expertise technique et créativité pour concevoir des solutions modernes, efficaces et adaptées aux besoins réels. Curieux et rigoureux, je me forme en continu pour rester à la pointe des nouvelles technologies.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&crop=face',
  'mikponhouelerichharold@gmail.com',
  '+229 01 51 45 06 71',
  'Abomey-Calavi, Bénin',
  'https://github.com/HTech2005',
  'https://www.linkedin.com/in/harold-mikponhoue-5b082b359/'
);

insert into public.skills (name, percentage, category, order_index) values
  ('HTML / CSS / PHP', 95, 'Web & Mobile', 1),
  ('React / Angular', 50, 'Web & Mobile', 2),
  ('Laravel / SpringBoot', 75, 'Web & Mobile', 3),
  ('React Native Expo', 50, 'Web & Mobile', 4),
  ('C / C++', 95, 'Langages & Systèmes', 1),
  ('Java', 90, 'Langages & Systèmes', 2),
  ('VHDL', 80, 'Langages & Systèmes', 3),
  ('MySQL', 90, 'Données & Design', 1),
  ('Figma', 50, 'Données & Design', 2),
  ('Blender', 50, 'Données & Design', 3);

insert into public.projects (title, description, category, image_url, live_url, technologies, featured, order_index) values
  ('Plateforme de gestion des activités', 'Plateforme qui permet à des entreprises de gérer leurs activités, et de générer sous forme pdf plusieurs documents relatifs à l''activité.', 'web', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=400&fit=crop', null, ARRAY['HTML','CSS','MySQL','PHP','JS'], true, 1),
  ('Plateforme E-commerce', 'Plateforme qui permet à tout individu de vendre des vêtements, des produits électroniques et ménagers mais également des formations.', 'web', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=400&fit=crop', null, ARRAY['React-TypeScript','Supabase'], true, 2),
  ('MyExpenseTracker', 'Application mobile qui permet de suivre ses dépenses du quotidien.', 'mobile', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=400&fit=crop', 'https://expo.dev/accounts/harold14/projects/MyExpenseTracker/builds/f5d7b383-060f-4732-8ba7-ceaadb6bc33d', ARRAY['React Native','Expo'], false, 3),
  ('Gestion des bus', 'Application Desktop qui permet de gérer les bus et chauffeurs d''une entreprise de transport.', 'desktop', 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500&h=400&fit=crop', null, ARRAY['C++','WxWidgets'], false, 4),
  ('Adjornou', 'Plateforme qui permet de gérer ses tontines et même les tontines de groupe.', 'web', 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&h=400&fit=crop', null, ARRAY['React','Laravel','MySQL'], false, 5),
  ('Facture', 'Plateforme qui permet de suivre et payer ses factures de la SBEE et de la SONEB.', 'web', 'https://images.unsplash.com/photo-1554224154-260327c00c19?w=500&h=400&fit=crop', 'https://mesfactures.iwajutech.com/', ARRAY['Angular','Laravel','MySQL'], false, 6),
  ('Orientation', 'Plateforme qui permet aux nouveaux bacheliers de trouver leur orientation académique idéale.', 'web', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&h=400&fit=crop', 'https://orientation.iwajutech.com/', ARRAY['React'], false, 7),
  ('FusionOffice', 'Solution web permettant la fusion simplifiée de documents Microsoft Office (Word, Excel, PowerPoint).', 'web', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&h=400&fit=crop', 'https://fusion-office.vercel.app/', ARRAY['React'], false, 8),
  ('Avor', 'Plateforme d''e-commerce moderne avec intégration PWA, permettant une expérience d''achat fluide.', 'web', 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=400&fit=crop', 'https://avor-psi.vercel.app/', ARRAY['React','PWA','Supabase'], true, 9),
  ('XRMuseeRepas', 'Plateforme qui permet de découvrir les différents mets béninois à travers une expérience en réalité augmentée.', 'web', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=400&fit=crop', null, ARRAY['React','Blender','Aframe'], false, 10),
  ('Plateforme de gestion des permis', 'Plateforme qui permet aux candidats d''avoir des informations sur le déroulement de l''examen de permis et un permis numérique après réussite.', 'web', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&h=400&fit=crop', null, ARRAY['HTML','CSS','MySQL','PHP'], false, 11);
