import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { H1, YStack } from 'tamagui';

import type { RootStackScreenProps } from 'navigation.types';

import { Button } from 'components/Button';
import { HorizontalDivider } from 'components/Divider';
import { InputField } from 'components/InputField';
import { SignInInput, signInInputSchema, useSignIn } from 'user/queries/signIn';

export function SignIn({ navigation }: RootStackScreenProps<'SignIn'>) {
  const { control, handleSubmit, setError } = useForm<SignInInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInInputSchema),
  });

  const insets = useSafeAreaInsets();
  const { mutateAsync: logIn, isPending } = useSignIn();

  async function submit({ email, password }: SignInInput) {
    logIn(
      { email, password },
      {
        onError: (error) => {
          setError('password', { message: error.message });
          setError('email', { message: error.message });
        },
      },
    );
  }

  return (
    <YStack
      justifyContent="space-between"
      fullscreen
      bg="$primary700"
      px={16}
      pt={insets.top}
      pb={insets.bottom}
    >
      <YStack w="100%" alignItems="center">
        <H1 color="$brandDark" fontWeight="bold" fontSize="$16" pt={120}>
          FUSE
        </H1>

        <InputField
          label="Email"
          placeholder="Email"
          keyboardType="email-address"
          controlProps={{ control, name: 'email' }}
          _stack={{ m: 2 }}
        />

        <InputField
          label="Password"
          placeholder="********"
          secureTextEntry
          controlProps={{ control, name: 'password' }}
          _stack={{ m: 2 }}
        />

        <Button
          label="Sign In"
          my="4"
          onPress={handleSubmit(submit)}
          isLoading={isPending}
        />
      </YStack>

      <YStack w="100%" justifyContent="center" alignItems="center">
        <HorizontalDivider label="or" mt="100" />

        <Button
          my="4"
          type="secondary"
          label="Sign Up Now"
          onPress={() => navigation.push('SignUp')}
        />
      </YStack>
    </YStack>
  );
}
