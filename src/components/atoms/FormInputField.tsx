import { FormControl } from "native-base";

import InputField from "./InputField";

import type { IInputProps as IBaseInputProps } from "native-base";

interface FormInputFieldProps extends IBaseInputProps {
	label?: string;
	error?: string | undefined;
}

function FormInputField({ label, error, ...props }: FormInputFieldProps) {
	return (
		<FormControl m="2" isInvalid={error !== undefined}>
			{label && <FormControl.Label>{label}</FormControl.Label>}
			<InputField {...props} />
			<FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
		</FormControl>
	);
}

export default FormInputField;
