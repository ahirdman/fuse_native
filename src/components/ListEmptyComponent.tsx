import { Alert, type StyledAlertProps } from 'components/Alert';

interface ListEmptyComponentProps extends StyledAlertProps {
  isError: boolean;
  isFiltered: boolean;
  defaultLabel: string;
}

export function ListEmptyComponent({
  isError,
  isFiltered,
  defaultLabel,
  size = 'default',
  ...props
}: ListEmptyComponentProps) {
  const alertLabel = isError
    ? 'Error fetching tracks'
    : isFiltered
      ? 'No matches'
      : defaultLabel;

  return (
    <Alert
      label={alertLabel}
      type={isError ? 'error' : 'info'}
      size={size}
      {...props}
    />
  );
}
