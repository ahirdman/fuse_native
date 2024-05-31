drop policy "Enable read access for authenticated users" on "public"."trackTags";

create policy "Enable read access for authenticated users"
on "public"."trackTags"
as permissive
for select
to authenticated
using (true);



