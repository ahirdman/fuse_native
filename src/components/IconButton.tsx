import { ReactNode } from 'react';
import { GetProps, Stack, styled } from 'tamagui';

import type { ButtonSize } from 'components/Button';

interface IconButtonProps extends StyledIconButtonProps {
  size?: ButtonSize;
  icon: ReactNode;
}

export function IconButton({
  size = 'default',
  icon,
  ...props
}: IconButtonProps) {
  return (
    <StyledIconButton size={size} {...props}>
      {icon}
    </StyledIconButton>
  );
}

type StyledIconButtonProps = GetProps<typeof StyledIconButton>;

const StyledIconButton = styled(Stack, {
  bg: '$primary700',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '$2',
  pressStyle: { borderColor: '$border300' },
  borderColor: '$border500',
  borderWidth: 1,

  variants: {
    size: {
      small: {
        h: 28,
        w: 28,
      },
      default: {
        h: 40,
        w: 40,
      },
      large: {
        h: 52,
        w: 52,
      },
    },
  },
});
