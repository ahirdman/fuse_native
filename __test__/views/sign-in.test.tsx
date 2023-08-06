export function generateLongString(length: number): string {
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
  describe('Sign in form', () => {
    test('placeholder', () => {
      expect(2 + 2).toBe(4);
    });
    test.todo('User can sign in with existing account');
    test.todo('UI error for invalid email');
    test.todo('UI error for invalid password');
  });
});
