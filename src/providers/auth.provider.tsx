import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase/supabase.init";
import useProtectedRoute from "@/hooks/useProtectedRoute";

import type { AuthSession } from "@supabase/supabase-js";
import type { ReactNode } from "react";
import { useAppDispatch } from "@/store/hooks";
import { signIn } from "@/store/user/user.slice";

interface AuthState {
  session: AuthSession | null | undefined;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function useAuth() {
  return useContext(AuthContext);
}

interface IAuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: IAuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null | undefined>(
    undefined,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    // TODO:
    // -- Retrive stored spotify token data
    // -- Retrive Subscription data

    void supabase.auth.getSession().then((fetchedSession) => {
      if (fetchedSession.data.session) {
        setSession(fetchedSession.data.session);
        console.log("Dispatching in getSession")
        dispatch(signIn({ id: fetchedSession.data.session.user.id }))
      }
    })

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);

        if (newSession?.user.id) {
          console.log("Dispatching in auth listner")
          dispatch(signIn({ id: newSession?.user.id}))
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  const value = useMemo(() => ({ session }), [session]);

  useProtectedRoute(session?.user);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
