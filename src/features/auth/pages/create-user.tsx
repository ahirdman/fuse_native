import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, H3, Spinner, View, YStack } from 'tamagui';

import { useSignUp } from 'auth/proivders/signUp.provider';
import {
  type CreateUserArgs,
  type CreateUserInput,
  createUserSchema,
  useCreateUser,
} from 'auth/queries/createUser';
import { InputField } from 'components/InputField';
import { Text } from 'components/Text';
import { isAuthError } from '@supabase/supabase-js';
import { showToast } from 'util/toast';

export function CreateUserPage() {
  const { mutate: createUser, isPending } = useCreateUser();
  const { control, handleSubmit, setError } = useForm<CreateUserInput>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(createUserSchema),
  });

  const { dispatch, nextPage } = useSignUp();
  const insets = useSafeAreaInsets();

  async function onSubmit({ email, password }: CreateUserArgs) {
    createUser(
      { email, password },
      {
        onError: (error) => {
          if (isAuthError(error)) {
            setError('email', { message: error.message });
          } else {
            showToast({
              title: "Something went wrong",
              preset: "error"
            })
          }
        },
        onSuccess: ({ user }) => {
          dispatch({
            type: 'submitUser',
            payload: { id: user.id, email: user.email },
          });
          nextPage();
        },
      },
    );
  }

  return (
    <View
      key="create-user"
      bg="$primary700"
      h="$full"
      w="$full"
      jc="space-between"
      pt={24}
      pb={insets.bottom}
      px={24}
    >
      <YStack>
        <H3>Enter credentials</H3>
        <Text>Your email will not be visible to anyone but you</Text>

        <YStack gap={16} pt={48}>
          <InputField
            label="Email"
            placeholder="Email"
            keyboardType="email-address"
            controlProps={{ control, name: 'email' }}
          />

          <InputField
            label="Password"
            secureTextEntry={!__DEV__}
            placeholder="********"
            aria-label="password"
            textContentType="password"
            controlProps={{ control, name: 'password' }}
          />

          <InputField
            label="Confirm Password"
            secureTextEntry={!__DEV__}
            aria-label="confirm-password"
            placeholder="********"
            textContentType="password"
            controlProps={{ control, name: 'confirmPassword' }}
          />
        </YStack>
      </YStack>

      <Button
        mb={16}
        onPress={handleSubmit(onSubmit)}
        bg="$brandDark"
        fontWeight="bold"
        fontSize="$5"
      >
        {isPending && (
          <Button.Icon>
            <Spinner />
          </Button.Icon>
        )}
        Continue
      </Button>
    </View>
  );
}
