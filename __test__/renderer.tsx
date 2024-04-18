import type { PreloadedState } from '@reduxjs/toolkit';
import { render } from '@testing-library/react-native';
import type { RenderOptions } from '@testing-library/react-native';
import React from 'react';
import type { ReactElement } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { type AppStore, type RootState, setupStore } from 'store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: { children: ReactElement }): JSX.Element {
    return <ReduxProvider store={store}>{children}</ReduxProvider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
