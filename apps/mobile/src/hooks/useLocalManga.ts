import { Manga } from '@mangayomu/mangascraper';
import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import { Table } from '@/models/schema';
import { LocalManga } from '@/models/LocalManga';

type Selector<T> = (model: LocalManga) => T;

export default function useLocalManga<T>(
  manga: Pick<Manga, 'link'>,
  selector: Selector<T>,
) {
  const database = useDatabase();
  const [state, setState] = React.useState<T | undefined>(undefined);
  React.useEffect(() => {
    const observer = database
      .get(Table.LOCAL_MANGAS)
      .query(Q.where('link', manga.link))
      .observe();
    const subscription = observer.subscribe((updated) => {
      if (updated.length > 0) {
        const [localManga] = updated;
        setState(selector(localManga as LocalManga));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return state;
}
