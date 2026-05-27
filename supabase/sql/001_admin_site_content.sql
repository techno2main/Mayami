create table if not exists public.site_content (
  key text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- RLS stricte: seuls ces 2 emails admin peuvent lire/ecrire.
-- On force en lower-case pour eviter les soucis de casse.
-- Si besoin d'ajouter un 3e admin plus tard, ajoute juste un email dans la liste.
-- Exemple: 'nouvel-admin@example.com'
--
-- Note: la policy est dupliquee (SELECT + ALL) pour couvrir lecture et ecriture.

drop policy if exists site_content_select_auth on public.site_content;
create policy site_content_select_auth
on public.site_content
for select
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = any (
    array[
      'tyson.nomansa@gmail.com',
      'ellene@masri.com'
    ]
  )
);

drop policy if exists site_content_write_auth on public.site_content;
create policy site_content_write_auth
on public.site_content
for all
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = any (
    array[
      'tyson.nomansa@gmail.com',
      'ellene@masri.com'
    ]
  )
)
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) = any (
    array[
      'tyson.nomansa@gmail.com',
      'ellene@masri.com'
    ]
  )
);
