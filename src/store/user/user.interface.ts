import { z } from "zod";

const appSubscription = z.object({
	subscribed: z.boolean(),
});
export type AppSubscription = z.infer<typeof appSubscription>;

export const spotifyToken = z.object({
	accessToken: z.string(),
	tokenType: z.string(),
	expiresIn: z.number().optional(),
	scope: z.string().optional(),
	idToken: z.string().optional(),
	issuedAt: z.number().optional(),
});
export type SpotifyToken = z.infer<typeof spotifyToken>;

const user = z.object({
	id: z.string(),
});
export type User = z.infer<typeof user>;

const spotifyUser = z.object({
	id: z.string(),
});
export type SpotifyUser = z.infer<typeof spotifyUser>;

const userState = z.object({
	user: user.optional(),
	spotifyToken: spotifyToken.optional(),
	appSubscription: appSubscription.optional(),
	spotifyUser: spotifyUser.optional(),
});
export type UserState = z.infer<typeof userState>;
