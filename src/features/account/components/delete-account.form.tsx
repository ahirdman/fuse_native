import { AlertTriangle } from '@tamagui/lucide-icons';
import { useForm } from 'react-hook-form';
import { Button, Paragraph, YStack } from 'tamagui';

import { useAppDispatch } from 'store/hooks';
import { showToast } from 'util/toast';

import { signOut } from 'auth/auth.slice';
import { type DeleteUserArgs, useDeleteUser } from 'auth/queries/deleteUser';
import { InputField } from 'components/InputField';

// TODO: Show info about spotify connection and what happens with subscription post deletion

export function DeleteAccountForm() {
  const { mutate: deleteUser } = useDeleteUser();
  const { control, handleSubmit } = useForm<DeleteUserArgs>({
    defaultValues: {
      password: '',
    },
  });

  const dispatch = useAppDispatch();

  function onSubmit({ password }: DeleteUserArgs) {
    deleteUser(
      { password },
      {
        onSuccess: () => {
          showToast({ title: 'Your account has been deleted', preset: 'done' });
        },
        onSettled: () => {
          dispatch(signOut());
        },
      },
    );
  }

  return (
    <YStack>
      <Paragraph color="$lightText">
        Deleting your account is irreverseble.
      </Paragraph>
      <InputField
        label="Confirm Password"
        secureTextEntry
        placeholder="********"
        controlProps={{ control, name: 'password' }}
      />
      <Button
        justifyContent="flex-start"
        bg="$error400"
        color="$error700"
        borderColor="$error700"
        borderWidth={0.5}
        icon={AlertTriangle}
        onPress={handleSubmit(onSubmit)}
      >
        Confirm
      </Button>
    </YStack>
  );
}
