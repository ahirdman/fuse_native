import { combineReducers, configureStore } from '@reduxjs/toolkit';

import userReducer from './user/user.slice';

import { api } from '@/services/api';

import type { PreloadedState } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  user: userReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
};

export const store = setupStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
