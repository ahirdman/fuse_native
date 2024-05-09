set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_user()
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  delete from storage.objects where owner = auth.uid();
  delete from auth.users where id = auth.uid();
$function$
;

CREATE OR REPLACE FUNCTION public.delete_user_with_verification(password character varying)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Attempt to find a matching user with the correct password
  PERFORM id
  FROM auth.users
  WHERE id = auth.uid()
  AND encrypted_password = crypt(password::text, auth.users.encrypted_password);

  -- Check the correct password
  IF NOT FOUND THEN
    RAISE EXCEPTION 'incorrect password';
  END IF;

  DELETE FROM storage.objects WHERE owner = auth.uid();
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$function$
;


