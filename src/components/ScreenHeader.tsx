import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { type ReactNode, memo } from 'react';
import { Text, XStack } from 'tamagui';

import { SafeAreaStack } from 'components/SafeAreaStack';

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
  return (
    <SafeAreaStack
      bg="$primary300"
      borderBottomColor="$border400"
      borderWidth="0.5"
      edges={['top']}
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
    </SafeAreaStack>
  );
}

export default memo(ScreenHeader);
