import { AlertTriangle } from '@tamagui/lucide-icons';
import { useForm } from 'react-hook-form';
import { Button, Paragraph, YStack } from 'tamagui';
import InputField from '../atoms/InputField';

export function DeleteAccountForm() {
  const { control, handleSubmit } = useForm<{ password: string }>({
    defaultValues: {
      password: '',
    },
  });

  function onSubmit(data: { password: string }) {
    console.log(data); //TODO: Call rpc
  }

  return (
    <YStack gap={16}>
      <Paragraph color="$lightText">
        Deleting your account is irreverseble.
      </Paragraph>
      <InputField
        label="Confirm Password"
        secureTextEntry
        type="password"
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
