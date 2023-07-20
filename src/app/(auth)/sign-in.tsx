import { useRouter } from 'expo-router';

import { useForm } from 'react-hook-form';
import { Box, Heading } from 'native-base';

import PageView from '@/components/atoms/PageView';
import ControlledInput from '@/components/atoms/ControlledInput';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import { supabaseSignIn } from '@/lib/supabase/supabase.auth';
import HorizontalDivider from '@/components/atoms/Divider';

export interface IAuthInput {
  email: string;
  password: string;
}

function SignInView() {
  const { control, handleSubmit } = useForm<IAuthInput>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function signIn({ email, password }: IAuthInput) {
    void supabaseSignIn({ email, password });
  }

  const router = useRouter();

  return (
    <PageView justifyContent="space-between" paddingY="10">
      <Box w="full" justifyContent="center" alignItems="center">
        <Heading
          color="brand"
          fontWeight="extrabold"
          fontSize="9xl"
          paddingY="10"
        >
          FUSE
        </Heading>

        <ControlledInput
          placeholder="Email"
          control={control}
          name="email"
          rules={{ required: 'Username is required' }}
        />

        <ControlledInput
          placeholder="Password"
          control={control}
          name="password"
          type="password"
          rules={{
            required: 'Password is required',
            maxLength: 72,
            minLength: 6,
          }}
        />

        <PrimaryButton label="Sign In" onPress={handleSubmit(signIn)} />
      </Box>

      <Box w="full" justifyContent="center" alignItems="center">
        <HorizontalDivider label="or" mt="100" />

        <PrimaryButton
          label="Create New Account"
          onPress={() => router.push('/sign-up')}
        />
      </Box>
    </PageView>
  );
}

export default SignInView;
