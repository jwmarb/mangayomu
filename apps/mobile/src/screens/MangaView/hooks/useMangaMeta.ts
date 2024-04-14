import { useDatabase } from '@nozbe/watermelondb/react';
import { useQuery } from '@tanstack/react-query';
import { Q } from '@nozbe/watermelondb';
import useManga from '@/hooks/useManga';
import useMangaSource from '@/hooks/useMangaSource';
import { LocalManga } from '@/models/LocalManga';
import { Table } from '@/models/schema';
import { RootStackProps } from '@/screens/navigator';
import { SourceTimeoutException } from '@/exceptions/SourceTimeoutException';

export default function useMangaMeta(props: RootStackProps<'MangaView'>) {
  const {
    route: {
      params: { manga: unparsedManga, source: sourceStr },
    },
  } = props;
  const database = useDatabase();
  const source = useMangaSource({ manga: unparsedManga, source: sourceStr });
  const manga = useManga(unparsedManga, source);
  const query = useQuery({
    queryKey: [manga.link],
    queryFn: async ({ signal }) => {
      try {
        const meta = await source.meta(manga, signal);
        const parsed = source.toMangaMeta(meta);

        // As a side-effect, write to the database locally
        // since this is a cached query. useEffect would be
        // a waste of performance here
        LocalManga.toLocalManga(parsed, meta, database);

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
    },
  });

  return query;
}
