import { Ionicons } from "@expo/vector-icons";
import { Box, Icon, Pressable } from "native-base";

import type { IIconProps, IPressableProps } from "native-base";
import type { ButtonSize } from "./Button";

interface IconButtonProps extends IPressableProps {
	color?: string | undefined;
	size?: ButtonSize;
	_icon?: IIconProps;
}

function IconButton({
	size = "default",
	color = "#FFFFFF",
	_icon,
	...props
}: IconButtonProps) {
	const height = {
		large: "52px",
		default: "40px",
		small: "28px",
	}[size];

	return (
		<Pressable boxSize={props.h ?? height} bg="primary.700" {...props}>
			{({ isPressed }) => (
				<Box
					flex={1}
					justifyContent="center"
					alignItems="center"
					borderColor={isPressed ? "#707070" : "border.400"}
					borderWidth="1"
					rounded="6"
				>
					<Icon
						size="sm"
						color={color}
						as={<Ionicons name="color-palette-outline" />}
						{..._icon}
					/>
				</Box>
			)}
		</Pressable>
	);
}

export default IconButton;
