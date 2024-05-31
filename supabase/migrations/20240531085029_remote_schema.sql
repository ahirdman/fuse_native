drop policy "Enable select for users based on user_id" on "public"."tags";

create policy "Enable select for authenticated users only"
on "public"."tags"
as permissive
for select
to authenticated
using (true);



