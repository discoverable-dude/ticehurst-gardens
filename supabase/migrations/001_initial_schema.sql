-- ════════════════════════════════════════════════════════════
-- TICEHURST GROUNDS & GARDENS — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ════════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── QUOTES TABLE ──────────────────────────────────────────────
-- Stores all submissions from the /quote multi-step tool
create table if not exists public.quotes (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),

  -- Service details
  service         text not null,
  category        text check (category in ('gardening', 'cleaning')),

  -- Size/scope
  garden_size     text check (garden_size in ('small','medium','large','extra_large')),
  property_size   text check (property_size in ('terrace','semi','detached','large_detached')),
  num_windows     integer,
  num_panels      integer,
  conserv_size    text check (conserv_size in ('small','medium','large')),

  -- Frequency
  frequency       text check (frequency in ('one_off','weekly','fortnightly','monthly','quarterly')),

  -- Location
  town            text not null,
  postcode        text,

  -- Contact
  name            text not null,
  phone           text not null,
  email           text,
  message         text,

  -- Estimate shown to customer
  estimate_low    integer,
  estimate_high   integer,

  -- Workflow status
  status          text not null default 'new'
                  check (status in ('new','contacted','quoted','booked','declined')),
  source          text default 'quote_tool',

  -- Admin notes
  notes           text,
  contacted_at    timestamptz,
  booked_at       timestamptz
);

-- ── CONTACTS TABLE ────────────────────────────────────────────
-- Stores simple contact form submissions
create table if not exists public.contacts (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),

  name        text not null,
  phone       text not null,
  email       text,
  service     text,
  town        text,
  message     text,

  status      text not null default 'new'
              check (status in ('new','contacted','closed')),
  notes       text,
  contacted_at timestamptz
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────
-- Anonymous users can INSERT only (submit forms)
-- Only authenticated users (Andy / admin) can SELECT/UPDATE/DELETE

alter table public.quotes   enable row level security;
alter table public.contacts enable row level security;

-- Allow anon to insert quotes
create policy "anon_insert_quotes"
  on public.quotes for insert
  to anon
  with check (true);

-- Allow anon to insert contacts
create policy "anon_insert_contacts"
  on public.contacts for insert
  to anon
  with check (true);

-- Allow authenticated users full access
create policy "auth_all_quotes"
  on public.quotes for all
  to authenticated
  using (true)
  with check (true);

create policy "auth_all_contacts"
  on public.contacts for all
  to authenticated
  using (true)
  with check (true);

-- ── INDEXES ────────────────────────────────────────────────────
create index if not exists quotes_status_idx      on public.quotes (status);
create index if not exists quotes_created_at_idx  on public.quotes (created_at desc);
create index if not exists quotes_town_idx        on public.quotes (town);
create index if not exists contacts_status_idx    on public.contacts (status);
create index if not exists contacts_created_idx   on public.contacts (created_at desc);

-- ── ADMIN VIEW ─────────────────────────────────────────────────
-- Handy view Andy can use to see new leads at a glance
create or replace view public.new_leads as
  select
    'quote'     as source,
    id,
    created_at,
    name,
    phone,
    email,
    service,
    town,
    status,
    estimate_low,
    estimate_high
  from public.quotes
  where status = 'new'

  union all

  select
    'contact'   as source,
    id,
    created_at,
    name,
    phone,
    email,
    service,
    town,
    status,
    null        as estimate_low,
    null        as estimate_high
  from public.contacts
  where status = 'new'

  order by created_at desc;
