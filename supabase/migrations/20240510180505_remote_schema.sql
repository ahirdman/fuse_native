create type "public"."relation_type" as enum ('friend', 'requested_by', 'requested_to', 'none');

drop view if exists "public"."users_with_relation";

create or replace view "public"."users_with_relation" as  SELECT p.id,
    p.name,
    p.avatar_url,
        CASE
            WHEN (fr.status = 'accepted'::friend_request_status) THEN 'friend'::relation_type
            WHEN ((fr.status = 'pending'::friend_request_status) AND (fr.receiver_user_id = auth.uid())) THEN 'requested_by'::relation_type
            WHEN ((fr.status = 'pending'::friend_request_status) AND (fr.sender_user_id = auth.uid())) THEN 'requested_to'::relation_type
            ELSE 'none'::relation_type
        END AS relation
   FROM (profiles p
     LEFT JOIN friend_requests fr ON ((((fr.sender_user_id = p.id) OR (fr.receiver_user_id = p.id)) AND ((fr.sender_user_id = auth.uid()) OR (fr.receiver_user_id = auth.uid())))))
  WHERE (p.id <> auth.uid());



