import { Alert } from 'components/Alert';
import { YStack } from 'tamagui';

export function ListEmptyComponent({
  isError,
  isFiltered,
  defaultLabel,
}: { isError: boolean; isFiltered: boolean; defaultLabel: string }) {
  const alertLabel = isError
    ? 'Error fetching tracks'
    : isFiltered
      ? 'No matches'
      : defaultLabel;

  return (
    <YStack p={16}>
      <Alert label={alertLabel} type={isError ? 'error' : 'info'} />
    </YStack>
  );
}
