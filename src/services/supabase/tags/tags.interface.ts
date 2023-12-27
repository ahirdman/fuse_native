import type { SpotifyTrack } from '@/services/spotify/tracks/tracks.interface';

export interface GetTagsForTrackArgs {
  trackId: string;
}

export interface CreateTagArgs {
  color: string;
  name: string;
  track: SpotifyTrack
}

export interface DeleteTagArgs {
  tagId: number;
}

export interface UpdateTagArgs {
  tagId: number;
  name?: string | undefined
  color?: string | undefined
}

export interface AddTagToTrackArgs {
  track: SpotifyTrack;
  tagId: number;
}

export interface GetAllTagsArgs {
  exclude?: {
    trackId?: string;
  }
}

export type TagsWithTrackIdsQuery = {
  color: string;
  created_at: string;
  latest_snapshot_id: string;
  id: number;
  name: string;
  track_ids: string[] | null;
  user_id: string;
};


