import { HistoryEntry } from '@/models/HistoryEntry';
import { Table } from '@/models/schema';
import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';

export default function useHistoryEntry(
  localChapterLink: string,
  localMangaLink: string,
) {
  const database = useDatabase();
  const [historyEntry, setHistoryEntry] = React.useState<HistoryEntry | null>(
    null,
  );

  React.useEffect(() => {
    const historyEntries = database.get<HistoryEntry>(Table.HISTORY_ENTRIES);

    const observer = historyEntries
      .query(Q.where('local_manga_link', localMangaLink))
      .observe();

    const subscription = observer.subscribe((value) => {
      for (const historyEntry of value) {
        if (historyEntry.localChapterLink === localChapterLink) {
          console.log(historyEntry);
          setHistoryEntry(historyEntry);
          return;
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return historyEntry;
}
