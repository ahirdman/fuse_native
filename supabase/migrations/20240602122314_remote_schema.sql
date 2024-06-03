drop policy "Enable delete for users based on user_id" on "public"."fuseTags";

drop policy "Enable select for users based on user_id" on "public"."fuseTags";

drop policy "Enable update for users based on user_id" on "public"."fuseTags";

alter table "public"."fuseTags" drop constraint "public_fuseTags_tag_id_1_fkey";

alter table "public"."fuseTags" drop constraint "public_fuseTags_tag_id_2_fkey";

alter table "public"."fuseTags" drop constraint "public_fuseTags_user_id_fkey";

drop view if exists "public"."initial_tags_with_matches";

drop view if exists "public"."matched_tags";

alter table "public"."fuseTags" drop column "user_id";

alter table "public"."fuseTags" add column "created_by" uuid not null default auth.uid();

alter table "public"."fuseTags" add column "tag_ids" bigint[] not null;

alter table "public"."fuseTags" alter column "tag_id_1" drop not null;

alter table "public"."fuseTags" alter column "tag_id_2" drop not null;

alter table "public"."fuseTags" add constraint "public_fuseTags_user_id_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."fuseTags" validate constraint "public_fuseTags_user_id_fkey";

create or replace view "public"."initial_tags_with_matches" as  SELECT DISTINCT t.id,
    t.name,
    t.color
   FROM (tags t
     JOIN "trackTags" tt ON ((t.id = tt.tag_id)))
  WHERE ((EXISTS ( SELECT 1
           FROM "trackTags" tt_inner
          WHERE ((tt_inner.track_id = tt.track_id) AND (tt_inner.tag_id <> t.id)))) AND (NOT (EXISTS ( SELECT 1
           FROM "fuseTags" ft
          WHERE (((ft.tag_id_1 = t.id) AND (ft.tag_id_2 IN ( SELECT tt_inner.tag_id
                   FROM "trackTags" tt_inner
                  WHERE ((tt_inner.track_id = tt.track_id) AND (tt_inner.tag_id <> t.id))))) OR ((ft.tag_id_2 = t.id) AND (ft.tag_id_1 IN ( SELECT tt_inner.tag_id
                   FROM "trackTags" tt_inner
                  WHERE ((tt_inner.track_id = tt.track_id) AND (tt_inner.tag_id <> t.id))))))))));


create or replace view "public"."matched_tags" as  SELECT DISTINCT tt1.tag_id AS initial_tag_id,
    tt2.tag_id AS id,
    t2.name,
    t2.color
   FROM (("trackTags" tt1
     JOIN "trackTags" tt2 ON (((tt1.track_id = tt2.track_id) AND (tt1.tag_id <> tt2.tag_id))))
     JOIN tags t2 ON ((tt2.tag_id = t2.id)))
  WHERE (NOT (EXISTS ( SELECT 1
           FROM "fuseTags" ft
          WHERE (((ft.tag_id_1 = tt1.tag_id) AND (ft.tag_id_2 = tt2.tag_id)) OR ((ft.tag_id_1 = tt2.tag_id) AND (ft.tag_id_2 = tt1.tag_id))))));


create policy "Enable delete for users based on user_id"
on "public"."fuseTags"
as permissive
for delete
to public
using ((auth.uid() = created_by));


create policy "Enable select for users based on user_id"
on "public"."fuseTags"
as permissive
for select
to public
using ((auth.uid() = created_by));


create policy "Enable update for users based on user_id"
on "public"."fuseTags"
as permissive
for update
to public
using ((auth.uid() = created_by));



