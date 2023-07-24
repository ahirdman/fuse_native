import { Controller, useForm } from 'react-hook-form';
import { Heading, Text } from 'native-base';
import { z } from 'zod';

import PageView from '@/components/atoms/PageView';
import Input from '@/components/atoms/ControlledInput';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import { supabaseResetPassword } from '@/lib/supabase/supabase.auth';

const emailSchema = z.object({
  email: z.string().email({ message: 'Invalid Email' }),
});

type IEmailInput = z.infer<typeof emailSchema>;

function ResetPasswordView() {
  const { control, handleSubmit, setError } = useForm<IEmailInput>({
    defaultValues: { email: '' },
  });

  async function resetPassword({ email }: IEmailInput) {
    const error = await supabaseResetPassword(email);

    if (error) {
      setError('email', { message: error.message });
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
            placeholder="Email"
            keyboardType="email-address"
          />
        )}
      />

      <PrimaryButton
        label="Restore Password"
        onPress={handleSubmit(resetPassword)}
      />
    </PageView>
  );
}

export default ResetPasswordView;
