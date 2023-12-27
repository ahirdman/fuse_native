import { Input } from "native-base";

import type { IInputProps } from "native-base";

interface InputFieldProps extends IInputProps {}

function InputField({ ...props }: InputFieldProps) {
	return (
		<Input
			h="40px"
			size={props.size ?? "lg"}
			focusOutlineColor="border.300"
			borderColor={props.borderColor ?? "border.500"}
			placeholderTextColor="#505050"
			bg="primary.600"
			_focus={{
				_ios: {
					selectionColor: "brand.dark",
				},
			}}
			_input={{
				bg: "primary.600",
				color: "singelton.white",
			}}
			_invalid={{
				placeholderTextColor: "error.500",
				_input: { bg: "error.400" },
			}}
			{...props}
		/>
	);
}

export default InputField;
