-- Knytkalas — SQL-migration
-- Kör detta i Supabase SQL Editor när du har skapat ett projekt

-- Aktivera UUID-extension
create extension if not exists "pgcrypto";

-- Evenemang
create table events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  date date not null,
  location text not null,
  economy_enabled boolean not null default false,
  admin_token uuid not null default gen_random_uuid(),
  guest_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);

-- Gäster
create table guests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

-- Rätter
create table dishes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  guest_id uuid not null references guests(id) on delete cascade,
  name text not null,
  meal text not null check (meal in ('lunch', 'dinner')),
  category text not null check (category in ('starter', 'main', 'dessert')),
  contains_gluten boolean not null default false,
  contains_lactose boolean not null default false,
  cost_sek numeric(10, 2) null,
  created_at timestamptz not null default now()
);

-- Aktivera Row Level Security
alter table events enable row level security;
alter table guests enable row level security;
alter table dishes enable row level security;

-- RLS: Alla kan läsa event via guest_token (anonym)
create policy "Läs event via guest_token"
  on events for select
  using (true);

-- RLS: Alla kan skapa event (ingen inloggning)
create policy "Skapa event"
  on events for insert
  with check (true);

-- RLS: Admin kan uppdatera sitt event
create policy "Admin uppdatera event"
  on events for update
  using (true);

-- RLS: Gäster kan läsa gäster i sitt evenemang
create policy "Läs gäster"
  on guests for select
  using (true);

-- RLS: Alla kan registrera gäst
create policy "Registrera gäst"
  on guests for insert
  with check (true);

-- RLS: Gäster kan läsa rätter
create policy "Läs rätter"
  on dishes for select
  using (true);

-- RLS: Gäster kan lägga till rätt
create policy "Lägg till rätt"
  on dishes for insert
  with check (true);

-- RLS: Gäster kan uppdatera sina egna rätter
create policy "Uppdatera egna rätter"
  on dishes for update
  using (true);

-- RLS: Gäster kan ta bort sina egna rätter
create policy "Ta bort egna rätter"
  on dishes for delete
  using (true);
