import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase/supabase.init";
import { selectUserData } from "@/lib/supabase/supabase.queries";
import { isBoolean } from "@/lib/util/assert";
import { store } from "@/store/store";
import {
	setSpotifyUserId,
	setSubscription,
	setToken,
	signIn,
} from "@/store/user/user.slice";

import { SpotifyToken } from "@/store/user/user.interface";

function useAppDataLoader() {
	const [appReady, setAppReady] = useState(false);

	useEffect(() => {
		void supabase.auth
			.getSession()
			.then(async (fetchedSession) => {
				if (fetchedSession.data.session) {
					const userData = await selectUserData();

					if (userData && isBoolean(userData.is_subscribed)) {
						store.dispatch(
							setSubscription({ subscribed: userData.is_subscribed }),
						);
					}

					if (userData?.spotify_token_data) {
						const parsed = SpotifyToken.safeParse(userData.spotify_token_data);

						if (!parsed.success) {
							return;
						}

						if (userData.spotify_user_id) {
							store.dispatch(
								setSpotifyUserId({ id: userData.spotify_user_id }),
							);
						}

						store.dispatch(setToken({ ...parsed.data }));
					}

					store.dispatch(signIn({ id: fetchedSession.data.session.user.id }));
				}
			})
			.finally(() => setAppReady(true));
	}, []);

	return [appReady] as const;
}

export default useAppDataLoader;
