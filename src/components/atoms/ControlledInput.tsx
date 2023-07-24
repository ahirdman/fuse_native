import { FormControl, Input as BaseInput } from 'native-base';

import type { IInputProps } from 'native-base';

interface ControlledInputProps extends IInputProps {
  label?: string;
  error?: string | undefined;
}

function Input({ label, error, ...props }: ControlledInputProps) {
  return (
    <FormControl m="2" isInvalid={error !== undefined}>
      {label && <FormControl.Label>{label}</FormControl.Label>}
      <BaseInput size="lg" {...props} />
      <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
    </FormControl>
  );
}

export default Input;
