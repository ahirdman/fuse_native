import { ThunkDispatch } from '@reduxjs/toolkit';
import type { Session } from '@supabase/supabase-js';
import Purchases from 'react-native-purchases';

import { selectUserData } from 'user/queries';
import { type UserState, spotifyToken } from 'user/user.interface';
import { hydrateAuthState, signIn } from 'user/user.slice';

export async function handleAuthStateSignIn(
  session: Session | null,
  // biome-ignore lint/suspicious/noExplicitAny: reason
  dispatch: ThunkDispatch<any, any, any>,
) {
  if (!session?.user) {
    return;
  }

  await Purchases.logIn(session.user.id);
  const dbUserData = await selectUserData();

  if (!dbUserData) {
    dispatch(signIn({ id: session.user.id, email: session.user.email }));
    return;
  }

  const userState: UserState = {
    user: { id: session.user.id, email: session.user.email },
  };

  const parsedSpotifyToken = spotifyToken.safeParse(
    dbUserData.spotify_token_data,
  );

  if (parsedSpotifyToken.success) {
    userState.spotifyToken = parsedSpotifyToken.data;
  }

  if (dbUserData.spotify_user_id) {
    userState.spotifyUser = { id: dbUserData.spotify_user_id };
  }

  if (dbUserData.subscription && dbUserData.subscriptions) {
    userState.subscription = {
      isSubscribed: true,
      package: {
        ...dbUserData.subscriptions,
        app_user_id: dbUserData.subscriptions.app_user_id ?? 'Unknwon',
      },
    };
  }

  dispatch(hydrateAuthState(userState));
}
