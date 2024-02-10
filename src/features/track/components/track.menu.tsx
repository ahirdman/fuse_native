import { MoreVertical } from '@tamagui/lucide-icons';
import * as DropdownMenu from 'zeego/dropdown-menu';

interface TrackMenuProps {
  onDeletePress(): void;
}

export function TrackMenu({ onDeletePress }: TrackMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <MoreVertical />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item key="two" destructive onSelect={onDeletePress}>
          <DropdownMenu.ItemIcon ios={{ name: 'trash' }} />
          <DropdownMenu.ItemTitle>Remove track from tag</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
