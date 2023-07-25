import { Pressable, Text } from 'native-base';

import type { IPressableProps } from 'native-base';

interface ISecondaryButtonProps extends IPressableProps {
  onPress(): void;
  label: string;
}

function SecondaryButton({ label, onPress, ...props }: ISecondaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      bg={props.bg ?? 'primary.700'}
      borderColor="border.400"
      borderWidth="1"
      rounded="6"
      width="100%"
      height="40px"
      marginY={props.marginY ?? '4'}
      justifyContent="center"
      alignItems="center"
      _pressed={{ borderColor: '#707070' }}
      {...props}
    >
      <Text color="singelton.lightHeader" fontWeight="bold" letterSpacing="xl">
        {label}
      </Text>
    </Pressable>
  );
}

export default SecondaryButton;
