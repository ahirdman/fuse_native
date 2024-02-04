import { Heading, Text } from 'native-base';
import { useForm } from 'react-hook-form';

import Button from '@/components/atoms/Button';
import PageView from '@/components/atoms/PageView';
import { useResetPasswordMutation } from '@/services/supabase/auth/auth.endpoints';

import InputField from '@/components/atoms/InputField';
import type { ResetPasswordInput } from '@/services/supabase/auth/auth.interface';

function ResetPassword() {
  const { control, handleSubmit, setError } = useForm<ResetPasswordInput>({
    defaultValues: { email: '' },
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  async function submit({ email }: ResetPasswordInput) {
    const result = await resetPassword({ email });

    if ('error' in result) {
      setError('email', { message: 'Invalid email' });
    }
  }

  return (
    <PageView justifyContent="">
      <Heading color="brand" size="2xl" paddingY="10">
        Reset Password
      </Heading>

      <Text paddingY="10">
        A link will be sent to your email to enable restoration of your password
      </Text>

      <InputField
        controlProps={{ control, name: 'email' }}
        placeholder="Email"
        keyboardType="email-address"
      />

      <Button
        label="Restore Password"
        onPress={handleSubmit(submit)}
        isLoading={isLoading}
      />
    </PageView>
  );
}

export default ResetPassword;
