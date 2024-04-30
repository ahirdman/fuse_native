import type { PreloadedState } from '@reduxjs/toolkit';
import { render } from '@testing-library/react-native';
import type { RenderOptions } from '@testing-library/react-native';
import React, { type ReactElement } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { TamaguiProvider } from 'tamagui';

import { type AppStore, type RootState, setupStore } from '../src/store';
import tamaguiConfig from '../tamagui.config';

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
    return (
      <ReduxProvider store={store}>
        <TamaguiProvider config={tamaguiConfig}>{children}</TamaguiProvider>
      </ReduxProvider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
