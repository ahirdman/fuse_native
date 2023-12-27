import type { ApplicationConfiguration } from ".";

export const applicationConfiguration: ApplicationConfiguration = {
	supabase: {
		url: "http://127.0.0.1:54321",
		anonKey: "id",
	},
	spotify: {
		clientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
		baseUrl: "https://api.spotify.com/v1",
		authScope: [
			"user-read-email",
			"user-library-read",
			"user-read-private",
			"playlist-modify-public",
			"playlist-modify-private",
		],
	},
};
