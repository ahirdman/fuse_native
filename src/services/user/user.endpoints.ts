import { api } from '../api';

import { supabase } from '@/lib/supabase/supabase.init';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateUserData: builder.mutation({
      async queryFn() {
        const { data, error } = await supabase
          .from('Users')
          .insert([{ some_column: 'someValue', other_column: 'otherValue' }])
          .select();

        if (error) {
          return {
            error: {
              data: {
                message: 'Could not read user data',
              },
            },
          };
        }

        return { data };
      },
    }),
  }),
});
