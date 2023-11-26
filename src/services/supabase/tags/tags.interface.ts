import type { SpotifyTrack } from '@/services/spotify/tracks/tracks.interface';

export interface GetTagsForTrackArgs {
  trackId: string;
}

export interface CreateTagArgs {
  color: string;
  name: string;
  track: Pick<SpotifyTrack, 'id' | 'artist' | 'name'>;
}

export interface DeleteTagArgs {
  tagId: number;
}

export interface UpdateTagArgs {
  tagId: number;
}

export interface AddTagToTrackArgs {
  track: Pick<SpotifyTrack, 'id' | 'artist' | 'name'>;
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
  id: number;
  name: string;
  track_ids: string[] | null;
  user_id: string;
};


