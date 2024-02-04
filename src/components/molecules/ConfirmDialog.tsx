import { ReactNode } from 'react';
import { AlertDialog, Button, XStack, YStack } from 'tamagui';

interface ConfitmDialogProps {
  action(): void;
  renderTrigger(): ReactNode;
  title: string;
  description: string;
}

export function ConfirmDialog({
  action,
  renderTrigger,
  title,
  description,
}: ConfitmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>{renderTrigger()}</AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack gap={16}>
            <AlertDialog.Title textAlign="center">{title}</AlertDialog.Title>
            <AlertDialog.Description textAlign="center">
              {description}{' '}
            </AlertDialog.Description>

            <XStack justifyContent="center" gap={16}>
              <AlertDialog.Cancel asChild>
                <Button>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="active" onPress={action}>
                  Sign Out
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
