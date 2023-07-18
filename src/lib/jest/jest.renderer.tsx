import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { Provider as ReduxProvider } from 'react-redux';
import { render } from '@testing-library/react-native';

import { ApplicationTheme } from '@/style/theme';
import { setupStore } from '@/store/store';

import type { AppStore, RootState } from '@/store/store';
import type { ReactElement } from 'react';
import type { PreloadedState } from '@reduxjs/toolkit';
import type { RenderOptions } from '@testing-library/react-native';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

const inset = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

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
        <NativeBaseProvider
          theme={ApplicationTheme}
          initialWindowMetrics={inset}
        >
          {children}
        </NativeBaseProvider>
      </ReduxProvider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
