import { z } from 'zod';

const envVariables = z.object({
	EXPO_PUBLIC_APTABASE_KEY: z.string(),
	EXPO_PUBLIC_SUPABASE_URL: z.string(),
	EXPO_PUBLIC_SUPABASE_KEY: z.string(),
	EXPO_PUBLIC_SPOTIFY_CLIENT_ID: z.string(),
	EXPO_PUBLIC_REVENUE_CAT_KEY: z.string(),
});

envVariables.parse(process.env);

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envVariables> {}
	}
}
