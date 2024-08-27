import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Spinner, YStack } from 'tamagui';
import { z } from 'zod';

import { showToast } from 'util/toast';

import { passwordSchema } from 'auth/queries/signIn';
import { useUpdatePassword } from 'auth/queries/updatePassword';
import { InputField } from 'components/InputField';

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
  const { mutate: updatePassword, isPending: isLoading } = useUpdatePassword();
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
    updatePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onError: (error) => {
          setError('currentPassword', {
            message: error.message,
          });
        },
        onSuccess: () => {
          reset();
          onClose();

          showToast({
            title: 'Password changed!',
            preset: 'done',
          });
        },
      },
    );
  }

  return (
    <YStack>
      <InputField
        controlProps={{ control, name: 'currentPassword' }}
        label="Current Password"
        secureTextEntry
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

      <Button
        mt={42}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        fontWeight="bold"
        bg="$brandDark"
      >
        {isLoading && (
          <Button.Icon>
            <Spinner />
          </Button.Icon>
        )}
        Submit
      </Button>
    </YStack>
  );
}
