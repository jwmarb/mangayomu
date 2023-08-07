import type { Manga, MangaChapter, MangaMeta } from '@mangayomu/mangascraper';

export default async function getMangaMeta(
  manga: Manga,
): Promise<Manga & MangaMeta<MangaChapter>> {
  const res = await fetch('/api/v1/manga', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(manga),
  });
  return ((await res.json()) as { data: Manga & MangaMeta<MangaChapter> }).data;
}
