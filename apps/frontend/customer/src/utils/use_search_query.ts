import type { Dispatch, SetStateAction } from "react";
import { useCallback, useMemo } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ParseOptions } from "query-string";
import qs from "query-string";

import { removeFalsyFromObject } from "./remove_falsy_from_object";

const options: ParseOptions = {
  arrayFormat: "bracket",
};

export const useSearchQuery = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() ?? "";

  const setSearchQuery: Dispatch<SetStateAction<Record<string, any>>> =
    useCallback(
      (dispatch: SetStateAction<Record<string, any>>) => {
        const updateParams =
          typeof dispatch === "function"
            ? dispatch(qs.parse(queryString, options))
            : dispatch;
        const truthyParams = removeFalsyFromObject(updateParams);
        const query = qs.stringify(truthyParams, options);

        router.push(`${pathname}${query ? `?${query}` : ""}`);
      },
      [pathname, router, queryString],
    );

  const searchQuery = useMemo(
    () => qs.parse(queryString, options),
    [queryString],
  );

  const searchQueryString = useMemo(() => queryString, [queryString]);

  return { searchQuery, searchQueryString, setSearchQuery };
};
