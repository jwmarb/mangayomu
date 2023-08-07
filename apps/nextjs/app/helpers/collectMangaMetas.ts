import type { Manga } from '@mangayomu/mangascraper';

/**
 * Asynchronously get manga metas in parallel
 * @param data The data to get manga metas. The key is the source, while the values are links to the mangas
 * @returns
 */
export default async function collectMangaMetas(
  data: Record<string, string[]>,
): Promise<Manga[]> {
  const res = await fetch('/api/v1/manga', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mangas: data }),
  });
  return ((await res.json()) as { data: Manga[] }).data;
}
