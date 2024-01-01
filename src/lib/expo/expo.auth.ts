import { config } from "@/config";
import * as Burnt from "burnt";
import * as AuthSession from "expo-auth-session";
import { selecteUserSpotifyRefreshToken } from "../supabase/supabase.queries";
import { generateShortUUID } from "../util";
import { assertIsDefined } from "../util/assert";
import { redirectUri } from "./expo.linking";

const discovery = {
	authorizationEndpoint: "https://accounts.spotify.com/authorize",
	tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export async function authorizeSpotify(): Promise<
	AuthSession.TokenResponse | undefined
> {
	try {
		const state = generateShortUUID();

		const authRequestOptions: AuthSession.AuthRequestConfig = {
			responseType: AuthSession.ResponseType.Code,
			clientId: config.spotify.clientId,
			redirectUri,
			prompt: AuthSession.Prompt.Login,
			scopes: config.spotify.authScope,
			state: state,
		};

		const authRequest = new AuthSession.AuthRequest(authRequestOptions);

		const authorizeResult = await authRequest.promptAsync(discovery);

		if (authorizeResult.type !== "success") {
			throw new Error("oh no");
		}

		const tokenResult = await AuthSession.exchangeCodeAsync(
			{
				code: authorizeResult.params.code ?? "", //TODO Fix
				clientId: config.spotify.clientId,
				redirectUri,
				extraParams: {
					code_verifier: authRequest.codeVerifier || "",
				},
			},
			discovery,
		);

		return tokenResult;
	} catch (error) {
		Burnt.toast({
			title: "Something went wrong",
			preset: "error",
			message: "Spotify authorization did not work...",
		});
	}
}

export async function refreshSpotifyToken(): Promise<
	AuthSession.TokenResponse | undefined
> {
	try {
		const refreshToken = await selecteUserSpotifyRefreshToken();

		assertIsDefined(refreshToken);

		const request = await AuthSession.refreshAsync(
			{
				clientId: config.spotify.clientId,
				refreshToken,
			},
			discovery,
		);

		return request;
	} catch (error) {
		//TODO: Sometimes errors here, figure out why
		Burnt.toast({
			title: "Something went wrong",
			preset: "error",
			message: "Refreshing Spotify token did not work...",
		});
	}
}
