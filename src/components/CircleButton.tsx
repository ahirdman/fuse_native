import type { ReactNode } from 'react';
import { type ColorTokens, H6, View, YStack } from 'tamagui';

interface CicrcleBUttonProps {
  label: string;
  icon: ReactNode;
  color?: ColorTokens;
  onPress(): void;
}

export function CircleBUtton({
  label,
  icon,
  onPress,
  color,
}: CicrcleBUttonProps) {
  return (
    <YStack
      ai="center"
      jc="center"
      borderColor="$primary800"
      borderRadius={8}
      gap={4}
      f={1}
    >
      <View
        borderRadius="$12"
        aspectRatio={1}
        h={52}
        w={52}
        jc="center"
        ai="center"
        pressStyle={{
          bg: '$primary500',
        }}
        onPress={onPress}
        bg={color ?? '$primary800'}
      >
        {icon}
      </View>
      <H6 color="$border300" textTransform="uppercase">
        {label}
      </H6>
    </YStack>
  );
}
