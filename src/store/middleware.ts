import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { TypedStartListening } from '@reduxjs/toolkit';
import {
  addPushTokenUpdateListener,
  addSignInDispatchListener,
  addSignOutDispatchListener,
  addSpotifyTokenUpdateListener,
} from 'auth/auth.listeners';

import type { AppDispatch, RootState } from 'store';

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const authListener = createListenerMiddleware();

addSignOutDispatchListener(authListener.startListening as AppStartListening);
addSignInDispatchListener(authListener.startListening as AppStartListening);
addSpotifyTokenUpdateListener(authListener.startListening as AppStartListening);
addPushTokenUpdateListener(authListener.startListening as AppStartListening);
