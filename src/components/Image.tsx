import { Image } from 'expo-image';
import { styled } from 'tamagui';

export const StyledImage = styled(Image, {
  alt: 'album-artwork',
  accessibilityIgnoresInvertColors: true,
});
