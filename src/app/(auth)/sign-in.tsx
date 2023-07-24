import { useRouter } from 'expo-router';

import { Controller, useForm } from 'react-hook-form';
import { Box, Heading } from 'native-base';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import PageView from '@/components/atoms/PageView';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import HorizontalDivider from '@/components/atoms/Divider';
import Input from '@/components/atoms/ControlledInput';
import { supabaseSignIn } from '@/lib/supabase/supabase.auth';
import SecondaryButton from '@/components/atoms/SecondaryButton';

const signInschema = z.object({
  email: z.string().email({ message: 'Invalid Email' }),
  password: z
    .string()
    .min(6, {
      message: 'Password cannot be shorter than 6 characters',
    })
    .max(72, { message: 'Password cannot be longer than 72 characters' }),
});

export type ISignIn = z.infer<typeof signInschema>;

function SignInView() {
  const router = useRouter();

  const { control, handleSubmit, setError } = useForm<ISignIn>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInschema),
  });

  async function submit({ email, password }: ISignIn) {
    const { error } = await supabaseSignIn({ email, password });

    if (error) {
      setError('password', { message: error.message });
      setError('email', { message: error.message });
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
            <Input
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
            <Input
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

        <PrimaryButton label="Sign In" onPress={handleSubmit(submit)} />
      </Box>

      <Box w="full" justifyContent="center" alignItems="center">
        <HorizontalDivider label="or" mt="100" />

        <SecondaryButton
          label="Sign Up Now"
          onPress={() => router.push('/sign-up')}
        />
      </Box>
    </PageView>
  );
}

export default SignInView;
