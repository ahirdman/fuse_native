import { supabaseApi } from "../supabase.api";

import { supabase } from "@/lib/supabase/supabase.init";
import { signIn, signOut } from "@/store/user/user.slice";

import type {
  ResetPasswordInput,
  SignInInput,
  SignUpRequest,
  SupaBaseAuthRes,
} from "./auth.interface";
import { handleAuthStateSignIn } from "@/lib/auth";

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
              status: error.status ?? 500
            }
          };
        }

        await handleAuthStateSignIn(data.session, api.dispatch)

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
              status: error.status ?? 500
            }
          };
        }

        if (data.session === null || data.user === null) {
          return {
            error: {
              message: "Session was null",
              status: 500
            }
          };
        }

        api.dispatch(signIn({ id: data.session.user.id }))

        return {
          data: {
            user: data.user,
            session: data.session,
          },
        };
      },
    }),

    signOut: builder.query<string, void>({
      async queryFn(_, api) {
        const { error } = await supabase.auth.signOut();

        if (error) {
          return {
            error: {
              message: error.message,
              status: error.status ?? 500
            }
          };
        }

        api.dispatch(signOut());

        return { data: "OK" };
      },
    }),

    resetPassword: builder.mutation({
      async queryFn({ email }: ResetPasswordInput) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
          return {
            error: {
              message: error.message,
              status: error.status ?? 500
            }
          };
        }

        return { data: "OK" };
      },
    }),

    updatePassword: builder.mutation({
      async queryFn({ currentPassword, newPassword }: UpdatePasswordArgs) {
        const { error } = await supabase.rpc("change_user_password", { current_plain_password: currentPassword, new_plain_password: newPassword })

        if (error) {
          return {
            error: {
              message: error.message,
              status: 500
            }
          }
        }

        return { data: "OK" }
      }
    })

  }),
  overrideExisting: false,
});

interface UpdatePasswordArgs {
  currentPassword: string
  newPassword: string
}

export const {
  useSignInMutation,
  useSignUpMutation,
  useLazySignOutQuery,
  useResetPasswordMutation,
  useUpdatePasswordMutation
} = authApi;
