import { Sheet, SheetProps } from 'tamagui';

import { TagForm } from 'tag/components/Tagform';
import { useCreateTag } from 'tag/queries/createTag';

interface CreateTagSheetPreops extends SheetProps {
  closeSheet(): void;
  isOpen: boolean;
  trackId?: string | undefined;
}

export function CreateTagSheet({
  isOpen,
  closeSheet,
  trackId,
  ...props
}: CreateTagSheetPreops) {
  const { mutate: createTag } = useCreateTag();

  return (
    <Sheet
      moveOnKeyboardChange
      open={isOpen}
      animation="quick"
      snapPointsMode="fit"
      disableDrag
      {...props}
    >
      <Sheet.Overlay
        onPress={closeSheet}
        animation="quick"
        enterStyle={{ opacity: 0.5 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame padding={20} borderRadius={28} pb={48}>
        <TagForm
          label="Create New Tag"
          closeAction={closeSheet}
          confirmAction={({ name, color }) =>
            createTag(
              { name, color, trackId: trackId },
              {
                onSuccess: () => {
                  closeSheet();
                },
              },
            )
          }
        />
      </Sheet.Frame>
    </Sheet>
  );
}
