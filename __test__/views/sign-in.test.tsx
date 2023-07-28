import { act, fireEvent, waitFor } from '@testing-library/react-native';

import SignInView from '@/app/(auth)/sign-in';
import { renderWithProviders } from '@/lib/jest/jest.renderer';
import { setupStore } from '@/store/store';

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

function generateLongString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  while (result.length < length) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

describe('<SignInView />', () => {
  const storeRef = setupStore();

  describe('Render', () => {
    test('it renders', async () => {
      const { getByText } = renderWithProviders(<SignInView />, {
        store: storeRef,
      });

      expect(getByText(/fuse/i)).toBeVisible();
    });
  });

  describe('Sign in form', () => {
    test.skip('User can sign in with existing account', async () => {
      const { getByPlaceholderText, getByText } = renderWithProviders(
        <SignInView />,
        {
          store: storeRef,
        },
      );

      fireEvent.changeText(
        getByPlaceholderText(/email/i),
        'JohnWick@awsome.com',
      );
      fireEvent.changeText(
        getByPlaceholderText(/\*\*\*\*\*\*/i),
        'AwesomePassword',
      );

      await act(() => fireEvent.press(getByText(/sign in/i)));

      await waitFor(() => expect(storeRef.getState().user.user).toBeDefined());

      expect(storeRef.getState().user.user?.id).toBeDefined();
    });

    test('UI error for invalid email', async () => {
      const { getByPlaceholderText, getByText } = renderWithProviders(
        <SignInView />,
        {
          store: storeRef,
        },
      );

      fireEvent.changeText(getByPlaceholderText(/email/i), 'JohnWick');

      await act(() => fireEvent.press(getByText(/sign in/i)));

      expect(getByText(/invalid email/i)).toBeTruthy();
    });

    test('UI error for invalid password', async () => {
      const { getByPlaceholderText, getByText } = renderWithProviders(
        <SignInView />,
        {
          store: storeRef,
        },
      );

      const passwordInput = getByPlaceholderText(/\*\*\*\*\*\*/i);

      fireEvent.changeText(passwordInput, '12345');
      await act(() => fireEvent.press(getByText(/sign in/i)));

      expect(
        getByText(/password cannot be shorter than 6 characters/i),
      ).toBeTruthy();

      fireEvent.changeText(passwordInput, generateLongString(73));
      await act(() => fireEvent.press(getByText(/sign in/i)));

      expect(
        getByText(/password cannot be longer than 72 characters/i),
      ).toBeTruthy();
    });
  });
});
