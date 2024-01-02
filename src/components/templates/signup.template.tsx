import { Box, VStack } from "native-base";
import { ReactElement } from "react";
import PageView from "../atoms/PageView";

interface SignUpTemplateProps {
	renderBody(): ReactElement;
	renderFooter(): ReactElement;
}

export function SignUpTemplate({
	renderBody,
	renderFooter,
}: SignUpTemplateProps) {
	return (
		<PageView>
			<Box
				flex={1}
				w="full"
				safeAreaBottom
				mt="4"
				justifyContent="space-between"
			>
				<VStack space="4">{renderBody()}</VStack>

				<VStack>{renderFooter()}</VStack>
			</Box>
		</PageView>
	);
}
