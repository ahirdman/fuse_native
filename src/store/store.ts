import { combineReducers, configureStore } from '@reduxjs/toolkit';

import userReducer from './user/user.slice';

import { supabaseApi } from '@/services/supabase/supabase.api';

import type { PreloadedState } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  [supabaseApi.reducerPath]: supabaseApi.reducer,
  user: userReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(supabaseApi.middleware),
  });
};

export const store = setupStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
