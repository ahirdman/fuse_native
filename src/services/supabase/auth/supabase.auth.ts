import { supabaseApi } from '../supabase.api';

import { AuthError } from './supabase.model';

import { supabase } from '@/lib/supabase/supabase.init';
import { catchException } from '@/lib/sentry/sentry.exceptions';

import type {
  ResetPasswordInput,
  SignInInput,
  SignUpRequest,
  SupaBaseAuthRes,
} from './supabase.interface';
import { signOut } from '@/store/user/user.slice';
import { clearSecureItem } from '@/lib/expo/expo.secure';

export const authApi = supabaseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<SupaBaseAuthRes, SignInInput>({
      async queryFn({ email, password }) {
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

        return { data };
      },
    }),
    signOut: builder.query({
      async queryFn(_arg, api) {
        const { error } = await supabase.auth.signOut();

        if (error) {
          catchException(error);

          return new AuthError({
            status: error.status,
            message: error.message,
          }).toJSON();
        }

        api.dispatch(signOut())
        await clearSecureItem("SPOTIFY_REFRESH_TOKEN")

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
