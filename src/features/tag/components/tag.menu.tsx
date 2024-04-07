import { MoreVertical } from '@tamagui/lucide-icons';
import * as DropdownMenu from 'zeego/dropdown-menu';

interface TagEditMenuProps {
  onEditPress?(): void;
  onDeletePress(): void;
}

export function TagEditMenu({ onEditPress, onDeletePress }: TagEditMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <MoreVertical />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        {onEditPress && (
          <DropdownMenu.Item key="one" onSelect={onEditPress}>
            <DropdownMenu.ItemIcon ios={{ name: 'pencil' }} />
            <DropdownMenu.ItemTitle>Edit Tag</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        )}

        <DropdownMenu.Item key="two" destructive onSelect={onDeletePress}>
          <DropdownMenu.ItemIcon ios={{ name: 'trash' }} />
          <DropdownMenu.ItemTitle>Delete Tag</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
