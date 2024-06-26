import { zodResolver } from '@hookform/resolvers/zod';
import { XCircle } from '@tamagui/lucide-icons';
import { Controller, useForm } from 'react-hook-form';
import ColorPicker, { HueSlider } from 'reanimated-color-picker';
import { Button, H4, Paragraph, Spinner, XStack, YStack } from 'tamagui';
import { z } from 'zod';

import type { Tag } from 'tag/tag.interface';

import { InputField } from 'components/InputField';

const tagFormSchema = z.object({
  name: z.string().min(1, { message: 'Tag requires a name' }),
  color: z.string().min(1, { message: 'Tag requires a color' }),
});

export type TagFormInput = z.infer<typeof tagFormSchema>;

interface EditTagFormArgs {
  closeAction(): void;
  confirmAction(data: TagFormInput): void;
  label: string;
  existingTag?: Partial<Pick<Tag, 'color' | 'name'>> | undefined;
  isLoading?: boolean | undefined;
}

export function TagForm({
  closeAction,
  confirmAction,
  label,
  existingTag,
  isLoading,
}: EditTagFormArgs) {
  const { control, handleSubmit, reset } = useForm<TagFormInput>({
    defaultValues: {
      name: existingTag?.name ?? '',
      color: existingTag?.color ?? '#F4753F',
    },
    resolver: zodResolver(tagFormSchema),
  });

  async function onConfirm(data: TagFormInput): Promise<void> {
    confirmAction(data);
  }

  function onClose(): void {
    closeAction();
    reset();
  }

  return (
    <YStack gap={16}>
      <XStack justifyContent="space-between" alignItems="center">
        <H4>{label}</H4>
        <XCircle onPress={onClose} />
      </XStack>

      <YStack gap={4}>
        <Paragraph fontWeight="$8">Name</Paragraph>
        <InputField controlProps={{ control, name: 'name' }} />
      </YStack>

      <YStack gap={4}>
        <Paragraph fontWeight="$8">Color</Paragraph>
        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <ColorPicker
              value={field.value}
              onComplete={(c) => {
                field.onChange(c.hex);
              }}
            >
              <HueSlider boundedThumb />
            </ColorPicker>
          )}
        />
      </YStack>

      <Button onPress={handleSubmit(onConfirm)}>
        {isLoading ? <Spinner /> : 'Save'}{' '}
      </Button>
    </YStack>
  );
}
