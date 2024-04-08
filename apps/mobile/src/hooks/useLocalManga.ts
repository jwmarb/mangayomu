import { Manga } from '@mangayomu/mangascraper';
import { Model, Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import { Table } from '@/models/schema';
import { LocalManga } from '@/models/LocalManga';

type Selector<T> = (model: LocalManga) => T;

export default function useLocalManga<T>(
  manga: Pick<Manga, 'link'>,
  selector: Selector<T>,
  onInitialize?: (model: LocalManga) => void,
) {
  const database = useDatabase();
  const [state, setState] = React.useState<T | undefined>(undefined);
  const id = React.useRef<string>('');
  React.useEffect(() => {
    function initialize() {
      const observer = database
        .get(Table.LOCAL_MANGAS)
        .query(Q.where('link', manga.link))
        .observe();
      const callback = (updated: Model[]) => {
        if (updated.length > 0) {
          const [localManga] = updated;
          id.current = localManga.id;
          setState(selector(localManga as LocalManga));
          if (onInitialize != null) onInitialize(localManga as LocalManga);
        }
      };
      const subscription = observer.subscribe(callback);

      return () => {
        subscription.unsubscribe();
      };
    }

    async function listenToChanges() {
      const observer = database
        .get(Table.LOCAL_MANGAS)
        .findAndObserve(id.current);

      const callback = (updated: Model) => {
        setState(selector(updated as LocalManga));
      };
      const subscription = observer.subscribe(callback);
      return () => {
        subscription.unsubscribe();
      };
    }
    if (state == null) {
      initialize();
    } else {
      listenToChanges();
    }
  }, [state != null]);

  return state;
}
