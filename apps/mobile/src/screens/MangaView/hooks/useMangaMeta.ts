import { useDatabase } from '@nozbe/watermelondb/react';
import { useQuery } from '@tanstack/react-query';
import { Q } from '@nozbe/watermelondb';
import React from 'react';
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
        const meta = source.toMangaMeta(await source.meta(manga, signal));

        // As a side-effect, write to the database locally
        // since this is a cached query. useEffect would be
        // a waste of performance here
        LocalManga.toLocalManga(meta, database);

        return meta;
      } catch (e) {
        const result = await database
          .get(Table.LOCAL_MANGAS)
          .query(Q.where('link', manga.link));
        if (result.length > 0) {
          const meta = await (result[0] as LocalManga).meta;

          return meta;
        }
        throw new SourceTimeoutException(source, 'meta', e);
      }
    },
  });

  return query;
}
