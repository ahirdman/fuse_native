import { Spinner, YStack } from 'tamagui';

export function ListFooterComponent() {
  return (
    <YStack h={40} justifyContent="center" alignItems="center">
      <Spinner />
    </YStack>
  );
}
