drop policy "Enable delete for users based on user_id" on "public"."tags";

drop policy "Enable update for users based on user_id" on "public"."tags";

alter table "public"."tags" drop constraint "public_tags_user_id_fkey";

drop view if exists "public"."tags_with_track_ids";

alter table "public"."tags" drop column "user_id";

alter table "public"."tags" add column "created_by" uuid not null default auth.uid();

alter table "public"."tags" add constraint "public_tags_user_id_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tags" validate constraint "public_tags_user_id_fkey";

create or replace view "public"."tags_with_track_ids" as  SELECT tags.id,
    tags.created_at,
    tags.name,
    tags.color,
    tags.created_by AS user_id,
    array_agg("trackTags".track_id) FILTER (WHERE ("trackTags".track_id IS NOT NULL)) AS track_ids
   FROM (tags
     LEFT JOIN "trackTags" ON ((tags.id = "trackTags".tag_id)))
  GROUP BY tags.id, tags.created_at, tags.name, tags.color, tags.created_by;


create policy "Enable delete for users based on user_id"
on "public"."tags"
as permissive
for delete
to public
using ((auth.uid() = created_by));


create policy "Enable update for users based on user_id"
on "public"."tags"
as permissive
for update
to public
using ((auth.uid() = created_by))
with check ((auth.uid() = created_by));



