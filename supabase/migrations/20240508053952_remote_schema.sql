alter table "public"."profiles" drop constraint "users_id_fkey";

alter table "public"."accounts" alter column "spotify_refresh_token" set not null;

alter table "public"."accounts" alter column "spotify_token_data" set not null;

alter table "public"."accounts" alter column "spotify_user_id" set not null;

alter table "public"."subscriptions" alter column "app_user_id" set not null;


