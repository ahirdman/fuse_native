import {
  ArrowRight,
  MailCheck,
  MailQuestion,
  UserPlus,
} from '@tamagui/lucide-icons';
import { XStack } from 'tamagui';

import { Text } from 'components/Text';
import { UserAvatar } from 'components/UserAvatar';
import type { ReactNode } from 'react';
import { useGetAvatarUrl } from 'social/queries/getSignedAvatarUrl';
import type { UserRelation } from 'social/queries/getUsers';
import { useSendFriendRequest } from 'social/queries/sendFriendRequest';
import { showToast } from 'util/toast';

// TODO: User row avatar image
// - Handle url error with fallback
// - Match avatar size with fallback size
// - Loading state or just fallback

interface UserRowProps {
  onPress(): void;
  renderRight?(): ReactNode;
  avatarUrl?: string | undefined | null;
  username: string;
  relation: UserRelation;
  id: string;
}

export function UserRow({
  avatarUrl,
  username,
  relation,
  id,
  onPress,
  renderRight,
}: UserRowProps) {
  const { data: signedUrl } = useGetAvatarUrl(avatarUrl);

  return (
    <XStack
      bg="$primary800"
      borderRadius={8}
      ai="center"
      gap={12}
      p={12}
      onPress={onPress}
      jc="space-between"
    >
      <XStack ai="center" gap={12}>
        <UserAvatar imageUrl={signedUrl} />

        <Text fontWeight="bold" fontSize="$6">
          {username}
        </Text>
      </XStack>

      <StatusButton relation={relation} id={id} customRender={renderRight} />
    </XStack>
  );
}

interface StatusButtonProps {
  customRender?(): ReactNode;
  relation: UserRelation;
  id: string;
}

function StatusButton({ relation, id, customRender }: StatusButtonProps) {
  if (customRender) {
    return customRender();
  }

  switch (relation) {
    case 'friend': {
      return <ArrowRight />;
    }
    case 'requested_by': {
      return (
        <XStack px={18}>
          <MailQuestion size={20} />
        </XStack>
      );
    }
    case 'requested_to': {
      return (
        <XStack px={18}>
          <MailCheck size={20} />
        </XStack>
      );
    }
    case 'none': {
      const { mutate: sendFriendRequest } = useSendFriendRequest();

      return (
        <XStack
          bg="$primary700"
          px={18}
          py={8}
          borderRadius={4}
          borderColor="$border500"
          borderWidth={0.5}
          pressStyle={{ bg: '$border500' }}
          onPress={() =>
            sendFriendRequest(id, {
              onSuccess: () => {
                showToast({ title: 'Request sent', preset: 'done' });
              },
            })
          }
        >
          <UserPlus size={20} />
        </XStack>
      );
    }
  }
}
