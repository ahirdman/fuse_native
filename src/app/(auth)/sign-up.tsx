import { useForm } from 'react-hook-form';

import PageView from '@/components/atoms/PageView';
import ControlledInput from '@/components/atoms/ControlledInput';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import { supabaseCreateAccount } from '@/lib/supabase/supabase.auth';

interface ISignUpInput {
  email: string;
  password: string;
  repeatPassword: string;
}

function SignUpView() {
  const { control, handleSubmit } = useForm<ISignUpInput>();

  function signUp({ email, password }: ISignUpInput) {
    // Submit should not allow password if not same as repeatPassword
    //
    void supabaseCreateAccount({ email, password });
  }

  return (
    <PageView>
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

      <ControlledInput
        placeholder="Repeat Password"
        control={control}
        name="repeatPassword"
        type="password"
        rules={{
          required: 'Password is required',
          maxLength: 72,
          minLength: 6,
        }}
      />

      <PrimaryButton label="Sign In" onPress={handleSubmit(signUp)} />
    </PageView>
  );
}

export default SignUpView;
