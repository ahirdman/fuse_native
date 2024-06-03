revoke delete on table "public"."fuseTagTags" from "anon";

revoke insert on table "public"."fuseTagTags" from "anon";

revoke references on table "public"."fuseTagTags" from "anon";

revoke select on table "public"."fuseTagTags" from "anon";

revoke trigger on table "public"."fuseTagTags" from "anon";

revoke truncate on table "public"."fuseTagTags" from "anon";

revoke update on table "public"."fuseTagTags" from "anon";

revoke delete on table "public"."fuseTagTags" from "authenticated";

revoke insert on table "public"."fuseTagTags" from "authenticated";

revoke references on table "public"."fuseTagTags" from "authenticated";

revoke select on table "public"."fuseTagTags" from "authenticated";

revoke trigger on table "public"."fuseTagTags" from "authenticated";

revoke truncate on table "public"."fuseTagTags" from "authenticated";

revoke update on table "public"."fuseTagTags" from "authenticated";

revoke delete on table "public"."fuseTagTags" from "service_role";

revoke insert on table "public"."fuseTagTags" from "service_role";

revoke references on table "public"."fuseTagTags" from "service_role";

revoke select on table "public"."fuseTagTags" from "service_role";

revoke trigger on table "public"."fuseTagTags" from "service_role";

revoke truncate on table "public"."fuseTagTags" from "service_role";

revoke update on table "public"."fuseTagTags" from "service_role";

alter table "public"."fuseTagTags" drop constraint "public_fuseTagTags_fuse_id_fkey";

alter table "public"."fuseTagTags" drop constraint "public_fuseTagTags_tag_id_fkey";

alter table "public"."fuseTagTags" drop constraint "fuseTagTags_pkey";

drop index if exists "public"."fuseTagTags_pkey";

drop table "public"."fuseTagTags";

create table "public"."fusetagtags" (
    "fuse_id" integer not null,
    "tag_id" integer not null
);


alter table "public"."fusetagtags" enable row level security;

CREATE UNIQUE INDEX fusetagtags_pkey ON public.fusetagtags USING btree (fuse_id, tag_id);

alter table "public"."fusetagtags" add constraint "fusetagtags_pkey" PRIMARY KEY using index "fusetagtags_pkey";

alter table "public"."fusetagtags" add constraint "fusetagtags_fuse_id_fkey" FOREIGN KEY (fuse_id) REFERENCES "fuseTags"(id) not valid;

alter table "public"."fusetagtags" validate constraint "fusetagtags_fuse_id_fkey";

alter table "public"."fusetagtags" add constraint "fusetagtags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) not valid;

alter table "public"."fusetagtags" validate constraint "fusetagtags_tag_id_fkey";

grant delete on table "public"."fusetagtags" to "anon";

grant insert on table "public"."fusetagtags" to "anon";

grant references on table "public"."fusetagtags" to "anon";

grant select on table "public"."fusetagtags" to "anon";

grant trigger on table "public"."fusetagtags" to "anon";

grant truncate on table "public"."fusetagtags" to "anon";

grant update on table "public"."fusetagtags" to "anon";

grant delete on table "public"."fusetagtags" to "authenticated";

grant insert on table "public"."fusetagtags" to "authenticated";

grant references on table "public"."fusetagtags" to "authenticated";

grant select on table "public"."fusetagtags" to "authenticated";

grant trigger on table "public"."fusetagtags" to "authenticated";

grant truncate on table "public"."fusetagtags" to "authenticated";

grant update on table "public"."fusetagtags" to "authenticated";

grant delete on table "public"."fusetagtags" to "service_role";

grant insert on table "public"."fusetagtags" to "service_role";

grant references on table "public"."fusetagtags" to "service_role";

grant select on table "public"."fusetagtags" to "service_role";

grant trigger on table "public"."fusetagtags" to "service_role";

grant truncate on table "public"."fusetagtags" to "service_role";

grant update on table "public"."fusetagtags" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."fusetagtags"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read for users based on user_id"
on "public"."fusetagtags"
as permissive
for select
to public
using (true);



