import { applicationConfiguration as defaultConfig } from "./config-default";

export interface ApplicationConfiguration {
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

export const config = defaultConfig;
