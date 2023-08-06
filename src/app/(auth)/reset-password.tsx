import { Controller, useForm } from 'react-hook-form';
import { Heading, Text } from 'native-base';

import PageView from '@/components/atoms/PageView';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import { useResetPasswordMutation } from '@/services/auth/auth.endpoints';
import { CustomerQueryError } from '@/services/auth/auth.interface';
import FormInputField from '@/components/atoms/FormInputField';

import type { ResetPasswordInput } from '@/services/auth/auth.interface';

function ResetPasswordView() {
  const { control, handleSubmit, setError } = useForm<ResetPasswordInput>({
    defaultValues: { email: '' },
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  async function submit({ email }: ResetPasswordInput) {
    const result = await resetPassword({ email });

    if ('error' in result) {
      const message = CustomerQueryError.parse(result).error.data.message;
      setError('email', { message });
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
          <FormInputField
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
        onPress={handleSubmit(submit)}
        isLoading={isLoading}
      />
    </PageView>
  );
}

export default ResetPasswordView;
