import { ChevronRight, DollarSign, UserCog } from '@tamagui/lucide-icons';
import { Sheet } from '@tamagui/sheet';
import * as Application from 'expo-application';
import { useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  H3,
  H6,
  ListItem,
  Paragraph,
  XStack,
  YGroup,
  YStack,
} from 'tamagui';

import { config } from 'config';
import { useAppDispatch } from 'store/hooks';

import { signOut } from 'auth/auth.slice';
import { BottomSheet, type BottomSheetMethods } from 'components/BottomSheet';
import { Text } from 'components/Text';
import { SubscriptionSheet } from 'subscription/components/subscription.sheet';
import { AccountSheet } from 'user/components/account.sheet';

type SheetComponent = 'account' | 'subscription' | undefined;

export function Settings() {
  const [sheet, setSheet] = useState<SheetComponent>(undefined);
  const dispatch = useAppDispatch();

  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const appVersion = `Version ${config.meta.appVersion} (${Application.nativeBuildVersion})`;

  function handleCloseSheet() {
    setSheet(undefined);
  }

  return (
    <>
      <YStack
        fullscreen
        bg="$primary700"
        px={16}
        pt={insets.top}
        pb={insets.bottom}
        justifyContent="space-between"
      >
        <YStack gap={16}>
          <YStack>
            <H6
              pb={4}
              width="100%"
              color="$lightText"
              textTransform="uppercase"
            >
              spotify account
            </H6>
          </YStack>

          <YStack>
            <H6
              pb={4}
              width="100%"
              color="$lightText"
              textTransform="uppercase"
            >
              fuse account
            </H6>
            <YGroup width="100%" mb={8}>
              <ListItem
                title="Credentials"
                subTitle="Edit your account"
                icon={<UserCog size={24} />}
                iconAfter={<ChevronRight size={18} color="$brandDark" />}
                pressStyle={{ bg: '$primary300' }}
                onPress={() => setSheet('account')}
              />

              <ListItem
                title="Subscription"
                subTitle="View your subscription plan"
                icon={<DollarSign size={24} />}
                iconAfter={<ChevronRight size={18} color="$brandDark" />}
                pressStyle={{ bg: '$primary300' }}
                onPress={() => setSheet('subscription')}
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
            onPress={() => bottomSheetRef.current?.expand()}
          >
            Sign Out
          </Button>
        </YStack>
      </YStack>

      <BottomSheet ref={bottomSheetRef}>
        <YStack>
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

            <Button onPress={() => bottomSheetRef.current?.close()} flex={1}>
              Cancel
            </Button>
          </XStack>
        </YStack>
      </BottomSheet>

      <Sheet
        modal
        moveOnKeyboardChange
        open={sheet !== undefined}
        animation="quick"
        snapPointsMode="fit"
      >
        <Sheet.Overlay
          onPress={handleCloseSheet}
          animation="quick"
          enterStyle={{ opacity: 0.5 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame padding={20} borderRadius={28} pb={48}>
          {sheet === 'account' && (
            <AccountSheet title="Fuse Account" onClose={handleCloseSheet} />
          )}
          {sheet === 'subscription' && (
            <SubscriptionSheet
              title="Subscription"
              onClose={handleCloseSheet}
            />
          )}
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
