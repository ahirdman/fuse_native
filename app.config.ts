import type { ExpoConfig } from "expo/config";

// biome-ignore lint/suspicious/noExplicitAny: reason
type ExpoPlugins = (string | [] | [string] | [string, any])[];

function expoPlugins(env: string): ExpoPlugins {
	const common = ["sentry-expo", "expo-build-properties"];

	switch (env) {
		case "development":
			return [
				...common,
				[
					"expo-build-properties",
					{
						ios: {
							flipper: true,
						},
					},
				],
			];

		default:
			return common;
	}
}

export default (): ExpoConfig => {
	const plugins = expoPlugins(process.env.EAS_ENV as string);
	const backgroundColor = "#1C1C1C";

	return {
		name: "Fuse - Playlist Manager",
		slug: "fuse",
		version: "0.0.1",
		orientation: "portrait",
		icon: "./assets/icons/app_icon.png",
		scheme: "fuse",
		userInterfaceStyle: "automatic",
		splash: {
			image: "./assets/images/splash.png",
			resizeMode: "contain",
			backgroundColor,
		},
		assetBundlePatterns: ["**/*"],
		ios: {
			supportsTablet: false,
			bundleIdentifier: "com.ahirdman.fuse",
		},
		android: {
			adaptiveIcon: {
				foregroundImage: "./assets/images/adaptive-icon.png",
				backgroundColor,
			},
		},
		plugins,
		hooks: {
			postPublish: [
				{
					file: "sentry-expo/upload-sourcemaps",
					config: {
						organization: "nomad-1l",
						project: "fuse",
					},
				},
			],
		},
		experiments: {
			tsconfigPaths: true,
		},
		extra: {
			eas: {
				projectId: "deeb4c71-d291-4e30-b509-43b38582400a",
			},
		},
		owner: "ahirdman",
	};
};
