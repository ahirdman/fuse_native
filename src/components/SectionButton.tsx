import { Plus } from '@tamagui/lucide-icons';
import { YStack, type YStackProps } from 'tamagui';

import { Text } from 'components/Text';

interface SectionButtonProps extends YStackProps {
  title: string;
  onPress(): void;
}

export function SectionButton({
  title,
  onPress,
  ...props
}: SectionButtonProps) {
  return (
    <YStack
      bg="$primary800"
      p={12}
      w={180}
      h={100}
      borderRadius={12}
      justifyContent="space-between"
      animation="bouncy"
      pressStyle={{ bg: '$primary600', scale: 0.9 }}
      onPress={onPress}
      {...props}
    >
      <Text fontWeight="bold">{title}</Text>
      <Plus color="$brandDark" size={32} alignSelf="flex-end" />
    </YStack>
  );
}
