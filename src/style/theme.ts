import { extendTheme } from 'native-base';

export const ApplicationTheme = extendTheme({
  colors: {
    brand: '#fa701b',
    primary: {
      500: '#3d3e42',
    },
    border: '#BFBFBF',
    singelton: {
      white: '#FFFFFF',
      black: '#000000',
      lightText: '#FFFFFF',
      darkText: '#191C1D',
    },
  },
});

export type ApplicationTheme = typeof ApplicationTheme;

declare module 'native-base' {
  interface ICustomTheme extends ApplicationTheme {}
}
