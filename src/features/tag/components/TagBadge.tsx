import { CheckCircle2 } from '@tamagui/lucide-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Paragraph, XStack, type XStackProps } from 'tamagui';

import { hexToRGBA } from 'util/color';

type TagColor =
  | { type: 'tag'; color: string }
  | { type: 'fuse'; colors: string[] };

interface TagProps extends XStackProps {
  name: string;
  color: TagColor;
  selected?: boolean;
}

export function TagBadge({ name, color, selected, ...props }: TagProps) {
  const gradientColors =
    color.type === 'tag'
      ? [hexToRGBA(color.color, 0.1), hexToRGBA(color.color, 0.1)]
      : color.colors;
  const fontColor = color.type === 'tag' ? color.color : 'white';

  return (
    <XStack {...props}>
      <LinearGradient
        colors={gradientColors}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 4,
          paddingVertical: 4,
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Paragraph fontWeight="bold" color={fontColor}>
          {name}
        </Paragraph>
        {selected && <CheckCircle2 color={fontColor} size={20} />}
      </LinearGradient>
    </XStack>
  );
}
