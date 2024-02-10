import { supabase } from 'lib/supabase/supabase.init';
import { store } from 'store';

import { useMutation } from '@tanstack/react-query';
import { spotifyService } from 'services/spotifyv2.api';
import { selectSpotifyUserId } from 'user/user.slice';
import { showToast } from 'util/toast';

export async function isLatestSnapshotId(
  playlistId: string,
  snapshotId: string,
): Promise<boolean> {
  const result = await spotifyService.get<{ snapshot_id: string }>(
    `/playlists/${playlistId}?fields=snapshot_id`,
  );

  return result.data.snapshot_id === snapshotId;
}

interface SyncTagPlatlistArgs {
  name: string;
  description?: string;
  tracks: string[];
  tagId: string;
  playlistId?: string | null;
  snapshot_id?: string | null;
}

interface SyncTagPlaylistRes {
  id: string;
  snapshot_id: string;
  uri?: string | undefined;
}

async function syncTagPlaylist(
  args: SyncTagPlatlistArgs,
): Promise<SyncTagPlaylistRes> {
  try {
    const userId = selectSpotifyUserId(store.getState());

    if (!userId) {
      throw new Error('Spotify User Id was undefined');
    }

    if (!args.playlistId) {
      throw new Error('Playlist Id was not supplied');
    }

    const { data } = await spotifyService.put<{ snapshot_id: string }>(
      `/playlists/${args.playlistId}/tracks`,
      {
        uris: args.tracks,
      },
    );

    const { error } = await supabase
      .from('tags')
      .update({
        latest_snapshot_id: data.snapshot_id,
        synced_at: new Date().toISOString().toLocaleString(),
      })
      .eq('id', args.tagId);

    if (error) {
      throw new Error('Error updating tag');
    }

    return {
      snapshot_id: data.snapshot_id,
      id: args.playlistId,
    };
  } catch (_error) {
    throw new Error('Something went wrong');
  }
}

async function exportTagPlaylist(
  args: SyncTagPlatlistArgs,
): Promise<SyncTagPlaylistRes> {
  try {
    const userId = selectSpotifyUserId(store.getState());

    if (!userId) {
      throw new Error('Spotify User Id was undefined');
    }

    const { data: playlist } = await spotifyService.post<SyncTagPlaylistRes>(
      `/users/${userId}/playlists`,
      {
        name: args.name,
        description: args.description,
      },
    );

    const { data } = await spotifyService.post<{ snapshot_id: string }>(
      `/playlists/${playlist.id}/tracks`,
      {
        uris: args.tracks,
      },
    );

    const { error } = await supabase
      .from('tags')
      .update({
        latest_snapshot_id: data.snapshot_id,
        spotify_playlist_id: playlist.id,
        spotify_playlist_uri: playlist.uri,
        synced_at: new Date().toISOString().toLocaleString(),
      })
      .eq('id', args.tagId);

    if (error) {
      throw new Error('Error updating tag');
    }

    return {
      snapshot_id: data.snapshot_id,
      id: playlist.id,
      uri: playlist.uri,
    };
  } catch (_error) {
    throw new Error('Something went wrong');
  }
}

export type TagSyncStatus = 'Unexported' | 'Unsynced' | 'Synced';

interface UseSyncPlaylistArgs {
  tagStatus?: TagSyncStatus | undefined;
}

export const useSyncPlaylist = ({ tagStatus }: UseSyncPlaylistArgs) =>
  useMutation({
    mutationFn:
      tagStatus === 'Unexported' ? exportTagPlaylist : syncTagPlaylist,
    onError: () => {
      showToast({
        title: 'Something went wrong',
        preset: 'error',
        message: 'Could not create playlist',
      });
    },
  });
