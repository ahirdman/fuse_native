import { X } from '@tamagui/lucide-icons';
import type { ReactNode } from 'react';
import {
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form';
import {
  Input,
  type InputProps,
  Label,
  type LabelProps,
  Text,
  View,
  YStack,
  type YStackProps,
  styled,
} from 'tamagui';

import { isDefined } from 'util/assert';

interface InputFieldProps<T extends FieldValues> extends InputProps {
  controlProps: UseControllerProps<T>;
  label?: string | undefined;
  stackProps?: YStackProps | undefined;
  labelProps?: LabelProps | undefined;
  iconLeft?: ReactNode;
}

export function InputField<T extends FieldValues>({
  controlProps,
  label,
  stackProps,
  labelProps,
  iconLeft,
  ...props
}: InputFieldProps<T>) {
  const { field, fieldState } = useController(controlProps);

  return (
    <YStack
      {...stackProps}
      pb={isDefined(fieldState.error) ? 0 : stackProps?.pb ? stackProps.pb : 20}
    >
      {label && (
        <Label
          unstyled
          color="$lightHeader"
          fontWeight="bold"
          pb={8}
          {...labelProps}
        >
          {label}
        </Label>
      )}
      <InputContainer error={isDefined(fieldState.error)}>
        {iconLeft && (
          <View jc="center" pl={12}>
            {iconLeft}
          </View>
        )}
        <StyledInputField
          onBlur={field.onBlur}
          onChangeText={field.onChange}
          value={field.value}
          ref={field.ref}
          error={isDefined(fieldState.error)}
          {...props}
        />
        {field.value && (
          <View jc="center" onPress={() => field.onChange('')}>
            <X color="$lightText" size={20} pl={34} />
          </View>
        )}
      </InputContainer>

      {fieldState.error?.message && (
        <ErrorBody
          animation="lazy"
          enterStyle={{ y: -30 }}
          h={20}
          pt={8}
          ai="center"
        >
          {fieldState.error.message}
        </ErrorBody>
      )}
    </YStack>
  );
}

const InputContainer = styled(View, {
  name: 'InputContainer',
  h: 40,
  bg: '$primary600',
  fd: 'row',

  borderRadius: 4,
  borderWidth: 1,
  borderColor: '$border400',

  overflow: 'hidden',

  focusStyle: {
    borderColor: '$border300',
  },

  variants: {
    error: {
      true: {
        bg: '$error400',
        borderColor: '$error500',
      },
    },
  } as const,
});

const StyledInputField = styled(Input, {
  name: 'InputField',
  h: '$full',
  f: 1,
  bg: '$colorTransparent',
  selectionColor: '#F4753F',
  color: 'white',
  borderWidth: 0,

  variants: {
    error: {
      true: {
        placeholderTextColor: '$error500',
      },
    },
  } as const,
});

const ErrorBody = styled(Text, {
  name: 'ErrorBody',
  color: '$error700',
  fontSize: 12,
  fontWeight: '500',
  zIndex: -1,
});
