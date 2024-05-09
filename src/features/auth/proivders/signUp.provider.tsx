import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import { useAppDispatch } from 'store/hooks';
import { showToast } from 'util/toast';

import {
  type Profile,
  type SpotifyToken,
  type SpotifyUser,
  type User,
  type UserState,
  userStateSchema,
} from 'auth/auth.interface';
import { signIn } from 'auth/auth.slice';
import { deleteAuthStorageValue, setAuthStorageValue } from 'auth/auth.storage';
import type { AppSubscription } from 'subscription/subscription.interface';

type State = Partial<UserState>;

type Action =
  | { type: 'submitUser'; payload: User }
  | { type: 'submitProfile'; payload: Profile }
  | {
      type: 'submitSpotifyToken';
      payload: { spotifyUser: SpotifyUser; spotifyToken: SpotifyToken };
    }
  | { type: 'submitSubscription'; payload: AppSubscription }
  | { type: 'cancel' };

export interface SignUpContext {
  dispatch(action: Action): void;
  nextPage(): void;
  state: State;
}

interface SignUpProviderProps {
  children: ReactNode;
  nextPage(): void;
}

const SignUpContext = createContext<SignUpContext | undefined>(undefined);

const initialState: State = {
  user: undefined,
  profile: undefined,
  spotifyUser: undefined,
  spotifyToken: undefined,
  subscription: undefined,
};

function signUpReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'submitUser':
      setAuthStorageValue('user', action.payload);

      return { ...state, user: action.payload };

    case 'submitProfile': {
      setAuthStorageValue('profile', action.payload);

      return { ...state, profile: action.payload };
    }

    case 'submitSpotifyToken': {
      setAuthStorageValue('spotifyToken', action.payload.spotifyToken);
      setAuthStorageValue('spotifyUser', action.payload.spotifyUser);

      return {
        ...state,
        spotifyToken: action.payload.spotifyToken,
        spotifyUser: action.payload.spotifyUser,
      };
    }

    case 'submitSubscription': {
      setAuthStorageValue('subscription', action.payload);

      return { ...state, subscription: action.payload };
    }

    case 'cancel': {
      deleteAuthStorageValue('all');

      return initialState;
    }

    default:
      throw new Error(`Unrecognized action. Recived: [${action}]`);
  }
}

export function SignUpProvider({ children, nextPage }: SignUpProviderProps) {
  const [state, dispatch] = useReducer(signUpReducer, initialState);
  const globalDispatch = useAppDispatch();

  const completeSignUp = useCallback(() => {
    try {
      const parsedState = userStateSchema.parse(state);

      globalDispatch(signIn(parsedState));
    } catch (_) {
      showToast({
        title: 'Something went wrong',
        preset: 'error',
      });
    }
  }, [state, globalDispatch]);

  useEffect(() => {
    if (state.subscription) {
      completeSignUp();
    }
  }, [state.subscription, completeSignUp]);

  return (
    <SignUpContext.Provider value={{ state, dispatch, nextPage }}>
      {children}
    </SignUpContext.Provider>
  );
}

export function useSignUp() {
  const context = useContext(SignUpContext);
  if (context === undefined) {
    throw new Error('useSignUp must be used within a SignUpProvider');
  }

  return context;
}
