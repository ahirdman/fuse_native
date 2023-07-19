import { useForm } from 'react-hook-form';

import PageView from '@/components/atoms/PageView';
import ControlledInput from '@/components/atoms/ControlledInput';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import {
  supabaseCreateAccount,
  supabaseSignIn,
} from '@/lib/supabase/supabase.auth';
import { authorizeSpotify } from '@/lib/expo/expo.auth';

export interface IAuthInput {
  email: string;
  password: string;
}

export default function AuthView() {
  const { control, handleSubmit } = useForm<IAuthInput>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function signUp({ email, password }: IAuthInput) {
    void supabaseCreateAccount({ email, password });
  }

  function signIn({ email, password }: IAuthInput) {
    void supabaseSignIn({ email, password });
  }
  return (
    <PageView>
      <ControlledInput
        label="Email"
        control={control}
        name="email"
        rules={{ required: 'Username is required' }}
      />
      <ControlledInput
        label="Password"
        control={control}
        name="password"
        rules={{
          required: 'Password is required',
          maxLength: 72,
          minLength: 6,
        }}
      />

      <PrimaryButton
        label="Sign Up"
        bg="green.600"
        onPress={handleSubmit(signUp)}
      />

      <PrimaryButton
        label="Sign In"
        bg="green.600"
        onPress={handleSubmit(signIn)}
      />

      <PrimaryButton
        label="Spotify"
        bg="green.600"
        onPress={authorizeSpotify}
      />
    </PageView>
  );
}
