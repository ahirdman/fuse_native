import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'lib/query/init';
import type { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';
import { showToast } from 'util/toast';

import { tagKeys } from 'tag/queries/keys';
import { trackTagKeys } from 'track/queries/keys';

interface AddTagToTrackArgs {
  trackId: string;
  tagIds: number[];
  userId: string;
}

async function addTagToTrack({ trackId, tagIds }: AddTagToTrackArgs) {
  //TODO: Error or disable if track is already tagged with same name (or better value?)

  const rowsToAdd: Pick<Tables<'trackTags'>, 'track_id' | 'tag_id'>[] =
    tagIds.map((id) => ({ track_id: trackId, tag_id: id }));

  const { error } = await supabase
    .from('trackTags')
    .upsert(rowsToAdd, { onConflict: 'id' });

  if (error) {
    throw new Error(error.message);
  }

  const { error: updatedAtError } = await supabase
    .from('tags')
    .update({ updated_at: new Date().toISOString() })
    .in('id', tagIds);

  if (updatedAtError) {
    throw new Error(updatedAtError.message);
  }
}

export const useAddTagToTrack = () =>
  useMutation({
    mutationFn: addTagToTrack,
    onError: () => {
      showToast({
        title: 'Something went wrong',
        preset: 'error',
        message: 'Could not add tag to track',
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: trackTagKeys.list(),
      });

      queryClient.invalidateQueries({
        queryKey: tagKeys.list(variables.userId, variables.trackId),
      });
    },
  });
