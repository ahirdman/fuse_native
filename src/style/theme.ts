import { INativebaseConfig, extendTheme } from "native-base";

export const ApplicationTheme = extendTheme({
	colors: {
		brand: {
			light: "#F07123",
			default: "#F59E0B",
			dark: "#F3640B",
		},
		primary: {
			300: "#232323",
			400: "#505050",
			500: "#3d3e42",
			600: "#222222",
			700: "#1C1C1C",
		},
		success: {
			500: "#54976F",
			600: "#6CCC93",
		},
		error: {
			400: "#1D1415",
			777: "#261515",
			500: "#5F2324",
			600: "#772829",
			700: "#D45453",
		},
		warning: {
			500: "#E5A43B",
			600: "#FFCA75",
		},
		border: {
			300: "#707070",
			400: "#505050",
			500: "#3E3E3E",
		},
		base: {
			10: "#000000",
			100: "#FFFFFF",
		},
		singelton: {
			white: "#FFFFFF",
			black: "#000000",
			lightText: "#BBBBBB",
			darkText: "#191C1D",
			lightHeader: "#EDEDED",
		},
	},
	fontConfig: {
		Mulish: {
			200: {
				normal: "Mulish_200ExtraLight",
			},
			300: {
				normal: "Mulish_300Light",
			},
			400: {
				normal: "Mulish_400Regular",
			},
			500: {
				normal: "Mulish_500Medium",
			},
			600: {
				normal: "Mulish_600SemiBold",
			},
			700: {
				normal: "Mulish_700Bold",
			},
			800: {
				normal: "Mulish_800ExtraBold",
			},
			900: {
				normal: "Mulish_900Black",
			},
		},
	},
	fonts: {
		heading: "Mulish",
		body: "Mulish",
		mono: "Mulish",
	},
	components: {
		Text: {
			baseStyle: {
				color: "singelton.lightText",
			},
		},
		FormControlLabel: {
			baseStyle: {
				paddingBottom: 1,
				_text: {
					color: "singelton.lightText",
				},
			},
		},
		FormControlErrorMessage: {
			baseStyle: {
				_text: { color: "error.700" },
			},
		},
		Divider: {
			baseStyle: {
				bg: "border.500",
			},
		},
		Heading: {
			baseStyle: {
				color: "singelton.lightHeader",
			},
		},
	},
});

export type ApplicationTheme = typeof ApplicationTheme;

declare module "native-base" {
	interface ICustomTheme extends ApplicationTheme {}
}

export const nativeBaseConfig: INativebaseConfig = {
	strictMode: "warn",
};
