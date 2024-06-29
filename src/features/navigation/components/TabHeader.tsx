import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { H6, Stack, View, XStack } from 'tamagui';

import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { ArrowLeft } from '@tamagui/lucide-icons';

interface Props extends NativeStackHeaderProps {}

export function TabHeader(props: Props) {
  const insets = useSafeAreaInsets();
  const canGoBack = props.navigation.canGoBack();
  const style = props.options.headerStyle;

  return (
    <XStack pt={insets.top} bg="$primary700" style={style} pb={12} ai="center">
      <Stack f={1} jc="center" ai="center">
        {props.options.headerLeft ? (
          props.options.headerLeft({ canGoBack })
        ) : (
          <View
            onPress={() => props.navigation.goBack()}
            jc="center"
            ai="center"
            flex={1}
            w="$full"
          >
            <ArrowLeft />
          </View>
        )}
      </Stack>

      <Stack f={4}>
        {props.options.headerTitle &&
        typeof props.options.headerTitle !== 'string' ? (
          props.options.headerTitle({ children: '' })
        ) : (
          <H6
            fontWeight="bold"
            fontSize="$8"
            lineHeight="$8"
            textAlign="center"
            textTransform="uppercase"
            color="$brandDark"
          >
            {props.route.name}
          </H6>
        )}
      </Stack>

      <Stack f={1} jc="center" ai="center">
        {props.options.headerRight?.({ canGoBack })}
      </Stack>
    </XStack>
  );
}
