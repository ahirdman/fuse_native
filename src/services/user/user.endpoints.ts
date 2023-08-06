import { api } from '../api';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateUserData: builder.mutation({
      async queryFn() {
        return {
          data: 'Not implemented',
        };
      },
    }),
  }),
  overrideExisting: false,
});
