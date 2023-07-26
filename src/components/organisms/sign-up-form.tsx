import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import Input from '@/components/atoms/Input';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import {
  CustomerQueryError,
  signUpInputSchema,
} from '@/services/supabase/auth/supabase.interface';
import { useSignUpMutation } from '@/services/supabase/auth/supabase.auth';

import type {
  SignUpInput,
  SignUpRequest,
} from '@/services/supabase/auth/supabase.interface';

function SignUpForm() {
  const { control, handleSubmit, setError } = useForm<SignUpInput>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(signUpInputSchema),
  });

  const [signUp, { isLoading }] = useSignUpMutation();

  async function submit({ email, password }: SignUpRequest) {
    const result = await signUp({ email, password });

    if ('error' in result) {
      const message = CustomerQueryError.parse(result).error.data.message;
      setError('password', { message });
      setError('email', { message });
    }
  }

  return (
    <>
      <Controller
        control={control}
        name="email"
        render={({
          field: { onBlur, onChange, value },
          fieldState: { error },
        }) => (
          <Input
            onBlur={onBlur}
            value={value}
            onChangeText={(val) => onChange(val)}
            error={error?.message}
            label="Email"
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
            onBlur={onBlur}
            value={value}
            onChangeText={(val) => onChange(val)}
            error={error?.message}
            label="Password"
            placeholder="********"
            type="password"
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({
          field: { onBlur, onChange, value },
          fieldState: { error },
        }) => (
          <Input
            onBlur={onBlur}
            value={value}
            onChangeText={(val) => onChange(val)}
            label="Confirm Password"
            error={error?.message}
            placeholder="********"
            type="password"
          />
        )}
      />
      <PrimaryButton
        label="Sign Up"
        onPress={handleSubmit(submit)}
        isLoading={isLoading}
      />
    </>
  );
}

export default SignUpForm;
