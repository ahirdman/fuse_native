import { api } from '../api';

import { AuthError } from './auth.model';

import { supabase } from '@/lib/supabase/supabase.init';
import { catchException } from '@/lib/sentry/sentry.exceptions';
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
      async queryFn({ email, password }, baseQueryApi) {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return new AuthError({
            status: error.status,
            message: error.message,
          }).toJSON();
        }

        const userData = await selectUserData();

        if (userData && isBoolean(userData.is_subscribed)) {
          baseQueryApi.dispatch(
            setSubscription({ subscribed: userData.is_subscribed }),
          );
        }

        if (userData && isBoolean(userData.is_subscribed)) {
          const tokenData = userData.spotify_token_data as SpotifyToken;
          baseQueryApi.dispatch(setToken(tokenData));
        }

        return { data };
      },
    }),
    signOut: builder.query({
      async queryFn(_, baseQueryApi) {
        const { error } = await supabase.auth.signOut();

        if (error) {
          catchException(error);

          return new AuthError({
            status: error.status,
            message: error.message,
          }).toJSON();
        }

        baseQueryApi.dispatch(signOut());

        return { data: 'OK' };
      },
    }),
    signUp: builder.mutation<SupaBaseAuthRes, SignUpRequest>({
      async queryFn({ email, password }) {
        const { error, data } = await supabase.auth.signUp({ email, password });

        if (error) {
          return new AuthError({
            status: error.status,
            message: error.message,
          }).toJSON();
        }

        return { data };
      },
    }),
    resetPassword: builder.mutation({
      async queryFn({ email }: ResetPasswordInput) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
          return new AuthError({
            status: error.status,
            message: error.message,
          }).toJSON();
        }

        return { data: 'OK' };
      },
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useLazySignOutQuery,
  useResetPasswordMutation,
} = authApi;
