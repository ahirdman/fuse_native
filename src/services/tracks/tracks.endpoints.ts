import { createEntityAdapter } from '@reduxjs/toolkit';

import { api } from '../api';

import type {
  UserTracksReq,
  UserTracksDTO,
  SavedTrack,
} from './tracks.interface';

export const userTracksAdapter = createEntityAdapter<SavedTrack>({
  selectId: (item: SavedTrack) => item.track.id,
});

export const userTracksSelector = userTracksAdapter.getSelectors();

export const tracksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserSavedTracks: builder.query({
      query: ({ limit, offset }: UserTracksReq) =>
        `/me/tracks?offset=${offset}&limit=${limit}`,
      keepUnusedDataFor: 600,
      transformResponse: (response: UserTracksDTO) => {
        const formattedSavedTracks: SavedTrack[] = response.items.map(
          (item) => ({
            added_at: item.added_at,
            track: {
              mainArtist: item.track.artists[0]?.name,
              albumImageUrl: item.track.album.images[2]?.url,
              albumName: item.track.album.name,
              name: item.track.name,
              id: item.track.id,
            },
          }),
        );

        return userTracksAdapter.setAll(
          userTracksAdapter.getInitialState(),
          formattedSavedTracks,
        );
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg?.offset !== previousArg?.offset;
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.limit}`;
      },
      merge: (currentState, incomingState) => {
        userTracksAdapter.addMany(
          currentState,
          userTracksSelector.selectAll(incomingState),
        );
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetUserSavedTracksQuery } = tracksApi;
