import { useAppSelector } from '@/store/hooks';
import { AlertTriangle, LockKeyhole, XCircle } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { Button, H4, H6, Paragraph, XStack, YStack } from 'tamagui';
import { DeleteAccountForm } from '../molecules/delete-account.form';
import { PasswordChangeForm } from '../molecules/password-change.form';

interface SheetProps {
  onClose(): void;
  title: string;
}

type AccountOption = 'passwordChange' | 'deleteAccount' | undefined;

export function AccountSheet({ onClose, title }: SheetProps) {
  const [optionSelected, setOptionSelected] =
    useState<AccountOption>(undefined);
  const user = useAppSelector((state) => state.user.user);

  const sheetTitle = !optionSelected
    ? title
    : optionSelected === 'deleteAccount'
      ? 'Delete Account'
      : 'Change Password';

  return (
    <YStack gap={16}>
      <XStack justifyContent="space-between" alignItems="center">
        <H4>{sheetTitle}</H4>
        <XCircle onPress={onClose} />
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
        <PasswordChangeForm onClose={onClose} />
      )}
      {optionSelected === 'deleteAccount' && <DeleteAccountForm />}
    </YStack>
  );
}
