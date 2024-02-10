import {
  type TypedStartListening,
  createListenerMiddleware,
} from '@reduxjs/toolkit';

import type { AppDispatch, RootState } from 'store';
import { addSpotifyTokenListener } from 'user/user.slice';

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const userListener = createListenerMiddleware();

addSpotifyTokenListener(userListener.startListening as AppStartListening);
