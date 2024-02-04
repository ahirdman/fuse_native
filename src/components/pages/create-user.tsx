import { useSignUpMutation } from '@/services/supabase/auth/auth.endpoints';
import {
  SignUpInput,
  SignUpRequest,
  signUpInputSchema,
} from '@/services/supabase/auth/auth.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Heading, VStack } from 'native-base';
import { useForm } from 'react-hook-form';
import Button from '../atoms/Button';
import InputField from '../atoms/InputField';

export function CreateUserPage() {
  const [signUp, { isLoading }] = useSignUpMutation();
  const { control, handleSubmit, setError } = useForm<SignUpInput>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(signUpInputSchema),
  });

  async function onSubmit({ email, password }: SignUpRequest) {
    const result = await signUp({ email, password });

    if ('error' in result) {
      setError('email', {
        message: result.error.message ?? 'Something went wrong',
      });
    }
  }

  return (
    <Box
      flex={1}
      w="full"
      px="4"
      safeAreaBottom
      justifyContent="space-between"
      bg="primary.700"
    >
      <VStack space="4" pt="4">
        <Heading textAlign="center">Create an account</Heading>
        <InputField
          label="Email"
          placeholder="Email"
          keyboardType="email-address"
          controlProps={{ control, name: 'email' }}
        />

        <InputField
          label="Password"
          secureTextEntry
          placeholder="********"
          type="password"
          controlProps={{ control, name: 'password' }}
        />

        <InputField
          label="Confirm Password"
          secureTextEntry
          placeholder="********"
          type="password"
          controlProps={{ control, name: 'confirmPassword' }}
        />
      </VStack>

      <VStack>
        <Button
          label="Sign Up"
          mb="4"
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
        />
      </VStack>
    </Box>
  );
}
