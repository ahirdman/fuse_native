import { Alert, type StyledAlertProps } from 'components/Alert';
import { YStack } from 'tamagui';

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
}: ListEmptyComponentProps) {
  const alertLabel = isError
    ? 'Error fetching tracks'
    : isFiltered
      ? 'No matches'
      : defaultLabel;

  return (
    <YStack p={16}>
      <Alert label={alertLabel} type={isError ? 'error' : 'info'} size={size} />
    </YStack>
  );
}
