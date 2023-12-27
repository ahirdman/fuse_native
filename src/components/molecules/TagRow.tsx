import { hexToRGBA } from "@/lib/util/color";
import { HStack, IPressableProps, Pressable, Square, Text } from "native-base";

interface TagListRowProps extends IPressableProps {
	tagColor: string;
	tagName: string;
}

function TagRow({ tagColor, tagName, ...props }: TagListRowProps) {
	const backgroundColor = hexToRGBA(tagColor, 0.1);

	return (
		<Pressable {...props}>
			<HStack
				h="60px"
				w="full"
				rounded="8"
				borderColor="border.400"
				borderWidth="1px"
				shadow="1"
				px="2"
				bg="primary.700"
				alignItems="center"
			>
				<Square
					bg={backgroundColor}
					boxSize="40px"
					rounded="8"
					mr="4"
					borderColor={tagColor}
					borderWidth="1px"
				/>
				<Text color="base.100">{tagName}</Text>
			</HStack>
		</Pressable>
	);
}

export default TagRow;
