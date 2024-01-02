import { FormControl, Input } from "native-base";

import type { IFormControlProps, IInputProps } from "native-base";
import {
	FieldValues,
	UseControllerProps,
	useController,
} from "react-hook-form";

interface InputFieldProps<T extends FieldValues> extends IInputProps {
	controlProps: UseControllerProps<T>;
	label?: string;
	_stack?: IFormControlProps | undefined;
}

function InputField<T extends FieldValues>({
	controlProps,
	label,
	_stack,
	...props
}: InputFieldProps<T>) {
	const { field, fieldState } = useController(controlProps);

	return (
		<FormControl {..._stack} isInvalid={fieldState.error !== undefined}>
			{label && <FormControl.Label>{label}</FormControl.Label>}
			<Input
				onBlur={field.onBlur}
				onChangeText={field.onChange}
				value={field.value}
				ref={field.ref}
				h="40px"
				size={props.size ?? "lg"}
				focusOutlineColor="border.300"
				borderColor="border.500"
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
			<FormControl.ErrorMessage>
				{fieldState.error?.message}
			</FormControl.ErrorMessage>
		</FormControl>
	);
}

export default InputField;
