import { X } from '@tamagui/lucide-icons';
import {
  FieldValues,
  UseControllerProps,
  useController,
} from 'react-hook-form';
import {
  Input,
  InputProps,
  Label,
  Paragraph,
  XStack,
  YStack,
  styled,
} from 'tamagui';
import { isDefined } from 'util/assert';

const InputField = styled(Input, {
  name: 'InputField',
  h: 40,
  borderRadius: 4,
  bg: '$primary600',
  focusStyle: {
    borderColor: '$border300',
  },
  selectionColor: '#F3640B',

  variants: {
    error: {
      true: {
        bg: '$error400',
        borderColor: '$error500',
        placeholderTextColor: '$error500',
      },
    },
  },
});

const ErrorBody = styled(Paragraph, {
  name: 'ErrorBody',
  color: '$error700',
  fontSize: 12,
  fontWeight: '500',
});

interface InputFieldV2Props<T extends FieldValues> extends InputProps {
  controlProps: UseControllerProps<T>;
  label?: string | undefined;
}

export function InputFieldV2<T extends FieldValues>({
  controlProps,
  label,
  ...props
}: InputFieldV2Props<T>) {
  const { field, fieldState } = useController(controlProps);

  return (
    <YStack minHeight={56}>
      {label && <Label>{label}</Label>}
      <InputField
        onBlur={field.onBlur}
        onChangeText={field.onChange}
        value={field.value}
        ref={field.ref}
        // @ts-ignore
        error={isDefined(fieldState.error)}
        {...props}
      />
      {field.value && (
        <XStack
          position="absolute"
          right={12}
          top={12}
          justifyContent="center"
          alignItems="center"
          onPress={() => field.onChange('')}
        >
          <X color="$lightText" size={16} />
        </XStack>
      )}
      <ErrorBody h={20}>{fieldState.error?.message}</ErrorBody>
    </YStack>
  );
}
