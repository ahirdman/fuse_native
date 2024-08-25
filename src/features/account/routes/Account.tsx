import {
  type BottomSheetModal,
  BottomSheetModalProvider,
  useBottomSheet,
} from '@gorhom/bottom-sheet';
import {
  AlertTriangle,
  ArrowUpDown,
  ArrowUpRightFromSquare,
  ChevronRight,
  DollarSign,
  Image,
  Link2,
  LockKeyhole,
  Palette,
  UserCog,
  XCircle,
} from '@tamagui/lucide-icons';
import * as Application from 'expo-application';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  H3,
  H4,
  H6,
  ListItem,
  Paragraph,
  XStack,
  YGroup,
  YStack,
} from 'tamagui';

import { config } from 'config';
import { useAppDispatch, useAppSelector } from 'store/hooks';

import { signOut } from 'auth/auth.slice';
import { selectUserId } from 'auth/auth.slice';
import { DetachedModal } from 'components/DetachedModal';
import { Text } from 'components/Text';
import { UserAvatar } from 'components/UserAvatar';
import { useGetUser } from 'social/queries/getUser';
import type { AppSubscription } from 'subscription/subscription.interface';
import { DeleteAccountForm } from 'user/components/delete-account.form';
import { PasswordChangeForm } from 'user/components/password-change.form';

export function Account() {
  const signOutBottomSheetRef = useRef<BottomSheetModal>(null);
  const accountBottomSheetRef = useRef<BottomSheetModal>(null);
  const subscriptionBottomSheetRef = useRef<BottomSheetModal>(null);

  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const appVersion = `Version ${config.meta.appVersion} (${Application.nativeBuildVersion})`;
  const userId = useAppSelector(selectUserId);
  const { data } = useGetUser(userId);

  const handlePresentSignOutModal = useCallback(() => {
    signOutBottomSheetRef.current?.present();
  }, []);

  const handlePresentAccountModal = useCallback(() => {
    accountBottomSheetRef.current?.present();
  }, []);

  const handlePresentSubscriptionModal = useCallback(() => {
    subscriptionBottomSheetRef.current?.present();
  }, []);

  return (
    <BottomSheetModalProvider>
      <YStack
        fullscreen
        bg="$primary700"
        px={16}
        pt={24}
        pb={insets.bottom}
        justifyContent="space-between"
      >
        <YStack gap={16}>
          <XStack ai="center" space>
            <UserAvatar imageUrl={data?.avatar_url} />
            <H6
              fontWeight="bold"
              fontSize="$8"
              lineHeight="$8"
              textAlign="center"
              textTransform="uppercase"
              color="$brandDark"
            >
              {data?.name}
            </H6>
          </XStack>
          <YStack>
            <H6
              pb={4}
              width="100%"
              color="$lightText"
              textTransform="uppercase"
            >
              spotify
            </H6>
            <YGroup width="$full" mb={8}>
              <ListItem //TODO: Link to connected profile on spotify - or simply display name?
                title="Cream Beam"
                subTitle="Spotify Account"
                iconAfter={
                  <ArrowUpRightFromSquare size={18} color="$brandDark" />
                }
                onPress={() => console.debug('Not implemented')}
              />
            </YGroup>
          </YStack>

          <YStack>
            <H6
              pb={4}
              width="100%"
              color="$lightText"
              textTransform="uppercase"
            >
              account
            </H6>
            <YGroup width="$full" mb={8}>
              <ListItem
                title="Credentials"
                subTitle="Edit your account"
                icon={<UserCog size={24} />}
                iconAfter={<ChevronRight size={18} color="$brandDark" />}
                pressStyle={{ bg: '$primary300' }}
                onPress={handlePresentAccountModal}
              />

              <ListItem
                title="Subscription"
                subTitle="View your subscription plan"
                icon={<DollarSign size={24} />}
                iconAfter={<ChevronRight size={18} color="$brandDark" />}
                pressStyle={{ bg: '$primary300' }}
                onPress={handlePresentSubscriptionModal}
              />
            </YGroup>
          </YStack>

          <YStack>
            <H6
              pb={4}
              width="100%"
              color="$lightText"
              textTransform="uppercase"
            >
              profile
            </H6>
            <YGroup width="$full" mb={8}>
              <ListItem //TODO: Add functionality and read color in profile page
                title="Color"
                subTitle="Change profile header color"
                icon={<Palette size={24} />}
                iconAfter={<ChevronRight size={18} color="$brandDark" />}
                pressStyle={{ bg: '$primary300' }}
                onPress={() => console.debug('Not implemented')}
              />

              <ListItem
                title="Avatar"
                subTitle="Change your avatar picture"
                icon={<Image size={24} />}
                iconAfter={<ChevronRight size={18} color="$brandDark" />}
                pressStyle={{ bg: '$primary300' }}
                onPress={() => console.debug('Not implemented')}
              />
            </YGroup>
          </YStack>
        </YStack>

        <YStack gap={16}>
          <Paragraph textAlign="center" color="$lightText">
            {appVersion}
          </Paragraph>

          <Button
            bg="$error777"
            borderColor="$error600"
            color="$error700"
            onPress={handlePresentSignOutModal}
          >
            Sign Out
          </Button>
        </YStack>
      </YStack>

      <DetachedModal ref={signOutBottomSheetRef} style={styles.bottomSheet}>
        <H3 textAlign="center" pb={24}>
          Are you sure?
        </H3>

        <XStack w="$full" jc="space-evenly" gap={24} px={18}>
          <Button
            onPress={() => {
              dispatch(signOut());
            }}
            flex={1}
            bg="$error400"
            borderColor="$error500"
          >
            <Text color="$error700">Sign Out</Text>
          </Button>

          <Button
            onPress={() => signOutBottomSheetRef.current?.close()}
            flex={1}
          >
            Cancel
          </Button>
        </XStack>
      </DetachedModal>

      <DetachedModal ref={accountBottomSheetRef} style={styles.bottomSheet}>
        <AccountSheet title="Fuse Account" />
      </DetachedModal>

      <DetachedModal
        ref={subscriptionBottomSheetRef}
        style={styles.bottomSheet}
      >
        <SubscriptionSheet title="Subscription" />
      </DetachedModal>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: 'black',
  },
});

interface SheetProps {
  title: string;
}

type AccountOption = 'passwordChange' | 'deleteAccount' | undefined;

export function AccountSheet({ title }: SheetProps) {
  const [optionSelected, setOptionSelected] =
    useState<AccountOption>(undefined);
  const user = useAppSelector((state) => state.auth.user);
  const { close } = useBottomSheet();

  const sheetTitle = !optionSelected
    ? title
    : optionSelected === 'deleteAccount'
      ? 'Delete Account'
      : 'Change Password';

  return (
    <YStack gap={16}>
      <XStack justifyContent="space-between" alignItems="center">
        <H4>{sheetTitle}</H4>
        <XCircle onPress={() => close()} />
      </XStack>
      {optionSelected === undefined && (
        <YStack gap={16}>
          <XStack justifyContent="space-between">
            <Paragraph fontWeight="$8">Email:</Paragraph>
            <H6> {user?.email ?? 'No associated email'} </H6>
          </XStack>

          <Button
            justifyContent="flex-start"
            icon={LockKeyhole}
            onPress={() => setOptionSelected('passwordChange')}
          >
            Change Password
          </Button>

          <Button
            justifyContent="flex-start"
            bg="$error400"
            color="$error700"
            borderColor="$error700"
            borderWidth={0.5}
            icon={AlertTriangle}
            onPress={() => setOptionSelected('deleteAccount')}
          >
            Delete Account
          </Button>
        </YStack>
      )}
      {optionSelected === 'passwordChange' && (
        <PasswordChangeForm onClose={() => close()} />
      )}
      {optionSelected === 'deleteAccount' && <DeleteAccountForm />}
    </YStack>
  );
}

export function SubscriptionSheet({ title }: SheetProps) {
  const subscriptionData = useAppSelector((state) => state.auth.subscription);
  const { close } = useBottomSheet();

  return (
    <YStack gap={16}>
      <XStack justifyContent="space-between" alignItems="center">
        <H4>{title}</H4>
        <XCircle onPress={() => close()} />
      </XStack>
      <CurrentSubscription subscription={subscriptionData} />
    </YStack>
  );
}

interface CurrentSubscriptionProps {
  subscription?: AppSubscription | undefined;
}

function CurrentSubscription({ subscription }: CurrentSubscriptionProps) {
  if (!subscription) {
    return null;
  }

  const subscriptionType = subscription.productId.slice(4);
  const expirationDate = new Date(
    subscription.expirationDate ?? '',
  ).toDateString();

  return (
    <>
      <YStack justifyContent="space-between">
        <XStack justifyContent="space-between">
          <Paragraph fontWeight="$8">Current Subscription:</Paragraph>
          <H6 textTransform="capitalize">{subscriptionType}</H6>
        </XStack>

        <XStack justifyContent="space-between">
          <Paragraph fontWeight="$8">Subscription Renews:</Paragraph>
          <H6>{expirationDate}</H6>
        </XStack>
      </YStack>

      <Paragraph>
        To cancel, or change subscription. Go to your profile in App Store
      </Paragraph>
    </>
  );
}
