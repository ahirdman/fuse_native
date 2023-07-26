import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/dist/query/react';

export const supabaseApi = createApi({
  reducerPath: 'supabaseApi',
  baseQuery: fakeBaseQuery(),
  keepUnusedDataFor: 600,
  endpoints: () => ({}),
});
