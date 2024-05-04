import { type ReactNode, createContext, useContext, useReducer } from 'react';

import type { SpotifyToken, User } from 'auth/auth.interface';
import type { Profile } from 'auth/queries/createProfile';
import type { MakePurchaseRes } from 'subscription/queries/useSubscription';

interface SpotifyCredentials {
  tokenData: SpotifyToken;
  spotifyUserId: string;
}

interface State {
  user?: User | undefined;
  profile?: Profile | undefined;
  spotifyTokenData?: SpotifyCredentials | undefined;
  subscription?: MakePurchaseRes | undefined;
}

type Action =
  | { type: 'submitUser'; payload: User }
  | { type: 'submitProfile'; payload: Profile }
  | { type: 'submitSpotifyToken'; payload: SpotifyCredentials }
  | { type: 'submitSubscription'; payload: MakePurchaseRes }
  | { type: 'cancel' };

interface SignUpContext {
  state: State;
  dispatch(action: Action): void;
  nextPage(): void;
}

interface SignUpProviderProps {
  children: ReactNode;
  nextPage(): void;
}

const SignUpContext = createContext<SignUpContext | undefined>(undefined);

function signUpReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'submitUser':
      return { ...state, user: action.payload };

    case 'submitProfile': {
      return { ...state, profile: action.payload };
    }

    case 'submitSpotifyToken': {
      return { ...state, spotifyTokenData: action.payload };
    }

    case 'submitSubscription': {
      return { ...state, subscription: action.payload };
    }

    case 'cancel': {
      return {
        ...state,
        user: undefined,
        profile: undefined,
        spotifyTokenData: undefined,
        subscription: undefined,
      };
    }

    default:
      throw new Error(`Unrecognized action. Recived: [${action}]`);
  }
}

function SignUpProvider({ children, nextPage }: SignUpProviderProps) {
  const [state, dispatch] = useReducer(signUpReducer, {
    user: undefined,
    spotifyTokenData: undefined,
    subscription: undefined,
  });

  return (
    <SignUpContext.Provider value={{ state, dispatch, nextPage }}>
      {children}
    </SignUpContext.Provider>
  );
}

function useSignUp() {
  const context = useContext(SignUpContext);
  if (context === undefined) {
    throw new Error('useSignUp must be used within a SignUpProvider');
  }

  return context;
}

export { type SignUpContext, SignUpProvider, useSignUp };
