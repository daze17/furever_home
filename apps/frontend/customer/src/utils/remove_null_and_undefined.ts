type ReplaceNullWithUndefined<T> = {
  [K in keyof T]: null extends T[K] ? Exclude<T[K], null> | undefined : T[K];
};

// Removes null and replaces with undefined
// Only for flat objects
export function removeNullFromObject<T extends Record<string, unknown>>(
  obj: T,
): ReplaceNullWithUndefined<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) =>
      value === null ? [key, undefined] : [key, value],
    ),
  ) as ReplaceNullWithUndefined<T>;
}
