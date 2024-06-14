import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'lib/query/init';
import type { Tables } from 'lib/supabase/database-generated.types';
import { supabase } from 'lib/supabase/supabase.init';
import { tagKeys } from 'tag/queries/keys';
import { showToast } from 'util/toast';

interface AddTracksToTagArgs {
  trackIds: string[];
  tagId: number;
}

async function addTracksToTag({ trackIds, tagId }: AddTracksToTagArgs) {
  //TODO: Error if row exists already!

  const rowsToAdd: Pick<Tables<'trackTags'>, 'track_id' | 'tag_id'>[] =
    trackIds.map((id) => ({ track_id: id, tag_id: tagId }));

  const { error } = await supabase
    .from('trackTags')
    .upsert(rowsToAdd, { onConflict: 'id' });

  if (error) throw error;

  const { error: updatedAtError } = await supabase
    .from('tags')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', tagId);

  if (updatedAtError) {
    throw new Error(updatedAtError.message);
  }
}

export const useAddTracksToTag = () =>
  useMutation({
    mutationFn: addTracksToTag,
    onError: () => {
      showToast({ title: 'Could not add tracks to tag', preset: 'error' });
    },
    onSuccess(_, args) {
      queryClient.invalidateQueries({
        queryKey: tagKeys.tracks(args.tagId),
      });
    },
  });
