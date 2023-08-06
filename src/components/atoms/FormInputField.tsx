import { FormControl, Input as BaseInput } from 'native-base';

import type { IInputProps as IBaseInputProps } from 'native-base';

interface FormInputFieldProps extends IBaseInputProps {
  label?: string;
  error?: string | undefined;
}

function FormInputField({ label, error, ...props }: FormInputFieldProps) {
  return (
    <FormControl m="2" isInvalid={error !== undefined}>
      {label && <FormControl.Label>{label}</FormControl.Label>}
      <BaseInput size="lg" {...props} />
      <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
    </FormControl>
  );
}

export default FormInputField;
