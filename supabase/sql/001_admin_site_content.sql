create table if not exists public.site_content (
  key text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Lecture reservee aux utilisateurs authentifies.
drop policy if exists site_content_select_auth on public.site_content;
create policy site_content_select_auth
on public.site_content
for select
to authenticated
using (true);

-- Ecriture reservee aux utilisateurs authentifies.
drop policy if exists site_content_write_auth on public.site_content;
create policy site_content_write_auth
on public.site_content
for all
to authenticated
using (true)
with check (true);
