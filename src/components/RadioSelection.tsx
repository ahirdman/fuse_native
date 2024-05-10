import type { ReactNode } from 'react';
import { useController } from 'react-hook-form';
import type { FieldValues, UseControllerProps } from 'react-hook-form';
import { H3, RadioGroup, XStack, YStack } from 'tamagui';
import type { ParagraphProps, XStackProps } from 'tamagui';

interface RadioSelectionArgs<T extends string, U extends FieldValues> {
  disableCondition?(item: T): boolean;
  LabelComponent?(option: T, index: number): ReactNode;
  rowStyle?(option: T, index: number): XStackProps;
  onChangeCallback?(): void;
  controlProps: UseControllerProps<U>;
  label?: string;
  options: T[];
  labelProps?: ParagraphProps;
}

export function RadioSelection<T extends string, U extends FieldValues>({
  disableCondition,
  LabelComponent,
  onChangeCallback,
  rowStyle,
  controlProps,
  label,
  options,
  labelProps,
}: RadioSelectionArgs<T, U>) {
  const { field } = useController(controlProps);

  return (
    <YStack>
      {label && <H3 mb={1}>{label}</H3>}

      <RadioGroup
        onValueChange={(e) => {
          onChangeCallback?.();
          field.onChange(e);
        }}
        value={field.value}
        ref={field.ref}
        accessibilityLabel={label}
        accessibilityHint="Klicka på ett av alternativen för att göra ett val"
      >
        {options.map((option, index) => {
          const isDisabled = disableCondition
            ? disableCondition(option)
            : false;

          return (
            <XStack
              alignItems="center"
              minHeight={44}
              key={option}
              onPress={() => field.onChange(option)}
              {...rowStyle?.(field.value, index)}
            >
              <RadioGroup.Item
                value={option}
                disabled={isDisabled}
                backgroundColor="$base100"
                accessibilityHint={`Klicka för att välja ${option}`}
                accessibilityLabel={option}
                mx="$3"
                width={16}
                height={16}
                borderColor={isDisabled ? '$neutral70' : '$base40'}
                opacity={isDisabled ? 0.4 : 1}
              >
                <RadioGroup.Indicator bg="$primary40" width={10} height={10} />
              </RadioGroup.Item>

              {LabelComponent ? (
                LabelComponent(option, index)
              ) : (
                <H3
                  color={isDisabled ? '$border400' : 'white'}
                  width={labelProps?.w ?? '100%'}
                  maxFontSizeMultiplier={1.5}
                  {...labelProps}
                >
                  {option}
                </H3>
              )}
            </XStack>
          );
        })}
      </RadioGroup>
    </YStack>
  );
}
