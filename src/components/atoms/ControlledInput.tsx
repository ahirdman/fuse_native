import { FormControl, Input } from 'native-base';
import { useController } from 'react-hook-form';

import type { IInputProps } from 'native-base';
import type { UseControllerProps } from 'react-hook-form';
import type { IAuthInput } from '@/app/(auth)/auth';

interface ControlledInputProps
  extends IInputProps,
    UseControllerProps<IAuthInput> {
  label: string;
  defaultValue?: string;
}

function ControlledInput({ label, ...props }: ControlledInputProps) {
  const {
    field: { onBlur, onChange, value },
    fieldState: { error },
  } = useController(props);
  return (
    <FormControl isRequired isInvalid={error !== undefined}>
      <FormControl.Label>{label}</FormControl.Label>
      <Input
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
        background="white"
        {...props}
      />
      <FormControl.ErrorMessage>{error?.message}</FormControl.ErrorMessage>
    </FormControl>
  );
}

export default ControlledInput;
