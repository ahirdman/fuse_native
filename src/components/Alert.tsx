import { AlertTriangle, Info } from '@tamagui/lucide-icons';
import { type GetProps, Text, View, styled } from 'tamagui';

interface AlertProps extends StyledAlertProps {
  label: string;
}

export function Alert({ label, ...props }: AlertProps) {
  return (
    <StyledAlert {...props}>
      {props.type === 'error' && <AlertTriangle color="$error700" mr={12} />}
      {props.type === 'info' && (
        <Info
          color="$border300"
          mr={12}
          size={props.size === 'small' ? 18 : 24}
        />
      )}
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
  borderRadius: 4,
  alignItems: 'center',

  variants: {
    size: {
      small: {
        p: 8,
      },
      default: {
        p: 16,
      },
      large: {
        p: 24,
      },
    },
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
    size: 'default',
  } as const,
});

export type StyledAlertProps = GetProps<typeof StyledAlert>;
