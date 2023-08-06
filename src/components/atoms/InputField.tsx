import { Input } from 'native-base';

import type { IInputProps } from 'native-base';

interface InputFieldProps extends IInputProps {
  setValue(value: string): void;
  value: string;
}

function InputField({ value, setValue, ...props }: InputFieldProps) {
  return <Input value={value} onChangeText={setValue} {...props} />;
}

export default InputField;
