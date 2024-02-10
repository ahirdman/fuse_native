import { Box, Pressable, Spinner, Text } from 'native-base';

import type { IPressableProps, ITextProps } from 'native-base';
import type { GestureResponderEvent } from 'react-native';

type ButtonType = 'primary' | 'secondary' | 'teritary';
type ButtonTypeProps<T> = { [K in ButtonType]: T };

const buttonsSizes = ['large', 'default', 'small'] as const;
export type ButtonSize = (typeof buttonsSizes)[number];

interface ButtonProps extends IPressableProps {
  onPress(e: GestureResponderEvent): void;
  label: string;
  size?: ButtonSize;
  type?: ButtonType;
  isLoading?: boolean;
  _text?: ITextProps;
}

export function Button({
  onPress,
  label,
  size = 'default',
  type = 'primary',
  isLoading,
  _text,
  ...props
}: ButtonProps) {
  const height = {
    large: '52px',
    default: '40px',
    small: '28px',
  }[size];

  const pressableTypeProps: ButtonTypeProps<IPressableProps> = {
    primary: {
      bg: 'brand.dark',
      w: props.w ?? 'full',
      borderColor: 'brand.light',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      _pressed: { bg: 'brand.light' },
    },
    secondary: {
      bg: 'primary.700',
      w: props.w ?? 'full',
      borderColor: 'border.400',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      _pressed: { borderColor: '#707070' },
    },
    teritary: {
      bg: 'transparent',
      _pressed: { bg: 'transparent' },
    },
  };

  return (
    <Pressable
      onPress={onPress}
      rounded="6"
      px={props.w ? '6' : 'auto'}
      height={props.height ?? height}
      {...pressableTypeProps[type]}
      {...props}
    >
      {({ isPressed }) => {
        const textTypeProps: ButtonTypeProps<ITextProps> = {
          primary: {
            color: 'singelton.white',
          },
          secondary: {
            color: 'singelton.lightHeader',
          },
          teritary: {
            color: isPressed ? 'singelton.lightText' : 'singelton.white',
          },
        };

        return (
          <Box boxSize="full" alignItems="center" justifyContent="center">
            {isLoading ? (
              <Spinner />
            ) : (
              <Text
                fontWeight="bold"
                letterSpacing="xl"
                {...textTypeProps[type]}
                {..._text}
              >
                {label}
              </Text>
            )}
          </Box>
        );
      }}
    </Pressable>
  );
}
