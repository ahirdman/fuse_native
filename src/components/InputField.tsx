import { X } from '@tamagui/lucide-icons';
import { ReactNode } from 'react';
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
  YStackProps,
  styled,
} from 'tamagui';
import { isDefined } from 'util/assert';

interface InputFieldProps<T extends FieldValues> extends InputProps {
  controlProps: UseControllerProps<T>;
  label?: string | undefined;
  stackProps?: YStackProps | undefined;
  iconLeft?: ReactNode;
}

export function InputField<T extends FieldValues>({
  controlProps,
  label,
  stackProps,
  iconLeft,
  ...props
}: InputFieldProps<T>) {
  const { field, fieldState } = useController(controlProps);

  return (
    <YStack {...stackProps}>
      {label && <Label>{label}</Label>}
      {iconLeft && (
        <XStack
          position="absolute"
          left={12}
          top={12}
          zIndex={2}
          justifyContent="center"
          alignItems="center"
        >
          {iconLeft}
        </XStack>
      )}
      <StyledInputField
        onBlur={field.onBlur}
        onChangeText={field.onChange}
        value={field.value}
        ref={field.ref}
        // @ts-ignore
        error={isDefined(fieldState.error)}
        pl={isDefined(iconLeft) ? 40 : 12}
        {...props}
      />
      {field.value && (
        <XStack
          position="absolute"
          right={12}
          top={56}
          justifyContent="center"
          alignItems="center"
          onPress={() => field.onChange('')}
        >
          <X color="$lightText" size={16} />
        </XStack>
      )}
      <ErrorBody h={fieldState.error ? 20 : 0}>
        {fieldState.error?.message}
      </ErrorBody>
    </YStack>
  );
}

const StyledInputField = styled(Input, {
  name: 'InputField',
  h: 40,
  borderRadius: 4,
  bg: '$primary600',
  focusStyle: {
    borderColor: '$border300',
  },
  selectionColor: '#F4753F',

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
