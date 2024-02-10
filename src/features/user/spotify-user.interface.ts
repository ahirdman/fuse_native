export interface GetSpotifyUserProfileRes {
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
