import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import Input from '@/components/atoms/Input';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import { supabaseCreateAccount } from '@/lib/supabase/supabase.auth';

const passwordSchema = z
  .string()
  .min(6, {
    message: 'Password cannot be shorter than 6 characters',
  })
  .max(72, { message: 'Password cannot be longer than 72 characters' });

const signUpschema = z
  .object({
    email: z.string().email({ message: 'Invalid Email' }),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    path: ['confirmPassword'],
    message: "Password don't match",
  });

type ISignUpInput = z.infer<typeof signUpschema>;

function SignUpForm() {
  const { control, handleSubmit, setError } = useForm<ISignUpInput>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(signUpschema),
  });

  async function signUp({ email, password }: ISignUpInput) {
    const { error } = await supabaseCreateAccount({ email, password });

    if (error) {
      setError('email', { message: error.message });
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
      <PrimaryButton label="Sign Up" onPress={handleSubmit(signUp)} />
    </>
  );
}

export default SignUpForm;
