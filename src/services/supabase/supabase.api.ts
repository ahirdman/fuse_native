import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { AuthError, PostgrestError } from '@supabase/supabase-js';

export const supabaseApi = createApi({
  reducerPath: 'supabaseApi',
  baseQuery:  fakeBaseQuery<PostgrestError | AuthError>(),
  keepUnusedDataFor: 600,
  tagTypes: ['Tag', 'Track'],
  endpoints: () => ({}),
});
