const hashmap = new Map<string, unknown>();
const expiry = new Map<string, number>();
const CACHE_TTL = 60;

/**
 *
 * @param key The key to get cached data
 * @param onCacheMiss An initializer function that will execute when cache misses
 * @param ttl The time it takes for the cache to expire or be considered a "miss" (in seconds)
 */
export default async function cache<T>(
  key: string,
  onCacheMiss: () => Promise<T>,
  ttl: number = CACHE_TTL,
): Promise<T> {
  const cached = (hashmap as Map<string, T>).get(key);
  const cachedAge = expiry.get(key);
  if (
    cached == null ||
    cachedAge == null ||
    (cached != null &&
      cachedAge != null &&
      Date.now() - cachedAge >= ttl * 1000)
  ) {
    const p = (await onCacheMiss()) as unknown as T;
    expiry.set(key, Date.now());
    hashmap.set(key, p);
    return p;
  }
  return cached;
}
