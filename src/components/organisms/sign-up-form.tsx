import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import FormInputField from '../atoms/FormInputField';

import PrimaryButton from '@/components/atoms/PrimaryButton';
import {
  CustomerQueryError,
  signUpInputSchema,
} from '@/services/auth/auth.interface';
import { useSignUpMutation } from '@/services/auth/auth.endpoints';

import type {
  SignUpInput,
  SignUpRequest,
} from '@/services/auth/auth.interface';

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
          <FormInputField
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
          <FormInputField
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
          <FormInputField
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
