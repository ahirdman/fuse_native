import { describe, expect, it } from '@jest/globals';
import { screen } from '@testing-library/react-native';

import { renderWithProviders } from 'test-utils';
import { Alert } from './Alert';

describe('Alert Component', () => {
  it('renders', () => {
    renderWithProviders(<Alert label="Hello" />);

    expect(screen.getByText(/hello/i)).toBeOnTheScreen();
  });
});
