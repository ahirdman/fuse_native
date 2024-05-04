import { spotifyService } from 'services/spotify.api';

interface GetSpotifyUserRes {
  id: string;
  product: string;
  uri: string;
  email: string;
  display_name: string;
  country: string;
  followers: {
    total: number;
  };
  images: SpotifyUserImage[];
}

interface SpotifyUserImage {
  url: string;
  height: number | null;
  width: number | null;
}

async function getSpotifyUser(token?: string | undefined) {
  const result = await spotifyService.get<GetSpotifyUserRes>('/me', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return result.data;
}

export { getSpotifyUser };
