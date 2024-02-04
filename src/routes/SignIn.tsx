import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Heading } from 'native-base';
import { useForm } from 'react-hook-form';

import Button from '@/components/atoms/Button';
import HorizontalDivider from '@/components/atoms/Divider';
import PageView from '@/components/atoms/PageView';
import { useSignInMutation } from '@/services/supabase/auth/auth.endpoints';
import { signInInputSchema } from '@/services/supabase/auth/auth.interface';

import InputField from '@/components/atoms/InputField';
import type { RootStackScreenProps } from '@/navigation.types';
import type { SignInInput } from '@/services/supabase/auth/auth.interface';
import { supabaseQueryError } from '@/services/supabase/supabase.api';

function SignIn({ navigation }: RootStackScreenProps<'SignIn'>) {
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

export default SignIn;
