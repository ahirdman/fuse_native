import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { z } from 'zod';

export const supabaseQueryError = z.object({
  message: z.string(),
  status: z.number(),
});

type SupabaseQueryError = z.infer<typeof supabaseQueryError>;

export const supabaseApi = createApi({
  reducerPath: 'supabaseApi',
  baseQuery: fakeBaseQuery<SupabaseQueryError>(),
  keepUnusedDataFor: 600,
  tagTypes: ['Tag', 'Track'],
  endpoints: () => ({}),
});
