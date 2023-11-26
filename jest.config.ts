import type { Config } from "jest";

const config: Config = {
	rootDir: ".",
	preset: "jest-expo",
	setupFilesAfterEnv: ["./__test__/jest.setup.ts"],
	verbose: true,
	testEnvironment: "jsdom",
	moduleNameMapper: {
		"@/(.*)": "<rootDir>/src/$1",
	},
	transformIgnorePatterns: [
		"node_modules/(?!((jest-|sentry-expo)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
	],
};

export default config;
