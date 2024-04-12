import { Manga as MManga } from '@mangayomu/mangascraper';
import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import { Table } from '@/models/schema';
import { Manga } from '@/models/Manga';

export default function useIsInLibrary(manga: MManga) {
  const database = useDatabase();
  const [isInLibrary, setIsInLibrary] = React.useState<boolean | null>(null);
  const row = React.useRef<Manga>();

  React.useEffect(() => {
    async function initialize() {
      const mangas = database.get<Manga>(Table.MANGAS);
      const query = mangas.query(Q.where('link', manga.link));
      const results = await query;
      if (results.length > 0) {
        const [found] = results;
        row.current = found;
        setIsInLibrary(!!found.isInLibrary);
      }
    }
    initialize();
  }, []);

  React.useEffect(() => {
    async function uploadChanges() {
      if (isInLibrary == null) return;
      if (row.current == null) {
        row.current = await Manga.toManga(manga, database);
      }
      database.write(async () => {
        await row.current?.update((model) => {
          model.isInLibrary = isInLibrary ? 1 : 0;
        });
      });
    }

    function listenForChanges() {
      if (row.current != null) {
        const observer = row.current.observe();
        const subscription = observer.subscribe((change) => {
          setIsInLibrary(!!change.isInLibrary);
        });

        return () => {
          subscription.unsubscribe();
        };
      }
    }

    uploadChanges();
    listenForChanges();
  }, [isInLibrary]);

  return [isInLibrary, setIsInLibrary] as const;
}
