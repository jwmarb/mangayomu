type Expiry = { _age: number };
const hashmap = new Map<string, Expiry>();
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
): Promise<T & Expiry> {
  const cached = (hashmap as Map<string, T & Expiry>).get(key);
  if (
    cached == null ||
    (cached != null && Date.now() - cached._age >= ttl * 1000)
  ) {
    const p = (await onCacheMiss()) as unknown as T & Expiry;
    p._age = Date.now();
    hashmap.set(key, p);
    return p;
  }
  return cached;
}
