import { Feather } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Box, HStack, Icon, Text } from "native-base";
import React, { memo } from "react";
import type { ReactElement } from "react";

interface ScreenHeaderProps extends NativeStackHeaderProps {
	leftElement?: ReactElement;
	title: string;
	rightElement?: ReactElement;
	bottomElement?: ReactElement;
}

function ScreenHeader({
	leftElement,
	title,
	rightElement,
	bottomElement,
	...props
}: ScreenHeaderProps) {
	return (
		<Box
			w="full"
			justifyContent="space-between"
			alignItems="center"
			bg="primary.300"
			p="2"
			safeAreaTop
			flexDir="row"
			borderBottomColor="border.400"
			borderWidth="0.5"
		>
			<HStack justifyContent="space-evenly" alignItems="center">
				<Box flex={1} justifyContent="center">
					<Icon
						as={<Feather name="chevron-left" />}
						size="xl"
						onPress={() => props.navigation.goBack()}
					/>
				</Box>

				<Box flex={3} alignItems="center">
					<Text>{title}</Text>
				</Box>

				<Box flex={1} justifyContent="center">
					{rightElement}
				</Box>
			</HStack>

			{bottomElement}
		</Box>
	);
}

export default memo(ScreenHeader);
