create or replace view "public"."track_tags_view" as  SELECT DISTINCT "trackTags".track_id,
    "trackTags".user_id
   FROM "trackTags";


CREATE TRIGGER "Friend Request Notification" AFTER INSERT OR UPDATE ON public.friend_requests FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('http://host.docker.internal:54321/functions/v1/friend-request-notification', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"}', '{}', '1000');


