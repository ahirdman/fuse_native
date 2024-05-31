import type { ReactNode } from 'react';
import { YStack, type YStackProps } from 'tamagui';

interface SectionBoxProps extends YStackProps {
  children?: ReactNode;
}

export function SectionBox({ children, ...props }: SectionBoxProps) {
  return (
    <YStack bg="$primary800" f={1} borderRadius={8} p={12} {...props}>
      {children}
    </YStack>
  );
}
