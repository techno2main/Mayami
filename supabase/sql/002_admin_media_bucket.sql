-- Create a public bucket for media URLs used by the landing page.
insert into storage.buckets (id, name, public)
values ('mayami-media', 'mayami-media', true)
on conflict (id) do nothing;

-- Public read so uploaded images can be rendered directly on the site.
drop policy if exists media_bucket_public_read on storage.objects;
create policy media_bucket_public_read
on storage.objects
for select
to public
using (bucket_id = 'mayami-media');

-- Strict write access for the 2 admin accounts only.
drop policy if exists media_bucket_admin_insert on storage.objects;
create policy media_bucket_admin_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'mayami-media'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = any (
    array[
      'tyson.nomansa@gmail.com',
      'ellene@masri.com'
    ]
  )
);

drop policy if exists media_bucket_admin_update on storage.objects;
create policy media_bucket_admin_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'mayami-media'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = any (
    array[
      'tyson.nomansa@gmail.com',
      'ellene@masri.com'
    ]
  )
)
with check (
  bucket_id = 'mayami-media'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = any (
    array[
      'tyson.nomansa@gmail.com',
      'ellene@masri.com'
    ]
  )
);

drop policy if exists media_bucket_admin_delete on storage.objects;
create policy media_bucket_admin_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'mayami-media'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = any (
    array[
      'tyson.nomansa@gmail.com',
      'ellene@masri.com'
    ]
  )
);