-- Uppdatera check-constraint för category i dishes-tabellen
-- Kör detta i Supabase SQL Editor

alter table dishes
  drop constraint if exists dishes_category_check;

alter table dishes
  add constraint dishes_category_check
  check (category in ('starter', 'main', 'dessert', 'side', 'drink', 'bread', 'other'));
