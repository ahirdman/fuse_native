import { zodResolver } from '@hookform/resolvers/zod';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, H3, Spinner, YStack } from 'tamagui';

import { showToast } from 'util/toast';

import { type Profile, profileSchema } from 'auth/auth.interface';
import { useSignUp } from 'auth/proivders/signUp.provider';
import { useCreateProfile } from 'auth/queries/createProfile';
import { InputField } from 'components/InputField';
import { Text } from 'components/Text';
import { UserAvatar } from 'components/UserAvatar';
import { KeyboardView } from 'primitives/KeyboardView';

export function CreateProfilePage() {
  const { dispatch, nextPage } = useSignUp();
  const { mutate: createProfile, isPending } = useCreateProfile();
  const { control, setValue, watch, handleSubmit, setError } = useForm<Profile>({
    defaultValues: {
      username: '',
      avatarUrl: undefined,
    },
    resolver: zodResolver(profileSchema),
  });

  const { avatarUrl } = watch();
  const insets = useSafeAreaInsets();

  async function handleSelectImage() {
    const result = await launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setValue('avatarUrl', result.assets[0]?.uri ?? 'NA');
    }
  }

  async function onSubmit({ username, avatarUrl }: Profile) {
    createProfile(
      { username, avatarUrl },
      {
        onError: (error) => {
          const invalidUsername = error.message.match(/users_name_key/g)

          if (invalidUsername) {
            setError("username", { message: "Username is already taken" })
          } else {
            showToast({
              title: 'Could not create profile',
              preset: 'error',
            });
          }
        },
        onSuccess: (data, input) => {
          dispatch({
            type: 'submitProfile',
            payload: {
              username: input.username,
              avatarUrl: data?.remoteAvatarUrl,
            },
          });
          nextPage();
        },
      },
    );
  }

  return (
    <KeyboardView
      key="create-profile"
      bg="$primary700"
      w="$full"
      h="$full"
      jc="space-between"
      ai="center"
      pt={24}
      pb={insets.bottom}
      px={24}
    >
      <YStack>
        <H3>Configure your profile</H3>
        <Text>
          You can change the image later, but your username can not be changed
        </Text>
      </YStack>

      <UserAvatar
        imageUrl={avatarUrl}
        size="xl"
        badge="edit"
        onPress={handleSelectImage}
      />

      <InputField
        stackProps={{ w: '$full' }}
        label="Username"
        controlProps={{ control, name: 'username' }}
      />

      <Button
        mb={16}
        bg="$brandDark"
        fontWeight="bold"
        fontSize="$5"
        onPress={handleSubmit(onSubmit)}
      >
        {isPending && (
          <Button.Icon>
            <Spinner />
          </Button.Icon>
        )}
        Continue
      </Button>
    </KeyboardView>
  );
}
