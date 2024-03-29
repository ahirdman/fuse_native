export interface SpotifyTrack {
  id: string;
  uri: string;
  addedAt?: string | undefined;
  artist?: string | undefined;
  albumCovers: SpotifyAlbumImage[];
  album: string;
  name: string;
  explicit: boolean;
  duration: number;
  isTagged?: boolean;
}

/*
 * Data Transfer Objects
 * */

export interface UserSavedTracksDto {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: UserSavedTrackDto[];
}

export interface UserSavedTrackDto {
  added_at: string;
  track: SpotifyTrackDto;
}

export interface SpotifyTrackDto {
  name: string;
  album: {
    images: SpotifyAlbumImage[];
    name: string;
  };
  artists: SpotifyArtistDto[];
  id: string;
  uri: string;
  explicit: boolean;
  duration_ms: number;
}

interface SpotifyAlbumImage {
  url: string;
  height: number | null;
  width: number | null;
}

interface SpotifyArtistDto {
  name: string;
}
