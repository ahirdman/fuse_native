import { api } from '../api';

import { supabase } from '@/lib/supabase/supabase.init';
import { setSubscription, setToken, signOut } from '@/store/user/user.slice';
import { selectUserData } from '@/lib/supabase/supabase.queries';
import { isBoolean } from '@/lib/util/assert';

import type { SpotifyToken } from '@/store/user/user.interface';
import type {
  ResetPasswordInput,
  SignInInput,
  SignUpRequest,
  SupaBaseAuthRes,
} from './auth.interface';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<SupaBaseAuthRes, SignInInput>({
      async queryFn({ email, password }, queryApi) {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return {
            error: {
              status: error.status ?? 500,
              statusText: error.name,
              data: error.message,
            },
          };
        }

        const userData = await selectUserData();

        if (userData && isBoolean(userData.is_subscribed)) {
          queryApi.dispatch(
            setSubscription({ subscribed: userData.is_subscribed }),
          );
        }

        if (userData && isBoolean(userData.is_subscribed)) {
          const tokenData = userData.spotify_token_data as SpotifyToken;
          queryApi.dispatch(setToken(tokenData));
        }

        return { data };
      },
    }),

    signUp: builder.mutation<SupaBaseAuthRes, SignUpRequest>({
      async queryFn({ email, password }) {
        const { error, data } = await supabase.auth.signUp({ email, password });

        if (error) {
          return {
            error: {
              status: error.status ?? 500,
              statusText: error.name,
              data: error.message,
            },
          };
        }

        if (data.session === null || data.user === null) {
          return {
            error: {
              status: 500,
              statusText: 'User data is null',
              data: 'Null data returned',
            },
          };
        }

        return {
          data: {
            user: data.user,
            session: data.session,
          },
        };
      },
    }),

    signOut: builder.query<string, void>({
      async queryFn(_, baseQueryApi) {
        const { error } = await supabase.auth.signOut();

        if (error) {
          return {
            error: {
              status: error.status ?? 500,
              statusText: error.name,
              data: error.message,
            },
          };
        }

        baseQueryApi.dispatch(signOut());

        return { data: 'OK' };
      },
    }),

    resetPassword: builder.mutation({
      async queryFn({ email }: ResetPasswordInput) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
          return {
            error: {
              status: error.status ?? 500,
              statusText: error.name,
              data: error.message,
            },
          };
        }

        return { data: 'OK' };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useLazySignOutQuery,
  useResetPasswordMutation,
} = authApi;
