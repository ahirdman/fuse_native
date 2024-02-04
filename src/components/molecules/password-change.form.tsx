import { useUpdatePasswordMutation } from '@/services/supabase/auth/auth.endpoints';
import { passwordSchema } from '@/services/supabase/auth/auth.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Burnt from 'burnt';
import { useForm } from 'react-hook-form';
import { YStack } from 'tamagui';
import { z } from 'zod';
import Button from '../atoms/Button';
import InputField from '../atoms/InputField';

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

      Burnt.toast({
        title: 'Password changed!',
        preset: 'done',
      });
    }
  }

  return (
    <YStack>
      <YStack gap={16}>
        <InputField
          controlProps={{ control, name: 'currentPassword' }}
          label="Current Password"
          secureTextEntry
          type="password"
          placeholder="********"
        />
        <InputField
          controlProps={{ control, name: 'newPassword' }}
          label="New Password"
          secureTextEntry
          placeholder="********"
        />
        <InputField
          controlProps={{ control, name: 'confirmNewPassword' }}
          label="Confirm Password"
          secureTextEntry
          placeholder="********"
        />
      </YStack>

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
