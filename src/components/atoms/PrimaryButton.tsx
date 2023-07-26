import { Pressable, Spinner, Text } from 'native-base';

import type { IPressableProps } from 'native-base';

interface IPrimaryButtonProps extends IPressableProps {
  onPress(): void;
  isLoading?: boolean;
  label: string;
}

function PrimaryButton({
  label,
  onPress,
  isLoading,
  ...props
}: IPrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      bg={props.bg ?? 'brand.dark'}
      borderColor="brand.light"
      borderWidth="1"
      rounded="6"
      width="100%"
      height="40px"
      justifyContent="center"
      marginY={props.marginY ?? '4'}
      alignItems="center"
      _pressed={{ bg: 'brand.light' }}
      {...props}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <Text color="singelton.white" fontWeight="bold" letterSpacing="xl">
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export default PrimaryButton;
