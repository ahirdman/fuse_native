import { Pressable, Text } from 'native-base';

import type { IPressableProps } from 'native-base';

interface IPrimaryButtonProps extends IPressableProps {
  onPress(): void;
  label: string;
}

function PrimaryButton({ label, onPress, ...props }: IPrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      bg={props.bg ?? 'brand'}
      rounded="6"
      width="100%"
      height="40px"
      margin="4"
      justifyContent="center"
      alignItems="center"
      _pressed={{ bg: 'coolGray.500' }}
      {...props}
    >
      <Text color="singelton.lightText" fontWeight="bold" letterSpacing="xl">
        {label.toUpperCase()}
      </Text>
    </Pressable>
  );
}

export default PrimaryButton;
