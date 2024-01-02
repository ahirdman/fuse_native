import { config } from "@/config";
import * as Burnt from "burnt";
import * as AuthSession from "expo-auth-session";
import { generateShortUUID } from "../util";
import { redirectUri } from "./expo.linking";

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

		const authorizeResult = await authRequest.promptAsync(
			config.expoAuth.discovery,
		);

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
			config.expoAuth.discovery,
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
