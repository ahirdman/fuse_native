import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, H1, Spinner, YStack } from 'tamagui';
import { isAuthError } from '@supabase/supabase-js';

import type { RootStackScreenProps } from 'navigation.types';

import { signIn as reduxSignIn } from 'auth/auth.slice';
import {
  type SignInInput,
  signInInputSchema,
  useSignIn,
} from 'auth/queries/signIn';
import { HorizontalDivider } from 'components/Divider';
import { InputField } from 'components/InputField';
import { useAppDispatch } from 'store/hooks';
import { showToast } from 'util/toast';

export function SignIn({ navigation }: RootStackScreenProps<'SignIn'>) {
  const { mutate: logIn, isPending } = useSignIn();
  const { control, handleSubmit, setError } = useForm<SignInInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInInputSchema),
  });

  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  function submit({ email, password }: SignInInput) {
    logIn(
      { email, password },
      {
        onError: (error) => {
          if (isAuthError(error)) {
            setError('password', { message: error.message });
            setError('email', { message: error.message });
          } else {
            showToast({
              title: "Something went wrong",
              preset: "error"
            })
          }
        },
        onSuccess: (data) => {
          dispatch(reduxSignIn(data));
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
      <YStack gap={18}>
        <H1
          color="$brandDark"
          textAlign="center"
          fontWeight="bold"
          fontSize="$16"
          pt={120}
        >
          FUSE
        </H1>

        <InputField
          label="Email"
          placeholder="Email"
          keyboardType="email-address"
          controlProps={{ control, name: 'email' }}
        />

        <InputField
          label="Password"
          placeholder="********"
          secureTextEntry
          controlProps={{ control, name: 'password' }}
        />

        <Button
          my={24}
          onPress={handleSubmit(submit)}
          bg="$brandDark"
          fontWeight="bold"
        >
          {isPending && (
            <Button.Icon>
              <Spinner />
            </Button.Icon>
          )}
          Sign In
        </Button>
      </YStack>

      <YStack w="100%">
        <HorizontalDivider label="or" />

        <Button
          my={16}
          onPress={() => navigation.push('SignUp')}
          fontWeight="bold"
        >
          Sign Up Now
        </Button>
      </YStack>
    </YStack>
  );
}
