import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/dist/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  keepUnusedDataFor: 600,
  endpoints: () => ({}),
});
