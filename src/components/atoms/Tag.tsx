import { hexToRGBA } from "@/lib/util/color";
import {
	Box,
	IBoxProps,
	IPressableProps,
	ITextProps,
	Pressable,
} from "native-base";

type TagBadgeSize = "default" | "small";
type TagBadgeSizeProps<T> = { [K in TagBadgeSize]: T };

interface TagProps extends IPressableProps {
	name: string;
	color: string;
	size?: TagBadgeSize | undefined;
}

function TagBadge({ name, color, size = "default", ...props }: TagProps) {
	const badgeBackgroundColor = hexToRGBA(color, 0.1);

	const tagBadeSizeProps: TagBadgeSizeProps<IBoxProps> = {
		default: {
			px: "3.5",
			py: "1.5",
		},
		small: {
			px: "2",
			py: "0.5",
		},
	};

	const tagTextSizeProps: TagBadgeSizeProps<ITextProps> = {
		default: {},
		small: {
			fontSize: "xs",
		},
	};

	return (
		<Pressable accessibilityRole="button" {...props}>
			<Box
				borderColor={color}
				bg={badgeBackgroundColor}
				_text={{
					color: color,
					...tagTextSizeProps[size],
				}}
				rounded="8"
				borderWidth="0.3"
				{...tagBadeSizeProps[size]}
			>
				{name}
			</Box>
		</Pressable>
	);
}

export default TagBadge;
