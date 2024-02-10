import Purchases from 'react-native-purchases';

import { handleAuthStateSignIn } from 'lib/auth';
import { supabase } from 'lib/supabase/supabase.init';
import { supabaseApi } from 'services/supabase.api';

import type {
  ResetPasswordInput,
  SignInInput,
  SignUpRequest,
  SupaBaseAuthRes,
} from 'user/auth.interface';
import { signIn, signOut } from 'user/user.slice';

export const authApi = supabaseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<SupaBaseAuthRes, SignInInput>({
      async queryFn({ email, password }, api) {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return {
            error: {
              message: error.message,
              status: error.status ?? 500,
            },
          };
        }

        await handleAuthStateSignIn(data.session, api.dispatch);

        return { data };
      },
    }),

    signUp: builder.mutation<SupaBaseAuthRes, SignUpRequest>({
      async queryFn({ email, password }, api) {
        const { error, data } = await supabase.auth.signUp({ email, password });

        if (error) {
          return {
            error: {
              message: error.message,
              status: error.status ?? 500,
            },
          };
        }

        if (data.session === null || data.user === null) {
          return {
            error: {
              message: 'Session was null',
              status: 500,
            },
          };
        }

        api.dispatch(
          signIn({ id: data.session.user.id, email: data.session.user.email }),
        );

        return {
          data: {
            user: data.user,
            session: data.session,
          },
        };
      },
    }),
    signOut: builder.query({
      async queryFn(_, api) {
        const { error } = await supabase.auth.signOut();

        if (error) {
          return {
            error: {
              message: error.message,
              status: error.status ?? 500,
            },
          };
        }

        await Purchases.logOut();

        api.dispatch(signOut());

        return { data: 'OK' };
      },
    }),

    resetPassword: builder.mutation({
      async queryFn({ email }: ResetPasswordInput) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
          return {
            error: {
              message: error.message,
              status: error.status ?? 500,
            },
          };
        }

        return { data: 'OK' };
      },
    }),

    updatePassword: builder.mutation({
      async queryFn({ currentPassword, newPassword }: UpdatePasswordArgs) {
        const { error } = await supabase.rpc('change_user_password', {
          current_plain_password: currentPassword,
          new_plain_password: newPassword,
        });

        if (error) {
          return {
            error: {
              message: error.message,
              status: 500,
            },
          };
        }

        return { data: 'OK' };
      },
    }),
  }),
  overrideExisting: false,
});

interface UpdatePasswordArgs {
  currentPassword: string;
  newPassword: string;
}

export const {
  useSignInMutation,
  useSignUpMutation,
  useLazySignOutQuery,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
} = authApi;
