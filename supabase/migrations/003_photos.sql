-- ════════════════════════════════════════════════════════════
-- PHOTOS TABLE — stores image metadata for gallery/portfolio
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ════════════════════════════════════════════════════════════
-- Also create a Storage bucket called "photos" (public) in
-- Supabase Dashboard → Storage → New bucket

create table if not exists public.photos (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  url           text not null,                     -- full public URL from Supabase Storage
  alt           text not null default '',           -- alt text for accessibility
  service_slug  text,                              -- e.g. 'lawn-care', null for hero/about
  category      text not null default 'work'
                check (category in ('hero','about','work','before','after')),
  pair_id       text,                              -- shared ID linking a before↔after pair
  sort_order    integer not null default 0,
  active        boolean not null default true
);

alter table public.photos enable row level security;

-- Anyone can view active photos (public site)
create policy "anon_select_photos"
  on public.photos for select
  to anon
  using (active = true);

-- Authenticated users (admin) get full access
create policy "auth_all_photos"
  on public.photos for all
  to authenticated
  using (true)
  with check (true);

create index if not exists photos_service_idx    on public.photos (service_slug);
create index if not exists photos_category_idx   on public.photos (category);
create index if not exists photos_sort_idx       on public.photos (sort_order);
