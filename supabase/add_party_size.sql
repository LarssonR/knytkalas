-- Lägg till party_size på guests
-- Kör detta i Supabase SQL Editor

alter table guests
  add column if not exists party_size integer not null default 1;
