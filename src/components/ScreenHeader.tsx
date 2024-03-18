import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { type ReactNode, memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, XStack } from 'tamagui';

interface ScreenHeaderProps extends NativeStackHeaderProps {
  leftElement?: ReactNode;
  title: ReactNode;
  rightElement?: ReactNode;
  bottomElement?: ReactNode;
}

function ScreenHeader({
  title,
  rightElement,
  bottomElement,
  leftElement,
  ...props
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <XStack
      bg="$primary300"
      borderBottomColor="$border400"
      borderWidth="0.5"
      pt={insets.top}
      pb={12}
      px={12}
      alignItems="center"
    >
      {leftElement ? (
        leftElement
      ) : (
        <XStack
          flex={1}
          justifyContent="flex-start"
          onPress={() => props.navigation.goBack()}
        >
          <ChevronLeft size={28} />
        </XStack>
      )}

      <XStack flex={3} justifyContent="center" alignItems="center">
        {typeof title === 'string' ? <Text>{title}</Text> : title}
      </XStack>

      <XStack flex={1} justifyContent="flex-end">
        {rightElement}
      </XStack>

      {bottomElement}
    </XStack>
  );
}

export default memo(ScreenHeader);
