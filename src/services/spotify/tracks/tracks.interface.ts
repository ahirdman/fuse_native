export interface UserTracksReq {
	market?: string | undefined;
	limit?: number | undefined;
	offset: number;
}

export interface UserSavedTracksRes {
	total: number;
	items: SpotifyTrack[];
}

export interface SpotifyTrack {
	id: string;
	addedAt?: string | undefined;
	artist?: string | undefined;
	albumCovers: SpotifyAlbumImage[];
	albumName: string;
	name: string;
	explicit: boolean;
	duration: number;
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

interface SpotifyTrackDto {
	name: string;
	album: {
		images: SpotifyAlbumImage[];
		name: string;
	};
	artists: SpotifyArtistDto[];
	id: string;
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
