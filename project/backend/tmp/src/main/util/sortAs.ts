export function sortAs<TData, TKey extends string, TError extends Error>(
  data: readonly TData[],
  keys: readonly TKey[],
  getKey: (elem: TData) => TKey,
  notFound: (key: TKey) => TError,
): (TData | TError)[] {
  const map: Map<TKey, TData> = new Map();
  for (const elem of data) {
    map.set(getKey(elem), elem);
  }
  return keys.map((k) => map.get(k) ?? notFound(k));
}
