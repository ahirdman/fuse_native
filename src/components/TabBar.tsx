import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Book, Home, Tags, User, Users } from '@tamagui/lucide-icons';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, type GetProps, View } from 'tamagui';

import { hapticFeedback } from 'util/haptic';

export const CustomTabBar = View.styleable<BottomTabBarProps>(
  ({ state, navigation, ...rest }, ref) => {
    const { width } = Dimensions.get('screen');
    const tabWidth = width / state.routes.length;
    const insets = useSafeAreaInsets();

    return (
      <View
        flexDirection="row"
        maxWidth="100%"
        pb={insets.bottom}
        bg="black"
        {...rest}
        ref={ref}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const Icon = (props: GetProps<typeof Tags>) => {
            if (route.name === 'Home') {
              return <Home {...props} />;
            }

            if (route.name === 'Library') {
              return <Book {...props} />;
            }

            if (route.name === 'Tags') {
              return <Tags {...props} />;
            }

            if (route.name === 'Social') {
              return <Users {...props} />;
            }

            return <User {...props} />;
          };

          return (
            <Button
              unstyled
              flex={1}
              width={100}
              height={50}
              flexShrink={1}
              justifyContent="center"
              alignItems="center"
              cursor="pointer"
              key={route.name}
              onPress={onPress}
              onPressIn={() => hapticFeedback('Light')}
              animation="bouncy"
              pressStyle={{
                scale: 0.5,
              }}
            >
              <Icon color={isFocused ? '$white' : '$border300'} />
            </Button>
          );
        })}
        <View
          bottom={insets.bottom}
          left={0}
          borderWidth={1}
          width={tabWidth}
          borderColor="$brandDark"
          transform={[{ translateX: state.index * tabWidth }]}
          animation="quick"
          position="absolute"
        />
      </View>
    );
  },
);
