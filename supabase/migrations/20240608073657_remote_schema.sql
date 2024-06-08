alter table "public"."fusetagtags" drop constraint "fusetagtags_fuse_id_fkey";

alter table "public"."fusetagtags" drop constraint "fusetagtags_tag_id_fkey";

alter table "public"."fuseTags" drop column "tag_id";

alter table "public"."fuseTags" drop column "tag_id_1";

alter table "public"."fusetagtags" add constraint "public_fusetagtags_fuse_id_fkey" FOREIGN KEY (fuse_id) REFERENCES "fuseTags"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."fusetagtags" validate constraint "public_fusetagtags_fuse_id_fkey";

alter table "public"."fusetagtags" add constraint "public_fusetagtags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."fusetagtags" validate constraint "public_fusetagtags_tag_id_fkey";


