import { router } from 'expo-router';

import { Controller, useForm } from 'react-hook-form';
import { Box, Heading } from 'native-base';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

import PageView from '@/components/atoms/PageView';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import HorizontalDivider from '@/components/atoms/Divider';
import Input from '@/components/atoms/Input';
import SecondaryButton from '@/components/atoms/SecondaryButton';
import { useSignInMutation } from '@/services/auth/auth.endpoints';
import {
  CustomerQueryError,
  signInInputSchema,
} from '@/services/auth/auth.interface';
import { useAppSelector } from '@/store/hooks';

import type { SignInInput } from '@/services/auth/auth.interface';

function SignInView() {
  const { user, token, subscription } = useAppSelector((state) => state.user);

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
      const message = CustomerQueryError.parse(result).error.data.message;
      setError('password', { message });
      setError('email', { message });
    }
  }

  useEffect(() => {
    if (user && (!token || !subscription)) {
      router.push('/sign-up');
    }
  }, [user, token, subscription]);

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

        <PrimaryButton
          label="Sign In"
          onPress={handleSubmit(submit)}
          isLoading={isLoading}
        />
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
