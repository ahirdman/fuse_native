import { Filter } from '@tamagui/lucide-icons';
import { IconButton } from 'components/IconButton';
import * as DropdownMenu from 'zeego/dropdown-menu';

interface FilterMenuProps {
  filterTags: boolean;
  setFilterTags(val: boolean): void;
}

export function FilterMenu({ filterTags, setFilterTags }: FilterMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton
          icon={
            <Filter size={16} color={filterTags ? '$brandDark' : 'white'} />
          }
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.CheckboxItem
          value={filterTags ? 'on' : 'off'}
          onValueChange={() => {
            setFilterTags(!filterTags);
          }}
          key="one"
        >
          <DropdownMenu.ItemIcon
            ios={{ name: filterTags ? 'eye.slash' : 'eye' }}
          />
          <DropdownMenu.ItemTitle>Hide tagged tracks</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIndicator />
        </DropdownMenu.CheckboxItem>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
