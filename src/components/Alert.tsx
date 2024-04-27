import { AlertTriangle, Info } from '@tamagui/lucide-icons';
import { type GetProps, Text, View, styled } from 'tamagui';

interface AlertProps extends StyledAlertProps {
  label: string;
}

export function Alert({ label, ...props }: AlertProps) {
  return (
    <StyledAlert {...props}>
      {props.type === 'error' && <AlertTriangle color="$error700" mr={12} />}
      {props.type === 'info' && <Info color="$border300" mr={12} />}
      <Text
        color={
          props.type === 'error'
            ? '$error700'
            : props.type === 'success'
              ? '$white'
              : props.type === 'warning'
                ? '$black'
                : 'white'
        }
      >
        {label}
      </Text>
    </StyledAlert>
  );
}

const StyledAlert = styled(View, {
  flexDirection: 'row',
  borderWidth: 1,
  p: 16,
  borderRadius: 4,
  alignItems: 'center',

  variants: {
    type: {
      error: {
        bg: '$error777',
        borderColor: '$error600',
      },
      success: {
        bg: 'success.500',
        borderColor: 'success.600',
      },
      warning: {
        bg: 'warning.500',
        borderColor: 'warning.600',
      },
      info: {
        bg: '$primary600',
        borderColor: '$border500',
      },
    },
  },
  defaultVariants: {
    type: 'info',
  } as const,
});

export type StyledAlertProps = GetProps<typeof StyledAlert>;
