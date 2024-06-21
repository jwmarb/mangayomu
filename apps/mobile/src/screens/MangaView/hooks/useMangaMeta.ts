import { useDatabase } from '@nozbe/watermelondb/react';
import { useQuery } from '@tanstack/react-query';
import { Database, Q } from '@nozbe/watermelondb';
import { Manga, MangaSource } from '@mangayomu/mangascraper';
import useManga from '@/hooks/useManga';
import useMangaSource from '@/hooks/useMangaSource';
import { LocalManga } from '@/models/LocalManga';
import { Table } from '@/models/schema';
import { SourceTimeoutException } from '@/exceptions/SourceTimeoutException';

type GetMangaMetaOptions = {
  signal: AbortSignal;
  source: MangaSource;
  manga: Manga;
  database: Database;
};

export const getMangaMeta = async ({
  signal,
  source,
  manga,
  database,
}: GetMangaMetaOptions) => {
  try {
    const meta = await source.meta(manga, signal);
    const parsed = source.toMangaMeta(meta);

    // As a side-effect, write to the database locally
    // since this is a cached query. useEffect would be
    // a waste of performance here
    await LocalManga.toLocalManga(parsed, meta, database);

    return [meta, parsed] as const;
  } catch (e) {
    const result = await database
      .get<LocalManga>(Table.LOCAL_MANGAS)
      .query(Q.where('link', manga.link));
    if (result.length > 0) {
      const [found] = result;

      return [found.raw, await found.meta] as const;
    }
    throw new SourceTimeoutException(source, 'meta', e);
  }
};

export default function useMangaMeta(
  unparsedManga: unknown,
  sourceStr?: string,
) {
  const database = useDatabase();
  const source = useMangaSource({ manga: unparsedManga, source: sourceStr });
  const manga = useManga(unparsedManga, source);
  const query = useQuery({
    queryKey: [manga.link],
    queryFn: ({ signal }) => getMangaMeta({ database, source, manga, signal }),
  });

  return query;
}
