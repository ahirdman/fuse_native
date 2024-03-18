import { Paragraph, styled } from 'tamagui';

export const Text = styled(Paragraph, {
  variants: {
    label: {
      medium: {
        fontWeight: '300',
        fontFamily: '$body',
      },
    },
  } as const,
});
