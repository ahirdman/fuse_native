import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

import { config } from '@/config';

import type { RootState } from '@/store/store';

const baseQuery = fetchBaseQuery({
  baseUrl: config.spotify.baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.token?.accessToken;

    //TODO: Only set bearer token for spotify requests
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  keepUnusedDataFor: 600,
  endpoints: () => ({}),
});
