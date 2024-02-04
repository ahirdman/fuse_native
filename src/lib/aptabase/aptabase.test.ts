import { formatPath } from './aptabase';

describe('Apatabase', () => {
  it('formats paths correctly', () => {
    const path = formatPath('/modal');

    expect(path).toStrictEqual('Modal');
  });

  it('formats a pathname without characters', () => {
    const path = formatPath('/');

    expect(path).toStrictEqual('Home');
  });
});
