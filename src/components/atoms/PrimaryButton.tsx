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
      {...props}
      bg={props.bg ?? 'brand'}
      rounded="4"
      width="100%"
      height="40px"
      margin="4"
      justifyContent="center"
      alignItems="center"
    >
      <Text>{label}</Text>
    </Pressable>
  );
}

export default PrimaryButton;
