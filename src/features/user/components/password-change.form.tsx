import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { YStack } from 'tamagui';
import { z } from 'zod';

import { showToast } from 'util/toast';

import { Button } from 'components/Button';
import { InputFieldV2 } from 'components/InputFieldV2';
import { passwordSchema } from 'user/auth.interface';
import { useUpdatePasswordMutation } from 'user/queries/auth.endpoints';

const passwordChangeSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((schema) => schema.newPassword === schema.confirmNewPassword, {
    path: ['confirmNewPassword'],
    message: "Passwords don't match",
  });

type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;

interface PasswordChangeFormProps {
  onClose(): void;
}

export function PasswordChangeForm({ onClose }: PasswordChangeFormProps) {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const { control, handleSubmit, setError, reset } =
    useForm<PasswordChangeInput>({
      defaultValues: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      },
      resolver: zodResolver(passwordChangeSchema),
    });

  async function onSubmit(data: PasswordChangeInput) {
    const result = await updatePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });

    if ('error' in result) {
      setError('currentPassword', {
        message: result.error.message ?? 'Something went wrong',
      });
    }

    if ('data' in result) {
      reset();
      onClose();

      showToast({
        title: 'Password changed!',
        preset: 'done',
      });
    }
  }

  return (
    <YStack>
      <InputFieldV2
        controlProps={{ control, name: 'currentPassword' }}
        label="Current Password"
        secureTextEntry
        placeholder="********"
      />
      <InputFieldV2
        controlProps={{ control, name: 'newPassword' }}
        label="New Password"
        secureTextEntry
        placeholder="********"
      />
      <InputFieldV2
        controlProps={{ control, name: 'confirmNewPassword' }}
        label="Confirm Password"
        secureTextEntry
        placeholder="********"
      />

      <Button
        label="Submit"
        marginTop={16}
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
        isDisabled={isLoading}
      />
    </YStack>
  );
}
