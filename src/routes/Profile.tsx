import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { AccountSheet } from '@/components/organisms/account.sheet';
import { SubscriptionSheet } from '@/components/organisms/subscription.sheet';
import { config } from '@/config';
import { useGetUserProfileQuery } from '@/services/spotify/user/user.endpoint';
import { useLazySignOutQuery } from '@/services/supabase/auth/auth.endpoints';
import { ChevronRight, DollarSign, UserCog } from '@tamagui/lucide-icons';
import { Sheet } from '@tamagui/sheet';
import { useState } from 'react';
import {
  Avatar,
  Button,
  H6,
  ListItem,
  Paragraph,
  YGroup,
  YStack,
} from 'tamagui';

type SheetComponent = 'account' | 'subscription' | undefined;

export function Profile() {
  const { data } = useGetUserProfileQuery(undefined);
  const [signOut] = useLazySignOutQuery();
  const [sheet, setSheet] = useState<SheetComponent>(undefined);

  function handleCloseSheet() {
    setSheet(undefined);
  }

  return (
    <>
      <YStack
        fullscreen
        bg="$primary700"
        px={16}
        pt={84}
        pb={24}
        justifyContent="space-between"
      >
        <YStack gap={16}>
          <YStack>
            <H6
              pl={16}
              pb={4}
              width="100%"
              color="$lightText"
              textTransform="uppercase"
            >
              spotify account
            </H6>
            <ListItem
              title={data?.display_name}
              subTitle={data?.email}
              icon={
                <Avatar
                  circular
                  size="$4"
                  borderWidth={1}
                  borderColor="$primary400"
                  bg="$primary400"
                  elevate
                >
                  <Avatar.Image src={data?.images[1]?.url} />
                  <Avatar.Fallback bc="$brand" />
                </Avatar>
              }
              radiused
            />
          </YStack>

          <YStack>
            <H6
              pl={16}
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
                iconAfter={<ChevronRight size={18} />}
                pressStyle={{ bg: '$primary300' }}
                onPress={() => setSheet('account')}
              />

              <ListItem
                title="Subscription"
                subTitle="Change your subscription plan"
                icon={<DollarSign size={24} />}
                iconAfter={<ChevronRight size={18} />}
                pressStyle={{ bg: '$primary300' }}
                onPress={() => setSheet('subscription')}
              />
            </YGroup>
          </YStack>
        </YStack>

        <YStack gap={16}>
          <Paragraph
            textAlign="center"
            color="$lightText"
          >{`Version ${config.meta.appVersion}`}</Paragraph>
          <ConfirmDialog
            title="Sign out"
            description="Are you sure?"
            action={() => signOut()}
            renderTrigger={() => <Button width="100%">Sign Out</Button>}
          />
        </YStack>
      </YStack>

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
