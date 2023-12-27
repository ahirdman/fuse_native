
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.users (id)
  values (new.id);
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "color" "text" NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "latest_snapshot_id" "text",
    "spotify_playlist_id" "text",
    "spotify_playlist_uri" "text",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."tags" OWNER TO "postgres";

ALTER TABLE "public"."tags" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."tags_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."trackTags" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "tag_id" bigint NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "track_id" "text" NOT NULL
);

ALTER TABLE "public"."trackTags" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."tags_with_track_ids" WITH ("security_invoker"='true') AS
 SELECT "tags"."id",
    "tags"."created_at",
    "tags"."name",
    "tags"."color",
    "tags"."user_id",
    "array_agg"("trackTags"."track_id") FILTER (WHERE ("trackTags"."track_id" IS NOT NULL)) AS "track_ids"
   FROM ("public"."tags"
     LEFT JOIN "public"."trackTags" ON (("tags"."id" = "trackTags"."tag_id")))
  GROUP BY "tags"."id", "tags"."created_at", "tags"."name", "tags"."color", "tags"."user_id";

ALTER TABLE "public"."tags_with_track_ids" OWNER TO "postgres";

ALTER TABLE "public"."trackTags" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."trackTags_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."tracks" (
    "name" "text",
    "artist" "text",
    "id" "text" NOT NULL,
    "explicit" boolean DEFAULT false NOT NULL,
    "album" "text",
    "duration" bigint NOT NULL,
    "album_covers" "text"[],
    "uri" "text" DEFAULT ''::"text" NOT NULL
);

ALTER TABLE "public"."tracks" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "spotify_refresh_token" "text",
    "spotify_token_data" "jsonb",
    "is_subscribed" boolean,
    "spotify_user_id" "text"
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."trackTags"
    ADD CONSTRAINT "trackTags_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tracks"
    ADD CONSTRAINT "tracks_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."trackTags"
    ADD CONSTRAINT "trackTags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."trackTags"
    ADD CONSTRAINT "trackTags_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id");

ALTER TABLE ONLY "public"."trackTags"
    ADD CONSTRAINT "trackTags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

CREATE POLICY "Enable all actions for authenticated users only" ON "public"."tracks" TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "Enable all actions for users based on user_id" ON "public"."users" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."tags" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."trackTags" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."tags" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."trackTags" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON "public"."trackTags" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable select for users based on user_id" ON "public"."tags" FOR SELECT USING (("auth"."uid"() = "user_id"));

ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."trackTags" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tracks" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";

GRANT ALL ON SEQUENCE "public"."tags_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tags_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tags_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."trackTags" TO "anon";
GRANT ALL ON TABLE "public"."trackTags" TO "authenticated";
GRANT ALL ON TABLE "public"."trackTags" TO "service_role";

GRANT ALL ON TABLE "public"."tags_with_track_ids" TO "anon";
GRANT ALL ON TABLE "public"."tags_with_track_ids" TO "authenticated";
GRANT ALL ON TABLE "public"."tags_with_track_ids" TO "service_role";

GRANT ALL ON SEQUENCE "public"."trackTags_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."trackTags_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."trackTags_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."tracks" TO "anon";
GRANT ALL ON TABLE "public"."tracks" TO "authenticated";
GRANT ALL ON TABLE "public"."tracks" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
