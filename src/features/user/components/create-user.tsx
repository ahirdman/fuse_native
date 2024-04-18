import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, H3, Spinner, YStack } from 'tamagui';

import { InputField } from 'components/InputField';
import {
  type SignUpArgs,
  type SignUpInput,
  signUpInputSchema,
  useSignUp,
} from 'user/queries/signUp';

export function CreateUserPage() {
  const { mutate: signUp, isPending: isLoading } = useSignUp();
  const { control, handleSubmit, setError } = useForm<SignUpInput>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(signUpInputSchema),
  });

  const insets = useSafeAreaInsets();

  async function onSubmit({ email, password }: SignUpArgs) {
    signUp(
      { email, password },
      {
        onError: (error) => {
          setError('email', { message: error.message });
        },
      },
    );
  }

  return (
    <YStack
      fullscreen
      px={16}
      pb={insets.bottom}
      justifyContent="space-between"
      bg="$primary700"
    >
      <YStack gap={16} pt={16}>
        <H3 textAlign="center">Create an account</H3>
        <InputField
          label="Email"
          placeholder="Email"
          keyboardType="email-address"
          controlProps={{ control, name: 'email' }}
        />

        <InputField
          label="Password"
          secureTextEntry={!__DEV__}
          placeholder="********"
          aria-label="password"
          textContentType="password"
          controlProps={{ control, name: 'password' }}
        />

        <InputField
          label="Confirm Password"
          secureTextEntry={!__DEV__}
          aria-label="confirm-password"
          placeholder="********"
          textContentType="password"
          controlProps={{ control, name: 'confirmPassword' }}
        />
      </YStack>

      <Button
        mb={16}
        onPress={handleSubmit(onSubmit)}
        bg="$brandDark"
        fontWeight="bold"
      >
        {isLoading && (
          <Button.Icon>
            <Spinner />
          </Button.Icon>
        )}
        Sign Up
      </Button>
    </YStack>
  );
}
