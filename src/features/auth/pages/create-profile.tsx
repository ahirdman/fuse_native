import { zodResolver } from '@hookform/resolvers/zod';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, H3, Spinner, View, YStack } from 'tamagui';

import { useSignUp } from 'auth/proivders/signUp.provider';
import {
  type Profile,
  profileSchmea,
  useCreateProfile,
} from 'auth/queries/createProfile';
import { InputField } from 'components/InputField';
import { Text } from 'components/Text';
import { UserAvatar } from 'components/UserAvatar';
import { showToast } from 'util/toast';

function CreateProfilePage() {
  const { dispatch, nextPage } = useSignUp();
  const { mutate: createProfile, isPending } = useCreateProfile();
  const { control, setValue, watch, handleSubmit } = useForm<Profile>({
    defaultValues: {
      username: '',
      avatarUrl: undefined,
    },
    resolver: zodResolver(profileSchmea),
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

  async function onSubmit(data: Profile) {
    createProfile(
      {
        username: data.username,
        avatarUrl: data.avatarUrl,
      },
      {
        onError: () => {
          showToast({
            title: 'Could not create profile',
            preset: 'error',
          });
        },
        onSuccess: (_, input) => {
          dispatch({ type: 'submitProfile', payload: input });
          nextPage();
        },
      },
    );
  }

  return (
    <View
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
    </View>
  );
}

export { CreateProfilePage };
