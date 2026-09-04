-- ════════════════════════════════════════════════════════════
-- PHOTO PLACEMENTS — allows one image to appear in multiple
-- places across the site (services, hero, about, etc.)
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ════════════════════════════════════════════════════════════

create table if not exists public.photo_placements (
  id            uuid primary key default uuid_generate_v4(),
  photo_id      uuid not null references public.photos(id) on delete cascade,
  service_slug  text,                              -- null for hero/about
  category      text not null default 'work'
                check (category in ('hero','about','work','before','after')),
  pair_id       text,                              -- links before↔after
  sort_order    integer not null default 0
);

alter table public.photo_placements enable row level security;

create policy "anon_select_placements"
  on public.photo_placements for select to anon using (true);

create policy "auth_all_placements"
  on public.photo_placements for all to authenticated
  using (true) with check (true);

create index if not exists placements_photo_idx   on public.photo_placements (photo_id);
create index if not exists placements_service_idx on public.photo_placements (service_slug);
create index if not exists placements_cat_idx     on public.photo_placements (category);

-- Migrate existing photo assignments into placements
insert into public.photo_placements (photo_id, service_slug, category, pair_id, sort_order)
select id, service_slug, category, pair_id, sort_order
from public.photos
where service_slug is not null or category in ('hero', 'about')
on conflict do nothing;
