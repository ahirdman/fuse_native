import { useForm } from 'react-hook-form';
import { Heading, Text } from 'native-base';

import PageView from '@/components/atoms/PageView';
import ControlledInput from '@/components/atoms/ControlledInput';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import { supabaseResetPassword } from '@/lib/supabase/supabase.auth';

interface IEmailInput {
  email: string;
}

function ResetPasswordView() {
  const { control, handleSubmit } = useForm({ defaultValues: { email: '' } });

  function resetPassword({ email }: IEmailInput) {
    void supabaseResetPassword(email);
  }

  return (
    <PageView justifyContent="">
      <Heading color="brand" size="2xl" paddingY="10">
        Reset Password
      </Heading>

      <Text paddingY="10">
        A link will be sent to your email to enable restoration of your password
      </Text>

      <ControlledInput
        placeholder="Email"
        control={control}
        name="email"
        rules={{ required: true }}
      />
      <PrimaryButton
        label="Restore Password"
        onPress={handleSubmit(resetPassword)}
      />
    </PageView>
  );
}

export default ResetPasswordView;
