import { FormControl, Input } from 'native-base';
import { useController } from 'react-hook-form';

import type { IInputProps } from 'native-base';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

interface ControlledInputProps<T extends FieldValues>
  extends UseControllerProps<T>,
    Omit<IInputProps, 'defaultValue'> {
  label?: string;
}

function ControlledInput<T extends FieldValues>({
  label,
  ...props
}: ControlledInputProps<T>) {
  const {
    field: { onBlur, onChange, value },
    fieldState: { error },
  } = useController(props);
  return (
    <FormControl isRequired isInvalid={error !== undefined} m="2">
      {label && <FormControl.Label>{label}</FormControl.Label>}
      <Input
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
        size="lg"
        {...props}
      />
      <FormControl.ErrorMessage>{error?.message}</FormControl.ErrorMessage>
    </FormControl>
  );
}

export default ControlledInput;
