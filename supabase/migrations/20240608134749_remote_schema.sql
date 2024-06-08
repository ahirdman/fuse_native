set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_fuse_tags_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        UPDATE public."fuseTags"
        SET updated_at = NEW.updated_at
        WHERE id IN (
            SELECT fuse_id
            FROM public.fusetagtags
            WHERE tag_id = NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER trigger_update_fuse_tags_updated_at AFTER UPDATE ON public.tags FOR EACH ROW EXECUTE FUNCTION update_fuse_tags_updated_at();


