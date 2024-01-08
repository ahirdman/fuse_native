import * as Constants from "expo-constants";
import { channel } from "expo-updates";
import { applicationConfiguration as defaultConfig } from "./config-default";

export interface EnvironmentConfig {
	supabase: {
		url: string;
		anonKey: string;
	};
	spotify: {
		clientId: string;
		baseUrl: string;
		authScope: string[];
	};
	expoAuth: {
		discovery: {
			authorizationEndpoint: string;
			tokenEndpoint: string;
		};
	};
}

export interface CommonConfig {
	eas: {
		channel: string;
	};
	meta: {
		appVersion: string;
	};
}

const commonConfig: CommonConfig = {
	eas: {
		channel: typeof channel === "string" ? channel : "NA",
	},
	meta: {
		appVersion: Constants.default.expoConfig?.version ?? "NA",
	},
};

export const config = {
	...commonConfig,
	...defaultConfig,
};
