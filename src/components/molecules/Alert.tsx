import { Alert as BaseAlert, IAlertProps } from 'native-base';

type AlertVariant = 'error' | 'success' | 'warning' | 'info';
type AlertVariantProps<T> = { [K in AlertVariant]: T };

interface AlertProps extends IAlertProps {
  label: string;
  variant?: AlertVariant | undefined;
}

function Alert({ label, variant = 'error', ...props }: AlertProps) {
  const alertVariantProps: AlertVariantProps<IAlertProps> = {
    error: {
      bg: 'error.777',
      borderColor: 'error.600',
      _text: {
        color: 'error.700',
      },
    },
    success: {
      bg: 'success.500',
      borderColor: 'success.600',
      _text: {
        color: 'base.100',
      },
    },
    warning: {
      bg: 'warning.500',
      borderColor: 'warning.600',
      _text: {
        color: 'base.10',
      },
    },
    info: {
      bg: 'transparent',
      borderColor: 'transparent',
      _text: {
        color: 'base.100',
      },
    },
  };

  return (
    <BaseAlert borderWidth="1" {...alertVariantProps[variant]} {...props}>
      {label}
    </BaseAlert>
  );
}

export default Alert;
