import { MoreVertical } from '@tamagui/lucide-icons';
import * as DropdownMenu from 'zeego/dropdown-menu';

interface FriendProfileMenuProps {
  onDeletePress(): void;
}

export function FriendProfileMenu({ onDeletePress }: FriendProfileMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <MoreVertical />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item key="delete" destructive onSelect={onDeletePress}>
          <DropdownMenu.ItemIcon ios={{ name: 'trash' }} />
          <DropdownMenu.ItemTitle>Remove Friend</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
