create type "public"."tag_type" as enum ('fuse', 'tag');

alter table "public"."fuseTags" add column "type" tag_type not null default 'fuse'::tag_type;

alter table "public"."tags" add column "type" tag_type not null default 'tag'::tag_type;


