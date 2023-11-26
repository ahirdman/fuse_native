import { applicationConfiguration as defaultConfig } from "./config-default";
import { applicationConfiguration as testConfig } from "./config-test";

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
}

const { NODE_ENV } = process.env;

export const config = NODE_ENV === "production" ? testConfig : defaultConfig;
