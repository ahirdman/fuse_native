import { ReactNode } from 'react';
import { Stack, StackProps } from 'tamagui';

import type { ButtonSize } from 'components/Button';

interface IconButtonProps extends StackProps {
  size?: ButtonSize;
  icon: ReactNode;
}

export function IconButton({
  size = 'default',
  icon,
  ...props
}: IconButtonProps) {
  const height = {
    large: 52,
    default: 40,
    small: 28,
  }[size];

  return (
    <Stack
      bg="$primary700"
      h={height}
      w={height}
      justifyContent="center"
      alignItems="center"
      borderRadius="$2"
      pressStyle={{ borderColor: '#707070' }}
      borderColor="$border400"
      borderWidth={1}
      {...props}
    >
      {icon}
    </Stack>
  );
}
