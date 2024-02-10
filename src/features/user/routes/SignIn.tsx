import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Heading } from 'native-base';
import { useForm } from 'react-hook-form';

import type { RootStackScreenProps } from 'navigation.types';
import { supabaseQueryError } from 'services/supabase.api';

import { Button } from 'components/Button';
import HorizontalDivider from 'components/Divider';
import { InputField } from 'components/InputField';
import { PageView } from 'components/PageView';
import { type SignInInput, signInInputSchema } from 'user/auth.interface';
import { useSignInMutation } from 'user/queries/auth.endpoints';

export function SignIn({ navigation }: RootStackScreenProps<'SignIn'>) {
  const { control, handleSubmit, setError } = useForm<SignInInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInInputSchema),
  });

  const [logIn, { isLoading }] = useSignInMutation();

  async function submit({ email, password }: SignInInput) {
    const result = await logIn({ email, password });

    if ('error' in result) {
      const errorRes = supabaseQueryError.parse(result.error);
      setError('password', { message: errorRes.message });
      setError('email', { message: errorRes.message });
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

        <InputField
          label="Email"
          placeholder="Email"
          keyboardType="email-address"
          controlProps={{ control, name: 'email' }}
          _stack={{ m: 2 }}
        />

        <InputField
          label="Password"
          placeholder="********"
          secureTextEntry
          controlProps={{ control, name: 'password' }}
          _stack={{ m: 2 }}
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
          onPress={() => navigation.push('SignUp')}
        />
      </Box>
    </PageView>
  );
}
