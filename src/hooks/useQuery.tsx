import { useEffect, useState } from "react";

import type { PostgrestSingleResponse } from "@supabase/supabase-js";

function useQuery<T>(queryFn: () => Promise<PostgrestSingleResponse<T>>) {
	const [data, setData] = useState<T>();
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		setIsLoading(true);

		async function execute() {
			const { data: queryData, error: queryError } = await queryFn();

			queryError ? setIsError(true) : setData(queryData);
		}

		void execute();

		setIsLoading(false);
	}, [queryFn]);

	return { data, isLoading, isError };
}

export default useQuery;
