-- ════════════════════════════════════════════════════════════
-- CMS TABLES — editable content for the entire site
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ════════════════════════════════════════════════════════════

-- ── PAGE CONTENT (flexible JSONB per section) ─────────────
create table if not exists public.cms_content (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  page        text not null,
  section     text not null,
  content     jsonb not null default '{}',
  sort_order  integer not null default 0,
  unique(page, section)
);

-- ── REVIEWS ───────────────────────────────────────────────
create table if not exists public.cms_reviews (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  quote       text not null,
  name        text not null,
  location    text not null,
  service     text,
  rating      integer not null default 5,
  sort_order  integer not null default 0,
  active      boolean not null default true
);

-- ── SERVICES ──────────────────────────────────────────────
create table if not exists public.cms_services (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  slug        text not null unique,
  name        text not null,
  category    text not null check (category in ('gardening', 'cleaning')),
  title       text not null,
  meta        text not null,
  h1a         text not null,
  h1b         text not null,
  intro       text not null,
  includes    text[] not null default '{}',
  faqs        jsonb not null default '[]',
  kw_extra    text,
  sort_order  integer not null default 0,
  active      boolean not null default true
);

-- ── LOCATIONS ─────────────────────────────────────────────
create table if not exists public.cms_locations (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  slug        text not null unique,
  name        text not null,
  county      text not null,
  lat         double precision not null,
  lng         double precision not null,
  description text not null,
  villages    text not null,
  nearby      text[] not null default '{}',
  kw_gardeners text,
  kw_window    text,
  kw_gutter    text,
  sort_order   integer not null default 0,
  active       boolean not null default true
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────

alter table public.cms_content   enable row level security;
alter table public.cms_reviews   enable row level security;
alter table public.cms_services  enable row level security;
alter table public.cms_locations enable row level security;

-- Anon can read all content (public site)
create policy "anon_select_content"   on public.cms_content   for select to anon using (true);
create policy "anon_select_reviews"   on public.cms_reviews   for select to anon using (active = true);
create policy "anon_select_services"  on public.cms_services  for select to anon using (active = true);
create policy "anon_select_locations" on public.cms_locations  for select to anon using (active = true);

-- Authenticated (admin) full access
create policy "auth_all_content"   on public.cms_content   for all to authenticated using (true) with check (true);
create policy "auth_all_reviews"   on public.cms_reviews   for all to authenticated using (true) with check (true);
create policy "auth_all_services"  on public.cms_services  for all to authenticated using (true) with check (true);
create policy "auth_all_locations" on public.cms_locations  for all to authenticated using (true) with check (true);

-- ── INDEXES ───────────────────────────────────────────────
create index if not exists cms_content_page_idx    on public.cms_content (page);
create index if not exists cms_reviews_sort_idx    on public.cms_reviews (sort_order);
create index if not exists cms_services_cat_idx    on public.cms_services (category);
create index if not exists cms_locations_sort_idx  on public.cms_locations (sort_order);
