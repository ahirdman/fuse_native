import { createListenerMiddleware } from '@reduxjs/toolkit';

import { addExpiredSpotifyTokenListener } from './user/user.slice';

import type { TypedStartListening } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from './store';

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const userListener = createListenerMiddleware();

addExpiredSpotifyTokenListener(
  userListener.startListening as AppStartListening,
);
