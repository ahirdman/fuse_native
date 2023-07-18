import AuthView from '../../src/app/(auth)/auth';

import { renderWithProviders } from '@/lib/jest/jest.renderer';
import { setupStore } from '@/store/store';

describe('<Auth />', () => {
  const storeRef = setupStore();

  test('renders', async () => {
    const { findByText } = renderWithProviders(<AuthView />, {
      store: storeRef,
    });

    expect(await findByText(/Sign in!/i)).toBeVisible();
  });
});
