import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Heading } from "native-base";
import { Controller, useForm } from "react-hook-form";

import Button from "@/components/atoms/Button";
import HorizontalDivider from "@/components/atoms/Divider";
import FormInputField from "@/components/atoms/FormInputField";
import PageView from "@/components/atoms/PageView";
import { useSignInMutation } from "@/services/supabase/auth/auth.endpoints";
import {
	CustomerQueryError,
	signInInputSchema,
} from "@/services/supabase/auth/auth.interface";

import type { RootStackScreenProps } from "@/navigation.types";
import type { SignInInput } from "@/services/supabase/auth/auth.interface";

function SignIn({ navigation }: RootStackScreenProps<"SignIn">) {
	const { control, handleSubmit, setError } = useForm<SignInInput>({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: zodResolver(signInInputSchema),
	});

	const [logIn, { isLoading }] = useSignInMutation();

	async function submit({ email, password }: SignInInput) {
		const result = await logIn({ email, password });

		if ("error" in result) {
			const message = CustomerQueryError.parse(result).error.data.message;
			setError("password", { message });
			setError("email", { message });
		}
	}

	return (
		<PageView justifyContent="space-between" paddingY="10">
			<Box w="full" justifyContent="center" alignItems="center">
				<Heading
					color="brand.dark"
					fontWeight="extrabold"
					fontSize="9xl"
					paddingY="10"
				>
					FUSE
				</Heading>

				<Controller
					control={control}
					name="email"
					render={({
						field: { onBlur, onChange, value },
						fieldState: { error },
					}) => (
						<FormInputField
							label="Email"
							onBlur={onBlur}
							value={value}
							onChangeText={(val) => onChange(val)}
							error={error?.message}
							placeholder="Email"
							keyboardType="email-address"
						/>
					)}
				/>

				<Controller
					control={control}
					name="password"
					render={({
						field: { onBlur, onChange, value },
						fieldState: { error },
					}) => (
						<FormInputField
							label="Password"
							onBlur={onBlur}
							value={value}
							onChangeText={(val) => onChange(val)}
							error={error?.message}
							placeholder="********"
							secureTextEntry
						/>
					)}
				/>

				<Button
					label="Sign In"
					my="4"
					onPress={handleSubmit(submit)}
					isLoading={isLoading}
				/>
			</Box>

			<Box w="full" justifyContent="center" alignItems="center">
				<HorizontalDivider label="or" mt="100" />

				<Button
					my="4"
					type="secondary"
					label="Sign Up Now"
					onPress={() => navigation.push("SignUp")}
				/>
			</Box>
		</PageView>
	);
}

export default SignIn;
