import { Heading, Text } from "native-base";
import { Controller, useForm } from "react-hook-form";

import Button from "@/components/atoms/Button";
import FormInputField from "@/components/atoms/FormInputField";
import PageView from "@/components/atoms/PageView";
import { useResetPasswordMutation } from "@/services/supabase/auth/auth.endpoints";
import { CustomerQueryError } from "@/services/supabase/auth/auth.interface";

import type { ResetPasswordInput } from "@/services/supabase/auth/auth.interface";

function ResetPassword() {
	const { control, handleSubmit, setError } = useForm<ResetPasswordInput>({
		defaultValues: { email: "" },
	});

	const [resetPassword, { isLoading }] = useResetPasswordMutation();

	async function submit({ email }: ResetPasswordInput) {
		const result = await resetPassword({ email });

		if ("error" in result) {
			const message = CustomerQueryError.parse(result).error.data.message;
			setError("email", { message });
		}
	}

	return (
		<PageView justifyContent="">
			<Heading color="brand" size="2xl" paddingY="10">
				Reset Password
			</Heading>

			<Text paddingY="10">
				A link will be sent to your email to enable restoration of your password
			</Text>

			<Controller
				control={control}
				name="email"
				render={({
					field: { onBlur, onChange, value },
					fieldState: { error },
				}) => (
					<FormInputField
						onBlur={onBlur}
						value={value}
						onChangeText={(val) => onChange(val)}
						error={error?.message}
						placeholder="Email"
						keyboardType="email-address"
					/>
				)}
			/>

			<Button
				label="Restore Password"
				onPress={handleSubmit(submit)}
				isLoading={isLoading}
			/>
		</PageView>
	);
}

export default ResetPassword;
