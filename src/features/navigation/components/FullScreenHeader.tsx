import type { DrawerHeaderProps } from '@react-navigation/drawer';
import { ArrowLeft } from '@tamagui/lucide-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, YStack } from 'tamagui';

export function FullScreenHeader(props: DrawerHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <YStack bg="$primary700" h="$4" pt={insets.top}>
      <Stack
        w={44}
        h={44}
        onPress={() => props.navigation.goBack()}
        jc="center"
        ai="center"
      >
        <ArrowLeft />
      </Stack>
    </YStack>
  );
}
