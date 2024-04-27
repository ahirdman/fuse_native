import { createAnimations } from '@tamagui/animations-react-native';
import { config as tamaguiConfig } from '@tamagui/config/v2';
import { createMedia } from '@tamagui/react-native-media-driver';
import { shorthands } from '@tamagui/shorthands';
import {
  color as baseColor,
  tokens as baseTokens,
  themes,
} from '@tamagui/themes';
import { createFont, createTamagui, createTokens } from 'tamagui';

const animations = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
});

const customTokens = createTokens({
  ...baseTokens,
  size: {
    ...baseTokens.size,
    full: '100%',
  },
  color: {
    ...baseColor,
    brandDark: '#F4753F',
    primary300: '#232323',
    primary400: '#505050',
    primary500: '#3d3e42',
    primary600: '#222222',
    primary700: '#1C1C1C',
    primary800: '#151515',
    white: '#FFFFFF',
    black: '#000000',
    lightText: '#BBBBBB',
    darkText: '#191C1D',
    lightHeader: '#EDEDED',
    success500: '#54976F',
    success600: '#6CCC93',
    error400: '#1D1415',
    error777: '#261515',
    error500: '#5F2324',
    error600: '#772829',
    error700: '#D45453',
    warning500: '#E5A43B',
    warning600: '#FFCA75',
    border300: '#707070',
    border400: '#505050',
    border500: '#3E3E3E',
  },
});

const mulishFace = {
  normal: { normal: 'Mulish_400Regular' },
  bold: { normal: 'Mulish_700Bold' },
  200: { normal: 'Mulish_200ExtraLight' },
  300: { normal: 'Mulish_300Light' },
  500: { normal: 'Mulish_500Medium' },
  600: { normal: 'Mulish_600SemiBold' },
  800: { normal: 'Mulish_800ExtraBold' },
  900: { normal: 'Mulish_900Black' },
};

const headingFont = createFont({
  size: tamaguiConfig.fonts.heading.size,
  lineHeight: tamaguiConfig.fonts.heading.lineHeight,
  weight: tamaguiConfig.fonts.heading.weight,
  letterSpacing: tamaguiConfig.fonts.heading.letterSpacing,
  face: mulishFace,
});

const bodyFont = createFont({
  size: tamaguiConfig.fonts.body.size,
  lineHeight: tamaguiConfig.fonts.body.lineHeight,
  weight: tamaguiConfig.fonts.body.weight,
  letterSpacing: tamaguiConfig.fonts.body.letterSpacing,
  face: mulishFace,
});

const config = createTamagui({
  animations,
  defaultTheme: 'dark',
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes,
  tokens: customTokens,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
});

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
