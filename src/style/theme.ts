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
  fontConfig: {
    Mulish: {
      200: {
        normal: 'Mulish_200ExtraLight',
      },
      300: {
        normal: 'Mulish_300Light',
      },
      400: {
        normal: 'Mulish_400Regular',
      },
      500: {
        normal: 'Mulish_500Medium',
      },
      600: {
        normal: 'Mulish_600SemiBold',
      },
      700: {
        normal: 'Mulish_700Bold',
      },
      800: {
        normal: 'Mulish_800ExtraBold',
      },
      900: {
        normal: 'Mulish_900Black',
      },
    },
  },
  fonts: {
    heading: 'Mulish',
    body: 'Mulish',
    mono: 'Mulish',
  },
  components: {
    Text: {
      baseStyle: {
        color: 'singelton.lightText',
      },
    },
    Input: {
      baseStyle: {
        height: '40px',
        focusOutlineColor: 'brand',
        _focus: {
          _ios: {
            selectionColor: 'brand',
          },
        },
        _input: {
          color: 'singelton.lightText',
        },
      },
    },
  },
});

export type ApplicationTheme = typeof ApplicationTheme;

declare module 'native-base' {
  interface ICustomTheme extends ApplicationTheme {}
}
