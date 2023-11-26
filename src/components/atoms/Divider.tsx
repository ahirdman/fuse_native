import { Box, Divider as NativeDivider, Text } from "native-base";

import type { IBoxProps } from "native-base";

interface IHorizontalDividerProps extends IBoxProps {
	label?: string;
}

function HorizontalDivider({ label, ...props }: IHorizontalDividerProps) {
	return (
		<Box
			w="100%"
			marginBottom="4"
			flexDir="row"
			justifyContent="center"
			alignItems="center"
			overflow="hidden"
			{...props}
		>
			<NativeDivider maxW="100%" mx="5" />
			{label && (
				<Text color="singelton.white" fontWeight="bold">
					{label}
				</Text>
			)}
			<NativeDivider maxW="100%" mx="5" />
		</Box>
	);
}

export default HorizontalDivider;
