import { Manga as MManga } from '@mangayomu/mangascraper';
import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import { Table } from '@/models/schema';
import { Manga } from '@/models/Manga';

export default function useIsInLibrary(manga: MManga) {
  const database = useDatabase();
  const [isInLibrary, setIsInLibrary] = React.useState<boolean | null>(null);
  const [row, setRow] = React.useState<Manga>();

  React.useEffect(() => {
    async function uploadChanges() {
      if (isInLibrary == null) return;
      if (row == null) {
        setRow(
          await Manga.toManga(manga, database, {
            isInLibrary: isInLibrary ? 1 : 0,
          }),
        );
        return;
      }
      database.write(async () => {
        await row?.update((model) => {
          model.isInLibrary = isInLibrary ? 1 : 0;
        });
      });
    }

    uploadChanges();
  }, [isInLibrary]);

  React.useEffect(() => {
    function listenForChanges() {
      if (row != null) {
        const observer = row.observe();
        const subscription = observer.subscribe((change) => {
          setIsInLibrary(!!change.isInLibrary);
        });

        return () => {
          subscription.unsubscribe();
        };
      } else {
        const mangas = database.get<Manga>(Table.MANGAS);
        const query = mangas.query(Q.where('link', manga.link));
        const observer = query.observeWithColumns(['isInLibrary']);
        const subscription = observer.subscribe((results) => {
          if (results.length > 0) {
            const [found] = results;
            setRow(found);
          }
        });
        return () => {
          subscription.unsubscribe();
        };
      }
    }
    listenForChanges();
  }, [row != null]);

  return [isInLibrary, setIsInLibrary] as const;
}
