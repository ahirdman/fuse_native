import { Tables } from "@/lib/supabase/database.interface";
import { hexToRGBA } from "@/utils/color";
import { Box, IPressableProps, Pressable } from "native-base";

interface TagProps extends IPressableProps {
	tag: Tables<"tags">;
}

function Tag({ tag, ...props }: TagProps) {
	const badgeBackgroundColor = hexToRGBA(tag.color, 0.1);

	return (
		<Pressable accessibilityRole="button" {...props}>
			<Box
				borderColor={tag.color}
				bg={badgeBackgroundColor}
				_text={{
					color: tag.color,
				}}
				px="3.5"
				py="1.5"
				rounded="8"
				borderWidth="0.3"
			>
				{tag.name}
			</Box>
		</Pressable>
	);
}

export default Tag;
