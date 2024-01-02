import { handleAuthStateSignIn } from "@/lib/auth";
import { supabase } from "@/lib/supabase/supabase.init";
import { store } from "@/store/store";
import { useEffect, useState } from "react";

function useAppDataLoader() {
	const [appReady, setAppReady] = useState(false);

	useEffect(() => {
		void supabase.auth
			.getSession()
			.then(async (fetchedSession) => {
				if (!fetchedSession.data.session) return;

				void handleAuthStateSignIn(fetchedSession.data.session, store.dispatch);
			})
			.finally(() => setAppReady(true));
	}, []);

	return [appReady] as const;
}

export default useAppDataLoader;
