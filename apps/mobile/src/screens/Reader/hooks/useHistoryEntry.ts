import { HistoryEntry } from '@/models/HistoryEntry';
import { LocalManga } from '@/models/LocalManga';
import { Table } from '@/models/schema';
import { useCurrentChapter } from '@/screens/Reader/stores/chapter';
import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';

function generateTomorrowDate() {
  const r = new Date();
  r.setDate(r.getDate() + 1);
  return r.setHours(0, 0, 0, 0);
}

export default function useHistoryEntry() {
  const currentChapter = useCurrentChapter(
    (selector) => selector.currentChapter,
  );
  const database = useDatabase();
  React.useEffect(() => {
    async function change() {
      if (currentChapter != null) {
        const historyEntries = database.get<HistoryEntry>(
          Table.HISTORY_ENTRIES,
        );
        const localMangas = database.get<LocalManga>(Table.LOCAL_MANGAS);
        const results = await historyEntries.query(
          Q.where('local_chapter_link', currentChapter.link),
          Q.and(Q.where('updated_at', Q.lt(generateTomorrowDate()))),
        );

        if (results.length === 0) {
          await database.write(async () => {
            const foundLocalMangas = await localMangas.query(
              Q.on(Table.LOCAL_CHAPTERS, 'link', currentChapter.link),
            );
            if (foundLocalMangas.length > 0) {
              const [localManga] = foundLocalMangas;
              return await historyEntries.create((model) => {
                model.localChapterLink = currentChapter.link;
                model.localMangaLink = localManga.link;
              });
            } else {
              console.error(
                "Couldn't find either a local manga or local chapter. Data will not be persisted.",
              );
            }
          });
        } else {
          const [historyEntry] = results;
          await database.write(async () => {
            await historyEntry.update((self) => {
              self.updatedAt = new Date();
            });
          });
        }
      }
    }
    change();
  }, [currentChapter]);
}
