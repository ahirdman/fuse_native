import axios from 'axios';
import { config } from 'config';

export const spotifyService = axios.create({
  baseURL: config.spotify.baseUrl,
  timeout: 1000,
});
