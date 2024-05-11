create or replace view "public"."users_with_relation" as  SELECT p.id,
    p.name,
    p.avatar_url,
        CASE
            WHEN (fr.status = 'accepted'::friend_request_status) THEN 'friend'::text
            WHEN ((fr.status = 'pending'::friend_request_status) AND (fr.receiver_user_id = auth.uid())) THEN 'requested_by'::text
            WHEN ((fr.status = 'pending'::friend_request_status) AND (fr.sender_user_id = auth.uid())) THEN 'requested_to'::text
            ELSE 'none'::text
        END AS relation
   FROM (profiles p
     LEFT JOIN friend_requests fr ON ((((fr.sender_user_id = p.id) OR (fr.receiver_user_id = p.id)) AND ((fr.sender_user_id = auth.uid()) OR (fr.receiver_user_id = auth.uid())))))
  WHERE (p.id <> auth.uid());



