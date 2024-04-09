import { Manga } from '@mangayomu/mangascraper';
import { Model, Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import { Table } from '@/models/schema';
import { LocalManga } from '@/models/LocalManga';

type Selector<T> = (model: LocalManga) => T;

export type UseLocalMangaOptions<TDefault> = {
  onInitialize?: (model: LocalManga) => void;
  onUpdate?: (model: LocalManga) => void;
  default?: TDefault;
};

export default function useLocalManga<T, TDefault = T | undefined>(
  manga: Pick<Manga, 'link'>,
  selector: Selector<T>,
  options?: UseLocalMangaOptions<TDefault>,
): TDefault {
  const database = useDatabase();
  const [state, setState] = React.useState<T>(options?.default as T);
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
          if (options?.onInitialize != null)
            options.onInitialize(localManga as LocalManga);
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

      let init = false;

      const callback = (updated: Model) => {
        setState(selector(updated as LocalManga));
        if (init && options?.onUpdate != null)
          options.onUpdate(updated as LocalManga);
        else {
          init = true;
        }
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

  return state as unknown as TDefault;
}
