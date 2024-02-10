import type { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';
import { supabaseApi } from 'services/supabase.api';

import type {
  AddTagToTrackArgs,
  CreateTagArgs,
  DeleteTagArgs,
  GetAllTagsArgs,
  GetTagsForTrackArgs,
  TagsWithTrackIdsQuery,
} from 'tag/tags.interface';

export const tagsApi = supabaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTagsForTrack: builder.query<Tables<'tags'>[], GetTagsForTrackArgs>({
      async queryFn({ trackId }) {
        const { data, error } = await supabase
          .from('trackTags')
          .select('tags(*)')
          .eq('track_id', trackId);

        if (error) {
          return {
            error: {
              message: error.message,
              status: 500,
            },
          };
        }

        const transformedData = data
          .map((item) => item.tags)
          .filter((item): item is NonNullable<Tables<'tags'>> => item !== null);

        return {
          data: [...transformedData],
        };
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Tag' as const, id })), 'Tag']
          : ['Tag'],
    }),
    getAllTags: builder.query<TagsWithTrackIdsQuery[], GetAllTagsArgs>({
      async queryFn({ exclude }) {
        const { data, error } = await supabase
          .from('tags_with_track_ids')
          .select()
          .returns<TagsWithTrackIdsQuery[]>();

        if (error) {
          return {
            error: {
              message: error.message,
              status: 500,
            },
          };
        }

        if (exclude?.trackId) {
          return {
            data: data.filter(
              (tag) =>
                !tag.track_ids?.some((trackId) => trackId === exclude.trackId),
            ),
          };
        }

        return { data };
      },
      providesTags: ['Tag'],
    }),
    createTag: builder.mutation<Tables<'tags'>, CreateTagArgs>({
      async queryFn({ color, name, track }) {
        const { data, error } = await supabase
          .from('tags')
          .select()
          .eq('name', name);

        if ((data !== null && data.length > 0) || error) {
          return {
            error: error
              ? {
                  message: error.message,
                  status: 500,
                }
              : {
                  message: 'Something went wrong',
                  status: 500,
                },
          };
        }

        const { data: tag, error: tagError } = await supabase // Create tag - not needed if tag already exitst
          .from('tags')
          .upsert({ color, name })
          .eq('name', name)
          .select()
          .single();

        if (tagError) {
          return {
            error: {
              message: tagError.message,
              status: 500,
            },
          };
        }

        const albumCoversUrls = track.albumCovers.map((cover) => cover.url);

        const { data: trackData, error: trackError } = await supabase // Add track to Track table if not needed
          .from('tracks')
          .upsert(
            {
              id: track.id,
              artist: track.artist,
              name: track.name,
              explicit: track.explicit,
              duration: track.duration,
              album: track.album,
              album_covers: albumCoversUrls,
              uri: track.uri,
            },
            { onConflict: 'id' },
          )
          .select()
          .single();

        if (trackError) {
          return {
            error: {
              message: trackError.message,
              status: 500,
            },
          };
        }

        const { error: trackTagsError } = await supabase // Create row in junction table
          .from('trackTags')
          .insert({
            tag_id: tag.id,
            track_id: trackData.id,
          });

        if (trackTagsError) {
          return {
            error: {
              message: trackTagsError.message,
              status: 500,
            },
          };
        }

        return { data: tag };
      },
      invalidatesTags: ['Tag'],
    }),
    addTagToTrack: builder.mutation<string, AddTagToTrackArgs>({
      async queryFn({ track, tagId }) {
        const albumCoversUrls = track.albumCovers.map((cover) => cover.url);

        const { data: trackData, error: trackError } = await supabase
          .from('tracks')
          .upsert(
            {
              id: track.id,
              artist: track.artist,
              name: track.name,
              explicit: track.explicit,
              duration: track.duration,
              album: track.album,
              album_covers: albumCoversUrls,
              uri: track.uri,
            },
            { onConflict: 'id' },
          )
          .select()
          .single();

        if (trackError) {
          return {
            error: {
              message: trackError.message,
              status: 500,
            },
          };
        }

        //TODO: Error or disable if track is already tagged with same name (or better value?)

        const { error } = await supabase
          .from('trackTags')
          .upsert(
            { track_id: trackData.id, tag_id: tagId },
            { onConflict: 'id' },
          );

        if (error) {
          return {
            error: {
              message: error.message,
              status: 500,
            },
          };
        }

        const { error: updatedAtError } = await supabase
          .from('tags')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', tagId);

        if (updatedAtError) {
          return {
            error: {
              message: updatedAtError.message,
              status: 500,
            },
          };
        }

        return { data: 'ok' };
      },
      invalidatesTags: ['Tag', 'Track'],
    }),
    deleteTagFromTrack: builder.mutation<string, DeleteTagArgs>({
      async queryFn({ tagId, trackId }) {
        const { error } = await supabase
          .from('trackTags')
          .delete()
          .eq('tag_id', tagId)
          .eq('track_id', trackId);

        if (error) {
          return {
            error: {
              message: error.message,
              status: 500,
            },
          };
        }

        const { error: updatedAtError } = await supabase
          .from('tags')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', tagId);

        if (updatedAtError) {
          return {
            error: {
              message: updatedAtError.message,
              status: 500,
            },
          };
        }

        return { data: 'ok' };
      },
      invalidatesTags: ['Tag'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllTagsQuery,
  useGetTagsForTrackQuery,
  useCreateTagMutation,
  useDeleteTagFromTrackMutation,
  useAddTagToTrackMutation,
} = tagsApi;
