import { X } from '@tamagui/lucide-icons';
import { useRef } from 'react';
import PagerView from 'react-native-pager-view';
import {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, H3, Stack, XStack, YStack } from 'tamagui';

import { usePager } from 'hooks/usePager';
import type { RootStackScreenProps } from 'navigation.types';
import { AnimatedView } from 'primitives/AnimatedView';
import { withHapticFeedback } from 'util/haptic';

import { AuthorizeSpotifyPage } from 'auth/pages/authorize-spotify';
import { CreateProfilePage } from 'auth/pages/create-profile';
import { CreateUserPage } from 'auth/pages/create-user';
import { PickSubscription } from 'auth/pages/pick-subscription';
import { SignUpProvider, useSignUp } from 'auth/proivders/signUp.provider';
import { useDeleteUser } from 'auth/queries/deleteUser';
import { BottomSheet, type BottomSheetMethods } from 'components/BottomSheet';
import { Text } from 'components/Text';

type Props = RootStackScreenProps<'SignUp'>;

export function SignUpView({ navigation }: Props) {
  const pager = usePager();
  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  function handleOnClose() {
    navigation.goBack();
  }

  return (
    <SignUpProvider nextPage={pager.nextPage}>
      <SignUpHeader
        onClose={() => bottomSheetRef.current?.expand()}
        currentPageIndex={pager.currentPageIndex}
      />
      <PagerView
        ref={pager.ref}
        scrollEnabled={false}
        initialPage={0}
        style={{ flex: 1 }}
        onPageSelected={pager.onPageSelected}
      >
        <CreateUserPage />
        <CreateProfilePage />
        <AuthorizeSpotifyPage />
        <PickSubscription />
      </PagerView>

      <BottomSheet ref={bottomSheetRef}>
        <CancelSignUpSheetContent
          handleClose={handleOnClose}
          handleResume={() => bottomSheetRef.current?.close()}
        />
      </BottomSheet>
    </SignUpProvider>
  );
}

function SignUpHeader({
  onClose,
  currentPageIndex,
}: { onClose(): void; currentPageIndex: number }) {
  const insets = useSafeAreaInsets();
  const height = 44;
  const signUpSteps = ['user', 'profile', 'spotify', 'subscription'];

  return (
    <XStack pt={insets.top} px={24} bg="$primary700">
      <Stack
        jc="center"
        flex={1}
        w="100%"
        h={height}
        onPress={withHapticFeedback(onClose, 'Medium')}
      >
        <X size={28} />
      </Stack>

      <XStack flex={1} w="$full" gap={8} h={height} jc="center" ai="center">
        {signUpSteps.map((val, index) => {
          const isCurrentStep = currentPageIndex === index;

          const animatedStyles = useAnimatedStyle(() => ({
            flexGrow: isCurrentStep ? withTiming(1) : withSpring(0),
          }));

          return (
            <AnimatedView
              key={val}
              h={4}
              w={12}
              borderRadius="$6"
              bg={isCurrentStep ? '$brandDark' : '$white'}
              style={animatedStyles}
            />
          );
        })}
      </XStack>

      <Stack flex={1} w="$full" jc="center" ai="flex-end" />
    </XStack>
  );
}

interface CancelSignUpSheetContentProps {
  handleClose(): void;
  handleResume(): void;
}

function CancelSignUpSheetContent(props: CancelSignUpSheetContentProps) {
  const { dispatch } = useSignUp();
  const { mutate: deleteUser } = useDeleteUser();

  function handleDeleteUser() {
    deleteUser(
      {},
      {
        onSettled() {
          dispatch({ type: 'cancel' });
          props.handleClose();
        },
      },
    );
  }

  return (
    <YStack>
      <H3 textAlign="center">Are you sure?</H3>
      <Text textAlign="center" pb={24}>
        Your progress will be <Text color="$error700">deleted</Text>
      </Text>

      <XStack w="$full" jc="space-evenly" gap={24} px={18}>
        <Button
          onPress={handleDeleteUser}
          flex={1}
          bg="$error400"
          borderColor="$error500"
        >
          <Text color="$error700">Close</Text>
        </Button>

        <Button onPress={props.handleResume} flex={1}>
          Return
        </Button>
      </XStack>
    </YStack>
  );
}
