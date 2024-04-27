import { describe, expect, test } from 'bun:test';

describe('<SignInView />', () => {
  describe('Sign in form', () => {
    test('placeholder', () => {
      expect(2 + 2).toBe(4);
    });
    test.todo('User can sign in with existing account');
    test.todo('UI error for invalid email');
    test.todo('UI error for invalid password');
  });
});
