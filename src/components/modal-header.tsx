import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { ReactNode } from 'react';
import { Stack, XStack } from 'tamagui';

interface ModalHeaderProps extends NativeStackHeaderProps {
  leftElement?: ReactNode;
  centerElement?: ReactNode;
  rightElement?: ReactNode;
}

export function ModalHeader({
  leftElement,
  centerElement,
  rightElement,
}: ModalHeaderProps) {
  return (
    <XStack bg="$primary600" h={44} w="100%" alignItems="center" px={16}>
      <Stack flex={1} w="100%" h="100%">
        {leftElement}
      </Stack>

      <Stack flex={2} w="100%" h="100%" justifyContent="center">
        {centerElement}
      </Stack>

      <Stack
        flex={1}
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="flex-end"
      >
        {rightElement}
      </Stack>
    </XStack>
  );
}
