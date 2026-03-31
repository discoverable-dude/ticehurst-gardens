-- ════════════════════════════════════════════════════════════
-- WEBHOOKS TABLE — stores webhook URLs fired on form submissions
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ════════════════════════════════════════════════════════════

create table if not exists public.webhooks (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  url         text not null,
  label       text,                          -- optional friendly name
  event       text not null default 'all'    -- 'all', 'quote', or 'contact'
              check (event in ('all', 'quote', 'contact')),
  active      boolean not null default true
);

alter table public.webhooks enable row level security;

-- Only authenticated users can manage webhooks
create policy "auth_all_webhooks"
  on public.webhooks for all
  to authenticated
  using (true)
  with check (true);
