import type { SpotifyTrack } from 'track/tracks.interface';

export interface GetTagsForTrackArgs {
  trackId: string;
}

export interface CreateTagArgs {
  color: string;
  name: string;
  track: SpotifyTrack;
}

export interface DeleteTagArgs {
  tagId: number;
  trackId: string;
}

export interface AddTagToTrackArgs {
  track: SpotifyTrack;
  tagId: number;
}

export interface GetAllTagsArgs {
  exclude?: {
    trackId?: string;
  };
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

export interface Tag {
  tagId: number;
  name: string;
  color: string;
}
