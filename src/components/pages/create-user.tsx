import { useSignUpMutation } from "@/services/supabase/auth/auth.endpoints";
import {
	SignUpInput,
	SignUpRequest,
	signUpInputSchema,
} from "@/services/supabase/auth/auth.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "native-base";
import { useForm } from "react-hook-form";
import Button from "../atoms/Button";
import InputField from "../atoms/InputField";
import { SignUpTemplate } from "../templates/signup.template";

export function CreateUserPage() {
	const [signUp, { isLoading }] = useSignUpMutation();
	const { control, handleSubmit, setError } = useForm<SignUpInput>({
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
		resolver: zodResolver(signUpInputSchema),
	});

	async function onSubmit({ email, password }: SignUpRequest) {
		const result = await signUp({ email, password });

		if ("error" in result) {
			setError("email", {
				message: result.error.message ?? "Something went wrong",
			});
		}
	}

	return (
		<SignUpTemplate
			renderBody={() => (
				<>
					<Heading textAlign="center">Create an account</Heading>
					<InputField
						label="Email"
						placeholder="Email"
						keyboardType="email-address"
						controlProps={{ control, name: "email" }}
					/>

					<InputField
						label="Password"
						secureTextEntry
						placeholder="********"
						type="password"
						controlProps={{ control, name: "password" }}
					/>

					<InputField
						label="Confirm Password"
						secureTextEntry
						placeholder="********"
						type="password"
						controlProps={{ control, name: "confirmPassword" }}
					/>
				</>
			)}
			renderFooter={() => (
				<Button
					label="Sign Up"
					onPress={handleSubmit(onSubmit)}
					isLoading={isLoading}
				/>
			)}
		/>
	);
}
