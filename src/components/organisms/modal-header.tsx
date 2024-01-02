import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Box, HStack } from "native-base";
import { ReactElement } from "react";

interface ModalHeaderProps extends NativeStackHeaderProps {
	leftElement?(): ReactElement | undefined;
	centerElement?(): ReactElement | undefined;
	rightElement?(): ReactElement | undefined;
}

export function ModalHeader({
	leftElement,
	centerElement,
	rightElement,
}: ModalHeaderProps) {
	return (
		<HStack bg="primary.600" h="12" w="full" alignItems="center">
			<Box flex={1} boxSize="full">
				{leftElement?.()}
			</Box>

			<Box flex={2} boxSize="full" justifyContent="center">
				{centerElement?.()}
			</Box>

			<Box flex={1} boxSize="full" alignItems="center" justifyContent="center">
				{rightElement?.()}
			</Box>
		</HStack>
	);
}
